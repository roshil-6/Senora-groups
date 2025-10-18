// Client Dashboard JavaScript - Simplified Version
// Original Document Upload Interface + Enhanced Occupation List

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

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered successfully:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 New service worker available');
                            // Show update notification to user
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });
    } else {
        console.log('⚠️ Service Worker not supported');
    }
}

// Show update notification
function showUpdateNotification() {
    if (confirm('A new version of the app is available. Would you like to update?')) {
        window.location.reload();
    }
}

// Test dark theme readability
function testDarkThemeReadability() {
    console.log('🧪 Testing dark theme readability...');
    
    // Check if we're in dark mode
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDarkMode) {
        console.log('✅ Dark mode is active');
        
        // Test text contrast
        const testElements = [
            'h1', 'h2', 'h3', 'p', 'label', 'button', 'input', 'select'
        ];
        
        testElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                const color = computedStyle.color;
                const backgroundColor = computedStyle.backgroundColor;
                
                console.log(`${selector}: color=${color}, background=${backgroundColor}`);
            });
        });
        
        // Show test results
        alert('Dark theme readability test completed! Check console for details.');
    } else {
        console.log('ℹ️ Switch to dark mode to test readability');
        alert('Please switch to dark mode first, then run the test again.');
    }
}

// Test form element visibility in dark theme
function testFormElementVisibility() {
    console.log('🔍 Testing form element visibility in dark theme...');
    
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDarkMode) {
        console.log('✅ Dark mode is active - testing form elements');
        
        // Test all form elements
        const formElements = [
            'select', 'input[type="text"]', 'input[type="email"]', 
            'textarea', 'button', '.selection-field select'
        ];
        
        formElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`\n📋 Testing ${selector} (${elements.length} elements):`);
            
            elements.forEach((element, index) => {
                const computedStyle = window.getComputedStyle(element);
                const color = computedStyle.color;
                const backgroundColor = computedStyle.backgroundColor;
                const borderColor = computedStyle.borderColor;
                const isVisible = computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none';
                
                console.log(`  Element ${index + 1}:`);
                console.log(`    - Color: ${color}`);
                console.log(`    - Background: ${backgroundColor}`);
                console.log(`    - Border: ${borderColor}`);
                console.log(`    - Visible: ${isVisible}`);
                
                // Check if text is readable
                if (color.includes('rgb(255, 255, 255)') || color.includes('#ffffff')) {
                    console.log(`    ✅ Text is white - good contrast`);
                } else if (color.includes('rgb(241, 245, 249)') || color.includes('#f1f5f9')) {
                    console.log(`    ✅ Text is light - good contrast`);
                } else {
                    console.log(`    ⚠️ Text color may need adjustment`);
                }
            });
        });
        
        // Test dropdown options
        const selects = document.querySelectorAll('select');
        selects.forEach((select, index) => {
            console.log(`\n📋 Dropdown ${index + 1} options:`);
            for (let i = 0; i < select.options.length; i++) {
                const option = select.options[i];
                console.log(`  Option ${i + 1}: "${option.text}" - ${option.value}`);
            }
        });
        
        alert('Form element visibility test completed! Check console for detailed results.');
    } else {
        console.log('ℹ️ Switch to dark mode to test form visibility');
        alert('Please switch to dark mode first, then run the test again.');
    }
}

// Global Variables
let currentUser = null;
let isNewUser = false;

// Selection State
let selectedCountry = '';
let selectedVisaType = '';
let selectedAuthority = '';

// Document Section State
let isDocumentsEnabled = false;

// Visa Type and Authority Data
const visaTypeData = {
    'australia': [
        { value: 'general-skilled-migration', label: 'General Skilled Migration' },
        { value: 'student-visa', label: 'Student Visa' },
        { value: 'partner-visa', label: 'Partner Visa' },
        { value: 'family-visa', label: 'Family Visa' },
        { value: 'business-visa', label: 'Business Visa' },
        { value: 'visit-visa', label: 'Visit Visa' }
    ],
    'canada': [
        { value: 'express-entry', label: 'Express Entry' },
        { value: 'provincial-nominee', label: 'Provincial Nominee Program' },
        { value: 'student-visa', label: 'Student Visa' },
        { value: 'family-sponsorship', label: 'Family Sponsorship' },
        { value: 'business-visa', label: 'Business Visa' },
        { value: 'visit-visa', label: 'Visit Visa' }
    ],
    'new-zealand': [
        { value: 'skilled-migrant', label: 'Skilled Migrant Category' },
        { value: 'student-visa', label: 'Student Visa' },
        { value: 'partner-visa', label: 'Partner Visa' },
        { value: 'family-visa', label: 'Family Visa' },
        { value: 'business-visa', label: 'Business Visa' },
        { value: 'visit-visa', label: 'Visit Visa' }
    ],
    'uk': [
        { value: 'skilled-worker', label: 'Skilled Worker Visa' },
        { value: 'student-visa', label: 'Student Visa' },
        { value: 'family-visa', label: 'Family Visa' },
        { value: 'business-visa', label: 'Business Visa' },
        { value: 'visit-visa', label: 'Visit Visa' }
    ],
    'usa': [
        { value: 'h1b-visa', label: 'H-1B Visa' },
        { value: 'student-visa', label: 'Student Visa (F-1)' },
        { value: 'family-visa', label: 'Family Visa' },
        { value: 'business-visa', label: 'Business Visa' },
        { value: 'visit-visa', label: 'Visit Visa' }
    ]
};

