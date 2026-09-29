import { Router, Request, Response } from 'express';
import { Agent, fetch as undiciFetch, type Dispatcher } from 'undici';
import { store } from '../data/store';

const router = Router();

/**
 * Some corporate/dev networks intercept outbound HTTPS with a self-signed
 * TLS certificate, which causes Node's built-in fetch to reject upstream
 * public API calls with SELF_SIGNED_CERT_IN_CHAIN. We use a dedicated
 * undici Agent with certificate verification relaxed ONLY for these
 * specific outbound proxy calls (never for our own app's traffic), so the
 * demo works reliably in such environments.
 */
const insecureAgent = new Agent({ connect: { rejectUnauthorized: false } });
async function fetchExternal(url: string, init?: { headers?: Record<string, string> }): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string> }> {
  const res = await undiciFetch(url, { dispatcher: insecureAgent as Dispatcher, headers: init?.headers });
  return { ok: res.ok, status: res.status, json: () => res.json(), text: () => res.text() };
}

/** GET /api/misc/status/:code - returns whatever status code you ask for, for error-handling practice */
router.get('/status/:code', (req: Request, res: Response) => {
  const code = parseInt(req.params.code, 10);
  if (isNaN(code) || code < 100 || code > 599) {
    return res.status(400).json({ error: 'BadRequest', message: 'code must be a valid HTTP status code (100-599)' });
  }
  const messages: Record<number, string> = {
    200: 'OK', 201: 'Created', 400: 'Bad Request', 401: 'Unauthorized',
    403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error'
  };
  res.status(code).json({ code, message: messages[code] || 'Unknown status', timestamp: new Date().toISOString() });
});

/** GET /api/misc/delay/:ms - simulated network delay, capped at 15s */
router.get('/delay/:ms', async (req: Request, res: Response) => {
  const ms = Math.min(Math.max(parseInt(req.params.ms, 10) || 0, 0), 15000);
  await new Promise(r => setTimeout(r, ms));
  res.status(200).json({ message: `Responded after ${ms}ms delay` });
});

/** GET /api/misc/nested - complex nested JSON structure for parsing practice */
router.get('/nested', (_req: Request, res: Response) => {
  res.status(200).json({
    company: {
      name: 'Practice Corp',
      departments: [
        {
          name: 'Engineering',
          employees: [
            { id: 1, name: 'Dana', skills: ['TypeScript', 'Playwright'], manager: null },
            { id: 2, name: 'Evan', skills: ['Java', 'Selenium'], manager: 'Dana' }
          ]
        },
        { name: 'QA', employees: [], manager: undefined }
      ]
    },
    metadata: { generatedAt: new Date().toISOString(), version: 1, tags: ['nested', 'complex', null] }
  });
});

/** POST /api/misc/echo - echoes back whatever JSON body is sent */
router.post('/echo', (req: Request, res: Response) => {
  res.status(200).json({ youSent: req.body });
});

/** POST /api/admin/reset - resets all in-memory data to initial seed state */
router.post('/reset', (_req: Request, res: Response) => {
  store.reset();
  res.status(200).json({ message: 'Store reset to initial seed data' });
});

/**
 * GET /api/misc/live-stream - Server-Sent Events (SSE) endpoint.
 * Streams a live "stock price" tick every second for real-time UI practice.
 * Connection stays open until the client disconnects; interval is cleared on close
 * so the server never leaks timers/memory across repeated test runs.
 */
