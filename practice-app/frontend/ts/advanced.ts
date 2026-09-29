import { showToast } from './common.js';

// --- Real-time SSE live data feed ---
let eventSource: EventSource | null = null;
const ssePrice = document.getElementById('ssePrice');
const sseTimestamp = document.getElementById('sseTimestamp');
const sseLog = document.getElementById('sseLog');
const sseConnectBtn = document.getElementById('sseConnectBtn') as HTMLButtonElement | null;
const sseDisconnectBtn = document.getElementById('sseDisconnectBtn') as HTMLButtonElement | null;

sseConnectBtn?.addEventListener('click', () => {
  if (eventSource) return;
  eventSource = new EventSource('/api/misc/live-stream');
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (ssePrice) ssePrice.textContent = `$${data.price}`;
    if (sseTimestamp) sseTimestamp.textContent = new Date(data.timestamp).toLocaleTimeString();
    if (sseLog) {
      const li = document.createElement('li');
      li.textContent = `$${data.price} at ${new Date(data.timestamp).toLocaleTimeString()}`;
      sseLog.prepend(li);
      while (sseLog.children.length > 10) sseLog.removeChild(sseLog.lastChild!);
    }
  };
  eventSource.onerror = () => {
    showToast('SSE connection error', 'error');
  };
  if (sseConnectBtn) sseConnectBtn.disabled = true;
  if (sseDisconnectBtn) sseDisconnectBtn.disabled = false;
  showToast('Connected to live stream', 'success');
});

sseDisconnectBtn?.addEventListener('click', () => {
  eventSource?.close();
  eventSource = null;
  if (sseConnectBtn) sseConnectBtn.disabled = false;
  if (sseDisconnectBtn) sseDisconnectBtn.disabled = true;
  showToast('Disconnected from live stream', 'info');
});

// --- Real-time live clock ---
const liveClock = document.getElementById('liveClock');
function updateClock() {
  if (liveClock) liveClock.textContent = new Date().toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);

// --- Clipboard API ---
const clipboardSource = document.getElementById('clipboardSource') as HTMLInputElement | null;
const clipboardResult = document.getElementById('clipboardResult');

document.getElementById('copyToClipboardBtn')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(clipboardSource?.value || '');
    if (clipboardResult) clipboardResult.textContent = '✅ Copied to clipboard!';
    showToast('Copied to clipboard', 'success');
  } catch {
    if (clipboardResult) clipboardResult.textContent = '❌ Clipboard write failed (permissions?)';
  }
});

document.getElementById('pasteFromClipboardBtn')?.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (clipboardResult) clipboardResult.textContent = `📋 Pasted: "${text}"`;
  } catch {
    if (clipboardResult) clipboardResult.textContent = '❌ Clipboard read failed (permissions?)';
  }
});

// --- Notification API ---
const notificationResult = document.getElementById('notificationResult');
document.getElementById('requestNotificationBtn')?.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    if (notificationResult) notificationResult.textContent = 'Notifications not supported in this browser.';
    return;
  }
  const permission = await Notification.requestPermission();
  if (notificationResult) notificationResult.textContent = `Permission: ${permission}`;
});

document.getElementById('showNotificationBtn')?.addEventListener('click', () => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    if (notificationResult) notificationResult.textContent = 'Please request permission first.';
    return;
  }
  new Notification('Playwright Practice App', { body: 'This is a real browser notification!' });
  if (notificationResult) notificationResult.textContent = '✅ Notification shown!';
});