const authorityData = {
    'australia': {
        'general-skilled-migration': [
            { value: 'acs', label: 'ACS (Australian Computer Society)' },
            { value: 'vetassess', label: 'VETASSESS' },
            { value: 'engineers-australia', label: 'Engineers Australia' },
            { value: 'ahpra', label: 'AHPRA' },
            { value: 'osap-tra', label: 'OSAP TRA' },
            { value: 'msa-tra', label: 'MSA TRA' }
        ],
        'student-visa': [
            { value: 'vetassess', label: 'VETASSESS' },
            { value: 'engineers-australia', label: 'Engineers Australia' }
        ],
        'partner-visa': [
            { value: 'vetassess', label: 'VETASSESS' }
        ],
        'family-visa': [
            { value: 'vetassess', label: 'VETASSESS' }
        ],
        'business-visa': [
            { value: 'vetassess', label: 'VETASSESS' }
        ],
        'visit-visa': [
            { value: 'vetassess', label: 'VETASSESS' }
        ]
    },
    'canada': {
        'express-entry': [
            { value: 'wes', label: 'WES (World Education Services)' },
            { value: 'icas', label: 'ICAS' },
            { value: 'ces', label: 'CES' }
        ],
        'provincial-nominee': [
            { value: 'wes', label: 'WES (World Education Services)' },
            { value: 'icas', label: 'ICAS' }
        ],
        'student-visa': [
            { value: 'wes', label: 'WES (World Education Services)' }
        ],
        'family-sponsorship': [
            { value: 'wes', label: 'WES (World Education Services)' }
        ],
        'business-visa': [
            { value: 'wes', label: 'WES (World Education Services)' }
        ],
        'visit-visa': [
            { value: 'wes', label: 'WES (World Education Services)' }
        ]
    }
};

// Occupation Database
const occupationDatabase = [
    // ACS Occupations
    { id: 1, title: 'Software Engineer', anzsco: '261313', authority: 'acs', demand: 'high', points: 65 },
    { id: 2, title: 'Systems Analyst', anzsco: '261112', authority: 'acs', demand: 'high', points: 60 },
    { id: 3, title: 'Database Administrator', anzsco: '262111', authority: 'acs', demand: 'medium', points: 60 },
    { id: 4, title: 'Network Administrator', anzsco: '263111', authority: 'acs', demand: 'medium', points: 60 },
    { id: 5, title: 'ICT Business Analyst', anzsco: '261111', authority: 'acs', demand: 'high', points: 65 },
    
    // VETASSESS Occupations
    { id: 6, title: 'Accountant', anzsco: '221111', authority: 'vetassess', demand: 'high', points: 70 },
    { id: 7, title: 'Marketing Specialist', anzsco: '225113', authority: 'vetassess', demand: 'medium', points: 60 },
    { id: 8, title: 'Human Resources Manager', anzsco: '132311', authority: 'vetassess', demand: 'medium', points: 60 },
    { id: 9, title: 'Project Manager', anzsco: '133612', authority: 'vetassess', demand: 'high', points: 65 },
    { id: 10, title: 'Business Analyst', anzsco: '224711', authority: 'vetassess', demand: 'high', points: 65 },
    
    // Engineers Australia Occupations
    { id: 11, title: 'Civil Engineer', anzsco: '233211', authority: 'engineers-australia', demand: 'high', points: 70 },
    { id: 12, title: 'Mechanical Engineer', anzsco: '233512', authority: 'engineers-australia', demand: 'high', points: 70 },
    { id: 13, title: 'Electrical Engineer', anzsco: '233311', authority: 'engineers-australia', demand: 'high', points: 70 },
    { id: 14, title: 'Software Engineer', anzsco: '261313', authority: 'engineers-australia', demand: 'high', points: 70 },
    { id: 15, title: 'Chemical Engineer', anzsco: '233111', authority: 'engineers-australia', demand: 'medium', points: 65 },
    
    // AHPRA Occupations
    { id: 16, title: 'General Practitioner', anzsco: '253111', authority: 'ahpra', demand: 'high', points: 75 },
    { id: 17, title: 'Registered Nurse', anzsco: '254418', authority: 'ahpra', demand: 'high', points: 70 },
    { id: 18, title: 'Physiotherapist', anzsco: '252511', authority: 'ahpra', demand: 'high', points: 70 },
    { id: 19, title: 'Pharmacist', anzsco: '251513', authority: 'ahpra', demand: 'medium', points: 65 },
    { id: 20, title: 'Dentist', anzsco: '252312', authority: 'ahpra', demand: 'medium', points: 65 },
    
    // OSAP TRA Occupations
    { id: 21, title: 'Automotive Electrician', anzsco: '321111', authority: 'osap-tra', demand: 'high', points: 70 },
    { id: 22, title: 'Carpenter', anzsco: '331212', authority: 'osap-tra', demand: 'high', points: 70 },
    { id: 23, title: 'Plumber', anzsco: '334111', authority: 'osap-tra', demand: 'high', points: 70 },
    { id: 24, title: 'Electrician', anzsco: '341111', authority: 'osap-tra', demand: 'high', points: 70 },
    { id: 25, title: 'Welder', anzsco: '322311', authority: 'osap-tra', demand: 'medium', points: 65 },
    
    // MSA TRA Occupations
    { id: 26, title: 'Chef', anzsco: '351311', authority: 'msa-tra', demand: 'high', points: 70 },
    { id: 27, title: 'Baker', anzsco: '351111', authority: 'msa-tra', demand: 'medium', points: 65 },
    { id: 28, title: 'Pastry Cook', anzsco: '351112', authority: 'msa-tra', demand: 'medium', points: 65 },
    { id: 29, title: 'Cook', anzsco: '351411', authority: 'msa-tra', demand: 'high', points: 70 },
    { id: 30, title: 'Kitchen Hand', anzsco: '851111', authority: 'msa-tra', demand: 'low', points: 60 }
];

