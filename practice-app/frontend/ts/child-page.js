"use strict";
// Logic for child-page-1.html: spinner, slider, rainbow buttons, mute toggle
document.getElementById('childSpinnerBtn')?.addEventListener('click', () => {
    const container = document.getElementById('childSpinnerContainer');
    if (!container)
        return;
    container.innerHTML = '<span class="spinner" data-testid="child-loading-spinner"></span> Loading...';
    setTimeout(() => { container.innerHTML = '✅ Done loading!'; }, 2000);
});
const slider = document.getElementById('childSlider');
const sliderValue = document.getElementById('childSliderValue');
slider?.addEventListener('input', () => {
    if (sliderValue)
        sliderValue.textContent = slider.value;
});
document.querySelectorAll('[data-testid^="rainbow-btn-"]').forEach(btn => {
    btn.addEventListener('click', () => {
        const result = document.getElementById('rainbowResult');
        const color = btn.textContent?.trim();
        if (result)
            result.textContent = `You clicked the ${color} button!`;
    });
});
let isMuted = false;
document.getElementById('muteToggleBtn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    isMuted = !isMuted;
    btn.setAttribute('aria-pressed', String(isMuted));
    btn.textContent = isMuted ? '🔇 Muted' : '🔊 Unmuted';
});
//# sourceMappingURL=child-page.js.map