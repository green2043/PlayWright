// Delayed element
document.getElementById('showDelayedBtn')?.addEventListener('click', () => {
  const el = document.getElementById('delayedElement');
  if (!el) return;
  el.hidden = true;
  setTimeout(() => { el.hidden = false; }, 2000);
});

// Spinner
document.getElementById('loadSpinnerBtn')?.addEventListener('click', () => {
  const container = document.getElementById('spinnerContainer');
  if (!container) return;
  container.innerHTML = '<span class="spinner" data-testid="loading-spinner"></span> Loading...';
  setTimeout(() => { container.innerHTML = '✅ Done loading!'; }, 2000);
});

// Skeleton loader
document.getElementById('loadSkeletonBtn')?.addEventListener('click', () => {
  const skeleton = document.getElementById('skeletonContainer');
  const loaded = document.getElementById('loadedContent');
  if (skeleton) skeleton.hidden = false;
  if (loaded) loaded.hidden = true;
  setTimeout(() => {
    if (skeleton) skeleton.hidden = true;
    if (loaded) loaded.hidden = false;
  }, 2000);
});

// Progress bar
document.getElementById('startProgressBtn')?.addEventListener('click', () => {
  const fill = document.getElementById('progressFill') as HTMLDivElement | null;
  const text = document.getElementById('progressText');
  if (!fill || !text) return;
  let pct = 0;
  fill.style.width = '0%';
  const interval = setInterval(() => {
    pct += 10;
    fill.style.width = `${pct}%`;
    text.textContent = `${pct}%`;
    if (pct >= 100) clearInterval(interval);
  }, 300);
});

// Infinite scroll simulation
const infiniteList = document.getElementById('infiniteScrollList');
const infiniteContainer = document.getElementById('infiniteScrollContainer');
let itemCount = 0;

function appendItems(count: number) {
  if (!infiniteList) return;
  for (let i = 0; i < count; i++) {
    itemCount++;
    const li = document.createElement('li');
    li.textContent = `Scroll item ${itemCount}`;
    li.setAttribute('data-testid', `scroll-item-${itemCount}`);
    infiniteList.appendChild(li);
  }
}
appendItems(15);

infiniteContainer?.addEventListener('scroll', () => {
  if (!infiniteContainer) return;
  const nearBottom = infiniteContainer.scrollTop + infiniteContainer.clientHeight >= infiniteContainer.scrollHeight - 20;
  if (nearBottom && itemCount < 100) appendItems(10);
});

// Custom calendar
let calDate = new Date();
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const label = document.getElementById('calendarMonthYear');
  if (!grid || !label) return;
  label.textContent = `${monthNames[calDate.getMonth()]} ${calDate.getFullYear()}`;
  grid.innerHTML = '';
  const firstDay = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    grid.appendChild(empty);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement('button');
    btn.textContent = String(d);
    btn.setAttribute('data-testid', `calendar-day-${d}`);
    btn.addEventListener('click', () => {
      const selected = document.getElementById('selectedDate');
      if (selected) selected.textContent = `Selected: ${monthNames[calDate.getMonth()]} ${d}, ${calDate.getFullYear()}`;
    });
    grid.appendChild(btn);
  }
}

document.getElementById('prevMonthBtn')?.addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById('nextMonthBtn')?.addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

// Dynamic Toggle Button (Start/Stop) - practice dynamic element locators with XPath
const toggleStartStopBtn = document.getElementById('toggleStartStopBtn') as HTMLButtonElement | null;
toggleStartStopBtn?.addEventListener('click', () => {
  const isStart = toggleStartStopBtn.textContent?.trim() === 'START';
  if (isStart) {
    toggleStartStopBtn.textContent = 'STOP';
    toggleStartStopBtn.name = 'stopState';
    toggleStartStopBtn.classList.remove('btn-start');
    toggleStartStopBtn.classList.add('btn-stop');
  } else {
    toggleStartStopBtn.textContent = 'START';
    toggleStartStopBtn.name = 'startState';
    toggleStartStopBtn.classList.remove('btn-stop');
    toggleStartStopBtn.classList.add('btn-start');
  }
});

/* ============================================================
   Dynamically-Loaded Dropdown
   Simulates an AJAX call: the <select> stays disabled with a
   placeholder option until "Load Options" is clicked, then options
   arrive ~1.5s later - practise auto-waiting for disabled to clear.
   ============================================================ */
const loadCategoryOptionsBtn = document.getElementById('loadCategoryOptionsBtn') as HTMLButtonElement | null;
const dynamicCategorySelect = document.getElementById('dynamicCategorySelect') as HTMLSelectElement | null;
const dynamicCategorySpinner = document.getElementById('dynamicCategorySpinner') as HTMLElement | null;

const PRODUCT_CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports & Outdoors', 'Toys & Games'];