// Pagination variables
let currentPage = 1;
let itemsPerPage = 10;
let filteredOccupations = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Client Dashboard Initialized');
    initializeTheme();
    initializeUserState();
    initializeOccupationList();
    initializeDocumentUpload();
    updateNavigationAccess();
    validateDocumentAccess();
    registerServiceWorker();
});

// User State Management
function initializeUserState() {
    console.log('🔄 Initializing user state...');
    
    // Check if this is a new user session
    const lastSessionTime = localStorage.getItem('lastSessionTime');
    const currentTime = Date.now();
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    
    // Always reset to Step 1 for new logins (force reset)
    console.log('🆕 New login detected - forcing reset to Step 1');
    isNewUser = true;
    
    // Update session timestamp
    localStorage.setItem('lastSessionTime', currentTime.toString());
    
    console.log('✅ User state initialized');
}

// Section Navigation
function showSection(sectionId) {
    console.log(`📱 Showing section: ${sectionId}`);
    
    // Validate document access when accessing documents section
    if (sectionId === 'documents') {
        validateDocumentAccess();
    }
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Special handling for documents section
    if (sectionId === 'documents') {
        console.log('📁 Documents section activated');
    }
}

// Selection Handling Functions
function handleCountrySelection() {
    const countrySelect = document.getElementById('countrySelect');
    const visaSelect = document.getElementById('visaTypeSelect');
    const authoritySelect = document.getElementById('authoritySelect');
    const countryStatus = document.getElementById('country-status');
    const visaStep = document.getElementById('visa-selection');
    const authorityStep = document.getElementById('authority-selection');
    
    selectedCountry = countrySelect.value;
    
    if (selectedCountry) {
        // Update country status
        countryStatus.innerHTML = '<i class="fas fa-check-circle"></i> Country selected successfully';
        countryStatus.className = 'field-status success';
        
        // Enable visa type selection
        visaStep.classList.remove('locked');
        visaStep.classList.add('active');
        visaSelect.disabled = false;
        
        // Populate visa types
        populateVisaTypes(selectedCountry);
        
        // Reset authority selection
        authoritySelect.innerHTML = '<option value="">Select Assessment Authority</option>';
        authoritySelect.disabled = true;
        authorityStep.classList.remove('active', 'completed');
        authorityStep.classList.add('locked');
        
        // Reset proceed button
        document.getElementById('proceedToDocumentation').disabled = true;
        
        console.log('✅ Country selected:', selectedCountry);
    } else {
        // Reset everything
        countryStatus.innerHTML = '';
        countryStatus.className = 'field-status';
        visaStep.classList.remove('active', 'completed');
        visaStep.classList.add('locked');
        visaSelect.disabled = true;
        visaSelect.innerHTML = '<option value="">Select Visa Type</option>';
        authorityStep.classList.remove('active', 'completed');
        authorityStep.classList.add('locked');
        authoritySelect.disabled = true;
        authoritySelect.innerHTML = '<option value="">Select Assessment Authority</option>';
        document.getElementById('proceedToDocumentation').disabled = true;
    }
}

function handleVisaTypeSelection() {
    const visaSelect = document.getElementById('visaTypeSelect');
    const authoritySelect = document.getElementById('authoritySelect');
    const visaStatus = document.getElementById('visa-status');
    const authorityStep = document.getElementById('authority-selection');
    
    selectedVisaType = visaSelect.value;
    
    if (selectedVisaType) {
        // Update visa status
        visaStatus.innerHTML = '<i class="fas fa-check-circle"></i> Visa type selected successfully';
        visaStatus.className = 'field-status success';
        
        // Enable authority selection
        authorityStep.classList.remove('locked');
        authorityStep.classList.add('active');
        authoritySelect.disabled = false;
        
        // Populate authorities
        populateAuthorities(selectedCountry, selectedVisaType);
        
        // Reset proceed button
        document.getElementById('proceedToDocumentation').disabled = true;
        
        console.log('✅ Visa type selected:', selectedVisaType);
    } else {
        // Reset authority selection
        authoritySelect.innerHTML = '<option value="">Select Assessment Authority</option>';
        authoritySelect.disabled = true;
        authorityStep.classList.remove('active', 'completed');
        authorityStep.classList.add('locked');
        document.getElementById('proceedToDocumentation').disabled = true;
    }
}

function handleAuthoritySelection() {
    const authoritySelect = document.getElementById('authoritySelect');
    const authorityStatus = document.getElementById('authority-status');
    const proceedButton = document.getElementById('proceedToDocumentation');
    
    selectedAuthority = authoritySelect.value;
    
    if (selectedAuthority) {
        // Update authority status
        authorityStatus.innerHTML = '<i class="fas fa-check-circle"></i> Assessment authority selected successfully';
        authorityStatus.className = 'field-status success';
        
        // Mark authority step as completed
        const authorityStep = document.getElementById('authority-selection');
        authorityStep.classList.remove('active');
        authorityStep.classList.add('completed');
        
        // Enable proceed button
        proceedButton.disabled = false;
        
        // Update navigation access
        updateNavigationAccess();
        
        // Validate document access
        validateDocumentAccess();
        
        console.log('✅ Authority selected:', selectedAuthority);
    } else {
        // Reset proceed button
        proceedButton.disabled = true;
    }
}

