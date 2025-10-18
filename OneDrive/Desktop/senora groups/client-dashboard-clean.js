// Client Dashboard JavaScript - Clean Version
// Multi-Step Document Upload Interface

// Global Variables
let currentUser = null;
let documentCategories = {
    'academic-transcripts': { required: true, files: [] },
    'degree-certificates': { required: true, files: [] },
    'english-tests': { required: true, files: [] },
    'educational-evaluation': { required: false, files: [] },
    'current-employment': { required: true, files: [] },
    'cv-resume': { required: true, files: [] },
    'previous-employment': { required: true, files: [] },
    'employment-references': { required: true, files: [] },
    'bank-statements': { required: true, files: [] },
    'tax-returns': { required: true, files: [] },
    'financial-invoices': { required: false, files: [] },
    'medical-certificates': { required: true, files: [] },
    'vaccination-records': { required: true, files: [] },
    'insurance-documents': { required: false, files: [] },
    'health-reports': { required: false, files: [] }
};
let currentUploadStep = 1;

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeClientDashboard();
});

function initializeClientDashboard() {
    // Clear any admin session data first
    localStorage.removeItem('adminSession');
    
    // Check for client session
    const clientSession = localStorage.getItem('clientSession');
    const savedUser = localStorage.getItem('currentUser');
    
    if (!clientSession || !savedUser) {
        // No valid client session, redirect to login
        clearAllSessions();
        window.location.href = 'index.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(savedUser);
        updateUserInfo();
        loadDashboardData();
        loadDocuments();
        loadMessages();
        addToRecentActivity('login', 'Logged in successfully');
    } catch (error) {
        console.error('Error parsing user data:', error);
        clearAllSessions();
        window.location.href = 'index.html';
    }
}

function updateUserInfo() {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userNameElement) userNameElement.textContent = currentUser.name;
    if (userEmailElement) userEmailElement.textContent = currentUser.email;
}

function loadDashboardData() {
    // Load recent activity
    const activityList = document.getElementById('activityList');
    if (activityList) {
        const activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        let html = '';
        
        if (activities.length === 0) {
            html = '<li class="activity-item"><span class="activity-text">No recent activity</span></li>';
        } else {
            activities.slice(0, 5).forEach(activity => {
                html += `
                    <li class="activity-item">
                        <span class="activity-time">${new Date(activity.timestamp).toLocaleString()}</span>
                        <span class="activity-text">${activity.message}</span>
                    </li>
                `;
            });
        }
        
        activityList.innerHTML = html;
    }
}

function loadDocuments() {
    const documentsList = document.getElementById('documentsList');
    if (!documentsList) return;
    
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    let html = '';
    
    if (documents.length === 0) {
        html = '<li class="document-item"><span class="document-text">No documents uploaded yet</span></li>';
    } else {
        documents.slice(0, 5).forEach(doc => {
            html += `
                <li class="document-item">
                    <span class="document-name">${doc.name}</span>
                    <span class="document-status status-${doc.status}">${doc.status}</span>
                </li>
            `;
        });
    }
    
    documentsList.innerHTML = html;
}

function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;
    
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    let html = '';
    
    if (messages.length === 0) {
        html = '<li class="message-item"><span class="message-text">No messages yet</span></li>';
    } else {
        messages.slice(0, 5).forEach(message => {
            html += `
                <li class="message-item">
                    <span class="message-sender">${message.sender}</span>
                    <span class="message-text">${message.text}</span>
                    <span class="message-time">${new Date(message.timestamp).toLocaleString()}</span>
                </li>
            `;
        });
    }
    
    messagesList.innerHTML = html;
}