loadCategoryOptionsBtn?.addEventListener('click', () => {
  if (dynamicCategorySpinner) dynamicCategorySpinner.hidden = false;
  loadCategoryOptionsBtn.disabled = true;
  if (dynamicCategorySelect) dynamicCategorySelect.innerHTML = '<option value="">Loading categories...</option>';

  setTimeout(() => {
    if (dynamicCategorySelect) {
      dynamicCategorySelect.innerHTML = '<option value="">-- Select a category --</option>';
      PRODUCT_CATEGORIES.forEach((category, i) => {
        const opt = document.createElement('option');
        opt.value = category.toLowerCase().replace(/[^a-z]+/g, '-');
        opt.textContent = category;
        opt.setAttribute('data-testid', `dynamic-category-option-${i + 1}`);
        dynamicCategorySelect.appendChild(opt);
      });
      dynamicCategorySelect.disabled = false;
    }
    if (dynamicCategorySpinner) dynamicCategorySpinner.hidden = true;
    loadCategoryOptionsBtn.disabled = false;
  }, 1500);
});

/* ============================================================
   Cascading (Dependent) Dropdowns
   Continent -> Country -> City, each level dynamically rebuilding
   the <option> list of the level below it and resetting/disabling
   any further-downstream dropdown until a valid parent is chosen.
   ============================================================ */
interface CascadeCountry { code: string; name: string; cities: string[]; }
interface CascadeContinent { code: string; countries: CascadeCountry[]; }

const CASCADE_DATA: Record<string, CascadeCountry[]> = {
  asia: [
    { code: 'in', name: 'India', cities: ['Mumbai', 'Delhi', 'Bengaluru'] },
    { code: 'jp', name: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
    { code: 'sg', name: 'Singapore', cities: ['Singapore City'] },
  ],
  europe: [
    { code: 'uk', name: 'United Kingdom', cities: ['London', 'Manchester', 'Edinburgh'] },
    { code: 'fr', name: 'France', cities: ['Paris', 'Lyon', 'Marseille'] },
    { code: 'de', name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg'] },
  ],
  namerica: [
    { code: 'us', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago'] },
    { code: 'ca', name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
  ],
};

const cascadeContinent = document.getElementById('cascadeContinent') as HTMLSelectElement | null;
const cascadeCountry = document.getElementById('cascadeCountry') as HTMLSelectElement | null;
const cascadeCity = document.getElementById('cascadeCity') as HTMLSelectElement | null;
const cascadeSelectionSummary = document.getElementById('cascadeSelectionSummary') as HTMLParagraphElement | null;

function resetCascadeCountry(): void {
  if (!cascadeCountry) return;
  cascadeCountry.innerHTML = '<option value="">-- Select a continent first --</option>';
  cascadeCountry.disabled = true;
}
function resetCascadeCity(placeholder = '-- Select a country first --'): void {
  if (!cascadeCity) return;
  cascadeCity.innerHTML = `<option value="">${placeholder}</option>`;
  cascadeCity.disabled = true;
}
function updateCascadeSummary(): void {
  if (!cascadeSelectionSummary) return;
  const continentText = cascadeContinent?.selectedOptions[0]?.textContent ?? '';
  const countryText = cascadeCountry?.selectedOptions[0]?.textContent ?? '';
  const cityText = cascadeCity?.selectedOptions[0]?.textContent ?? '';
  if (cascadeContinent?.value && cascadeCountry?.value && cascadeCity?.value) {
    cascadeSelectionSummary.textContent = `Selected: ${cityText}, ${countryText}, ${continentText}`;
  } else {
    cascadeSelectionSummary.textContent = '';
  }
}

cascadeContinent?.addEventListener('change', () => {
  const continentCode = cascadeContinent.value;
  resetCascadeCity();
  if (!continentCode || !cascadeCountry) {
    resetCascadeCountry();
    updateCascadeSummary();
    return;
  }
  cascadeCountry.innerHTML = '<option value="">-- Select a country --</option>';
  for (const country of CASCADE_DATA[continentCode] ?? []) {
    const opt = document.createElement('option');
    opt.value = country.code;
    opt.textContent = country.name;
    opt.setAttribute('data-testid', `cascade-country-option-${country.code}`);
    cascadeCountry.appendChild(opt);
  }
  cascadeCountry.disabled = false;
  updateCascadeSummary();
});

cascadeCountry?.addEventListener('change', () => {
  const continentCode = cascadeContinent?.value ?? '';
  const countryCode = cascadeCountry.value;
  if (!countryCode || !cascadeCity) {
    resetCascadeCity();
    updateCascadeSummary();
    return;
  }
  const country = (CASCADE_DATA[continentCode] ?? []).find(c => c.code === countryCode);
  cascadeCity.innerHTML = '<option value="">-- Select a city --</option>';
  for (const city of country?.cities ?? []) {
    const opt = document.createElement('option');
    opt.value = city.toLowerCase().replace(/\s+/g, '-');
    opt.textContent = city;
    opt.setAttribute('data-testid', `cascade-city-option-${opt.value}`);
    cascadeCity.appendChild(opt);
  }
  cascadeCity.disabled = false;
  updateCascadeSummary();
});

cascadeCity?.addEventListener('change', updateCascadeSummary);
