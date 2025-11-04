// Admin Dashboard JavaScript for Tonio & Senora

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

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeAdminDashboard();
    setupAdminEventListeners();
    registerServiceWorker();
});

// Admin credentials are user-provided on first login via admin-login.html and stored locally
const ADMIN_CREDENTIALS = (function(){
    try {
        const raw = localStorage.getItem('adminCredentials');
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
})();

// Initialize admin dashboard
function initializeAdminDashboard() {
    // Clear any client session data first
    localStorage.removeItem('clientSession');
    
    // Check for admin session
    const adminSession = localStorage.getItem('adminSession');
    const savedUser = localStorage.getItem('currentUser');
    
    if (!adminSession || !savedUser) {
        // No valid admin session, show unauthorized error
        clearAllSessions();
        showUnauthorizedError();
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    
    // Verify admin credentials exist and match session
    if (!ADMIN_CREDENTIALS || currentUser.accountType !== 'admin' || currentUser.email !== ADMIN_CREDENTIALS.email) {
        // Clear invalid session and show error
        clearAllSessions();
        showUnauthorizedError();
        return;
    }
    
    isAuthenticated = true;
    
    // Update admin name
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = `Admin Panel - ${currentUser.name}`;
    }
    
    // Load initial data
    loadAdminDashboardData();
    loadClients();
    loadDocumentReviews();
    loadApplications();
    loadCommunications();
}

// Clear all session data
function clearAllSessions() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('clientSession');
}