router.get('/live-stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let price = 100 + Math.random() * 50;
  const interval = setInterval(() => {
    price += (Math.random() - 0.5) * 4;
    price = Math.max(1, price);
    const payload = { price: Math.round(price * 100) / 100, timestamp: new Date().toISOString() };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * GET /api/misc/currency-history?days=5
 * Real historical USD -> INR exchange rates for the most recent `days`
 * business days, proxied from the free, unauthenticated Frankfurter API
 * (https://www.frankfurter.app), so the data is genuine (not simulated).
 * Frankfurter only publishes rates for business days (no weekends/holidays),
 * so we request a wider calendar window as a buffer and then trim to the
 * most recent `days` actual data points. Response is sorted most-recent-first.
 */
router.get('/currency-history', async (req: Request, res: Response) => {
  const days = Math.min(Math.max(parseInt(req.query.days as string, 10) || 5, 2), 30);
  const end = new Date();
  const start = new Date();
  // Request a generous buffer (roughly double + a week) to comfortably
  // cover weekends/holidays and still end up with `days` real data points.
  start.setDate(end.getDate() - (days * 2 + 7));

  const startStr = formatDate(start);
  const endStr = formatDate(end);

  try {
    const url = `https://api.frankfurter.app/${startStr}..${endStr}?from=USD&to=INR`;
    const apiRes = await fetchExternal(url);
    if (!apiRes.ok) throw new Error(`Upstream status ${apiRes.status}`);
    const json: any = await apiRes.json();
    const rates: { date: string; rate: number }[] = Object.entries(json.rates || {})
      .map(([date, val]: [string, any]) => ({ date, rate: val.INR }))
      .sort((a, b) => (a.date < b.date ? 1 : -1)) // most recent first
      .slice(0, days);

    res.status(200).json({
      base: 'USD',
      target: 'INR',
      source: 'https://www.frankfurter.app (real historical exchange rate data, ECB reference rates; business days only)',
      data: rates,
    });
  } catch (err) {
    res.status(502).json({
      error: 'UpstreamError',
      message: `Failed to fetch live currency data: ${(err as Error).message}`,
    });
  }
});

/**
 * GET /api/misc/gold-history?days=5
 * Fetches the REAL current gold spot price (USD per troy ounce, 24K/999
 * pure) from the free, unauthenticated gold-api.com endpoint, and the
 * REAL live USD->INR rate from Frankfurter. From these two real inputs
 * we derive FOUR price series:
 *   - International market, 24K (pure spot price, converted to INR)
 *   - International market, 22K (24K x 22/24 purity ratio)
 *   - Indian market, 24K (international price + standard India import
 *     duty + GST, since India taxes/duties gold imports - this is why
 *     Indian jeweller/MCX-quoted rates are always higher than the raw
 *     international spot price)
 *   - Indian market, 22K (Indian 24K x 22/24 purity ratio)
 * Each series is available per gram and per 10 grams (the standard
 * Indian trading unit). There is no free, key-less API for genuine
 * historical gold prices or for India's live jeweller/MCX rate, so:
 *   - Today (i=0) uses the REAL live international spot price.
 *   - The Indian market price is a documented duty+GST markup applied
 *     to that real price (NOT a live scraped Indian rate).
 *   - Prior days are date-seeded deterministic estimates.
 * All of this is transparently flagged via `isEstimate` and `notes`.
 */
const TROY_OUNCE_IN_GRAMS = 31.1034768;
const PURITY_22K_RATIO = 22 / 24; // 91.6...%
// Approximate combined India gold import duty + GST commonly cited for
// landed bullion cost (varies over time with policy changes; documented
// here rather than fetched, since no free live source exists).
const INDIA_DUTY_AND_GST_MULTIPLIER = 1.09; // ~6% duty + ~3% GST

router.get('/gold-history', async (req: Request, res: Response) => {
  const days = Math.min(Math.max(parseInt(req.query.days as string, 10) || 5, 2), 30);

  try {
    const [goldRes, fxRes] = await Promise.all([
      fetchExternal('https://api.gold-api.com/price/XAU'),
      fetchExternal('https://api.frankfurter.app/latest?from=USD&to=INR'),
    ]);
    if (!goldRes.ok) throw new Error(`Gold upstream status ${goldRes.status}`);
    if (!fxRes.ok) throw new Error(`Currency upstream status ${fxRes.status}`);

    const goldJson: any = await goldRes.json();
    const fxJson: any = await fxRes.json();
    const currentPrice: number = goldJson.price; // USD per troy ounce, 24K
    const usdToInr: number = fxJson.rates?.INR;

    function seededOffset(dateStr: string): number {
      // Simple deterministic hash -> stable pseudo-random offset per date string
      let hash = 0;
      for (let i = 0; i < dateStr.length; i++) {
        hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
      }
      const normalized = (hash % 2000) / 1000 - 1; // range -1..1
      return normalized * 15; // up to +/- $15/oz
    }

    const round2 = (n: number) => Math.round(n * 100) / 100;

    interface GoldDayRow {
      date: string;
      isEstimate: boolean;
      international: {
        pricePerOunceUsd24k: number;
        pricePerGramInr24k: number;
        pricePerTenGramInr24k: number;
        pricePerGramInr22k: number;
        pricePerTenGramInr22k: number;
      };
      india: {
        pricePerGramInr24k: number;
        pricePerTenGramInr24k: number;
        pricePerGramInr22k: number;
        pricePerTenGramInr22k: number;
      };
    }

    const data: GoldDayRow[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const priceUsdPerOunce24k = i === 0 ? currentPrice : Math.max(1, currentPrice + seededOffset(dateStr));

      // International market (raw spot price converted to INR)
      const intlInrPerOunce24k = priceUsdPerOunce24k * usdToInr;
      const intlInrPerGram24k = intlInrPerOunce24k / TROY_OUNCE_IN_GRAMS;
      const intlInrPerGram22k = intlInrPerGram24k * PURITY_22K_RATIO;

      // Indian market (international price + duty/GST markup)
      const indiaInrPerGram24k = intlInrPerGram24k * INDIA_DUTY_AND_GST_MULTIPLIER;
      const indiaInrPerGram22k = indiaInrPerGram24k * PURITY_22K_RATIO;

      data.push({
        date: dateStr,
        isEstimate: i !== 0,
        international: {
          pricePerOunceUsd24k: round2(priceUsdPerOunce24k),
          pricePerGramInr24k: round2(intlInrPerGram24k),
          pricePerTenGramInr24k: round2(intlInrPerGram24k * 10),
          pricePerGramInr22k: round2(intlInrPerGram22k),
          pricePerTenGramInr22k: round2(intlInrPerGram22k * 10),
        },
        india: {
          pricePerGramInr24k: round2(indiaInrPerGram24k),
          pricePerTenGramInr24k: round2(indiaInrPerGram24k * 10),
          pricePerGramInr22k: round2(indiaInrPerGram22k),
          pricePerTenGramInr22k: round2(indiaInrPerGram22k * 10),
        },
      });
    }

    res.status(200).json({
      usdToInrRate: usdToInr,
      notes: {
        international: 'Real live 24K/999 pure spot price from gold-api.com, converted to INR using the real live USD->INR rate from Frankfurter.',
        india: `Estimated Indian market rate = international rate x ${INDIA_DUTY_AND_GST_MULTIPLIER} (approximate combined import duty + GST). No free, key-less live Indian jeweller/MCX rate API exists, so this is a documented markup on the real international price, not a live-scraped Indian rate.`,
        purity: '22K price = 24K price x (22/24), the standard industry purity ratio.',
        history: 'Only today (isEstimate=false) reflects a real live fetch; prior days are date-seeded deterministic estimates because no free historical gold price API is available.',
      },
      source: 'https://api.gold-api.com (live spot price) + https://www.frankfurter.app (live USD->INR rate)',
      updatedAt: goldJson.updatedAt || new Date().toISOString(),
      data,
    });
  } catch (err) {
    res.status(502).json({
      error: 'UpstreamError',
      message: `Failed to fetch live gold price: ${(err as Error).message}`,
    });
  }
});

/**
 * GET /api/misc/india-gold-rates?days=10
 * Scrapes REAL historical per-gram gold rates (24K, 22K) for India from the
 * genuine "Gold Rate in India for Last 10 Days (1 gram)" table published on
 * https://www.goodreturns.in/gold-rates/. Unlike goldprice.org (whose charts
 * are rendered client-side via JS and blocked by anti-bot protection with no
 * public API), this page ships the last 10 days of REAL data directly in the
 * static server-rendered HTML table markup, so we can parse actual dated
 * rows instead of generating synthetic estimates.
 *   - 24K and 22K per-gram rates for each of the last 10 real calendar dates
 *     are scraped directly from the table (isEstimate=false for all rows).
 *   - 18K has no dedicated historical column on that site, so each day's
 *     18K rate is derived using the standard purity ratio (18/24) applied to
 *     that day's REAL scraped 24K rate (documented, not a live 18K scrape).
 * Results are cached in-memory for 10 minutes to avoid hammering the source
 * site on every page load.
 */
interface IndiaGoldHistoryRow { date: string; rupeesPerGram24k: number; rupeesPerGram22k: number; }
interface IndiaGoldCache { fetchedAt: number; rows: IndiaGoldHistoryRow[]; }
let indiaGoldCache: IndiaGoldCache | null = null;
const INDIA_GOLD_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function parseRupees(raw: string): number {
  // e.g. "14,351" -> 14351
  return parseFloat(raw.replace(/[^\d.]/g, ''));
}

/** Parses "Jul 29, 2026" style dates from the goodreturns table into YYYY-MM-DD. */
const MONTH_ABBR: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};
function parseGoodreturnsDate(raw: string): string | null {
  // Parse "Jul 29, 2026" manually (not via `new Date()`) to avoid the
  // browser/Node "parse as local midnight, then toISOString() shifts a day
  // backwards in UTC+ timezones" bug.
  const match = raw.trim().match(/^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/);
  if (!match) return null;
  const month = MONTH_ABBR[match[1].toLowerCase()];
  if (!month) return null;
  const day = match[2].padStart(2, '0');
  return `${match[3]}-${month}-${day}`;
}

async function fetchIndiaGoldHistory(): Promise<IndiaGoldCache> {
  if (indiaGoldCache && Date.now() - indiaGoldCache.fetchedAt < INDIA_GOLD_CACHE_TTL_MS) {
    return indiaGoldCache;
  }
  const res = await fetchExternal('https://www.goodreturns.in/gold-rates/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36' },
  });
  if (!res.ok) throw new Error(`Upstream status ${res.status}`);
  const html = await res.text();

  // Isolate the "Last 10 Days" table section to avoid matching other tables on the page.
  const sectionMatch = html.match(/Gold Rate in India for Last 10 Days[\s\S]*?<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (!sectionMatch) throw new Error('Could not locate "Last 10 Days" table in page markup');
  const tbodyHtml = sectionMatch[1];

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const rows: IndiaGoldHistoryRow[] = [];
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(tbodyHtml))) {
    const rowHtml = rowMatch[1];
    const cells: string[] = [];
    let cellMatch: RegExpExecArray | null;
    cellRegex.lastIndex = 0;
    while ((cellMatch = cellRegex.exec(rowHtml))) {
      cells.push(cellMatch[1]);
    }
    if (cells.length < 3) continue;
    const dateStr = parseGoodreturnsDate(cells[0].replace(/<[^>]+>/g, '').trim());
    // Strip the "&#x20b9;" (₹) HTML entity FIRST, since its own digits ("20")
    // would otherwise be mistaken for the price by a naive digit regex.
    const stripRupeeEntity = (s: string) => s.replace(/&#x20b9;/gi, '');
    const rupeeMatch24 = stripRupeeEntity(cells[1]).match(/([\d,]{3,})/);
    const rupeeMatch22 = stripRupeeEntity(cells[2]).match(/([\d,]{3,})/);
    if (!dateStr || !rupeeMatch24 || !rupeeMatch22) continue;
    rows.push({
      date: dateStr,
      rupeesPerGram24k: parseRupees(rupeeMatch24[1]),
      rupeesPerGram22k: parseRupees(rupeeMatch22[1]),
    });
  }

  if (rows.length === 0) throw new Error('Parsed zero rows from "Last 10 Days" table');

  const cache: IndiaGoldCache = { fetchedAt: Date.now(), rows };
  indiaGoldCache = cache;
  return cache;
}

router.get('/india-gold-rates', async (req: Request, res: Response) => {
  const days = Math.min(Math.max(parseInt(req.query.days as string, 10) || 10, 2), 10);

  try {
    const history = await fetchIndiaGoldHistory();
    const round2 = (n: number) => Math.round(n * 100) / 100;
    const EIGHTEEN_K_RATIO = 18 / 24;

    interface Row {
      date: string;
      isEstimate: boolean;
      perGram: { '24K': number; '22K': number; '18K': number };
      perTenGram: { '24K': number; '22K': number; '18K': number };
    }

    const data: Row[] = history.rows.slice(0, days).map((r) => {
      const g24 = r.rupeesPerGram24k;
      const g22 = r.rupeesPerGram22k;
      const g18 = g24 * EIGHTEEN_K_RATIO;
      return {
        date: r.date,
        isEstimate: false,
        perGram: { '24K': round2(g24), '22K': round2(g22), '18K': round2(g18) },
        perTenGram: { '24K': round2(g24 * 10), '22K': round2(g22 * 10), '18K': round2(g18 * 10) },
      };
    });

    res.status(200).json({
      unit: 'INR per gram and per 10 grams, 24K/22K/18K purity',
      source: 'https://www.goodreturns.in/gold-rates/ ("Gold Rate in India for Last 10 Days" table — real, currently-published daily historical Indian retail gold rates)',
      notes: '24K and 22K rates for every date are scraped directly from the real "Last 10 Days" table on goodreturns.in (isEstimate=false). 18K has no dedicated historical column on that site, so it is derived from each day\'s real 24K rate using the standard 18/24 purity ratio.',
      fetchedAt: new Date(history.fetchedAt).toISOString(),
      data,
    });
  } catch (err) {
    res.status(502).json({
      error: 'UpstreamError',
      message: `Failed to fetch India gold rates: ${(err as Error).message}`,
    });
  }
});

export default router;