function populateVisaTypes(country) {
    const visaSelect = document.getElementById('visaTypeSelect');
    const visaTypes = visaTypeData[country] || [];
    
    visaSelect.innerHTML = '<option value="">Select Visa Type</option>';
    visaTypes.forEach(visa => {
        const option = document.createElement('option');
        option.value = visa.value;
        option.textContent = visa.label;
        visaSelect.appendChild(option);
    });
}

function populateAuthorities(country, visaType) {
    const authoritySelect = document.getElementById('authoritySelect');
    const authorities = authorityData[country]?.[visaType] || [];
    
    authoritySelect.innerHTML = '<option value="">Select Assessment Authority</option>';
    authorities.forEach(authority => {
        const option = document.createElement('option');
        option.value = authority.value;
        option.textContent = authority.label;
        authoritySelect.appendChild(option);
    });
}

function proceedToDocumentation() {
    console.log('📋 Proceeding to documentation screen...');
    
    // Hide selection container
    document.querySelector('.compulsory-selection-container').style.display = 'none';
    
    // Show documentation screen
    const documentationScreen = document.getElementById('documentationScreen');
    documentationScreen.style.display = 'block';
    
    // Update display values
    document.getElementById('selectedCountryDisplay').textContent = getCountryLabel(selectedCountry);
    document.getElementById('selectedVisaTypeDisplay').textContent = getVisaTypeLabel(selectedCountry, selectedVisaType);
    document.getElementById('selectedAuthorityDisplay').textContent = getAuthorityLabel(selectedCountry, selectedVisaType, selectedAuthority);
    
    // Skip the limited checklist and go directly to comprehensive document list
    proceedToUpload();
    
    console.log('✅ Documentation screen loaded');
}

function proceedToUpload() {
    console.log('📁 Proceeding to upload interface...');
    
    // Keep documentation screen visible and load comprehensive document list directly
    const documentationScreen = document.getElementById('documentationScreen');
    documentationScreen.style.display = 'block';
    
    // Hide the limited checklist container
    const checklistContainer = document.getElementById('authorityChecklist');
    if (checklistContainer) {
        checklistContainer.style.display = 'none';
    }
    
    // Show upload interface within the documentation screen
    const uploadInterface = document.getElementById('uploadInterface');
    if (uploadInterface) {
        uploadInterface.style.display = 'block';
    }
    
    // Load authority-specific documents
    loadAuthoritySpecificDocuments(selectedAuthority);
    
    // Update authority badge
    const authorityBadge = document.getElementById('selectedAuthorityBadge');
    if (authorityBadge) {
        authorityBadge.textContent = getAuthorityLabel(selectedCountry, selectedVisaType, selectedAuthority);
    }
    
    console.log('✅ Upload interface loaded');
}

// Initialize document upload interface as hidden
function initializeDocumentUpload() {
    // Ensure upload interface is hidden initially
    const uploadInterface = document.getElementById('uploadInterface');
    if (uploadInterface) {
        uploadInterface.style.display = 'none';
    }
}

// Access Control Functions
function checkSelectionsCompleted() {
    return selectedCountry && selectedVisaType && selectedAuthority;
}

// Document Section Validation
function validateDocumentAccess() {
    const isValid = checkSelectionsCompleted();
    isDocumentsEnabled = isValid;
    
    console.log('🔍 Document access validation:', isValid);
    
    // Update document section visibility
    updateDocumentSectionVisibility();
    
    // Update navigation access
    updateNavigationAccess();
    
    return isValid;
}

function updateDocumentSectionVisibility() {
    const documentsSection = document.getElementById('documents');
    const uploadInterface = document.getElementById('uploadInterface');
    const documentationScreen = document.getElementById('documentationScreen');
    const compulsorySelection = document.querySelector('.compulsory-selection-container');
    
    // Always show the documents section and selection fields
    if (documentsSection) {
        documentsSection.style.display = 'block';
    }
    
    if (compulsorySelection) {
        compulsorySelection.style.display = 'block';
    }
    
    if (isDocumentsEnabled) {
        // Show document upload interfaces
        if (uploadInterface) {
            uploadInterface.style.display = 'block';
        }
        if (documentationScreen) {
            documentationScreen.style.display = 'block';
        }
        
        // Hide instructional message if it exists
        const instructionMsg = document.getElementById('documentInstructionMessage');
        if (instructionMsg) {
            instructionMsg.style.display = 'none';
        }
        
        console.log('✅ Document upload enabled');
    } else {
        // Hide document upload interfaces only
        if (uploadInterface) {
            uploadInterface.style.display = 'none';
        }
        if (documentationScreen) {
            documentationScreen.style.display = 'none';
        }
        
        // Show instructional message for upload area
        showDocumentInstructionMessage();
        
        console.log('🚫 Document upload disabled - selections incomplete');
    }
}