// Show unauthorized error
function showUnauthorizedError() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #D4AF37, #4A0E4E);
            font-family: 'Inter', sans-serif;
        ">
            <div style="
                background: white;
                padding: 3rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: #dc3545;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                ">
                    <i class="fas fa-lock" style="color: white; font-size: 2rem;"></i>
                </div>
                <h2 style="color: #333; margin-bottom: 1rem; font-size: 1.5rem;">Unauthorized Access</h2>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
                    You do not have permission to access the admin panel. 
                    Please contact the system administrator for access.
                </p>
                <button onclick="window.location.href='index.html'" style="
                    background: #D4AF37;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#B8941F'" onmouseout="this.style.background='#D4AF37'">
                    Return to Home
                </button>
            </div>
        </div>
    `;
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Client search
    const clientSearch = document.getElementById('clientSearch');
    if (clientSearch) {
        clientSearch.addEventListener('input', debounce(filterClients, 300));
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterClients);
    }
    
    // Country filter
    const countryFilter = document.getElementById('countryFilter');
    if (countryFilter) {
        countryFilter.addEventListener('change', filterClients);
    }
    
    // Review filters
    const reviewStatus = document.getElementById('reviewStatus');
    if (reviewStatus) {
        reviewStatus.addEventListener('change', filterDocumentReviews);
    }
    
    const reviewClient = document.getElementById('reviewClient');
    if (reviewClient) {
        reviewClient.addEventListener('change', filterDocumentReviews);
    }
    
    // Admin message form
    const adminMessageForm = document.getElementById('adminMessageForm');
    if (adminMessageForm) {
        adminMessageForm.addEventListener('submit', handleAdminMessageSubmit);
    }
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active sidebar link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load section-specific data
    switch(sectionId) {
        case 'clients':
            loadClients();
            break;
        case 'documents':
            loadDocumentReviews();
            break;
        case 'applications':
            loadApplications();
            break;
        case 'communications':
            loadCommunications();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// Load admin dashboard data
function loadAdminDashboardData() {
    // Load statistics
    loadDashboardStats();
    
    // Load recent activities
    loadAdminRecentActivities();
    
    // Load application status overview
    loadApplicationStatusOverview();
}

// Load dashboard statistics
function loadDashboardStats() {
    const clients = loadFromStorage('clients') || [];
    const documentReviews = loadFromStorage('documentReviews') || [];
    const applications = loadFromStorage('applications') || [];
    
    // Calculate actual stats
    const stats = {
        activeClients: clients.filter(c => c.status === 'active' || c.status === 'pending').length,
        pendingReviews: documentReviews.filter(d => d.status === 'pending').length,
        completedThisMonth: applications.filter(a => {
            const appDate = new Date(a.createdAt || a.submittedAt || Date.now());
            const now = new Date();
            return appDate.getMonth() === now.getMonth() && 
                   appDate.getFullYear() === now.getFullYear() && 
                   a.status === 'completed';
        }).length,
        overdueTasks: applications.filter(a => {
            if (!a.dueDate) return false;
            return new Date(a.dueDate) < new Date() && a.status !== 'completed';
        }).length
    };
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        const valueElement = card.querySelector('h3');
        if (valueElement) {
            const values = Object.values(stats);
            valueElement.textContent = values[index] || 0;
        }
    });
}

// Load admin recent activities
function loadAdminRecentActivities() {
    const activities = loadFromStorage('adminActivities') || [];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history" style="font-size: 3rem; color: #D4AF37; margin-bottom: 1rem; display: block;"></i>
                    <h3>No Recent Activity</h3>
                    <p>Activity will appear here as clients interact with the system.</p>
                </div>
            `;
        } else {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item" style="color: inherit;">
                    <i class="fas fa-${getActivityIcon(activity.type)}" style="color: #D4AF37;"></i>
                    <div>
                        <p style="color: inherit; margin: 0;">${activity.message}</p>
                        <span style="color: inherit; opacity: 0.8; font-size: 0.875rem;">${formatDate(activity.timestamp)}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Load application status overview
function loadApplicationStatusOverview() {
    const statusData = {
        'In Review': 0,
        'Document Collection': 0,
        'Ready for Submission': 0
    };
    
    const statusChart = document.querySelector('.status-chart');
    if (statusChart) {
        statusChart.innerHTML = Object.entries(statusData).map(([status, count]) => `
            <div class="status-item">
                <span class="status-label">${status}</span>
                <div class="status-bar">
                    <div class="status-fill" style="width: 0%"></div>
                </div>
                <span class="status-count">${count}</span>
            </div>
        `).join('');
    }
}

// Load clients
function loadClients() {
    const clients = loadFromStorage('clients') || [];
    
    const clientsTable = document.querySelector('.clients-table tbody');
    if (clientsTable) {
        if (clients.length === 0) {
            clientsTable.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        <p>No clients registered yet</p>
                        <small>Clients will appear here once they register</small>
                    </td>
                </tr>
            `;
        } else {
            clientsTable.innerHTML = clients.map(client => {
                const progress = calculateClientProgress(client);
                return `
                <tr>
                    <td style="color: inherit;">${escapeHtml(client.name || 'Unknown')}</td>
                    <td style="color: inherit;">${escapeHtml(client.email || 'N/A')}</td>
                    <td>
                        <span class="country-badge country-${client.country || 'unknown'}">
                            ${getCountryDisplayName(client.country || 'unknown')}
                        </span>
                    </td>
                    <td>
                        <span class="visa-type-badge">
                            ${getVisaTypeDisplayName(client.visaType || 'unknown')}
                        </span>
                    </td>
                    <td>
                        <span class="authority-badge authority-${client.assessmentAuthority || 'unknown'}">
                            ${getAuthorityDisplayName(client.assessmentAuthority || 'unknown')}
                        </span>
                    </td>
                    <td><span class="status-badge status-${(client.status || 'pending').toLowerCase().replace(' ', '-')}">${(client.status || 'pending').charAt(0).toUpperCase() + (client.status || 'pending').slice(1)}</span></td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text" style="color: inherit;">${progress}%</span>
                    </td>
                    <td>
                        <button class="btn btn-small btn-outline" onclick="viewClientDetails('${client.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                </tr>
            `;
            }).join('');
        }
    }
}

// Filter clients
function filterClients() {
    const searchTerm = document.getElementById('clientSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const countryFilter = document.getElementById('countryFilter')?.value || '';
    
    const clients = loadFromStorage('clients') || [];
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm) || 
                            client.email.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || client.status.toLowerCase().includes(statusFilter.toLowerCase());
        const matchesCountry = !countryFilter || client.country.toLowerCase().includes(countryFilter.toLowerCase());
        
        return matchesSearch && matchesStatus && matchesCountry;
    });
    
    const clientsTable = document.querySelector('.clients-table tbody');
    if (clientsTable) {
        clientsTable.innerHTML = filteredClients.map(client => `
            <tr>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.country}</td>
                <td><span class="status-badge status-${client.status.toLowerCase().replace(' ', '-')}">${client.status}</span></td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${client.progress}%"></div>
                    </div>
                </td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="viewClient('${client.id}')">View</button>
                    <button class="btn btn-small btn-outline" onclick="messageClient('${client.id}')">Message</button>
                </td>
            </tr>
        `).join('');
    }
}

// View client
function viewClient(clientId) {
    viewClientDetails(clientId);
}

// Message client
function messageClient(clientId) {
    const clients = loadFromStorage('clients') || [];
    const client = clients.find(c => c.id === clientId);
    
    if (client) {
        showNotification(`Opening message thread with ${client.name}`, 'info');
        // Switch to communications section and focus on this client
        showSection('communications');
        // Here you would typically highlight the specific client's message thread
    }
}

// Load document reviews
function loadDocumentReviews() {
    const documentReviews = loadFromStorage('documentReviews') || [];
    
    const documentList = document.querySelector('.document-list') || document.getElementById('documentReviewList');
    const reviewClientSelect = document.getElementById('reviewClient');
    
    // Populate client filter
    if (reviewClientSelect) {
        const uniqueClients = [...new Set(documentReviews.map(doc => doc.client).filter(Boolean))];
        reviewClientSelect.innerHTML = '<option value="">All Clients</option>' + 
            uniqueClients.map(client => `<option value="${client}">${escapeHtml(client)}</option>`).join('');
    }
    
    if (documentList) {
        if (documentReviews.length === 0) {
            documentList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary, #666);">
                    <i class="fas fa-file-upload" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #D4AF37;"></i>
                    <h3 style="color: inherit;">No documents to review</h3>
                    <p style="color: inherit;">Documents will appear here once clients upload them</p>
                </div>
            `;
        } else {
            documentList.innerHTML = documentReviews.map(doc => `
                <div class="document-review-item">
                    <div class="document-info">
                        <h4 style="color: inherit;">${escapeHtml(doc.title)}</h4>
                        <p style="color: inherit; opacity: 0.9;">Uploaded: ${formatDate(doc.uploadedAt)} | Client: ${escapeHtml(doc.client || 'Unknown')}</p>
                        <span class="document-type">${escapeHtml(doc.type)}</span>
                    </div>
                    <div class="document-actions">
                        <button class="btn btn-small btn-outline" onclick="previewDocument('${doc.id}')">Preview</button>
                        <button class="btn btn-small btn-success" onclick="approveDocument('${doc.id}')">Approve</button>
                        <button class="btn btn-small btn-danger" onclick="rejectDocument('${doc.id}')">Reject</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Filter document reviews
function filterDocumentReviews() {
    const statusFilter = document.getElementById('reviewStatus')?.value || '';
    const clientFilter = document.getElementById('reviewClient')?.value || '';
    
    const documentReviews = loadFromStorage('documentReviews') || [];
    const filteredReviews = documentReviews.filter(doc => {
        const matchesStatus = !statusFilter || doc.status === statusFilter;
        const matchesClient = !clientFilter || doc.client === clientFilter;
        
        return matchesStatus && matchesClient;
    });
    
    const documentList = document.querySelector('.document-list') || document.getElementById('documentReviewList');
    if (documentList) {
        if (filteredReviews.length === 0) {
            documentList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary, #666);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #D4AF37;"></i>
                    <h3 style="color: inherit;">No documents match the filters</h3>
                    <p style="color: inherit;">Try adjusting your filter criteria</p>
                </div>
            `;
        } else {
            documentList.innerHTML = filteredReviews.map(doc => `
                <div class="document-review-item">
                    <div class="document-info">
                        <h4 style="color: inherit;">${escapeHtml(doc.title)}</h4>
                        <p style="color: inherit; opacity: 0.9;">Uploaded: ${formatDate(doc.uploadedAt)} | Client: ${escapeHtml(doc.client || 'Unknown')}</p>
                        <span class="document-type">${escapeHtml(doc.type)}</span>
                    </div>
                    <div class="document-actions">
                        <button class="btn btn-small btn-outline" onclick="previewDocument('${doc.id}')">Preview</button>
                        <button class="btn btn-small btn-success" onclick="approveDocument('${doc.id}')">Approve</button>
                        <button class="btn btn-small btn-danger" onclick="rejectDocument('${doc.id}')">Reject</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Preview document
function previewDocument(documentId) {
    const documentReviews = loadFromStorage('documentReviews') || [];
    const doc = documentReviews.find(d => d.id === documentId);
    
    if (!doc) {
        showNotification('Document not found', 'error');
        return;
    }
    
    // Create preview modal
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg, rgba(0,0,0,0.5)); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div class="modal-content" onclick="event.stopPropagation()" style="background: var(--modal-bg, white); padding: 2rem; border-radius: 12px; max-width: 900px; max-height: 90vh; overflow-y: auto; width: 90%; border: 1px solid var(--border-color, #e5e5e5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color, #e5e5e5); padding-bottom: 1rem;">
                    <h2 style="color: inherit; margin: 0;">Document Preview</h2>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: inherit; opacity: 0.7;">&times;</button>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: inherit; margin-bottom: 0.5rem;">${escapeHtml(doc.title)}</h3>
                    <p style="color: inherit; opacity: 0.9;"><strong>Type:</strong> ${escapeHtml(doc.type)}</p>
                    <p style="color: inherit; opacity: 0.9;"><strong>Client:</strong> ${escapeHtml(doc.client)}</p>
                    <p style="color: inherit; opacity: 0.9;"><strong>Uploaded:</strong> ${formatDate(doc.uploadedAt)}</p>
                    <p style="color: inherit; opacity: 0.9;"><strong>Status:</strong> <span class="status-badge status-${doc.status || 'pending'}">${(doc.status || 'pending').charAt(0).toUpperCase() + (doc.status || 'pending').slice(1)}</span></p>
                </div>
                <div style="background: var(--bg-secondary, #f8f9fa); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color, #e5e5e5); text-align: center;">
                    <i class="fas fa-file-pdf" style="font-size: 4rem; color: #D4AF37; margin-bottom: 1rem;"></i>
                    <p style="color: inherit;">Document preview would be displayed here</p>
                    <p style="color: inherit; opacity: 0.8; font-size: 0.875rem; margin-top: 0.5rem;">In a production environment, this would show the actual document content</p>
                </div>
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                    <button class="btn btn-primary" onclick="approveDocument('${doc.id}'); closeModal();">Approve</button>
                    <button class="btn btn-outline" onclick="rejectDocument('${doc.id}'); closeModal();">Reject</button>
                    <button class="btn btn-outline" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Approve document
function approveDocument(documentId) {
    const documentReviews = loadFromStorage('documentReviews') || [];
    const docIndex = documentReviews.findIndex(doc => doc.id === documentId);
    
    if (docIndex !== -1) {
        documentReviews[docIndex].status = 'approved';
        saveToStorage('documentReviews', documentReviews);
        
        showNotification('Document approved successfully', 'success');
        loadDocumentReviews();
        
        // Add to admin activities
        addToAdminActivities('approval', `Document approved: ${documentReviews[docIndex].title}`);
    }
}

// Reject document
function rejectDocument(documentId) {
    const documentReviews = loadFromStorage('documentReviews') || [];
    const docIndex = documentReviews.findIndex(doc => doc.id === documentId);
    
    if (docIndex !== -1) {
        documentReviews[docIndex].status = 'rejected';
        saveToStorage('documentReviews', documentReviews);
        
        showNotification('Document rejected', 'info');
        loadDocumentReviews();
        
        // Add to admin activities
        addToAdminActivities('rejection', `Document rejected: ${documentReviews[docIndex].title}`);
    }
}

// Load applications
function loadApplications() {
    const applications = loadFromStorage('applications') || [];
    
    const applicationsGrid = document.querySelector('.applications-grid');
    if (applicationsGrid) {
        if (applications.length === 0) {
            applicationsGrid.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666; grid-column: 1 / -1;">
                    <i class="fas fa-file-alt" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <h3>No applications yet</h3>
                    <p>Applications will appear here once clients start their visa process</p>
                </div>
            `;
        } else {
            applicationsGrid.innerHTML = applications.map(app => `
                <div class="application-card">
                    <div class="application-header">
                        <h4 style="color: inherit;">${app.client} - ${app.country} ${app.visaType}</h4>
                        <span class="status-badge status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span>
                    </div>
                    <div class="application-details">
                        <p style="color: inherit;"><strong>Country:</strong> ${app.country}</p>
                        <p style="color: inherit;"><strong>Visa Type:</strong> ${app.visaType}</p>
                        <p style="color: inherit;"><strong>Progress:</strong> ${app.progress}% Complete</p>
                        <p style="color: inherit;"><strong>Next Step:</strong> ${app.nextStep}</p>
                    </div>
                    <div class="application-actions">
                        <button class="btn btn-small btn-primary" onclick="viewApplication('${app.id}')">View Details</button>
                        <button class="btn btn-small btn-outline" onclick="updateStatus('${app.id}')">Update Status</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// View application
function viewApplication(applicationId) {
    const applications = loadFromStorage('applications') || [];
    const app = applications.find(a => a.id === applicationId);
    
    if (!app) {
        showNotification('Application not found', 'error');
        return;
    }
    
    // Get client details
    const clients = loadFromStorage('clients') || [];
    const client = clients.find(c => c.name === app.client || c.email === app.client);
    
    // Get related documents
    const documentReviews = loadFromStorage('documentReviews') || [];
    const relatedDocs = documentReviews.filter(doc => 
        doc.client === app.client || doc.clientEmail === (client?.email || '')
    );
    
    // Create application details modal
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg, rgba(0,0,0,0.5)); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div class="modal-content" onclick="event.stopPropagation()" style="background: var(--modal-bg, white); padding: 2rem; border-radius: 12px; max-width: 900px; max-height: 90vh; overflow-y: auto; width: 90%; border: 1px solid var(--border-color, #e5e5e5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color, #e5e5e5); padding-bottom: 1rem;">
                    <h2 style="color: inherit; margin: 0;">Application Details</h2>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: inherit; opacity: 0.7;">&times;</button>
                </div>
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3 style="color: inherit; margin: 0;">${escapeHtml(app.client)}</h3>
                        <span class="status-badge status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <p style="color: inherit; opacity: 0.9;"><strong>Country:</strong> ${escapeHtml(app.country)}</p>
                            <p style="color: inherit; opacity: 0.9;"><strong>Visa Type:</strong> ${escapeHtml(app.visaType)}</p>
                        </div>
                        <div>
                            <p style="color: inherit; opacity: 0.9;"><strong>Progress:</strong> ${app.progress}%</p>
                            <p style="color: inherit; opacity: 0.9;"><strong>Created:</strong> ${formatDate(app.createdAt || app.submittedAt)}</p>
                        </div>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <p style="color: inherit; opacity: 0.9;"><strong>Next Step:</strong></p>
                        <p style="color: inherit; padding: 1rem; background: var(--bg-secondary, #f8f9fa); border-radius: 8px; border: 1px solid var(--border-color, #e5e5e5);">${escapeHtml(app.nextStep || 'No next step defined')}</p>
                    </div>
                    ${app.dueDate ? `<p style="color: inherit; opacity: 0.9;"><strong>Due Date:</strong> ${formatDate(app.dueDate)}</p>` : ''}
                </div>
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: inherit; margin-bottom: 1rem;">Related Documents (${relatedDocs.length})</h3>
                    ${relatedDocs.length === 0 ? '<p style="color: inherit;">No documents uploaded yet.</p>' : 
                        relatedDocs.slice(0, 5).map(doc => `
                            <div style="padding: 1rem; background: var(--bg-secondary, #f8f9fa); border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--border-color, #e5e5e5);">
                                <p style="color: inherit; margin: 0;"><strong>${escapeHtml(doc.title)}</strong></p>
                                <p style="color: inherit; opacity: 0.8; font-size: 0.875rem; margin: 0.25rem 0 0 0;">Status: ${doc.status || 'pending'}</p>
                            </div>
                        `).join('')
                    }
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button class="btn btn-primary" onclick="updateStatus('${app.id}'); closeModal();">Update Status</button>
                    <button class="btn btn-outline" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Update status
function updateStatus(applicationId) {
    const applications = loadFromStorage('applications') || [];
    const app = applications.find(a => a.id === applicationId);
    
    if (!app) {
        showNotification('Application not found', 'error');
        return;
    }
    
    const statusOptions = ['pending', 'in-progress', 'under-review', 'approved', 'rejected', 'completed'];
    
    // Create status update modal
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg, rgba(0,0,0,0.5)); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div class="modal-content" onclick="event.stopPropagation()" style="background: var(--modal-bg, white); padding: 2rem; border-radius: 12px; max-width: 600px; width: 90%; border: 1px solid var(--border-color, #e5e5e5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color, #e5e5e5); padding-bottom: 1rem;">
                    <h2 style="color: inherit; margin: 0;">Update Application Status</h2>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: inherit; opacity: 0.7;">&times;</button>
                </div>
                <form id="statusUpdateForm" onsubmit="handleStatusUpdate('${applicationId}', event)">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; color: inherit; margin-bottom: 0.5rem; font-weight: 600;">Application</label>
                        <p style="color: inherit; opacity: 0.9; padding: 0.75rem; background: var(--bg-secondary, #f8f9fa); border-radius: 8px; border: 1px solid var(--border-color, #e5e5e5);">${escapeHtml(app.client)} - ${escapeHtml(app.country)} ${escapeHtml(app.visaType)}</p>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label for="newStatus" style="display: block; color: inherit; margin-bottom: 0.5rem; font-weight: 600;">New Status</label>
                        <select id="newStatus" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color, #e5e5e5); border-radius: 8px; background: var(--input-bg, white); color: inherit;">
                            ${statusOptions.map(status => `
                                <option value="${status}" ${status === app.status ? 'selected' : ''}>${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label for="statusNotes" style="display: block; color: inherit; margin-bottom: 0.5rem; font-weight: 600;">Notes (Optional)</label>
                        <textarea id="statusNotes" rows="4" placeholder="Add any notes about this status change..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color, #e5e5e5); border-radius: 8px; background: var(--input-bg, white); color: inherit; resize: vertical;"></textarea>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Status</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Handle status update
function handleStatusUpdate(applicationId, e) {
    e.preventDefault();
    
    const newStatus = document.getElementById('newStatus').value;
    const notes = document.getElementById('statusNotes').value.trim();
    
    const applications = loadFromStorage('applications') || [];
    const appIndex = applications.findIndex(a => a.id === applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex].status = newStatus;
        applications[appIndex].lastUpdated = new Date().toISOString();
        if (notes) {
            applications[appIndex].notes = (applications[appIndex].notes || []);
            applications[appIndex].notes.push({
                note: notes,
                timestamp: new Date().toISOString(),
                status: newStatus
            });
        }
        
        saveToStorage('applications', applications);
        
        showNotification('Application status updated successfully', 'success');
        loadApplications();
        closeModal();
        
        // Add to admin activities
        addToAdminActivities('update', `Application status updated: ${newStatus}`);
    }
}

// Load communications
function loadCommunications() {
    const clientMessages = loadFromStorage('adminClientMessages') || [];
    
    const messageThreads = document.querySelector('.message-threads');
    if (messageThreads) {
        if (clientMessages.length === 0) {
            messageThreads.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <h3>No messages yet</h3>
                    <p>Client messages will appear here once they start communicating</p>
                </div>
            `;
        } else {
            // Group messages by client
            const clientGroups = {};
            clientMessages.forEach(msg => {
                const key = msg.clientEmail || msg.clientName;
                if (!clientGroups[key]) {
                    clientGroups[key] = {
                        clientName: msg.clientName,
                        clientEmail: msg.clientEmail,
                        messages: [],
                        context: msg.context,
                        unreadCount: 0,
                        lastMessage: msg.message,
                        lastTimestamp: msg.timestamp
                    };
                }
                clientGroups[key].messages.push(msg);
                if (msg.requiresAdminResponse && !msg.adminResponded) {
                    clientGroups[key].unreadCount++;
                }
                if (new Date(msg.timestamp) > new Date(clientGroups[key].lastTimestamp)) {
                    clientGroups[key].lastMessage = msg.message;
                    clientGroups[key].lastTimestamp = msg.timestamp;
                }
            });
            
            const threads = Object.values(clientGroups);
            
            messageThreads.innerHTML = threads.map((thread, index) => {
                const contextStr = thread.context ? 
                    `${getCountryName(thread.context.country)} - ${getVisaTypeName(thread.context.country, thread.context.visaType)}${thread.context.authority ? ` (${getAuthorityName(thread.context.authority)})` : ''}` : 
                    'No context';
                
                return `
                    <div class="thread-item ${index === 0 ? 'active' : ''}" onclick="selectThread('${thread.clientEmail || thread.clientName}')" style="position: relative;">
                    <div class="thread-header">
                            <h4 style="color: inherit;">${thread.clientName}</h4>
                            <span class="timestamp" style="color: inherit; opacity: 0.8;">${formatDate(thread.lastTimestamp)}</span>
                    </div>
                    <div class="thread-preview">
                            <p style="color: inherit;"><strong>Context:</strong> ${contextStr}</p>
                            <p style="margin-top: 0.5rem; color: inherit; opacity: 0.9;">${thread.lastMessage.substring(0, 80)}${thread.lastMessage.length > 80 ? '...' : ''}</p>
                    </div>
                    ${thread.unreadCount > 0 ? `<span class="unread-count">${thread.unreadCount}</span>` : ''}
                        ${thread.messages.some(m => m.isAutoResponse) ? '<span class="auto-response-badge" title="Contains auto-responses"><i class="fas fa-robot"></i></span>' : ''}
                </div>
                `;
            }).join('');
            
            // Load first thread by default
            if (threads.length > 0) {
                selectThread(threads[0].clientEmail || threads[0].clientName);
            }
        }
    }
}

// Helper functions for displaying names
function getCountryName(countryCode) {
    const names = {
        'australia': 'Australia',
        'canada': 'Canada',
        'new-zealand': 'New Zealand',
        'united-kingdom': 'United Kingdom',
        'united-states': 'United States'
    };
    return names[countryCode] || countryCode;
}

function getVisaTypeName(country, visaType) {
    const names = {
        'general-skilled-migration': 'Skilled Migration (GSM)',
        'student-visa': 'Student Visa',
        'express-entry': 'Express Entry',
        'partner-visa': 'Partner Visa'
    };
    return names[visaType] || visaType;
}

function getAuthorityName(authority) {
    const names = {
        'acs': 'ACS',
        'engineers-australia': 'Engineers Australia',
        'vetassess': 'VETASSESS'
    };
    return names[authority] || authority;
}

// Select thread
function selectThread(clientKey) {
    // Remove active class from all threads
    document.querySelectorAll('.thread-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(clientKey)) {
            item.classList.add('active');
        }
    });
    
    // Load messages for this client
    const allMessages = loadFromStorage('adminClientMessages') || [];
    const clientMessages = allMessages.filter(msg => 
        (msg.clientEmail || msg.clientName) === clientKey
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Display messages in the thread view
    displayClientMessages(clientMessages, clientKey);
}

// Display client messages in thread
function displayClientMessages(messages, clientKey) {
    const messageArea = document.querySelector('.message-compose');
    if (!messageArea) return;
    
    const clientMsg = messages.find(m => (m.clientEmail || m.clientName) === clientKey);
    if (!clientMsg) return;
    
    // Create message display area
    let messageHTML = `
        <div class="client-messages-display" style="max-height: 400px; overflow-y: auto; padding: 1rem; background: var(--bg-secondary, #f8f9fa); border-radius: 8px; margin-bottom: 1rem; border: 1px solid var(--border-color, #e5e5e5);">
            <div class="client-info-header" style="padding-bottom: 1rem; border-bottom: 2px solid #D4AF37; margin-bottom: 1rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: inherit;">${clientMsg.clientName}</h4>
                <p style="margin: 0; font-size: 0.875rem; color: inherit; opacity: 0.9;">
                    Context: ${clientMsg.context ? 
                        `${getCountryName(clientMsg.context.country)} - ${getVisaTypeName(clientMsg.context.country, clientMsg.context.visaType)}${clientMsg.context.authority ? ` (${getAuthorityName(clientMsg.context.authority)})` : ''}` : 
                        'Not specified'}
                </p>
            </div>
            <div class="messages-list-display">
                ${messages.map(msg => `
                    <div class="admin-message-item ${msg.isAutoResponse ? 'auto-response' : msg.isAdminResponse ? 'admin-response' : msg.requiresAdminResponse ? 'needs-response' : ''}" style="margin-bottom: 1rem; padding: 1rem; background: var(--card-bg, white); border-radius: 8px; border-left: 4px solid ${msg.isAutoResponse ? '#10b981' : msg.isAdminResponse ? '#D4AF37' : msg.requiresAdminResponse ? '#ef4444' : '#666'}; border: 1px solid var(--border-color, #e5e5e5);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <strong style="color: inherit;">${msg.isAutoResponse ? '🤖 Auto-Response' : msg.isAdminResponse ? 'Admin' : msg.clientName}</strong>
                            <span style="font-size: 0.75rem; color: inherit; opacity: 0.8;">${formatDate(msg.timestamp)}</span>
                        </div>
                        <p style="margin: 0; color: inherit;">${escapeHtml(msg.message)}</p>
                        ${msg.matchedQuestion ? `<div style="margin-top: 0.5rem; padding: 0.5rem; background: var(--bg-tertiary, #f0f0f0); border-radius: 4px; font-size: 0.875rem; color: inherit;"><strong>Matched Question:</strong> ${msg.matchedQuestion}</div>` : ''}
                        ${msg.requiresAdminResponse && !msg.adminResponded ? `<div style="margin-top: 0.5rem;"><span style="background: #ef4444; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">⏰ Requires Admin Response</span></div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update compose area
    messageArea.innerHTML = messageHTML + `
        <div class="compose-header">
            <h4 style="color: inherit;">Reply to ${clientMsg.clientName}</h4>
        </div>
        <form id="adminMessageForm" onsubmit="handleAdminReply('${clientKey}', event)">
            <div class="form-group">
                <textarea id="adminReplyText" placeholder="Type your reply..." rows="4" required style="color: inherit; background: var(--input-bg, white); border-color: var(--border-color, #e5e5e5);"></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Send Reply</button>
            </div>
        </form>
    `;
    
    // Scroll to bottom
    const messageDisplay = messageArea.querySelector('.client-messages-display');
    if (messageDisplay) {
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
    }
}

// Handle admin reply
function handleAdminReply(clientKey, e) {
    e.preventDefault();
    
    const replyText = document.getElementById('adminReplyText').value.trim();
    if (!replyText) return;
    
    // Get all messages
    const allMessages = loadFromStorage('adminClientMessages') || [];
    
    // Mark client messages as responded
    const updatedMessages = allMessages.map(msg => {
        if ((msg.clientEmail || msg.clientName) === clientKey && msg.requiresAdminResponse && !msg.adminResponded) {
            msg.adminResponded = true;
            msg.adminResponseTime = new Date().toISOString();
        }
        return msg;
    });
    
    // Add admin reply message
    const clientMsg = allMessages.find(m => (m.clientEmail || m.clientName) === clientKey);
    updatedMessages.unshift({
        id: Date.now().toString(),
        clientName: clientMsg.clientName,
        clientEmail: clientMsg.clientEmail,
        message: replyText,
        timestamp: new Date().toISOString(),
        context: clientMsg.context,
        isAdminResponse: true,
        adminResponded: true
    });
    
    saveToStorage('adminClientMessages', updatedMessages);
    
    // Reload communications
    loadCommunications();
    
    showNotification('Reply sent successfully', 'success');
}

// Escape HTML helper
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle admin message submit
function handleAdminMessageSubmit(e) {
    e.preventDefault();
    
    const messageInput = e.target.querySelector('textarea');
    const message = messageInput.value.trim();
    
    if (!message) {
        showNotification('Please enter a message', 'error');
        return;
    }
    
    // Add message to storage
    const adminMessages = loadFromStorage('adminMessages') || [];
    const newMessage = {
        id: Date.now().toString(),
        sender: 'Admin',
        message: message,
        timestamp: new Date().toISOString(),
        type: 'sent'
    };
    
    adminMessages.unshift(newMessage);
    saveToStorage('adminMessages', adminMessages);
    
    // Clear input
    messageInput.value = '';
    
    showNotification('Message sent successfully', 'success');
    
    // Add to admin activities
    addToAdminActivities('message', 'Message sent to client');
}

// Load reports
function loadReports() {
    const applications = loadFromStorage('applications') || [];
    const documentReviews = loadFromStorage('documentReviews') || [];
    const clients = loadFromStorage('clients') || [];
    
    // Calculate success rate (approved applications / total applications)
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(app => app.status === 'approved' || app.status === 'completed').length;
    const successRate = totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;
    
    // Calculate average processing time (simplified - would need actual dates)
    const averageProcessingTime = totalApplications > 0 ? Math.round(totalApplications * 2.5) : 0; // Placeholder calculation
    
    // Calculate country distribution
    const countryDistribution = {};
    clients.forEach(client => {
        const country = getCountryDisplayName(client.country) || 'Unknown';
        countryDistribution[country] = (countryDistribution[country] || 0) + 1;
    });
    
    // Calculate total counts
    const totalClients = clients.length;
    const totalDocuments = documentReviews.length;
    const pendingDocuments = documentReviews.filter(doc => doc.status === 'pending').length;
    
    // Update report cards
    const reportCards = document.querySelectorAll('.report-card');
    reportCards.forEach((card, index) => {
        const chartElement = card.querySelector('.report-chart');
        if (chartElement) {
            switch(index) {
                case 0: // Success Rate
                    chartElement.innerHTML = `
                        <div style="text-align: center; color: inherit; padding: 2rem;">
                            <i class="fas fa-chart-pie" style="font-size: 3rem; color: #D4AF37; margin-bottom: 1rem; display: block;"></i>
                            <h3 style="color: inherit; font-size: 2rem; margin: 0.5rem 0;">${successRate}%</h3>
                            <p style="color: inherit; opacity: 0.9;">Success Rate</p>
                            <p style="color: inherit; opacity: 0.8; font-size: 0.875rem; margin-top: 0.5rem;">${approvedApplications} of ${totalApplications} applications</p>
                        </div>
                    `;
                    break;
                case 1: // Processing Times
                    chartElement.innerHTML = `
                        <div style="text-align: center; color: inherit; padding: 2rem;">
                            <i class="fas fa-chart-line" style="font-size: 3rem; color: #D4AF37; margin-bottom: 1rem; display: block;"></i>
                            <h3 style="color: inherit; font-size: 2rem; margin: 0.5rem 0;">${averageProcessingTime}</h3>
                            <p style="color: inherit; opacity: 0.9;">Average Days</p>
                            <p style="color: inherit; opacity: 0.8; font-size: 0.875rem; margin-top: 0.5rem;">Processing Time</p>
                        </div>
                    `;
                    break;
                case 2: // Country Distribution
                    const distribution = Object.entries(countryDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([country, count]) => {
                            const percentage = totalClients > 0 ? Math.round((count / totalClients) * 100) : 0;
                            return `<div style="margin: 0.5rem 0; color: inherit;"><strong>${country}:</strong> ${count} (${percentage}%)</div>`;
                        })
                        .join('');
                    chartElement.innerHTML = `
                        <div style="text-align: center; color: inherit; padding: 2rem;">
                            <i class="fas fa-chart-bar" style="font-size: 3rem; color: #D4AF37; margin-bottom: 1rem; display: block;"></i>
                            <div style="text-align: left; margin-top: 1rem;">
                                ${distribution || '<p style="color: inherit;">No data available</p>'}
                            </div>
                        </div>
                    `;
                    break;
            }
        }
    });
}

// Add to admin activities
function addToAdminActivities(type, message) {
    const activities = loadFromStorage('adminActivities') || [];
    const newActivity = {
        type: type,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    activities.unshift(newActivity);
    
    // Keep only last 20 activities
    if (activities.length > 20) {
        activities.splice(20);
    }
    
    saveToStorage('adminActivities', activities);
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        upload: 'file-upload',
        message: 'comment',
        approval: 'check',
        rejection: 'times',
        review: 'eye',
        submission: 'paper-plane'
    };
    return icons[type] || 'info-circle';
}

// Utility functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
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

function saveToStorage(key, data) {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
        return true;
    } catch (error) {
        // Handle QuotaExceededError
        if (error.name === 'QuotaExceededError') {
            showNotification('Storage quota exceeded. Please contact support.', 'error');
        } else {
            showNotification('Failed to save data. Please try again.', 'error');
        }
        return false;
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        // Try to parse JSON data
        try {
            return JSON.parse(data);
        } catch (parseError) {
            // If parsing fails, remove corrupted data
            localStorage.removeItem(key);
            return null;
        }
    } catch (error) {
        return null;
    }
}

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

function logout() {
    currentUser = null;
    isAuthenticated = false;
    
    // Clear all session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminSession');
    
    showNotification('Logged out successfully', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Register Service Worker for PWA functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered successfully:', registration.scope);
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });
    } else {
        console.log('[PWA] Service Worker not supported in this browser');
    }
}

// Client Grouping Functions
function filterClientsByGroup() {
    const countryFilter = document.getElementById('countryFilter')?.value || '';
    const visaTypeFilter = document.getElementById('visaTypeFilter')?.value || '';
    const authorityFilter = document.getElementById('authorityFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const searchTerm = document.getElementById('clientSearch')?.value.toLowerCase() || '';

    const clients = loadFromStorage('clients') || [];

    const filteredClients = clients.filter(client => {
        const matchesCountry = !countryFilter || client.country === countryFilter;
        const matchesVisaType = !visaTypeFilter || client.visaType === visaTypeFilter;
        const matchesAuthority = !authorityFilter || client.assessmentAuthority === authorityFilter;
        const matchesStatus = !statusFilter || client.status === statusFilter;
        const matchesSearch = !searchTerm ||
            client.name.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm);

        return matchesCountry && matchesVisaType && matchesAuthority && matchesStatus && matchesSearch;
    });
    
    updateClientsTableGrouped(filteredClients);
}

function updateClientsTableGrouped(clients) {
    const tbody = document.querySelector('.clients-table tbody');
    if (!tbody) return;

    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #D4AF37;"></i>
                    <h3>No clients found</h3>
                    <p>No clients match the current filter criteria</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    clients.forEach(client => {
        const progress = calculateClientProgress(client);
        html += `
            <tr>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>
                    <span class="country-badge country-${client.country || 'unknown'}">
                        ${getCountryDisplayName(client.country || 'unknown')}
                    </span>
                </td>
                <td>
                    <span class="visa-type-badge">
                        ${getVisaTypeDisplayName(client.visaType || 'unknown')}
                    </span>
                </td>
                <td>
                    <span class="authority-badge authority-${client.assessmentAuthority || 'unknown'}">
                        ${getAuthorityDisplayName(client.assessmentAuthority || 'unknown')}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${client.status || 'pending'}">
                        ${(client.status || 'pending').charAt(0).toUpperCase() + (client.status || 'pending').slice(1)}
                    </span>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${progress}%</span>
                </td>
                <td>
                    <button class="btn btn-small btn-outline" onclick="viewClientDetails('${client.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function getCountryDisplayName(country) {
    const displayNames = {
        'australia': 'Australia',
        'canada': 'Canada',
        'newzealand': 'New Zealand',
        'unknown': 'Not Selected'
    };
    return displayNames[country] || country;
}

function getVisaTypeDisplayName(visaType) {
    const allVisaTypes = [
        { id: 'general-skilled-migration', name: 'General Skilled Migration' },
        { id: 'student-visa', name: 'Student Visa' },
        { id: 'partner-visa', name: 'Partner Visa' },
        { id: 'family-visa', name: 'Family Visa' },
        { id: 'business-visa', name: 'Business Visa' },
        { id: 'visit-visa', name: 'Visit Visa' }
    ];
    const visaTypeObj = allVisaTypes.find(vt => vt.id === visaType);
    return visaTypeObj ? visaTypeObj.name : (visaType === 'unknown' ? 'Not Selected' : visaType);
}

function getAuthorityDisplayName(authority) {
    const displayNames = {
        'acs': 'ACS',
        'vetassess': 'VETASSESS',
        'engineers-australia': 'Engineers Australia',
        'ahpra': 'AHPRA',
        'osap-tra': 'OSAP TRA',
        'msa-tra': 'MSA TRA',
        'unknown': 'Not Selected'
    };
    return displayNames[authority] || authority;
}

function calculateClientProgress(client) {
    // Calculate progress based on document completion
    const documents = loadFromStorage('documents') || [];
    const clientDocuments = documents.filter(doc => doc.clientId === client.id);
    
    if (clientDocuments.length === 0) return 0;
    
    const uploadedDocuments = clientDocuments.filter(doc => doc.status === 'uploaded' || doc.status === 'approved');
    return Math.round((uploadedDocuments.length / clientDocuments.length) * 100);
}

// Export functions for global access
window.showSection = showSection;
window.viewClient = viewClient;
window.viewClientDetails = viewClientDetails;
window.messageClient = messageClient;
window.previewDocument = previewDocument;
window.approveDocument = approveDocument;
window.rejectDocument = rejectDocument;
window.viewApplication = viewApplication;
window.updateStatus = updateStatus;
window.handleStatusUpdate = handleStatusUpdate;
window.selectThread = selectThread;
window.handleAdminReply = handleAdminReply;
window.filterDocumentReviews = filterDocumentReviews;
window.logout = logout;

// View client details - missing function
function viewClientDetails(clientId) {
    const clients = loadFromStorage('clients') || [];
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
        showNotification('Client not found', 'error');
        return;
    }
    
    // Get client documents
    const documents = loadFromStorage('documents') || [];
    const clientDocuments = documents.filter(doc => doc.clientId === clientId);
    
    // Get client messages
    const messages = loadFromStorage('adminClientMessages') || [];
    const clientMessages = messages.filter(msg => 
        msg.clientEmail === client.email || msg.clientName === client.name
    );
    
    // Create modal with client details
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg, rgba(0,0,0,0.5)); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div class="modal-content" onclick="event.stopPropagation()" style="background: var(--modal-bg, white); padding: 2rem; border-radius: 12px; max-width: 800px; max-height: 90vh; overflow-y: auto; width: 90%; border: 1px solid var(--border-color, #e5e5e5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color, #e5e5e5); padding-bottom: 1rem;">
                    <h2 style="color: inherit; margin: 0;">Client Details: ${escapeHtml(client.name)}</h2>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: inherit; opacity: 0.7;">&times;</button>
                </div>
                
                <div class="client-info-section" style="margin-bottom: 2rem;">
                    <h3 style="color: inherit;">Personal Information</h3>
                    <p style="color: inherit;"><strong>Name:</strong> ${escapeHtml(client.name)}</p>
                    <p style="color: inherit;"><strong>Email:</strong> ${escapeHtml(client.email)}</p>
                    <p style="color: inherit;"><strong>Phone:</strong> ${escapeHtml(client.phone || 'Not provided')}</p>
                    <p style="color: inherit;"><strong>Country:</strong> ${getCountryDisplayName(client.country)}</p>
                    <p style="color: inherit;"><strong>Visa Type:</strong> ${getVisaTypeDisplayName(client.visaType)}</p>
                    <p style="color: inherit;"><strong>Assessment Authority:</strong> ${getAuthorityDisplayName(client.assessmentAuthority)}</p>
                    <p style="color: inherit;"><strong>Status:</strong> <span class="status-badge status-${client.status || 'pending'}">${(client.status || 'pending').charAt(0).toUpperCase() + (client.status || 'pending').slice(1)}</span></p>
                    <p style="color: inherit;"><strong>Progress:</strong> ${calculateClientProgress(client)}%</p>
                </div>
                
                <div class="documents-section" style="margin-bottom: 2rem;">
                    <h3 style="color: inherit;">Documents (${clientDocuments.length})</h3>
                    ${clientDocuments.length === 0 ? '<p style="color: inherit;">No documents uploaded yet.</p>' : 
                        clientDocuments.map(doc => `
                            <div class="modal-document-item" style="padding: 1rem; background: var(--bg-secondary, #f8f9fa); border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--border-color, #e5e5e5);">
                                <p style="color: inherit;"><strong>${escapeHtml(doc.name || doc.title)}</strong></p>
                                <p style="font-size: 0.875rem; color: inherit; opacity: 0.8;">Uploaded: ${formatDate(doc.uploadedAt || doc.timestamp)}</p>
                                <p style="font-size: 0.875rem; color: inherit; opacity: 0.8;">Status: ${doc.status || 'pending'}</p>
                            </div>
                        `).join('')
                    }
                </div>
                
                <div class="messages-section">
                    <h3 style="color: inherit;">Messages (${clientMessages.length})</h3>
                    ${clientMessages.length === 0 ? '<p style="color: inherit;">No messages yet.</p>' : 
                        clientMessages.slice(0, 5).map(msg => `
                            <div class="modal-message-item" style="padding: 1rem; background: var(--bg-secondary, #f8f9fa); border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--border-color, #e5e5e5);">
                                <p style="color: inherit;">${escapeHtml(msg.message.substring(0, 100))}${msg.message.length > 100 ? '...' : ''}</p>
                                <p style="font-size: 0.875rem; color: inherit; opacity: 0.8;">${formatDate(msg.timestamp)}</p>
                            </div>
                        `).join('')
                    }
                </div>
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="messageClient('${clientId}'); closeModal();">Message Client</button>
                    <button class="btn btn-outline" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Export grouping functions
window.filterClientsByGroup = filterClientsByGroup;
window.viewClientDetails = viewClientDetails;
window.closeModal = closeModal;