import { showToast } from './common.js';

let authToken = '';

document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const username = (document.getElementById('loginUsername') as HTMLInputElement).value;
  const password = (document.getElementById('loginPassword') as HTMLInputElement).value;
  const tokenDisplay = document.getElementById('tokenDisplay');
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      authToken = data.token;
      if (tokenDisplay) tokenDisplay.textContent = `Token: ${authToken.substring(0, 40)}...`;
      showToast('Login successful', 'success');
    } else {
      if (tokenDisplay) tokenDisplay.textContent = `Error: ${data.message}`;
      showToast('Login failed', 'error');
    }
  } catch {
    showToast('Network error during login', 'error');
  }
});

document.querySelectorAll('.api-call-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const el = btn as HTMLElement;
    const endpoint = el.dataset.endpoint!;
    const method = el.dataset.method || 'GET';
    const needsAuth = el.dataset.auth === 'true';
    const responseEl = document.getElementById('apiResponse');
    if (responseEl) responseEl.textContent = 'Loading...';

    const headers: Record<string, string> = {};
    if (needsAuth && authToken) headers['Authorization'] = `Bearer ${authToken}`;

    try {
      const res = await fetch(endpoint, { method, headers });
      const contentType = res.headers.get('content-type') || '';
      const body = contentType.includes('application/json') ? await res.json() : await res.text();
      if (responseEl) {
        responseEl.textContent = `Status: ${res.status} ${res.statusText}\n\n${JSON.stringify(body, null, 2)}`;
      }
    } catch (err) {
      if (responseEl) responseEl.textContent = `Request failed: ${err}`;
    }
  });
});
