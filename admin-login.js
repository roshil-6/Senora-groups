// Simple admin login with first-time setup stored in localStorage
// Allows owner to set email/password the first time, and validates thereafter

(function () {
  const STORAGE_KEYS = {
    adminCreds: 'adminCredentials', // { email, passwordHash }
    adminSession: 'adminSession',   // { email, loginAt }
    currentUser: 'currentUser',     // { name, email, accountType }
  };

  const form = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  const rememberMe = document.getElementById('rememberMe');
  const errorBox = document.getElementById('errorBox');
  const setupNotice = document.getElementById('setupNotice');
  const togglePwd = document.getElementById('togglePwd');

  togglePwd?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePwd.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  });

  const existingCreds = loadCreds();
  if (!existingCreds) {
    setupNotice.style.display = 'block';
    // Pre-fill with default admin credentials
    emailInput.value = 'docunittoniosenora@gmail.com';
    passwordInput.value = 'Senora@2024';
  }

  // If session exists, go straight to admin dashboard
  const activeSession = loadSession();
  if (activeSession) {
    window.location.href = 'admin-dashboard.html';
    return;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = (emailInput.value || '').trim().toLowerCase();
    const password = passwordInput.value || '';

    if (!email || !password) {
      return showError('Please enter email and password');
    }

    // First-time setup: store provided credentials
    let creds = loadCreds();
    if (!creds) {
      creds = await createCreds(email, password);
      saveCreds(creds);
    }
    
    // Also set up the admin session in the main system format
    const adminUser = {
      id: 'admin-001',
      name: 'Administrator',
      email: creds.email,
      accountType: 'admin',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
    localStorage.setItem('adminSession', 'true');

    // Validate
    const isValid = await verifyPassword(password, creds.passwordHash) && email === creds.email;
    if (!isValid) {
      return showError('Invalid email or password');
    }

    // Create session and redirect
    const session = { email: creds.email, loginAt: new Date().toISOString(), remember: !!rememberMe.checked };
    localStorage.setItem(STORAGE_KEYS.adminSession, 'true'); // Use simple string format
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify({ name: 'Administrator', email: creds.email, accountType: 'admin' }));

    window.location.href = 'admin-dashboard.html';
  });

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }
  function hideError() {
    if (!errorBox) return;
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  }

  function loadCreds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.adminCreds);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function saveCreds(creds) {
    localStorage.setItem(STORAGE_KEYS.adminCreds, JSON.stringify(creds));
  }
  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.adminSession);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  async function createCreds(email, password) {
    return { email, passwordHash: await hash(password) };
  }

  async function verifyPassword(plain, hashValue) {
    const computed = await hash(plain);
    return computed === hashValue;
  }

  async function hash(text) {
    // Simple SHA-256 hash via SubtleCrypto; not for production secrets across devices, but ok for local-only demo
    const enc = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
})();