function showDocumentInstructionMessage() {
    // Find the upload area container
    const uploadInterface = document.getElementById('uploadInterface');
    const documentationScreen = document.getElementById('documentationScreen');
    
    // Remove existing instruction message
    const existingMsg = document.getElementById('documentInstructionMessage');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create instruction message for upload area
    const instructionDiv = document.createElement('div');
    instructionDiv.id = 'documentInstructionMessage';
    instructionDiv.className = 'document-instruction-message';
    instructionDiv.innerHTML = `
        <div class="instruction-content">
            <div class="instruction-icon">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="instruction-text">
                <h3>Complete Your Selections Above</h3>
                <p>Please complete all three selections above to access document upload.</p>
                <div class="instruction-steps">
                    <div class="step-item ${selectedCountry ? 'completed' : 'pending'}">
                        <i class="fas fa-${selectedCountry ? 'check-circle' : 'circle'}"></i>
                        <span>Select Country</span>
                    </div>
                    <div class="step-item ${selectedVisaType ? 'completed' : 'pending'}">
                        <i class="fas fa-${selectedVisaType ? 'check-circle' : 'circle'}"></i>
                        <span>Choose Visa Type</span>
                    </div>
                    <div class="step-item ${selectedAuthority ? 'completed' : 'pending'}">
                        <i class="fas fa-${selectedAuthority ? 'check-circle' : 'circle'}"></i>
                        <span>Select Assessment Authority</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert after the selection fields, before upload interfaces
    const documentsSection = document.getElementById('documents');
    const selectionContainer = document.querySelector('.compulsory-selection-container');
    if (selectionContainer && selectionContainer.nextSibling) {
        documentsSection.insertBefore(instructionDiv, selectionContainer.nextSibling);
    } else {
        documentsSection.appendChild(instructionDiv);
    }
}

function updateNavigationAccess() {
    const documentsLink = document.querySelector('a[href="#documents"]');
    if (documentsLink) {
        // Always enable Documents navigation
        documentsLink.classList.remove('disabled');
        documentsLink.style.pointerEvents = 'auto';
    }
}

function showAccessControlModal() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'access-control-overlay';
    overlay.id = 'accessControlOverlay';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'access-control-modal';
    modal.innerHTML = `
        <h3><i class="fas fa-lock"></i> Access Restricted</h3>
        <p>You must complete all three mandatory selections before accessing the Documents section:</p>
        <ul style="text-align: left; margin: 1rem 0;">
            <li>✓ Select your target country</li>
            <li>✓ Choose your visa type</li>
            <li>✓ Select your skill assessment authority</li>
        </ul>
        <button class="btn btn-primary" onclick="closeAccessControlModal()">
            <i class="fas fa-arrow-left"></i> Go to Selections
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function closeAccessControlModal() {
    const overlay = document.getElementById('accessControlOverlay');
    if (overlay) {
        overlay.remove();
    }
    // Redirect to dashboard to show selections
    showSection('dashboard');
}

function getCountryLabel(country) {
    const labels = {
        'australia': 'Australia',
        'canada': 'Canada',
        'new-zealand': 'New Zealand',
        'uk': 'United Kingdom',
        'usa': 'United States'
    };
    return labels[country] || country;
}

function getVisaTypeLabel(country, visaType) {
    const visaTypes = visaTypeData[country] || [];
    const visa = visaTypes.find(v => v.value === visaType);
    return visa ? visa.label : visaType;
}

function getAuthorityLabel(country, visaType, authority) {
    const authorities = authorityData[country]?.[visaType] || [];
    const auth = authorities.find(a => a.value === authority);
    return auth ? auth.label : authority;
}


// Load Authority-Specific Documents (Consolidated)
function loadAuthoritySpecificDocuments(authority) {
    const container = document.getElementById('authoritySpecificDocuments');
    if (!container) return;
    
    const authorityDocuments = getAuthoritySpecificDocuments(authority);
    
    // Consolidate all documents into a single list, removing duplicates
    const consolidatedDocuments = consolidateDocuments(authorityDocuments);
    
    let html = `
        <div class="consolidated-document-list">
            <div class="document-progress-header">
                <h3><i class="fas fa-clipboard-list"></i> Required Documents Checklist</h3>
                <div class="progress-summary">
                    <span class="progress-text">Documents Uploaded: <span id="uploaded-count">0</span> / <span id="total-count">${consolidatedDocuments.length}</span></span>
                    <div class="progress-bar">
                        <div class="progress-fill" id="document-progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="document-items-container">
    `;
    
    consolidatedDocuments.forEach((doc, index) => {
        html += `
            <div class="document-item" data-category="${doc.category}" data-required="${doc.required}">
                <div class="document-item-header">
                    <div class="document-info">
                        <h4 class="document-name">${doc.name}</h4>
                        <span class="document-type">${doc.type}</span>
                        ${doc.required ? '<span class="required-badge">Required</span>' : '<span class="optional-badge">Optional</span>'}
                    </div>
                    <div class="document-status" id="status-${doc.category}">
                        <i class="fas fa-circle status-pending"></i>
                        <span class="status-text">Pending</span>
                    </div>
                </div>
                <div class="document-description">
                    <p>${doc.description}</p>
                    <div class="document-requirements">
                        <span class="file-types">Accepted: ${doc.acceptedFormats}</span>
                        <span class="file-size">Max size: ${doc.maxSize}</span>
                    </div>
                </div>
                <div class="upload-area" data-category="${doc.category}">
                    <div class="upload-zone" onclick="document.querySelector('input[data-category=\"${doc.category}\"]').click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Click to upload or drag & drop files here</span>
                        <input type="file" data-category="${doc.category}" accept="${doc.acceptTypes}" multiple onchange="handleFileUpload(this, '${doc.category}')" style="display: none;">
                    </div>
                    <div class="uploaded-files" id="${doc.category}-files"></div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="final-submit-section">
                <div class="submit-info">
                    <p><i class="fas fa-info-circle"></i> Please complete all required documents before submitting</p>
                </div>
                <button class="btn btn-primary btn-large" id="final-submit-btn" onclick="submitAllDocuments()" disabled>
                    <i class="fas fa-paper-plane"></i> Submit All Documents
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Initialize progress tracking
    updateDocumentProgress();
}

// Consolidate documents to remove duplicates
function consolidateDocuments(authorityDocuments) {
    const documentMap = new Map();
    
    authorityDocuments.categories.forEach(category => {
        category.documents.forEach(doc => {
            // Use document name as key to identify duplicates
            const key = doc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            if (!documentMap.has(key)) {
                documentMap.set(key, {
                    ...doc,
                    required: doc.type === 'Primary' || doc.type === 'Required' || doc.type === 'Financial' || doc.type === 'Health' || doc.type === 'Work Experience'
                });
            } else {
                // Merge requirements if document appears multiple times
                const existing = documentMap.get(key);
                if (doc.required || existing.required) {
                    existing.required = true;
                }
                // Update accepted formats to be more inclusive
                if (doc.acceptTypes && existing.acceptTypes) {
                    const existingTypes = existing.acceptTypes.split(',');
                    const newTypes = doc.acceptTypes.split(',');
                    const allTypes = [...new Set([...existingTypes, ...newTypes])];
                    existing.acceptTypes = allTypes.join(',');
                    existing.acceptedFormats = allTypes.map(type => type.toUpperCase().replace('.', '')).join(', ');
                }
            }
        });
    });
    
    return Array.from(documentMap.values());
}

// Get Authority-Specific Documents
function getAuthoritySpecificDocuments(authority) {
    const authorityDocuments = {
        'acs': {
            categories: [
                {
                    title: 'Educational',
                    icon: 'fas fa-graduation-cap',
                    description: 'Academic records',
                    documents: [
                        {
                            name: 'Degree Certificate',
                            type: 'Primary',
                            description: 'Bachelor/Master degree',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'degree-certificate'
                        },
                        {
                            name: 'Academic Transcript',
                            type: 'Primary',
                            description: 'Complete transcript',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'academic-transcript'
                        }
                    ]
                },
                {
                    title: 'Professional',
                    icon: 'fas fa-briefcase',
                    description: 'Work experience',
                    documents: [
                        {
                            name: 'CV/Resume',
                            type: 'Profile',
                            description: 'Detailed CV',
                            acceptedFormats: 'PDF, DOCX',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.docx',
                            category: 'cv-resume'
                        },
                        {
                            name: 'Employment References',
                            type: 'Experience',
                            description: 'Reference letters',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'employment-references'
                        }
                    ]
                },
                {
                    title: 'Identity',
                    icon: 'fas fa-id-card',
                    description: 'Personal documents',
                    documents: [
                        {
                            name: 'Passport Copy',
                            type: 'Identity',
                            description: 'Passport bio page',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'passport'
                        }
                    ]
                },
                {
                    title: 'Medical',
                    icon: 'fas fa-user-md',
                    description: 'Health records',
                    documents: [
                        {
                            name: 'Medical Exam',
                            type: 'Health',
                            description: 'Medical examination',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'medical-examination'
                        }
                    ]
                }
            ]
        },
        'vetassess': {
            categories: [
                {
                    title: 'Educational Qualifications',
                    icon: 'fas fa-graduation-cap',
                    description: 'Complete academic records for VETASSESS skills assessment',
                    documents: [
                        {
                            name: 'Degree Certificates',
                            type: 'Primary Qualification',
                            description: 'All degree certificates with official translations',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'degree-certificates'
                        },
                        {
                            name: 'Academic Transcripts',
                            type: 'Primary Qualification',
                            description: 'Complete academic transcripts with course details',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'academic-transcripts'
                        },
                        {
                            name: 'English Language Test Results',
                            type: 'Language Requirement',
                            description: 'IELTS, PTE, or TOEFL test results',
                            acceptedFormats: 'PDF',
                            maxSize: '5MB',
                            acceptTypes: '.pdf',
                            category: 'english-test'
                        }
                    ]
                },
                {
                    title: 'Professional Experience',
                    icon: 'fas fa-briefcase',
                    description: 'Detailed work experience for VETASSESS assessment',
                    documents: [
                        {
                            name: 'Detailed CV/Resume',
                            type: 'Professional Profile',
                            description: 'Comprehensive CV with detailed work history',
                            acceptedFormats: 'PDF, DOCX',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.docx',
                            category: 'cv-resume'
                        },
                        {
                            name: 'Employment References',
                            type: 'Work Experience',
                            description: 'Reference letters from supervisors/managers',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'employment-references'
                        },
                        {
                            name: 'Payslips and Employment Records',
                            type: 'Work Experience',
                            description: 'Payslips, contracts, and employment verification',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'employment-records'
                        }
                    ]
                }
            ]
        },
        'engineers-australia': {
            categories: [
                {
                    title: 'Engineering Qualifications',
                    icon: 'fas fa-cogs',
                    description: 'Engineering degree and professional qualifications',
                    documents: [
                        {
                            name: 'Engineering Degree Certificate',
                            type: 'Primary Qualification',
                            description: 'Bachelor or Master degree in Engineering',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'engineering-degree'
                        },
                        {
                            name: 'Engineering Transcript',
                            type: 'Primary Qualification',
                            description: 'Complete academic transcript with engineering subjects',
                            acceptedFormats: 'PDF, JPG',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.jpg,.jpeg',
                            category: 'engineering-transcript'
                        },
                        {
                            name: 'Professional Engineering Experience',
                            type: 'Professional Experience',
                            description: 'Detailed engineering work experience documentation',
                            acceptedFormats: 'PDF, DOCX',
                            maxSize: '5MB',
                            acceptTypes: '.pdf,.docx',
                            category: 'engineering-experience'
                        }
                    ]
                }
            ]
        }
    };
    
    return authorityDocuments[authority] || authorityDocuments['acs'];
}

// Handle File Upload
function handleFileUpload(input, category) {
    const files = Array.from(input.files);
    if (files.length === 0) return;
    
    console.log(`📁 Processing ${files.length} files for category: ${category}`);
    
    files.forEach(file => {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`File ${file.name} is too large. Maximum size is 5MB.`, 'error');
            return;
        }
        
        // Create file object
        const fileObj = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            category: category,
            uploadedAt: new Date().toISOString(),
            file: file,
            status: 'uploaded'
        };
        
        // Update file list display
        updateFileList(category, fileObj);
        
        // Update document status
        updateDocumentStatus(category, true);
        
        showNotification(`File ${file.name} uploaded successfully!`, 'success');
    });
    
    // Clear input
    input.value = '';
    
    // Update overall progress
    updateDocumentProgress();
}

// Update File List Display
function updateFileList(category, fileObj) {
    const container = document.getElementById(`${category}-files`);
    if (!container) return;
    
    // Create file item
    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file-item';
    fileItem.innerHTML = `
        <div class="file-info">
            <i class="fas fa-file"></i>
            <span class="file-name">${fileObj.name}</span>
            <span class="file-size">${formatFileSize(fileObj.size)}</span>
        </div>
        <div class="file-actions">
            <button class="btn-remove" onclick="removeFile('${fileObj.id}', '${category}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    container.appendChild(fileItem);
}

// Remove File
function removeFile(fileId, category) {
    const fileItem = document.querySelector(`[onclick="removeFile('${fileId}', '${category}')"]`)?.parentElement?.parentElement;
    if (fileItem) {
        fileItem.remove();
    }
    
    // Check if any files remain for this category
    const container = document.getElementById(`${category}-files`);
    const hasFiles = container && container.children.length > 0;
    updateDocumentStatus(category, hasFiles);
    
    // Update overall progress
    updateDocumentProgress();
    
    showNotification('File removed successfully', 'info');
}

// Update Document Status
function updateDocumentStatus(category, hasFiles) {
    const statusElement = document.getElementById(`status-${category}`);
    if (!statusElement) return;
    
    const icon = statusElement.querySelector('i');
    const text = statusElement.querySelector('.status-text');
    
    if (hasFiles) {
        icon.className = 'fas fa-check-circle status-completed';
        text.textContent = 'Completed';
        statusElement.className = 'document-status completed';
    } else {
        icon.className = 'fas fa-circle status-pending';
        text.textContent = 'Pending';
        statusElement.className = 'document-status pending';
    }
}

// Update Document Progress
function updateDocumentProgress() {
    const totalCount = document.getElementById('total-count');
    const uploadedCount = document.getElementById('uploaded-count');
    const progressFill = document.getElementById('document-progress-fill');
    const submitBtn = document.getElementById('final-submit-btn');
    
    if (!totalCount || !uploadedCount || !progressFill || !submitBtn) return;
    
    const total = parseInt(totalCount.textContent);
    let completed = 0;
    let requiredCompleted = 0;
    let totalRequired = 0;
    
    // Count completed documents
    document.querySelectorAll('.document-item').forEach(item => {
        const category = item.dataset.category;
        const isRequired = item.dataset.required === 'true';
        const statusElement = document.getElementById(`status-${category}`);
        
        if (isRequired) {
            totalRequired++;
        }
        
        if (statusElement && statusElement.classList.contains('completed')) {
            completed++;
            if (isRequired) {
                requiredCompleted++;
            }
        }
    });
    
    // Update progress display
    uploadedCount.textContent = completed;
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    progressFill.style.width = `${progressPercentage}%`;
    
    // Enable submit button only if all required documents are completed
    const canSubmit = requiredCompleted === totalRequired && totalRequired > 0;
    submitBtn.disabled = !canSubmit;
    
    if (canSubmit) {
        submitBtn.classList.add('ready-to-submit');
    } else {
        submitBtn.classList.remove('ready-to-submit');
    }
    
    console.log(`📊 Progress: ${completed}/${total} documents uploaded, ${requiredCompleted}/${totalRequired} required completed`);
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Submit All Documents
function submitAllDocuments() {
    console.log('📤 Submitting all documents...');
    
    // Validate that all required documents are uploaded
    const requiredDocuments = document.querySelectorAll('.document-item[data-required="true"]');
    const completedRequired = document.querySelectorAll('.document-item[data-required="true"] .document-status.completed');
    
    if (completedRequired.length !== requiredDocuments.length) {
        showNotification('Please complete all required documents before submitting', 'error');
        return;
    }
    
    // Collect all uploaded files
    const uploadedFiles = [];
    document.querySelectorAll('.uploaded-file-item').forEach(item => {
        const fileName = item.querySelector('.file-name').textContent;
        const fileSize = item.querySelector('.file-size').textContent;
        uploadedFiles.push({ name: fileName, size: fileSize });
    });
    
    if (uploadedFiles.length === 0) {
        showNotification('Please upload at least one document before submitting', 'error');
        return;
    }
    
    // Disable submit button during submission
    const submitBtn = document.getElementById('final-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }
    
    // Show submission confirmation
    showNotification(`Submitting ${uploadedFiles.length} documents for ${getAuthorityLabel(selectedCountry, selectedVisaType, selectedAuthority)} assessment`, 'success');
    
    // Simulate submission process
    setTimeout(() => {
        showNotification('Documents submitted successfully! Your application is now under review.', 'success');
        
        // Reset submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit All Documents';
        }
    }, 2000);
}

// Occupation List Functions
function initializeOccupationList() {
    console.log('📋 Initializing occupation list...');
    filteredOccupations = [...occupationDatabase];
    updateOccupationStats();
}

function showOccupationListModal() {
    console.log('🔍 Opening occupation list modal...');
    const modal = document.getElementById('occupationListModal');
    if (modal) {
        modal.style.display = 'block';
        initializeOccupationList();
        displayOccupations();
    }
}

function closeOccupationListModal() {
    console.log('❌ Closing occupation list modal...');
    const modal = document.getElementById('occupationListModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleSearchInput() {
    const searchInput = document.getElementById('occupationSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    if (searchInput && clearBtn) {
        if (searchInput.value.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    }
    
    filterOccupations();
}

function clearSearch() {
    const searchInput = document.getElementById('occupationSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    filterOccupations();
}

function filterOccupations() {
    const searchInput = document.getElementById('occupationSearchInput');
    const authorityFilter = document.getElementById('authorityFilter');
    const demandFilter = document.getElementById('demandFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedAuthority = authorityFilter ? authorityFilter.value : '';
    const selectedDemand = demandFilter ? demandFilter.value : '';
    
    filteredOccupations = occupationDatabase.filter(occupation => {
        const matchesSearch = !searchTerm || 
            occupation.title.toLowerCase().includes(searchTerm) ||
            occupation.anzsco.includes(searchTerm);
        
        const matchesAuthority = !selectedAuthority || occupation.authority === selectedAuthority;
        const matchesDemand = !selectedDemand || occupation.demand === selectedDemand;
        
        return matchesSearch && matchesAuthority && matchesDemand;
    });
    
    currentPage = 1;
    updateOccupationStats();
    displayOccupations();
}

function updateOccupationStats() {
    const totalOccupations = document.getElementById('totalOccupations');
    const filteredOccupationsCount = document.getElementById('filteredOccupations');
    const selectedAuthorityName = document.getElementById('selectedAuthorityName');
    
    if (totalOccupations) {
        totalOccupations.textContent = occupationDatabase.length;
    }
    
    if (filteredOccupationsCount) {
        filteredOccupationsCount.textContent = filteredOccupations.length;
    }
    
    if (selectedAuthorityName) {
        const authorityFilter = document.getElementById('authorityFilter');
        const selectedAuthority = authorityFilter ? authorityFilter.value : '';
        
        if (selectedAuthority) {
            const authorityLabels = {
                'acs': 'ACS (Australian Computer Society)',
                'vetassess': 'VETASSESS',
                'engineers-australia': 'Engineers Australia',
                'ahpra': 'AHPRA',
                'osap-tra': 'OSAP TRA',
                'msa-tra': 'MSA TRA'
            };
            selectedAuthorityName.textContent = authorityLabels[selectedAuthority] || selectedAuthority;
        } else {
            selectedAuthorityName.textContent = 'All';
        }
    }
}

function getAuthorityName(authority) {
    const authorityLabels = {
        'acs': 'ACS (Australian Computer Society)',
        'vetassess': 'VETASSESS',
        'engineers-australia': 'Engineers Australia',
        'ahpra': 'AHPRA',
        'osap-tra': 'OSAP TRA',
        'msa-tra': 'MSA TRA'
    };
    return authorityLabels[authority] || authority;
}

function displayOccupations() {
    const occupationList = document.getElementById('occupationList');
    const loadingIndicator = document.getElementById('occupationLoading');
    const noResults = document.getElementById('noResults');
    const paginationControls = document.getElementById('paginationControls');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    if (filteredOccupations.length === 0) {
        if (occupationList) {
            occupationList.innerHTML = '';
        }
        if (noResults) {
            noResults.style.display = 'block';
        }
        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
        return;
    }
    
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageOccupations = filteredOccupations.slice(startIndex, endIndex);
    
    if (occupationList) {
        let html = '';
        pageOccupations.forEach(occupation => {
            const demandClass = `demand-${occupation.demand}`;
            html += `
                <div class="occupation-item" data-authority="${occupation.authority}">
                    <div class="occupation-header">
                        <h3 class="occupation-title">${occupation.title}</h3>
                        <span class="occupation-anzsco">ANZSCO: ${occupation.anzsco}</span>
                    </div>
                    <div class="occupation-details">
                        <div class="occupation-authority">
                            <i class="fas fa-certificate"></i>
                            <span>${getAuthorityName(occupation.authority)}</span>
                        </div>
                        <div class="occupation-demand ${demandClass}">
                            <i class="fas fa-chart-line"></i>
                            <span>${occupation.demand.charAt(0).toUpperCase() + occupation.demand.slice(1)} Demand</span>
                        </div>
                        <div class="occupation-points">
                            <i class="fas fa-star"></i>
                            <span>${occupation.points} Points</span>
                        </div>
                    </div>
                    <div class="occupation-actions">
                        <button class="btn btn-outline btn-small" onclick="selectOccupation(${occupation.id})">
                            <i class="fas fa-plus"></i> Select
                        </button>
                    </div>
                </div>
            `;
        });
        occupationList.innerHTML = html;
    }
    
    updatePagination();
}

function updatePagination() {
    const paginationControls = document.getElementById('paginationControls');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    if (!paginationControls) return;
    
    const totalPages = Math.ceil(filteredOccupations.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationControls.style.display = 'none';
        return;
    }
    
    paginationControls.style.display = 'flex';
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayOccupations();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredOccupations.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayOccupations();
    }
}

function selectOccupation(occupationId) {
    const occupation = occupationDatabase.find(occ => occ.id === occupationId);
    if (occupation) {
        console.log('✅ Occupation selected:', occupation.title);
        showNotification(`Selected: ${occupation.title} (${occupation.anzsco})`, 'success');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    // You can implement a toast notification here
}

function logout() {
    console.log('🚪 Logging out...');
    localStorage.clear();
    window.location.href = 'index.html';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('occupationListModal');
    if (event.target === modal) {
        closeOccupationListModal();
    }
}