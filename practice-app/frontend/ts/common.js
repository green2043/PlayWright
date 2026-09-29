// Shared utilities used across pages: toast notifications, nav highlighting, etc.
export function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('data-testid', 'toast-container');
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('data-testid', `toast-${type}`);
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
export function highlightActiveNavLink() {
    const links = document.querySelectorAll('nav.main-nav a');
    const current = window.location.pathname.split('/').pop();
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && current && href.endsWith(current)) {
            link.setAttribute('aria-current', 'page');
        }
    });
}
/**
 * Injects a decorative, Makoto Shinkai–inspired anime backdrop into every page:
 * a dreamy sky gradient with twinkling stars, drifting clouds, falling sakura
 * petals, and a small floating corner sticker. Purely visual — every element
 * uses `pointer-events: none` and negative/low z-index so it never interferes
 * with Playwright/Selenium locators or interactions.
 */
export function injectAnimeDecor() {
    if (document.querySelector('.anime-sky-bg'))
        return; // avoid duplicate injection
    const sky = document.createElement('div');
    sky.className = 'anime-sky-bg';
    sky.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sky);
    const cloudEmojis = ['☁️', '🌤️', '⛅'];
    for (let i = 0; i < 4; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'anime-cloud';
        cloud.setAttribute('aria-hidden', 'true');
        cloud.textContent = cloudEmojis[i % cloudEmojis.length];
        cloud.style.top = `${8 + i * 14}%`;
        cloud.style.fontSize = `${2 + (i % 3)}rem`;
        cloud.style.animationDuration = `${40 + i * 15}s`;
        cloud.style.animationDelay = `${i * -8}s`;
        document.body.appendChild(cloud);
    }
    const petalEmojis = ['🌸', '🌸', '🍃'];
    for (let i = 0; i < 10; i++) {
        const petal = document.createElement('div');
        petal.className = 'anime-petal';
        petal.setAttribute('aria-hidden', 'true');
        petal.textContent = petalEmojis[i % petalEmojis.length];
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${8 + Math.random() * 10}s`;
        petal.style.animationDelay = `${Math.random() * -15}s`;
        document.body.appendChild(petal);
    }
    const sticker = document.createElement('div');
    sticker.className = 'anime-corner-sticker';
    sticker.setAttribute('aria-hidden', 'true');
    sticker.textContent = '🎐';
    document.body.appendChild(sticker);
    // --- "Your Name" (君の名は。) motifs: streaking comet + red thread of fate ---
    const comet = document.createElement('div');
    comet.className = 'anime-comet';
    comet.setAttribute('aria-hidden', 'true');
    document.body.appendChild(comet);
    const thread = document.createElement('div');
    thread.className = 'anime-thread-of-fate';
    thread.setAttribute('aria-hidden', 'true');
    thread.innerHTML = '<svg viewBox="0 0 200 400" preserveAspectRatio="none"><path d="M10,0 C60,80 -20,160 40,240 C90,300 20,340 60,400" /></svg>';
    document.body.appendChild(thread);
    // --- "Weathering With You" (天気の子) motifs: falling rain + teru teru bozu charm ---
    const rain = document.createElement('div');
    rain.className = 'anime-rain';
    rain.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 30; i++) {
        const drop = document.createElement('div');
        drop.className = 'anime-raindrop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.6 + Math.random() * 0.6}s`;
        drop.style.animationDelay = `${Math.random() * -2}s`;
        rain.appendChild(drop);
    }
    document.body.appendChild(rain);
    const charm = document.createElement('div');
    charm.className = 'anime-teru-teru-bozu';
    charm.setAttribute('aria-hidden', 'true');
    charm.innerHTML = '<span class="teru-string"></span><span class="teru-body">👻</span>';
    document.body.appendChild(charm);
}
document.addEventListener('DOMContentLoaded', injectAnimeDecor);
document.addEventListener('DOMContentLoaded', highlightActiveNavLink);
//# sourceMappingURL=common.js.map