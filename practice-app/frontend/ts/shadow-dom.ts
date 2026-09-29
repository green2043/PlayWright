class PracticeCounter extends HTMLElement {
  private count = 0;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        button { padding: 0.5rem 1rem; border-radius: 6px; border: none; background: #2563eb; color: #fff; cursor: pointer; }
        span { margin-left: 0.75rem; font-weight: bold; }
      </style>
      <button data-testid="shadow-increment-btn">Increment</button>
      <span data-testid="shadow-count-display">Count: 0</span>
    `;
    const button = shadow.querySelector('button');
    const display = shadow.querySelector('span');
    button?.addEventListener('click', () => {
      this.count++;
      if (display) display.textContent = `Count: ${this.count}`;
    });
  }
}
customElements.define('practice-counter', PracticeCounter);

// Canvas drawing
const canvas = document.getElementById('practiceCanvas') as HTMLCanvasElement | null;
if (canvas) {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(10, 10, 100, 60);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(200, 60, 40, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Drag and drop
const dragSource = document.getElementById('dragSource');
const dropTarget = document.getElementById('dropTarget');
const dragDropResult = document.getElementById('dragDropResult');

dragSource?.addEventListener('dragstart', (e) => {
  (e as DragEvent).dataTransfer?.setData('text/plain', 'dragged-item');
});

dropTarget?.addEventListener('dragover', (e) => e.preventDefault());
dropTarget?.addEventListener('drop', (e) => {
  e.preventDefault();
  if (dragDropResult) dragDropResult.textContent = '✅ Item was dropped successfully!';
});
