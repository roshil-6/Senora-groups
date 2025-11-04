// Main JavaScript file for Tonio & Senora Migration Law Firm Application

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme on page load
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

// Toggle theme function
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Trigger illustration update if function exists
    if (typeof updateCountryIllustrations === 'function') {
        setTimeout(() => updateCountryIllustrations(), 100);
    }
    updateThemeIcon();
}

// Update theme icon
function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Global variables
let currentUser = null;
let isAuthenticated = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeApp();
    setupEventListeners();
    checkAuthentication();
    registerServiceWorker();
});

// Initialize application
function initializeApp() {
    // Clear any existing session data to ensure clean state
    clearAllSessions();
    
    // Check if user is already logged in (but don't auto-redirect)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
    }
}

// Clear all session data
function clearAllSessions() {
    // Only clear session data, not user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('clientSession');
}

// Clear client checklist state to ensure clean session for new client
function clearClientChecklistState() {
    console.log('🧹 Clearing previous client checklist state...');
    
    // Clear document selection state
    localStorage.removeItem('documentCountry');
    localStorage.removeItem('documentVisaType');
    localStorage.removeItem('documentAuthority');
    
    // Clear any stored document data
    localStorage.removeItem('documents');
    localStorage.removeItem('uploadedFiles');
    
    // Clear any stored selections
    localStorage.removeItem('documentSelectionState');
    
    console.log('✅ Previous client checklist state cleared');
}

// Clear all application data (for testing)
function clearAllData() {
    localStorage.clear();
    showNotification('All application data cleared', 'info');
}

// Setup event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile nav and smooth scroll on link click
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.indexOf('#') === 0) {
                    e.preventDefault();
                    // Close the mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                    const targetId = href.slice(1);
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        // Account for fixed navbar height (no optional chaining)
                        const navbar = document.querySelector('.navbar');
                        const navHeight = navbar ? navbar.offsetHeight : 0;
                        const rect = targetEl.getBoundingClientRect();
                        const offsetTop = window.pageYOffset + rect.top - navHeight;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    } else {
                        // Fallback to default if element not found
                        window.location.hash = href;
                    }
                }
            });
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // File upload
    setupFileUpload();
}