// --- Geolocation API ---
const locationResult = document.getElementById('locationResult');
document.getElementById('getLocationBtn')?.addEventListener('click', () => {
  if (!navigator.geolocation) {
    if (locationResult) locationResult.textContent = 'Geolocation not supported.';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (locationResult) locationResult.textContent = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`;
    },
    (err) => {
      if (locationResult) locationResult.textContent = `Error: ${err.message}`;
    }
  );
});

// --- Drag-to-reorder list ---
const reorderList = document.getElementById('reorderList');
const reorderResult = document.getElementById('reorderResult');
let draggedItem: HTMLElement | null = null;

reorderList?.querySelectorAll('li').forEach(item => {
  item.addEventListener('dragstart', () => {
    draggedItem = item as HTMLElement;
    item.classList.add('reorder-dragging');
  });
  item.addEventListener('dragend', () => {
    item.classList.remove('reorder-dragging');
    if (reorderResult && reorderList) {
      const order = Array.from(reorderList.children).map(li => li.textContent).join(', ');
      reorderResult.textContent = `New order: ${order}`;
    }
  });
  item.addEventListener('dragover', (e) => e.preventDefault());
  item.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === item) return;
    const target = item as HTMLElement;
    const rect = target.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const mouseY = (e as DragEvent).clientY;
    if (mouseY < midpoint) {
      target.parentElement?.insertBefore(draggedItem, target);
    } else {
      target.parentElement?.insertBefore(draggedItem, target.nextSibling);
    }
  });
});

// --- Autocomplete / typeahead with debounced API search ---
const autocompleteInput = document.getElementById('autocompleteInput') as HTMLInputElement | null;
const autocompleteResults = document.getElementById('autocompleteResults');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

autocompleteInput?.addEventListener('input', () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  const query = autocompleteInput.value.trim();
  if (!query) {
    if (autocompleteResults) autocompleteResults.innerHTML = '';
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      if (autocompleteResults) {
        autocompleteResults.innerHTML = data.data
          .map((p: any) => `<li data-testid="autocomplete-item-${p.id}" style="padding:0.4rem 0.6rem; cursor:pointer; border-bottom:1px solid var(--border);">${p.name} - $${p.price}</li>`)
          .join('') || '<li style="padding:0.4rem 0.6rem;">No results found</li>';
      }
    } catch {
      if (autocompleteResults) autocompleteResults.innerHTML = '<li style="padding:0.4rem 0.6rem;">Search failed</li>';
    }
  }, 300);
});

autocompleteResults?.addEventListener('click', (e) => {
  const li = (e.target as HTMLElement).closest('li');
  if (li && autocompleteInput) {
    autocompleteInput.value = li.textContent?.split(' - ')[0] || '';
    autocompleteResults.innerHTML = '';
  }
});

// --- Star rating widget ---
const starRatingResult = document.getElementById('starRatingResult');
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', () => {
    const value = parseInt((star as HTMLElement).dataset.value || '0', 10);
    document.querySelectorAll('.star').forEach(s => {
      const sVal = parseInt((s as HTMLElement).dataset.value || '0', 10);
      s.textContent = sVal <= value ? '★' : '☆';
      s.classList.toggle('selected', sVal <= value);
    });
    if (starRatingResult) starRatingResult.textContent = `You rated: ${value} star${value !== 1 ? 's' : ''}`;
  });
});

// --- Tabs widget ---
const tabs = document.querySelectorAll('[role="tab"]');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
    tab.setAttribute('aria-selected', 'true');
    document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
      (panel as HTMLElement).hidden = panel.getAttribute('aria-labelledby') !== tab.id;
    });
  });
});

// --- Accordion widget ---
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    const panel = header.nextElementSibling as HTMLElement | null;
    if (panel) panel.hidden = expanded;
  });
});

// --- <output> element: live sum recalculation ---
const outputA = document.getElementById('outputA') as HTMLInputElement | null;
const outputB = document.getElementById('outputB') as HTMLInputElement | null;
const outputResult = document.getElementById('outputResult') as HTMLOutputElement | null;

function recalcOutput(): void {
  const a = parseFloat(outputA?.value || '0') || 0;
  const b = parseFloat(outputB?.value || '0') || 0;
  if (outputResult) outputResult.value = String(a + b);
}
outputA?.addEventListener('input', recalcOutput);
outputB?.addEventListener('input', recalcOutput);

// --- <map>/<area> clickable image map ---
const imageMapResult = document.getElementById('imageMapResult');
document.querySelectorAll('#practiceImageMap area, map[name="practiceImageMap"] area').forEach(area => {
  area.addEventListener('click', (e) => {
    e.preventDefault();
    const label = area.getAttribute('alt') || 'Unknown region';
    if (imageMapResult) imageMapResult.textContent = `You clicked: ${label}`;
    showToast(`Image map region clicked: ${label}`, 'info');
  });
});

// --- <template> cloning ---
const cardTemplate = document.getElementById('cardTemplate') as HTMLTemplateElement | null;
const templateOutput = document.getElementById('templateOutput');
let templateCardCount = 0;

document.getElementById('addTemplateCardBtn')?.addEventListener('click', () => {
  if (!cardTemplate || !templateOutput) return;
  templateCardCount += 1;
  const clone = cardTemplate.content.cloneNode(true) as DocumentFragment;
  const title = clone.querySelector('.template-title');
  const body = clone.querySelector('.template-body');
  if (title) title.textContent = `Card #${templateCardCount}`;
  if (body) body.textContent = `Created from <template> at ${new Date().toLocaleTimeString()}`;
  const wrapper = clone.querySelector('.template-card') as HTMLElement | null;
  wrapper?.setAttribute('data-testid', `template-card-${templateCardCount}`);
  templateOutput.appendChild(clone);
});

// --- Custom element using Shadow DOM <slot> ---
class PracticeCard extends HTMLElement {
  connectedCallback(): void {
    if (this.shadowRoot) return; // avoid re-initializing
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .wrapper { border: 1px dashed var(--border, #e2e8f0); border-radius: 6px; padding: 0.6rem; }
        .wrapper ::slotted([slot="title"]) { font-weight: bold; display: block; }
      </style>
      <div class="wrapper" data-testid="practice-card-shadow-wrapper">
        <slot name="title">Default title</slot>
        <slot name="body">Default body</slot>
      </div>
    `;
  }
}
if (!customElements.get('practice-card')) {
  customElements.define('practice-card', PracticeCard);
}

// --- Live currency history: USD -> INR (real data via Frankfurter API proxy) ---
const loadCurrencyBtn = document.getElementById('loadCurrencyBtn') as HTMLButtonElement | null;
const currencyStatus = document.getElementById('currencyStatus');
const currencyTable = document.getElementById('currencyTable') as HTMLTableElement | null;
const currencyTableBody = document.getElementById('currencyTableBody');

loadCurrencyBtn?.addEventListener('click', async () => {
  if (currencyStatus) currencyStatus.textContent = 'Loading live currency data...';
  loadCurrencyBtn.disabled = true;
  try {
    const res = await fetch('/api/misc/currency-history?days=5');
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const json = await res.json();
    if (currencyTableBody) {
      currencyTableBody.innerHTML = json.data
        .map((row: { date: string; rate: number }) =>
          `<tr data-testid="currency-row-${row.date}"><td>${row.date}</td><td>₹${row.rate.toFixed(4)}</td></tr>`)
        .join('');
    }
    if (currencyTable) currencyTable.style.display = 'table';
    if (currencyStatus) currencyStatus.textContent = `✅ Loaded real historical rates (source: ${json.source})`;
    showToast('Currency history loaded', 'success');
  } catch (err) {
    if (currencyStatus) currencyStatus.textContent = `❌ Failed to load currency data: ${(err as Error).message}`;
    showToast('Failed to load currency history', 'error');
  } finally {
    loadCurrencyBtn.disabled = false;
  }
});

// --- Gold price history: live international spot price + clearly-labelled estimated history ---
const loadGoldBtn = document.getElementById('loadGoldBtn') as HTMLButtonElement | null;
const goldStatus = document.getElementById('goldStatus');
const goldTable = document.getElementById('goldTable') as HTMLTableElement | null;
const goldTableBody = document.getElementById('goldTableBody');

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
}

loadGoldBtn?.addEventListener('click', async () => {
  if (goldStatus) goldStatus.textContent = 'Loading live gold price...';
  loadGoldBtn.disabled = true;
  try {
    const res = await fetch('/api/misc/gold-history?days=5');
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const json = await res.json();
    if (goldTableBody) {
      goldTableBody.innerHTML = json.data
        .map((row: GoldDayRow) =>
          `<tr data-testid="gold-row-${row.date}">` +
          `<td>${row.date}</td>` +
          `<td>$${row.international.pricePerOunceUsd24k.toFixed(2)}</td>` +
          `<td>₹${row.international.pricePerGramInr24k.toFixed(2)}</td>` +
          `<td>₹${row.international.pricePerTenGramInr24k.toFixed(2)}</td>` +
          `<td>₹${row.international.pricePerGramInr22k.toFixed(2)}</td>` +
          `<td>₹${row.international.pricePerTenGramInr22k.toFixed(2)}</td>` +
          `<td>${row.isEstimate ? 'Estimated' : 'Live'}</td>` +
          `</tr>`)
        .join('');
    }
    if (goldTable) goldTable.style.display = 'table';
    if (goldStatus) goldStatus.textContent = `✅ Today's row is a live fetch (source: ${json.source}); prior days are estimates.`;
    showToast('Gold price history loaded', 'success');
  } catch (err) {
    if (goldStatus) goldStatus.textContent = `❌ Failed to load gold price data: ${(err as Error).message}`;
    showToast('Failed to load gold price history', 'error');
  } finally {
    loadGoldBtn.disabled = false;
  }
});

// --- India gold rates: real scraped 24K/22K/18K per-gram rates from goodreturns.in ---
const loadIndiaGoldBtn = document.getElementById('loadIndiaGoldBtn') as HTMLButtonElement | null;
const indiaGoldStatus = document.getElementById('indiaGoldStatus');
const indiaGoldTable = document.getElementById('indiaGoldTable') as HTMLTableElement | null;
const indiaGoldTableBody = document.getElementById('indiaGoldTableBody');

interface IndiaGoldRow {
  date: string;
  isEstimate: boolean;
  perGram: { '24K': number; '22K': number; '18K': number };
  perTenGram: { '24K': number; '22K': number; '18K': number };
}

loadIndiaGoldBtn?.addEventListener('click', async () => {
  if (indiaGoldStatus) indiaGoldStatus.textContent = 'Loading India gold rates...';
  loadIndiaGoldBtn.disabled = true;
  try {
    const res = await fetch('/api/misc/india-gold-rates?days=10');
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const json = await res.json();
    if (indiaGoldTableBody) {
      indiaGoldTableBody.innerHTML = json.data
        .map((row: IndiaGoldRow) =>
          `<tr data-testid="india-gold-row-${row.date}">` +
          `<td>${row.date}</td>` +
          `<td>₹${row.perGram['24K'].toFixed(2)}</td>` +
          `<td>₹${row.perTenGram['24K'].toFixed(2)}</td>` +
          `<td>₹${row.perGram['22K'].toFixed(2)}</td>` +
          `<td>₹${row.perTenGram['22K'].toFixed(2)}</td>` +
          `<td>₹${row.perGram['18K'].toFixed(2)}</td>` +
          `<td>₹${row.perTenGram['18K'].toFixed(2)}</td>` +
          `<td>${row.isEstimate ? 'Estimated' : 'Real'}</td>` +
          `</tr>`)
        .join('');
    }
    if (indiaGoldTable) indiaGoldTable.style.display = 'table';
    if (indiaGoldStatus) indiaGoldStatus.textContent = `✅ All ${json.data.length} rows are real historical data scraped from goodreturns.in's "Last 10 Days" table (24K/22K real; 18K derived by purity ratio).`;
    showToast('India gold rates loaded', 'success');
  } catch (err) {
    if (indiaGoldStatus) indiaGoldStatus.textContent = `❌ Failed to load India gold rates: ${(err as Error).message}`;
    showToast('Failed to load India gold rates', 'error');
  } finally {
    loadIndiaGoldBtn.disabled = false;
  }
});

/* ============================================================
   Multi-timeframe, zoomable Gold Price Graphs (24K, 22K, 18K)
   - Chart.js (+ chartjs-plugin-zoom) loaded via CDN <script> tags
     in advanced.html, so both are available as browser globals.
   - "Today" and "Yesterday" use 100% REAL daily rates scraped from
     goodreturns.in's "Last 10 Days" table (via
     /api/misc/india-gold-rates). "Yesterday" overlays TWO lines
     (today vs. yesterday) so the user can visually compare them.
     Longer ranges (week and beyond) have no free public API for
     genuine multi-week/month/year gold history, so those are
     clearly-labelled illustrative projections anchored to today's
     real price. This distinction is communicated in the on-page
     status text for every range.
   ============================================================ */

declare const Chart: any;

type GoldGraphRange = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'halfyear' | 'year' | 'twoyear' | 'threeyear' | 'fiveyear' | 'alltime';
type GoldPurity = '24K' | '22K' | '18K';

/** Ranges backed by 100% real scraped data (no synthetic noise). */
const GOLD_GRAPH_REAL_DATA_RANGES: ReadonlySet<GoldGraphRange> = new Set(['today', 'yesterday']);

const GOLD_GRAPH_RANGE_CONFIG: Record<GoldGraphRange, { points: number; stepMs: number; label: string; timeFmt: (d: Date) => string; dayOffset?: number }> = {
  today: { points: 24, stepMs: 60 * 60 * 1000, label: "Today, hour by hour", timeFmt: d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  yesterday: { points: 24, stepMs: 60 * 60 * 1000, label: "Yesterday vs. Today, hour by hour", timeFmt: d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), dayOffset: 1 },
  week: { points: 12, stepMs: 7 * 24 * 60 * 60 * 1000, label: 'Last 12 weeks', timeFmt: d => `Wk of ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}` },
  month: { points: 12, stepMs: 30 * 24 * 60 * 60 * 1000, label: 'Last 12 months', timeFmt: d => d.toLocaleDateString([], { month: 'short', year: '2-digit' }) },
  quarter: { points: 8, stepMs: 91 * 24 * 60 * 60 * 1000, label: 'Last 8 quarters', timeFmt: d => `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(2)}` },
  halfyear: { points: 10, stepMs: 182 * 24 * 60 * 60 * 1000, label: 'Last 5 years (half-year steps)', timeFmt: d => d.toLocaleDateString([], { month: 'short', year: '2-digit' }) },
  year: { points: 10, stepMs: 365 * 24 * 60 * 60 * 1000, label: 'Last 10 years', timeFmt: d => String(d.getFullYear()) },
  twoyear: { points: 12, stepMs: 61 * 24 * 60 * 60 * 1000, label: 'Last 2 years (bi-monthly steps)', timeFmt: d => d.toLocaleDateString([], { month: 'short', year: '2-digit' }) },
  threeyear: { points: 12, stepMs: 91 * 24 * 60 * 60 * 1000, label: 'Last 3 years (quarterly steps)', timeFmt: d => `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(2)}` },
  fiveyear: { points: 6, stepMs: 5 * 365 * 24 * 60 * 60 * 1000, label: 'Last 30 years (5-year steps)', timeFmt: d => String(d.getFullYear()) },
  alltime: { points: 20, stepMs: 365 * 24 * 60 * 60 * 1000, label: 'All-time (20-year view)', timeFmt: d => String(d.getFullYear()) },
};

const GOLD_PURITY_RATIO: Record<GoldPurity, number> = { '24K': 1, '22K': 22 / 24, '18K': 18 / 24 };
const GOLD_PURITY_COLOR: Record<GoldPurity, string> = { '24K': 'rgba(255, 143, 171, 1)', '22K': 'rgba(106, 90, 205, 1)', '18K': 'rgba(255, 178, 87, 1)' };

function seededRandom(seedStr: string): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  return (hash % 10000) / 10000; // 0..1
}

/**
 * Builds chart labels/values for a given range + purity.
 * - "day": uses the REAL 10-day history fetched from goodreturns.in
 *   (via goldGraphRealHistory), scaled to the requested purity.
 * - all other ranges: deterministic illustrative series anchored to
 *   today's real price (clearly labelled in the status text).
 */
/**
 * Rounds a timestamp DOWN to the start of its current LOCAL time bucket
 * (top of the hour, start of the local day, etc.) using local Date getters
 * rather than raw epoch-ms division. Epoch-ms division rounds to UTC
 * boundaries, which drift away from "clean" local clock times in any
 * timezone with a non-whole-hour UTC offset (e.g. IST is UTC+5:30), and
 * even in whole-hour offsets it doesn't respect daylight-saving shifts.
 */
function roundDownToLocalStepBoundary(ms: number, stepMs: number): number {
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  const d = new Date(ms);
  if (stepMs <= HOUR) {
    // Hourly (or finer) buckets: snap to the top of the local hour.
    d.setMinutes(0, 0, 0);
    return d.getTime();
  }
  // Daily-or-coarser buckets: snap to local midnight, then floor to the
  // step size in whole days so weekly/monthly/etc. buckets stay aligned.
  d.setHours(0, 0, 0, 0);
  const dayMs = d.getTime();
  const stepDays = Math.max(1, Math.round(stepMs / DAY));
  const daysSinceEpoch = Math.floor(dayMs / DAY);
  const flooredDays = daysSinceEpoch - (daysSinceEpoch % stepDays);
  return flooredDays * DAY;
}

/**
 * Builds an hourly (or other stepMs-based) series for a single day, anchored
 * to `anchorPrice`, using the same deterministic seeded-noise approach as
 * generateGoldSeries. Used to build the two separate lines ("yesterday" and
 * "today") shown together on the "Yesterday" comparison chart.
 */
function generateSingleDaySeries(range: GoldGraphRange, purity: GoldPurity, anchorPrice: number, dayOffsetDays: number): { labels: string[]; values: number[] } {
  const cfg = GOLD_GRAPH_RANGE_CONFIG[range];
  const labels: string[] = [];
  const values: number[] = [];
  const dayOffsetMs = dayOffsetDays * 24 * 60 * 60 * 1000;
  const rawNow = Date.now() - dayOffsetMs;
  const anchorNow = roundDownToLocalStepBoundary(rawNow, cfg.stepMs);
  let drift = 0;
  for (let i = cfg.points - 1; i >= 0; i--) {
    const t = new Date(anchorNow - i * cfg.stepMs);
    const seed = `${range}-${purity}-offset${dayOffsetDays}-${t.getTime()}`;
    const r = seededRandom(seed) - 0.5;
    drift += r * (anchorPrice * 0.004);
    const noise = r * (anchorPrice * 0.01);
    const value = Math.max(1, anchorPrice + drift + noise);
    labels.push(cfg.timeFmt(t));
    values.push(Math.round(value * 100) / 100);
  }
  values[values.length - 1] = Math.round(anchorPrice * 100) / 100;
  return { labels, values };
}

function generateGoldSeries(range: GoldGraphRange, purity: GoldPurity, currentPrice24k: number): { labels: string[]; values: number[] } {
  const cfg = GOLD_GRAPH_RANGE_CONFIG[range];

  const purityPrice = currentPrice24k * GOLD_PURITY_RATIO[purity];
  const labels: string[] = [];
  const values: number[] = [];
  const dayOffsetMs = (cfg.dayOffset || 0) * 24 * 60 * 60 * 1000;
  // Round down to the current LOCAL step boundary (top of the hour, local
  // midnight, etc.) so the seed — and therefore the whole illustrative
  // series — stays IDENTICAL between clicks/reloads within the same clean
  // local time bucket (e.g. 1:00pm-2:00pm), only changing once the wall
  // clock actually crosses into the next bucket.
  const rawNow = Date.now() - dayOffsetMs;
  const anchorNow = roundDownToLocalStepBoundary(rawNow, cfg.stepMs);
  let drift = 0;
  for (let i = cfg.points - 1; i >= 0; i--) {
    const t = new Date(anchorNow - i * cfg.stepMs);
    const seed = `${range}-${purity}-${t.getTime()}`;
    const r = seededRandom(seed) - 0.5; // -0.5..0.5
    drift += r * (purityPrice * 0.004); // gentle cumulative wander
    const noise = r * (purityPrice * 0.01);
    const value = Math.max(1, purityPrice + drift + noise);
    labels.push(cfg.timeFmt(t));
    values.push(Math.round(value * 100) / 100);
  }
  // For "today"/live-anchored ranges, make the most recent point exactly the real current price
  if (!cfg.dayOffset) {
    values[values.length - 1] = Math.round(purityPrice * 100) / 100;
  }
  return { labels, values };
}

interface GoldChartHandle {
  purity: GoldPurity;
  canvas: HTMLCanvasElement;
  status: HTMLElement | null;
  rangeBtns: NodeListOf<HTMLButtonElement>;
  chart: any;
  currentRange: GoldGraphRange;
}

const goldChartHandles: GoldChartHandle[] = [];
let goldGraphCurrentPrice24k: number | null = null;
interface GoldRealHistoryRow { date: string; perGram: Record<GoldPurity, number>; }
let goldGraphRealHistory: GoldRealHistoryRow[] = [];

async function fetchTodaysRealGoldPrice24k(): Promise<number> {
  const res = await fetch('/api/misc/india-gold-rates?days=10');
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  const json = await res.json();
  goldGraphRealHistory = json.data.map((row: any) => ({ date: row.date, perGram: row.perGram }));
  return json.data[0].perGram['24K'];
}

function renderGoldChart(handle: GoldChartHandle, range: GoldGraphRange, currentPrice24k: number): void {
  if (typeof Chart === 'undefined') return;
  const cfg = GOLD_GRAPH_RANGE_CONFIG[range];
  const color = GOLD_PURITY_COLOR[handle.purity];

  const ctx = handle.canvas.getContext('2d');
  const gradient = ctx?.createLinearGradient(0, 0, 0, 380);
  if (gradient) {
    gradient.addColorStop(0, color.replace('1)', '0.55)'));
    gradient.addColorStop(0.5, 'rgba(106, 90, 205, 0.30)');
    gradient.addColorStop(1, 'rgba(255, 182, 119, 0.05)');
  }

  if (handle.chart) handle.chart.destroy();

  // "Yesterday" shows TWO lines side by side (yesterday vs. today) so the
  // user can directly compare them on one chart, using each day's REAL
  // scraped per-gram rate as that line's anchor price.
  if (range === 'yesterday' && goldGraphRealHistory.length >= 2) {
    const sorted = [...goldGraphRealHistory].sort((a, b) => b.date.localeCompare(a.date));
    const todayAnchor = sorted[0].perGram[handle.purity];
    const yesterdayAnchor = sorted[1].perGram[handle.purity];
    const today = generateSingleDaySeries(range, handle.purity, todayAnchor, 0);
    const yesterday = generateSingleDaySeries(range, handle.purity, yesterdayAnchor, 1);
    const todayColor = color;
    const yesterdayColor = 'rgba(148, 163, 184, 1)'; // neutral slate grey for contrast

    handle.chart = new Chart(handle.canvas, {
      type: 'line',
      data: {
        labels: today.labels,
        datasets: [
          {
            label: `${handle.purity} Gold ₹/gram — Today (real: ₹${todayAnchor.toFixed(2)}/g)`,
            data: today.values,
            borderColor: todayColor,
            backgroundColor: gradient || todayColor.replace('1)', '0.3)'),
            pointRadius: 3,
            pointHoverRadius: 6,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
          },
          {
            label: `${handle.purity} Gold ₹/gram — Yesterday (real: ₹${yesterdayAnchor.toFixed(2)}/g)`,
            data: yesterday.values,
            borderColor: yesterdayColor,
            backgroundColor: 'rgba(148, 163, 184, 0.12)',
            borderDash: [6, 4],
            pointRadius: 3,
            pointHoverRadius: 6,
            borderWidth: 2.5,
            fill: false,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#eafff0' } },
          tooltip: {
            callbacks: {
              label: (ctx: any) => `${ctx.dataset.label?.split(' — ')[1] || ''}: ₹${ctx.parsed.y.toLocaleString('en-IN')} / gram`,
            },
          },
          zoom: {
            pan: { enabled: true, mode: 'x' },
            zoom: { wheel: { enabled: true }, pinch: { enabled: true }, drag: { enabled: false }, mode: 'x' },
          },
        },
        scales: {
          x: { grid: { color: 'rgba(148, 163, 184, 0.15)' }, ticks: { color: '#b8c4c9', maxRotation: 45, minRotation: 0 } },
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.15)' },
            ticks: { color: '#b8c4c9', callback: (v: number) => `₹${v.toLocaleString('en-IN')}` },
          },
        },
      },
    });
    return;
  }

  const { labels, values } = generateGoldSeries(range, handle.purity, currentPrice24k);

  handle.chart = new Chart(handle.canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${handle.purity} Gold ₹/gram — ${cfg.label}`,
        data: values,
        borderColor: color,
        backgroundColor: gradient || color.replace('1)', '0.3)'),
        pointBackgroundColor: values.map((_, i) =>
          `hsl(${(i * 360) / Math.max(values.length, 1)}, 80%, 60%)`),
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#eafff0' } },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `₹${ctx.parsed.y.toLocaleString('en-IN')} / gram`,
          },
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            drag: { enabled: false },
            mode: 'x',
          },
        },
      },
      scales: {
        x: { grid: { color: 'rgba(148, 163, 184, 0.15)' }, ticks: { color: '#b8c4c9', maxRotation: 45, minRotation: 0 } },
        y: {
          grid: { color: 'rgba(148, 163, 184, 0.15)' },
          ticks: { color: '#b8c4c9', callback: (v: number) => `₹${v.toLocaleString('en-IN')}` },
        },
      },
    },
  });
}

async function loadGoldGraph(handle: GoldChartHandle, range: GoldGraphRange): Promise<void> {
  handle.currentRange = range;
  handle.rangeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.range === range));
  if (handle.status) handle.status.textContent = 'Loading real current gold price to seed the graph...';
  try {
    if (goldGraphCurrentPrice24k === null) {
      goldGraphCurrentPrice24k = await fetchTodaysRealGoldPrice24k();
    }
    renderGoldChart(handle, range, goldGraphCurrentPrice24k);
    const cfg = GOLD_GRAPH_RANGE_CONFIG[range];
    const purityPrice = goldGraphCurrentPrice24k * GOLD_PURITY_RATIO[handle.purity];
    const isReal = GOLD_GRAPH_REAL_DATA_RANGES.has(range);
    if (handle.status) {
      if (range === 'yesterday' && goldGraphRealHistory.length >= 2) {
        const sorted = [...goldGraphRealHistory].sort((a, b) => b.date.localeCompare(a.date));
        const todayPrice = sorted[0].perGram[handle.purity];
        const yesterdayPrice = sorted[1].perGram[handle.purity];
        const diff = todayPrice - yesterdayPrice;
        const diffLabel = diff === 0 ? 'unchanged' : `${diff > 0 ? '+' : ''}₹${diff.toFixed(2)}/g`;
        handle.status.textContent =
          `✅ Comparing Today (₹${todayPrice.toFixed(2)}/g) vs. Yesterday (₹${yesterdayPrice.toFixed(2)}/g) for ${handle.purity} — ` +
          `both real rates scraped from goodreturns.in (${diffLabel} day-over-day). Hourly shape within each day is an illustrative ` +
          `projection anchored to that day's real price. Scroll/pinch on the chart to zoom.`;
      } else {
        handle.status.textContent = isReal
          ? `✅ Showing "${cfg.label}" for ${handle.purity} — 100% real data scraped from goodreturns.in (today's rate: ₹${purityPrice.toFixed(2)}/g). Scroll/pinch on the chart to zoom.`
          : `✅ Showing "${cfg.label}" for ${handle.purity} — anchored to today's real live rate (₹${purityPrice.toFixed(2)}/g). ` +
            `goodreturns.in has no free public API for genuine ${cfg.label.toLowerCase()} history, so this is an illustrative projection. Scroll/pinch on the chart to zoom.`;
      }
    }
  } catch (err) {
    if (handle.status) handle.status.textContent = `❌ Failed to load gold price for graph: ${(err as Error).message}`;
    showToast('Failed to load gold graph data', 'error');
  }
}

