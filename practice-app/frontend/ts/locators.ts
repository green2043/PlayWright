import { showToast } from './common.js';

// --- getByRole() section ---
const roleResult = document.getElementById('roleResult');

document.querySelector('[data-testid="role-btn-explicit"]')?.addEventListener('click', () => {
  if (roleResult) roleResult.textContent = '✅ Native button clicked!';
  showToast('Native button clicked', 'success');
});

document.querySelector('[data-testid="role-div-explicit"]')?.addEventListener('click', () => {
  if (roleResult) roleResult.textContent = '✅ Div with role="button" clicked!';
  showToast('role="button" div clicked', 'success');
});

const roleCheckbox = document.getElementById('roleCheckbox') as HTMLInputElement | null;
roleCheckbox?.addEventListener('change', () => {
  if (roleResult) roleResult.textContent = `Checkbox is now ${roleCheckbox.checked ? 'checked ✅' : 'unchecked'}`;
});

document.querySelector('[data-testid="role-nav-link"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (roleResult) roleResult.textContent = '✅ Nav link clicked (navigation prevented for demo)!';
});

document.querySelector('[data-testid="role-heading"]')?.addEventListener('click', () => {
  if (roleResult) roleResult.textContent = '✅ Heading clicked!';
});

// --- getByText() section: highlight paragraph on click ---
document.querySelectorAll('[data-testid^="text-"]').forEach(p => {
  p.addEventListener('click', () => {
    (p as HTMLElement).style.background = (p as HTMLElement).style.background ? '' : '#fef08a';
  });
});

// --- getByLabel() section: echo typed value ---
const labelEchoResult = document.getElementById('labelEchoResult');
['label-for-input', 'label-wrapped-input', 'label-aria-input'].forEach(testId => {
  const input = document.querySelector(`[data-testid="${testId}"]`) as HTMLInputElement | null;
  input?.addEventListener('input', () => {
    if (labelEchoResult) labelEchoResult.textContent = `You typed: "${input.value}" in ${testId}`;
  });
});

// --- getByPlaceholder() section: echo typed value ---
const placeholderEchoResult = document.getElementById('placeholderEchoResult');
['placeholder-username', 'placeholder-similar'].forEach(testId => {
  const input = document.querySelector(`[data-testid="${testId}"]`) as HTMLInputElement | null;
  input?.addEventListener('input', () => {
    if (placeholderEchoResult) placeholderEchoResult.textContent = `You typed: "${input.value}" in ${testId}`;
  });
});

// --- getByAltText() section: click images / icon button ---
const altResult = document.getElementById('altResult');
document.querySelectorAll('[data-testid^="alt-"] img, [data-testid^="alt-"]').forEach(el => {
  el.addEventListener('click', () => {
    const alt = (el as HTMLImageElement).alt ?? (el.querySelector('img') as HTMLImageElement | null)?.alt;
    if (altResult) altResult.textContent = `✅ Clicked image/button with alt: "${alt ?? '(icon button)'}"`;
  });
});

// --- getByTitle() section ---
const titleResult = document.getElementById('titleResult');
document.querySelector('[data-testid="title-save-btn"]')?.addEventListener('click', () => {
  if (titleResult) titleResult.textContent = '✅ Changes saved!';
  showToast('Changes saved', 'success');
});
document.querySelector('[data-testid="title-back-link"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (titleResult) titleResult.textContent = '✅ Back link clicked (navigation prevented for demo)!';
});
document.querySelector('[data-testid="title-info-span"]')?.addEventListener('click', () => {
  if (titleResult) titleResult.textContent = 'ℹ️ Additional context info displayed!';
});

// --- getByTestId() section ---
const testIdResult = document.getElementById('testIdResult');
document.querySelector('[data-testid="testid-standard-btn"]')?.addEventListener('click', () => {
  if (testIdResult) testIdResult.textContent = '✅ Standard data-testid button clicked!';
});
document.querySelector('[data-qa="custom-qa-btn"]')?.addEventListener('click', () => {
  if (testIdResult) testIdResult.textContent = '✅ Custom data-qa button clicked!';
});

// --- Combined / Ambiguous section ---
const ambiguousResult = document.getElementById('ambiguousResult');
document.querySelector('[data-testid="multi-strategy-btn"]')?.addEventListener('click', () => {
  if (ambiguousResult) ambiguousResult.textContent = '✅ Multi-strategy button clicked!';
  showToast('Multi-strategy button clicked', 'info');
});
document.querySelectorAll('.ambiguous-btn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    if (ambiguousResult) ambiguousResult.textContent = `✅ Submit button #${index + 1} clicked! (Use .nth(${index}) or .filter() to target a specific one)`;
  });
});

// --- Filtering Locators section: filter(), hasText, hasNotText, has ---
const filterResult = document.getElementById('filterResult');
document.querySelectorAll('[data-testid^="filter-add-to-cart-"]').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    if (filterResult) filterResult.textContent = `✅ Added Product ${index + 1} to cart! (locate via .getByRole('listitem').filter({ hasText: 'Product ${index + 1}' }))`;
  });
});

// --- Locate by CSS or XPath section ---
const cssXpathResult = document.getElementById('cssXpathResult');
document.querySelector('[data-testid="css-xpath-btn"]')?.addEventListener('click', () => {
  if (cssXpathResult) cssXpathResult.textContent = '✅ Clicked via #cssIdTarget / .css-class-target / XPath!';
  showToast('CSS/XPath target clicked', 'info');
});

// --- Lists section: count, nth(), first(), last() ---
const fruitResult = document.getElementById('fruitResult');
document.querySelectorAll('[data-testid="fruit-item"]').forEach((item, index) => {
  item.addEventListener('click', () => {
    if (fruitResult) fruitResult.textContent = `✅ Clicked "${item.textContent}" (index ${index}) — try .nth(${index}), .first(), or .last()`;
  });
});

// --- Chaining Filters section: filter by text + child locator ---
const chainResult = document.getElementById('chainResult');
document.querySelectorAll('[data-testid="chain-row"]').forEach(row => {
  const name = row.querySelector('.chain-name')?.textContent ?? '';
  row.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (chainResult) chainResult.textContent = `✅ "${btn.textContent}" clicked for ${name}! (chain .filter({ hasText: '${name}' }).filter({ has: page.getByRole('button', { name: '${btn.textContent}' }) }))`;
    });
  });
});