// Authentication functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('registerModal').style.display = 'none';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    document.getElementById('loginModal').style.display = 'none';
    
    // Ensure the select element is enabled and clickable
    const registerTypeSelect = document.getElementById('registerType');
    if (registerTypeSelect) {
        registerTypeSelect.disabled = false;
        registerTypeSelect.style.pointerEvents = 'auto';
        registerTypeSelect.style.opacity = '1';
        registerTypeSelect.style.zIndex = '1000';
        registerTypeSelect.style.position = 'relative';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchToRegister() {
    closeModal('loginModal');
    showRegisterModal();
}

function switchToLogin() {
    closeModal('registerModal');
    showLoginModal();
}

// Admin credentials (in production, these should be in environment variables)
const ADMIN_CREDENTIALS = {
    email: 'docunittoniosenora@gmail.com',
    password: 'Senora@2024'
};

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Check for admin credentials first
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
            id: 'admin-001',
            name: 'Admin',
            email: ADMIN_CREDENTIALS.email,
            accountType: 'admin',
            createdAt: new Date().toISOString()
        };
        
        currentUser = adminUser;
        isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        localStorage.setItem('adminSession', 'true');
        
        showNotification('Admin login successful!', 'success');
        closeModal('loginModal');
        
        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
        return;
    }
    
    // Check if user exists in localStorage (for clients only)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Handle admin login
        if (user.accountType === 'admin') {
            currentUser = user;
            isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('adminSession', 'true');
            
            showNotification('Admin login successful!', 'success');
            closeModal('loginModal');
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1000);
            return;
        }
        
        currentUser = user;
        isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('clientSession', 'true');
        
        // Clear any previous client's checklist state to ensure clean session
        clearClientChecklistState();
        
        showNotification('Login successful!', 'success');
        closeModal('loginModal');
        
        // Redirect to client dashboard
        setTimeout(() => {
            window.location.href = 'client-dashboard.html';
        }, 1000);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    console.log('Registration form submitted');
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const accountType = document.getElementById('registerType').value;
    
    console.log('Registration data:', { name, email, accountType });
    
    // Basic validation
    if (!name || !email || !password || !accountType) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Name validation
    if (name.length < 2) {
        showNotification('Name must be at least 2 characters long', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Load users list early (needed for both paths)
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Admin registration validation
    if (accountType === 'admin') {
        console.log('Processing admin registration');
        console.log('Expected credentials:', ADMIN_CREDENTIALS);
        console.log('Provided credentials:', { email, password });
        
        // Check if admin credentials match the predefined ones
        if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
            console.log('Invalid admin credentials');
            showNotification('Invalid admin credentials. Please contact system administrator.', 'error');
            return;
        }
        
        // Check if admin already exists
        const existingAdmin = users.find(u => u.accountType === 'admin');
        if (existingAdmin) {
            console.log('Admin already exists');
            showNotification('Admin account already exists', 'error');
            return;
        }

        console.log('Admin credentials valid, storing hashed credentials');
        // Also persist hashed admin credentials for admin-dashboard guard
        try {
            const enc = new TextEncoder().encode(password);
            const digest = await crypto.subtle.digest('SHA-256', enc);
            const passwordHash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
            localStorage.setItem('adminCredentials', JSON.stringify({ email, passwordHash }));
            console.log('Admin credentials stored successfully');
        } catch (error) {
            console.error('Error storing admin credentials:', error);
        }
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showNotification('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: accountType === 'admin' ? 'admin-001' : Date.now().toString(),
        name: name,
        email: email,
        password: password,
        accountType: accountType,
        createdAt: new Date().toISOString()
    };
    
    console.log('Creating new user:', newUser);
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('User created and stored successfully');
    console.log('All users in localStorage:', JSON.parse(localStorage.getItem('users') || '[]'));
    
    showNotification('Registration successful! Please login.', 'success');
    closeModal('registerModal');
    showLoginModal();
}

// Check authentication
function checkAuthentication() {
    if (isAuthenticated && currentUser) {
        // Hide login/register buttons and show user info
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            // Create elements safely to prevent XSS
            navButtons.innerHTML = '';
            const welcomeSpan = document.createElement('span');
            welcomeSpan.textContent = `Welcome, ${currentUser.name}`;
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-outline';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = logout;
            navButtons.appendChild(welcomeSpan);
            navButtons.appendChild(logoutBtn);
        }
    }
}

// Redirect to dashboard
function redirectToDashboard() {
    if (currentUser) {
        if (currentUser.accountType === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'client-dashboard.html';
        }
    }
}

// Logout function
function logout() {
    currentUser = null;
    isAuthenticated = false;
    
    // Clear all session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    localStorage.removeItem('isAuthenticated');
    
    showNotification('Logged out successfully', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Handle contact form
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Store contact message
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
        id: Date.now().toString(),
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    showNotification('Message sent successfully! We will get back to you soon.', 'success');
    e.target.reset();
}

// File upload functionality
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            handleFileUpload(e.target.files);
        });
    }
}