function addToRecentActivity(type, message) {
    const activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    activities.unshift({
        type: type,
        message: message,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 activities
    if (activities.length > 20) {
        activities.splice(20);
    }
    
    localStorage.setItem('recentActivity', JSON.stringify(activities));
    loadDashboardData();
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`[href="#${sectionId}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        if (sectionId === 'documents') {
            // Initialize multi-step upload interface when documents section is shown
            setTimeout(() => {
                initializeMultiStepUpload();
            }, 100);
        } else if (sectionId === 'occupation-list') {
            loadOccupationList();
        }
    }
    
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

// Multi-Step Document Upload Functions
function handleFileUpload(input, category) {
    const files = Array.from(input.files);
    if (files.length === 0) return;

    files.forEach(file => {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`File ${file.name} is too large. Maximum size is 10MB.`, 'error');
            return;
        }

        // Validate file type
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            showNotification(`File ${file.name} has an unsupported format. Please upload PDF, JPG, PNG, or DOCX files.`, 'error');
            return;
        }

        // Create file object
        const fileObj = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: fileExtension,
            category: category,
            uploadedAt: new Date().toISOString(),
            file: file
        };

        // Add to category
        documentCategories[category].files.push(fileObj);
        
        // Update UI
        updateFileList(category);
        updateStepProgress();
        checkStepCompletion();
    });

    // Clear input
    input.value = '';
}

function updateFileList(category) {
    const container = document.getElementById(`${category}-files`);
    if (!container) return;

    const files = documentCategories[category].files;
    
    if (files.length === 0) {
        container.style.display = 'none';
        container.classList.remove('has-files');
        return;
    }

    container.style.display = 'block';
    container.classList.add('has-files');

    let html = '';
    files.forEach(file => {
        html += `
            <div class="file-item" data-file-id="${file.id}">
                <div class="file-info">
                    <i class="fas fa-file-alt"></i>
                    <div class="file-details">
                        <p class="file-name">${file.name}</p>
                        <p class="file-size">${formatFileSize(file.size)}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn-view" onclick="viewFile('${file.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-remove" onclick="removeFile('${file.id}', '${category}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function removeFile(fileId, category) {
    documentCategories[category].files = documentCategories[category].files.filter(f => f.id != fileId);
    updateFileList(category);
    updateStepProgress();
    checkStepCompletion();
}

function viewFile(fileId) {
    // Find file in all categories
    let file = null;
    for (const category in documentCategories) {
        file = documentCategories[category].files.find(f => f.id == fileId);
        if (file) break;
    }

    if (!file) return;

    // Create a new window to view the file
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
            <head>
                <title>${file.name}</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    .file-info { margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
                    img { max-width: 100%; height: auto; }
                </style>
            </head>
            <body>
                <div class="file-info">
                    <h2>${file.name}</h2>
                    <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                    <p><strong>Type:</strong> ${file.type}</p>
                    <p><strong>Uploaded:</strong> ${new Date(file.uploadedAt).toLocaleString()}</p>
                </div>
                <p>File preview would be displayed here. For security reasons, file content is not shown in this demo.</p>
            </body>
        </html>
    `);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateStepProgress() {
    const progressFill = document.getElementById('uploadProgressFill');
    if (!progressFill) return;

    const totalSteps = 5;
    const progress = ((currentUploadStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${progress}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentUploadStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentUploadStep) {
            step.classList.add('active');
        }
    });
}

function checkStepCompletion() {
    const currentStep = document.querySelector(`#step-${getStepName(currentUploadStep)}`);
    if (!currentStep) return;

    const requiredCategories = getRequiredCategoriesForStep(currentUploadStep);
    let allRequiredComplete = true;

    requiredCategories.forEach(category => {
        if (documentCategories[category].required && documentCategories[category].files.length === 0) {
            allRequiredComplete = false;
        }
    });

    // Enable/disable next button
    const nextButton = currentStep.querySelector('[onclick="nextStep()"]');
    if (nextButton) {
        nextButton.disabled = !allRequiredComplete;
    }
}

function getStepName(stepNumber) {
    const stepNames = {
        1: 'education',
        2: 'employment',
        3: 'financial',
        4: 'medical',
        5: 'review'
    };
    return stepNames[stepNumber] || 'education';
}

function getRequiredCategoriesForStep(stepNumber) {
    const stepCategories = {
        1: ['academic-transcripts', 'degree-certificates', 'english-tests', 'educational-evaluation'],
        2: ['current-employment', 'cv-resume', 'previous-employment', 'employment-references'],
        3: ['bank-statements', 'tax-returns', 'financial-invoices'],
        4: ['medical-certificates', 'vaccination-records', 'insurance-documents', 'health-reports']
    };
    return stepCategories[stepNumber] || [];
}

function nextStep() {
    if (currentUploadStep < 5) {
        // Hide current step
        const currentStep = document.querySelector(`#step-${getStepName(currentUploadStep)}`);
        if (currentStep) {
            currentStep.classList.remove('active');
        }

        // Show next step
        currentUploadStep++;
        const nextStep = document.querySelector(`#step-${getStepName(currentUploadStep)}`);
        if (nextStep) {
            nextStep.classList.add('active');
        }

        // Update progress
        updateStepProgress();

        // If moving to review step, load review data
        if (currentUploadStep === 5) {
            loadReviewData();
        }
    }
}

function previousStep() {
    if (currentUploadStep > 1) {
        // Hide current step
        const currentStep = document.querySelector(`#step-${getStepName(currentUploadStep)}`);
        if (currentStep) {
            currentStep.classList.remove('active');
        }

        // Show previous step
        currentUploadStep--;
        const prevStep = document.querySelector(`#step-${getStepName(currentUploadStep)}`);
        if (prevStep) {
            prevStep.classList.add('active');
        }

        // Update progress
        updateStepProgress();
    }
}

function loadReviewData() {
    // Calculate statistics
    let totalDocuments = 0;
    let requiredComplete = 0;
    let requiredTotal = 0;
    let optionalComplete = 0;
    let optionalTotal = 0;

    for (const category in documentCategories) {
        const categoryData = documentCategories[category];
        const fileCount = categoryData.files.length;
        totalDocuments += fileCount;

        if (categoryData.required) {
            requiredTotal++;
            if (fileCount > 0) {
                requiredComplete++;
            }
        } else {
            optionalTotal++;
            if (fileCount > 0) {
                optionalComplete++;
            }
        }
    }

    // Update summary stats
    document.getElementById('total-documents').textContent = totalDocuments;
    document.getElementById('required-complete').textContent = `${requiredComplete}/${requiredTotal}`;
    document.getElementById('optional-complete').textContent = `${optionalComplete}/${optionalTotal}`;

    // Load document review list
    loadDocumentReviewList();

    // Enable submit button if all required documents are uploaded
    const submitButton = document.getElementById('submit-all-btn');
    if (submitButton) {
        submitButton.disabled = requiredComplete < requiredTotal;
    }
}

function loadDocumentReviewList() {
    const reviewList = document.getElementById('document-review-list');
    if (!reviewList) return;

    let html = '';

    // Group by step
    const steps = [
        { name: 'Education Documents', categories: ['academic-transcripts', 'degree-certificates', 'english-tests', 'educational-evaluation'] },
        { name: 'Employment Documents', categories: ['current-employment', 'cv-resume', 'previous-employment', 'employment-references'] },
        { name: 'Financial Documents', categories: ['bank-statements', 'tax-returns', 'financial-invoices'] },
        { name: 'Medical Documents', categories: ['medical-certificates', 'vaccination-records', 'insurance-documents', 'health-reports'] }
    ];

    steps.forEach(step => {
        const stepFiles = [];
        let stepComplete = true;

        step.categories.forEach(category => {
            const categoryData = documentCategories[category];
            if (categoryData.required && categoryData.files.length === 0) {
                stepComplete = false;
            }
            stepFiles.push(...categoryData.files);
        });

        html += `
            <div class="review-category">
                <div class="review-category-header">
                    <div class="review-category-title">${step.name}</div>
                    <div class="review-category-status ${stepComplete ? 'status-complete' : 'status-incomplete'}">
                        ${stepComplete ? 'Complete' : 'Incomplete'}
                    </div>
                </div>
                <div class="review-files-list">
        `;

        if (stepFiles.length === 0) {
            html += `
                <div class="review-file-item">
                    <span>No files uploaded</span>
                </div>
            `;
        } else {
            stepFiles.forEach(file => {
                html += `
                    <div class="review-file-item">
                        <div class="file-info">
                            <i class="fas fa-file-alt"></i>
                            <span>${file.name}</span>
                        </div>
                        <div class="file-actions">
                            <button class="btn-view" onclick="viewFile('${file.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn-remove" onclick="removeFile('${file.id}', '${file.category}')">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>
        `;
    });

    reviewList.innerHTML = html;
}

function submitAllDocuments() {
    // Validate all required documents are uploaded
    let allRequiredComplete = true;
    for (const category in documentCategories) {
        const categoryData = documentCategories[category];
        if (categoryData.required && categoryData.files.length === 0) {
            allRequiredComplete = false;
            break;
        }
    }

    if (!allRequiredComplete) {
        showNotification('Please upload all required documents before submitting.', 'error');
        return;
    }

    // Save documents to localStorage
    const allFiles = [];
    for (const category in documentCategories) {
        allFiles.push(...documentCategories[category].files);
    }

    const existingDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    const newDocuments = allFiles.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        category: file.category,
        uploadedAt: file.uploadedAt,
        status: 'uploaded'
    }));

    const updatedDocuments = [...existingDocuments, ...newDocuments];
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));

    // Show success message
    showNotification('All documents submitted successfully! Our team will review your documents.', 'success');

    // Add to recent activity
    addToRecentActivity('upload', `Submitted ${allFiles.length} documents for review`);

    // Reset form
    resetUploadForm();
}

function resetUploadForm() {
    // Reset state
    currentUploadStep = 1;
    for (const category in documentCategories) {
        documentCategories[category].files = [];
    }

    // Reset UI
    document.querySelectorAll('.upload-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('#step-education').classList.add('active');

    // Clear file lists
    document.querySelectorAll('.uploaded-files').forEach(container => {
        container.style.display = 'none';
        container.classList.remove('has-files');
        container.innerHTML = '';
    });

    // Reset progress
    updateStepProgress();
    checkStepCompletion();
}

// Initialize multi-step upload interface
function initializeMultiStepUpload() {
    // Set initial step
    currentUploadStep = 1;
    
    // Update progress
    updateStepProgress();
    
    // Check initial completion
    checkStepCompletion();
    
    // Initialize file upload areas with drag and drop
    initializeDragAndDrop();
}

function initializeDragAndDrop() {
    // Add drag and drop functionality to all upload zones
    document.querySelectorAll('.upload-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.background = 'rgba(212, 175, 55, 0.2)';
        });
        
        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            zone.style.background = 'rgba(212, 175, 55, 0.05)';
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.background = 'rgba(212, 175, 55, 0.05)';
            
            const files = Array.from(e.dataTransfer.files);
            const category = zone.closest('.upload-area').dataset.category;
            const input = zone.querySelector('input[type="file"]');
            
            if (input && files.length > 0) {
                // Create a new FileList-like object
                const dt = new DataTransfer();
                files.forEach(file => dt.items.add(file));
                input.files = dt.files;
                
                // Trigger the file upload handler
                handleFileUpload(input, category);
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function clearAllSessions() {
    localStorage.removeItem('clientSession');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('currentUser');
}

function logout() {
    clearAllSessions();
    window.location.href = 'index.html';
}

// Occupation List Functions (simplified)
function loadOccupationList() {
    // Simple occupation list implementation
    const occupationGrid = document.getElementById('occupationGrid');
    if (occupationGrid) {
        occupationGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-briefcase"></i>
                <h3>Occupation List</h3>
                <p>Occupation list functionality will be available here</p>
            </div>
        `;
    }
}

// Export functions for global access
window.showSection = showSection;
window.logout = logout;
window.handleFileUpload = handleFileUpload;
window.removeFile = removeFile;
window.viewFile = viewFile;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.submitAllDocuments = submitAllDocuments;
window.initializeMultiStepUpload = initializeMultiStepUpload;
window.loadOccupationList = loadOccupationList;