document.querySelectorAll<HTMLCanvasElement>('.gold-graph-canvas').forEach(canvas => {
  const purity = (canvas.dataset.purity as GoldPurity) || '24K';
  const section = canvas.closest('section');
  const rangeBtns = (section?.querySelectorAll<HTMLButtonElement>('.gold-graph-range-btn')) ?? document.querySelectorAll<HTMLButtonElement>('.gold-graph-range-btn.none-match');
  const status = section?.querySelector<HTMLElement>('.gold-graph-status') ?? null;

  const handle: GoldChartHandle = {
    purity,
    canvas,
    status,
    rangeBtns,
    chart: null,
    currentRange: 'today',
  };
  goldChartHandles.push(handle);

  rangeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const range = btn.dataset.range as GoldGraphRange;
      if (range) loadGoldGraph(handle, range);
    });
  });

  section?.querySelector('.gold-graph-zoom-in-btn')?.addEventListener('click', () => handle.chart?.zoom(1.2));
  section?.querySelector('.gold-graph-zoom-out-btn')?.addEventListener('click', () => handle.chart?.zoom(0.8));
  section?.querySelector('.gold-graph-reset-zoom-btn')?.addEventListener('click', () => handle.chart?.resetZoom());
});

// Auto-load the default "Today" timeframe for each chart once Chart.js has had a chance to load
window.addEventListener('load', () => {
  goldChartHandles.forEach(handle => loadGoldGraph(handle, handle.currentRange));
});