// Handle file upload
function handleFileUpload(files) {
    if (files.length === 0) return;
    
    // Store uploaded files
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    
    Array.from(files).forEach(file => {
        const fileData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            status: 'uploaded'
        };
        
        uploadedFiles.push(fileData);
    });
    
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    
    showNotification(`${files.length} file(s) uploaded successfully`, 'success');
    
    // Refresh document list if on documents page
    if (typeof refreshDocumentList === 'function') {
        refreshDocumentList();
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element safely
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const icon = document.createElement('i');
    icon.className = `fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    content.appendChild(icon);
    content.appendChild(messageSpan);
    notification.appendChild(content);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#28a745';
        }
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function isValidPassword(password) {
    return password.length >= 6;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage helpers
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Export functions for use in other files
window.TonioSenora = {
    showNotification,
    validateForm,
    isValidEmail,
    isValidPassword,
    formatFileSize,
    formatDate,
    debounce,
    throttle,
    saveToStorage,
    loadFromStorage,
    logout
};

// Debug function for register select
function debugRegisterSelect() {
    const select = document.getElementById('registerType');
    if (select) {
        console.log('Register Type Select Debug:');
        console.log('- Element found:', !!select);
        console.log('- Disabled:', select.disabled);
        console.log('- Pointer Events:', select.style.pointerEvents);
        console.log('- Opacity:', select.style.opacity);
        console.log('- Z-Index:', select.style.zIndex);
        console.log('- Position:', select.style.position);
        console.log('- Value:', select.value);
        console.log('- Selected Index:', select.selectedIndex);
        console.log('- Options count:', select.options.length);
        
        // Try to enable it
        select.disabled = false;
        select.style.pointerEvents = 'auto';
        select.style.opacity = '1';
        select.style.zIndex = '1000';
        select.style.position = 'relative';
        
        console.log('After fix - Disabled:', select.disabled);
    } else {
        console.log('Register Type Select not found!');
    }
}

// Quick Admin Login function
async function quickAdminLogin() {
    try {
        // Setup admin credentials
        const email = 'docunittoniosenora@gmail.com';
        const password = 'Senora@2024';
        
        // Hash password
        const enc = new TextEncoder().encode(password);
        const digest = await crypto.subtle.digest('SHA-256', enc);
        const passwordHash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Store credentials
        const creds = { email, passwordHash };
        localStorage.setItem('adminCredentials', JSON.stringify(creds));
        
        // Create admin user
        const adminUser = {
            id: 'admin-001',
            name: 'Administrator',
            email: email,
            accountType: 'admin',
            createdAt: new Date().toISOString()
        };
        
        // Set session
        currentUser = adminUser;
        isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        localStorage.setItem('adminSession', 'true');
        
        showNotification('Admin login successful!', 'success');
        closeModal('loginModal');
        
        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
        
    } catch (error) {
        showNotification('Admin login failed: ' + error.message, 'error');
    }
}

// Register Service Worker for PWA functionality
function registerServiceWorker() {
    // Skip Service Worker registration for file:// protocol (local files)
    if (window.location.protocol === 'file:') {
        console.log('[PWA] Service Worker registration skipped - file:// protocol not supported');
        return;
    }
    
    // Skip if origin is null (iframe with data: URL, etc.)
    if (!window.location.origin || window.location.origin === 'null') {
        console.log('[PWA] Service Worker registration skipped - invalid origin');
        return;
    }
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available, show update notification
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });
    } else {
        console.log('[PWA] Service Worker not supported in this browser');
    }
}

// Show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <span>New version available! Click to update.</span>
            <button onclick="updateApp()" class="btn btn-primary btn-small">Update</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 10000);
}

// Update the app
function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

// Check for PWA install prompt
function checkPWAInstall() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] Install prompt triggered');
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        showInstallButton(deferredPrompt);
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        hideInstallButton();
    });
}

// Show install button
function showInstallButton(deferredPrompt) {
    const installButton = document.createElement('button');
    installButton.className = 'pwa-install-btn';
    installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
    installButton.onclick = () => installPWA(deferredPrompt);
    
    // Add to navigation
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons) {
        navButtons.appendChild(installButton);
    }
}

// Hide install button
function hideInstallButton() {
    const installButton = document.querySelector('.pwa-install-btn');
    if (installButton) {
        installButton.remove();
    }
}

// Install PWA
function installPWA(deferredPrompt) {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
            } else {
                console.log('[PWA] User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Initialize PWA features
function initializePWA() {
    checkPWAInstall();
    
    // Handle online/offline status
    window.addEventListener('online', () => {
        console.log('[PWA] App is online');
        showNotification('Connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        console.log('[PWA] App is offline');
        showNotification('You are now offline. Some features may be limited.', 'warning');
    });
}

// Call PWA initialization
initializePWA();