// Client Dashboard JavaScript for Tonio & Senora

// Global variables
let currentUser = null;
let isAuthenticated = false;

// Dashboard state management
let selectedCountry = null;
let selectedVisaType = null;
let selectedAuthority = null;
let selectedOccupation = null;

// Document Selection state management
let documentSelectionState = {
    country: null,
    visaType: null,
    authority: null
};

// Data structures
const VISA_TYPES = {
    australia: [
        { id: 'general-skilled-migration', name: 'General Skilled Migration', description: 'Skilled migration program for qualified workers' },
        { id: 'student-visa', name: 'Student Visa', description: 'Study in Australia with work rights' },
        { id: 'partner-visa', name: 'Partner Visa', description: 'Join your partner in Australia' },
        { id: 'family-visa', name: 'Family Visa', description: 'Family reunion and sponsorship' },
        { id: 'business-visa', name: 'Business Visa', description: 'Invest and do business in Australia' },
        { id: 'visit-visa', name: 'Visit Visa', description: 'Tourism and short-term visits' }
    ],
    canada: [
        { id: 'express-entry', name: 'Express Entry', description: 'Federal skilled worker program' },
        { id: 'provincial-nominee', name: 'Provincial Nominee Program', description: 'Provincial nomination pathway' },
        { id: 'family-sponsorship', name: 'Family Sponsorship', description: 'Sponsor family members' },
        { id: 'study-permit', name: 'Study Permit', description: 'Study in Canada' },
        { id: 'work-permit', name: 'Work Permit', description: 'Work in Canada temporarily' }
    ],
    newzealand: [
        { id: 'skilled-migrant', name: 'Skilled Migrant Category', description: 'Points-based skilled migration' },
        { id: 'essential-skills', name: 'Essential Skills', description: 'Work visa for skilled workers' },
        { id: 'family-category', name: 'Family Category', description: 'Family reunion visas' },
        { id: 'student-visa', name: 'Student Visa', description: 'Study in New Zealand' },
        { id: 'investor-visa', name: 'Investor Visa', description: 'Invest in New Zealand' }
    ]
};

const SKILL_ASSESSMENT_AUTHORITIES = {
    'acs': {
        name: 'ACS',
        description: 'Australian Computer Society',
        icon: 'fas fa-laptop-code'
    },
    'vetassess': {
        name: 'VETASSESS',
        description: 'Vocational Education and Training Assessment Services',
        icon: 'fas fa-tools'
    },
    'engineers-australia': {
        name: 'Engineers Australia',
        description: 'Professional Engineering Assessment',
        icon: 'fas fa-cogs'
    },
    'ahpra': {
        name: 'AHPRA',
        description: 'Australian Health Practitioner Regulation Agency',
        icon: 'fas fa-user-md'
    },
    'osap-tra': {
        name: 'OSAP TRA',
        description: 'Offshore Skills Assessment Program - Trades Recognition Australia',
        icon: 'fas fa-hammer'
    },
    'msa-tra': {
        name: 'MSA TRA',
        description: 'Migration Skills Assessment - Trades Recognition Australia',
        icon: 'fas fa-wrench'
    }
};

const AUTHORITY_DOCUMENT_CHECKLISTS = {
    'acs': {
        welcomeMessage: 'Here is your document checklist - let\'s start preparing documents for ACS skills assessment',
        documents: [
            { type: 'passport', name: 'Passport', description: 'Colour scanned copy of passport bio-data page' },
            { type: 'academic', name: 'Academic Documents', description: 'Degree certificates and academic transcripts' },
            { type: 'employment', name: 'Employment References', description: 'Detailed employment reference letters with duties and duration' },
            { type: 'cv', name: 'CV/Resume', description: 'Current curriculum vitae with detailed work history' },
            { type: 'skills-assessment', name: 'Skills Assessment Application', description: 'Completed ACS skills assessment application form' }
        ]
    },
    'vetassess': {
        welcomeMessage: 'Here is your document checklist - let\'s start preparing documents for VETASSESS skills assessment',
        documents: [
            { type: 'passport', name: 'Passport', description: 'Colour scanned copy of passport bio-data page' },
            { type: 'academic', name: 'Academic Qualifications', description: 'Certified copies of academic qualifications and transcripts' },
            { type: 'employment', name: 'Employment References', description: 'Detailed job descriptions and employment references' },
            { type: 'cv', name: 'CV/Resume', description: 'Current curriculum vitae with academic and employment history' },
            { type: 'skills-assessment', name: 'Skills Assessment Application', description: 'Completed VETASSESS skills assessment application' }
        ]
    },
    'engineers-australia': {
        welcomeMessage: 'Here is your document checklist - let\'s start preparing documents for Engineers Australia CDR assessment',
        documents: [
            { type: 'passport', name: 'Passport', description: 'Colour scanned copy of passport bio-data page' },
            { type: 'academic', name: 'Engineering Degree', description: 'Engineering degree certificates and complete academic transcripts' },
            { type: 'career-episodes', name: 'Career Episodes', description: 'Three career episode reports demonstrating engineering competencies' },
            { type: 'summary-statement', name: 'Summary Statement', description: 'Summary statement cross-referenced to career episodes' },
            { type: 'cpd', name: 'CPD Statement', description: 'Continuing Professional Development statement' },
            { type: 'english-test', name: 'English Test Results', description: 'Valid English language test results (IELTS, PTE, TOEFL, OET)' }
        ]
    },
    'ahpra': {
        welcomeMessage: 'Here is your document checklist - let\'s start preparing documents for AHPRA nursing registration',
        documents: [
            { type: 'passport', name: 'Passport', description: 'Certified copy of passport bio-data page' },
            { type: 'academic', name: 'Nursing Degree', description: 'Nursing degree certificate and academic transcripts' },
            { type: 'registration', name: 'Current Registration', description: 'Current nursing registration/license from home country' },
            { type: 'good-standing', name: 'Certificate of Good Standing', description: 'Certificate of good standing from nursing board' },
            { type: 'english-test', name: 'English Test Results', description: 'IELTS Academic 7.0 each band / OET Grade B each / PTE Academic 65+ / TOEFL iBT 94+' },
            { type: 'employment', name: 'Employment References', description: 'Professional reference letters from nursing supervisors' },
            { type: 'criminal-check', name: 'Criminal History Check', description: 'International criminal history check via Fit2Work' }
        ]
    },
    'osap-tra': {
        welcomeMessage: 'Here is your document checklist - let\'s start preparing documents for TRA Offshore Skills Assessment',
        documents: [
            { type: 'passport', name: 'Passport', description: 'Passport and proof of identity documents' },
            { type: 'trade-qualification', name: 'Trade Qualification', description: 'Trade qualification certificates and apprenticeship documents' },
            { type: 'academic', name: 'Academic Transcripts', description: 'Full transcripts and syllabus showing modules completed' },
            { type: 'employment', name: 'Employment References', description: 'Detailed employment reference letters with duties, duration, and tools used' },
            { type: 'work-evidence', name: 'Work Experience Evidence', description: 'Payslips, tax records, employment contracts, and bank statements' },
            { type: 'work-portfolio', name: 'Work Portfolio', description: 'Photos of completed work projects (if self-employed)' }
        ]
    },
    'msa-tra': {
        welcomeMessage: 'Here is your document checklist - let\'s start preparing documents for TRA Migration Skills Assessment',
        documents: [
            { type: 'passport', name: 'Passport', description: 'Passport and proof of identity documents' },
            { type: 'trade-qualification', name: 'Trade Qualification', description: 'Trade qualification certificates and complete academic transcripts' },
            { type: 'employment', name: 'Employment History', description: 'Detailed employment history documentation with minimum 6 years experience' },
            { type: 'employment-references', name: 'Employment References', description: 'Employer reference letters with job title, duties, and duration' },
            { type: 'cv', name: 'CV/Resume', description: 'CV showing progressive trade experience' },
            { type: 'work-evidence', name: 'Work Evidence', description: 'Proof of skilled employment including contracts, payslips, and tax records' }
        ]
    }
};

// Occupation List Data
const OCCUPATION_LIST = [
    // ACS Occupations
    {
        code: "261311",
        title: "Analyst Programmer",
        authority: "acs",
        authorityName: "ACS",
        points: 60,
        demand: "high",
        description: "Design, develop, and maintain software applications and systems."
    },
    {
        code: "261312",
        title: "Developer Programmer",
        authority: "acs",
        authorityName: "ACS",
        points: 60,
        demand: "high",
        description: "Create, modify, and test code for software applications."
    },
    {
        code: "261313",
        title: "Software Engineer",
        authority: "acs",
        authorityName: "ACS",
        points: 60,
        demand: "high",
        description: "Design and develop software systems and applications."
    },
    {
        code: "262111",
        title: "Database Administrator",
        authority: "acs",
        authorityName: "ACS",
        points: 60,
        demand: "medium",
        description: "Design, implement, and maintain database systems."
    },
    {
        code: "263111",
        title: "Computer Network and Systems Engineer",
        authority: "acs",
        authorityName: "ACS",
        points: 60,
        demand: "high",
        description: "Plan, design, and implement computer networks and systems."
    },
    
    // Engineers Australia Occupations
    {
        code: "233211",
        title: "Civil Engineer",
        authority: "engineers-australia",
        authorityName: "Engineers Australia",
        points: 60,
        demand: "high",
        description: "Design and oversee construction of infrastructure projects."
    },
    {
        code: "233212",
        title: "Geotechnical Engineer",
        authority: "engineers-australia",
        authorityName: "Engineers Australia",
        points: 60,
        demand: "medium",
        description: "Analyze soil and rock conditions for construction projects."
    },
    {
        code: "233213",
        title: "Structural Engineer",
        authority: "engineers-australia",
        authorityName: "Engineers Australia",
        points: 60,
        demand: "high",
        description: "Design and analyze structural systems for buildings and infrastructure."
    },
    {
        code: "233214",
        title: "Transport Engineer",
        authority: "engineers-australia",
        authorityName: "Engineers Australia",
        points: 60,
        demand: "medium",
        description: "Plan and design transportation systems and infrastructure."
    },
    {
        code: "233215",
        title: "Water Resources Engineer",
        authority: "engineers-australia",
        authorityName: "Engineers Australia",
        points: 60,
        demand: "medium",
        description: "Design and manage water supply and treatment systems."
    },
    
    // VETASSESS Occupations
    {
        code: "224111",
        title: "Actuary",
        authority: "vetassess",
        authorityName: "VETASSESS",
        points: 60,
        demand: "medium",
        description: "Analyze financial risks and develop insurance policies."
    },
    {
        code: "224112",
        title: "Mathematician",
        authority: "vetassess",
        authorityName: "VETASSESS",
        points: 60,
        demand: "low",
        description: "Develop mathematical theories and apply mathematical techniques."
    },
    {
        code: "224113",
        title: "Statistician",
        authority: "vetassess",
        authorityName: "VETASSESS",
        points: 60,
        demand: "medium",
        description: "Collect, analyze, and interpret statistical data."
    },
    {
        code: "225111",
        title: "Advertising Specialist",
        authority: "vetassess",
        authorityName: "VETASSESS",
        points: 60,
        demand: "medium",
        description: "Plan and coordinate advertising campaigns and strategies."
    },
    {
        code: "225112",
        title: "Market Research Analyst",
        authority: "vetassess",
        authorityName: "VETASSESS",
        points: 60,
        demand: "medium",
        description: "Research market conditions and consumer preferences."
    },
    
    // AHPRA Occupations
    {
        code: "254411",
        title: "Registered Nurse (Aged Care)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide nursing care to elderly patients in aged care facilities."
    },
    {
        code: "254412",
        title: "Registered Nurse (Child and Family Health)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide specialized nursing care for children and families."
    },
    {
        code: "254413",
        title: "Registered Nurse (Community Health)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide nursing care in community health settings."
    },
    {
        code: "254414",
        title: "Registered Nurse (Critical Care and Emergency)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide specialized nursing care in critical care and emergency settings."
    },
    {
        code: "254415",
        title: "Registered Nurse (Developmental Disability)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "medium",
        description: "Provide nursing care to individuals with developmental disabilities."
    },
    {
        code: "254416",
        title: "Registered Nurse (Disability and Rehabilitation)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "medium",
        description: "Provide nursing care for disability and rehabilitation services."
    },
    {
        code: "254417",
        title: "Registered Nurse (Medical)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide general medical nursing care in hospital settings."
    },
    {
        code: "254418",
        title: "Registered Nurse (Medical Practice)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide nursing care in medical practice settings."
    },
    {
        code: "254421",
        title: "Registered Nurse (Mental Health)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide specialized nursing care for mental health patients."
    },
    {
        code: "254422",
        title: "Registered Nurse (Perioperative)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide nursing care in operating room and perioperative settings."
    },
    {
        code: "254423",
        title: "Registered Nurse (Surgical)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide specialized nursing care for surgical patients."
    },
    {
        code: "254424",
        title: "Registered Nurse (Paediatrics)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide specialized nursing care for children and adolescents."
    },
    {
        code: "254425",
        title: "Registered Nurse (Rural and Remote)",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide nursing care in rural and remote healthcare settings."
    },
    {
        code: "254499",
        title: "Registered Nurses nec",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Other registered nurses not elsewhere classified."
    },
    {
        code: "254411",
        title: "Midwife",
        authority: "ahpra",
        authorityName: "AHPRA",
        points: 60,
        demand: "high",
        description: "Provide care and support to women during pregnancy, childbirth, and postpartum."
    },
    
    // OSAP TRA Occupations
    {
        code: "341111",
        title: "Electrician (General)",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "high",
        description: "Install, maintain, and repair electrical systems and equipment."
    },
    {
        code: "334112",
        title: "Plumber (General)",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "high",
        description: "Install, maintain, and repair plumbing systems and fixtures."
    },
    {
        code: "331212",
        title: "Carpenter",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "high",
        description: "Construct, install, and repair wooden structures and fixtures."
    },
    {
        code: "331111",
        title: "Bricklayer",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Build and repair walls, chimneys, and other structures using bricks and blocks."
    },
    {
        code: "351311",
        title: "Chef",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "high",
        description: "Plan and prepare food in restaurants and other food service establishments."
    },
    {
        code: "322311",
        title: "Metal Fabricator",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Cut, shape, and assemble metal components for construction and manufacturing."
    },
    {
        code: "321211",
        title: "Motor Mechanic (General)",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "high",
        description: "Diagnose, repair, and maintain motor vehicles and their systems."
    },
    {
        code: "342211",
        title: "Air Conditioning and Refrigeration Mechanic",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "high",
        description: "Install, maintain, and repair air conditioning and refrigeration systems."
    },
    {
        code: "394111",
        title: "Cabinetmaker",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Design, construct, and repair wooden furniture and cabinetry."
    },
    {
        code: "324111",
        title: "Panel Beater",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Repair and restore damaged vehicle bodywork and panels."
    },
    {
        code: "322313",
        title: "Welder (First Class)",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "high",
        description: "Join metal parts using various welding techniques and equipment."
    },
    {
        code: "332211",
        title: "Painter and Decorator",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Apply paint, wallpaper, and other decorative finishes to surfaces."
    },
    {
        code: "391111",
        title: "Hairdresser",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Cut, style, and color hair for clients in salons and other settings."
    },
    {
        code: "351112",
        title: "Baker",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Prepare and bake bread, pastries, and other baked goods."
    },
    {
        code: "351113",
        title: "Pastrycook",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Prepare and bake pastries, cakes, and other sweet baked goods."
    },
    {
        code: "351211",
        title: "Butcher or Smallgoods Maker",
        authority: "osap-tra",
        authorityName: "OSAP TRA",
        points: 60,
        demand: "medium",
        description: "Prepare and process meat products for retail and wholesale sale."
    },
    
    // MSA TRA Occupations
    {
        code: "341111",
        title: "Electrician (General) - MSA",
        authority: "msa-tra",
        authorityName: "MSA TRA",
        points: 60,
        demand: "high",
        description: "Install, maintain, and repair electrical systems and equipment (Migration Skills Assessment)."
    },
    {
        code: "334112",
        title: "Plumber (General) - MSA",
        authority: "msa-tra",
        authorityName: "MSA TRA",
        points: 60,
        demand: "high",
        description: "Install, maintain, and repair plumbing systems and fixtures (Migration Skills Assessment)."
    },
    {
        code: "331212",
        title: "Carpenter - MSA",
        authority: "msa-tra",
        authorityName: "MSA TRA",
        points: 60,
        demand: "high",
        description: "Construct, install, and repair wooden structures and fixtures (Migration Skills Assessment)."
    },
    {
        code: "351311",
        title: "Chef - MSA",
        authority: "msa-tra",
        authorityName: "MSA TRA",
        points: 60,
        demand: "high",
        description: "Plan and prepare food in restaurants and other food service establishments (Migration Skills Assessment)."
    },
    {
        code: "321211",
        title: "Motor Mechanic (General) - MSA",
        authority: "msa-tra",
        authorityName: "MSA TRA",
        points: 60,
        demand: "high",
        description: "Diagnose, repair, and maintain motor vehicles and their systems (Migration Skills Assessment)."
    }
];

// Initialize client dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeClientDashboard();
    setupClientEventListeners();
    registerServiceWorker();
});

// Initialize client dashboard
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
    
    currentUser = JSON.parse(savedUser);
    
    // Ensure only clients can access client dashboard
    if (currentUser.accountType !== 'client') {
        // Clear session and redirect to home
        clearAllSessions();
        window.location.href = 'index.html';
        return;
    }
    
    isAuthenticated = true;
    
    // Update user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `Welcome, ${currentUser.name}`;
    }
    
    // Load initial data
    loadDashboardData();
    loadDocuments();
    loadMessages();
    
    // Restore dashboard state
    restoreDashboardState();
    
    // Restore document selection state
    restoreDocumentSelectionState();
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
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="unauthorized-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">
                    Go to Login
                </button>
            </div>
        `;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Load recent activities
    loadActivities();
    
    // Load progress data
    loadProgress();
}

// Load documents
function loadDocuments() {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const documentList = document.getElementById('documentList');
    
    if (documentList) {
        if (documents.length === 0) {
            documentList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No documents uploaded</h3>
                    <p>Upload your documents to get started with your application.</p>
                </div>
            `;
        } else {
            let html = '';
            documents.forEach(doc => {
                html += `
                    <div class="document-item">
                        <div class="document-info">
                            <h4>${doc.name}</h4>
                            <p>Type: ${doc.type}</p>
                            <p>Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <div class="document-actions">
                            <button class="btn btn-small btn-outline" onclick="viewDocument('${doc.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-small btn-danger" onclick="deleteDocument('${doc.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            });
            documentList.innerHTML = html;
        }
    }
}

// Load messages
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const messageList = document.getElementById('messageList');
    
    if (messageList) {
        if (messages.length === 0) {
            messageList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-envelope"></i>
                    <h3>No messages</h3>
                    <p>Your messages will appear here.</p>
                </div>
            `;
        } else {
            let html = '';
            messages.forEach(message => {
                html += `
                    <div class="message-item">
                        <div class="message-header">
                            <h4>${message.subject}</h4>
                            <span class="message-date">${new Date(message.date).toLocaleDateString()}</span>
                        </div>
                        <p>${message.content}</p>
                    </div>
                `;
            });
            messageList.innerHTML = html;
        }
    }
}

// Load activities
function loadActivities() {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const activityList = document.getElementById('activityList');
    
    if (activityList) {
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>No recent activity</h3>
                    <p>Your recent activity will appear here.</p>
                </div>
            `;
        } else {
            let html = '';
            activities.slice(0, 5).forEach(activity => {
                html += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <p>${activity.description}</p>
                            <span class="activity-date">${new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            });
            activityList.innerHTML = html;
        }
    }
}

// Load progress
function loadProgress() {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const totalDocuments = 10; // Assuming 10 required documents
    const uploadedDocuments = documents.filter(doc => doc.status === 'uploaded').length;
    const progressPercentage = Math.round((uploadedDocuments / totalDocuments) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${progressPercentage}% Complete`;
    }
}

// Show section
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

// Setup client event listeners
function setupClientEventListeners() {
    // Message form submission
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            const message = textarea.value.trim();
            
            if (message) {
                // Add message to localStorage
                const messages = JSON.parse(localStorage.getItem('messages') || '[]');
                messages.push({
                    id: Date.now().toString(),
                    subject: 'New Message',
                    content: message,
                    date: new Date().toISOString(),
                    from: 'client',
                    to: 'admin'
                });
                localStorage.setItem('messages', JSON.stringify(messages));
                
                // Clear form
                textarea.value = '';
                
                // Show success message
                showNotification('Message sent successfully', 'success');
                
                // Reload messages
                loadMessages();
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout function
function logout() {
    clearAllSessions();
    window.location.href = 'index.html';
}

// Legacy document selection functions removed - using new multi-step interface

// Document UI Update Functions
function updateDocumentCountrySelection(country) {
    // Remove selected class from all country cards
    document.querySelectorAll('[data-country]').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to chosen country
    const selectedCard = document.querySelector(`[data-country="${country}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
}

function updateDocumentVisaTypeSelection(visaTypeId) {
    // Remove selected class from all visa type cards
    document.querySelectorAll('[data-visa-type]').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to chosen visa type
    const selectedCard = document.querySelector(`[data-visa-type="${visaTypeId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
}

function updateDocumentAuthoritySelection(authorityKey) {
    // Remove selected class from all authority cards
    document.querySelectorAll('[data-authority]').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to chosen authority
    const selectedCard = document.querySelector(`[data-authority="${authorityKey}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
}

// Document Data Loading Functions
function loadDocumentVisaTypes(country) {
    const visaTypes = VISA_TYPES[country] || [];
    const visaTypeOptions = document.getElementById('visaTypeOptions');
    if (visaTypeOptions) {
        let html = '';
        visaTypes.forEach(visaType => {
            html += `
                <div class="selection-card" data-visa-type="${visaType.id}" onclick="selectDocumentVisaType('${visaType.id}')">
                    <i class="fas fa-file-alt"></i>
                    <h4>${visaType.name}</h4>
                    <p>${visaType.description}</p>
                </div>
            `;
        });
        visaTypeOptions.innerHTML = html;
    }
}

function loadDocumentAuthorities() {
    const authorityOptions = document.getElementById('authorityOptions');
    if (authorityOptions) {
        let html = '';
        Object.keys(SKILL_ASSESSMENT_AUTHORITIES).forEach(authorityKey => {
            const authority = SKILL_ASSESSMENT_AUTHORITIES[authorityKey];
            html += `
                <div class="selection-card" data-authority="${authorityKey}" onclick="selectDocumentAuthority('${authorityKey}')">
                    <i class="${authority.icon}"></i>
                    <h4>${authority.name}</h4>
                    <p>${authority.description}</p>
                </div>
            `;
        });
        authorityOptions.innerHTML = html;
    }
}

// Document Step Management
function updateStepIndicator(activeStep) {
    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.remove('active', 'completed');
            if (i < activeStep) {
                step.classList.add('completed');
            } else if (i === activeStep) {
                step.classList.add('active');
            }
        }
    }
}

function showDocumentStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.selection-step').forEach(step => {
        step.classList.remove('active', 'locked');
    });
    
    // Show current step and lock subsequent steps
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`${i === 1 ? 'country' : i === 2 ? 'visa' : 'authority'}Step`);
        if (step) {
            if (i === stepNumber) {
                step.classList.add('active');
            } else if (i > stepNumber) {
                step.classList.add('locked');
            }
        }
    }
}

function showDocumentationScreen() {
    const documentationScreen = document.getElementById('documentationScreen');
    const selectedPath = document.getElementById('selectedPath');
    
    if (documentationScreen && selectedPath) {
        // Update selected path display
        const countryName = getCountryDisplayName(documentSelectionState.country);
        const visaTypeName = getVisaTypeDisplayName(documentSelectionState.visaType);
        const authorityName = getAuthorityDisplayName(documentSelectionState.authority);
        
        selectedPath.textContent = `${countryName} → ${visaTypeName} → ${authorityName}`;
        
        // Load authority-specific checklist
        loadDocumentAuthorityChecklist(documentSelectionState.authority);
        
        // Show documentation screen
        documentationScreen.style.display = 'block';
    }
}

function hideDocumentationScreen() {
    const documentationScreen = document.getElementById('documentationScreen');
    if (documentationScreen) {
        documentationScreen.style.display = 'none';
    }
}

function loadDocumentAuthorityChecklist(authorityKey) {
    const authorityChecklist = AUTHORITY_DOCUMENT_CHECKLISTS[authorityKey];
    const checklistContainer = document.getElementById('authorityChecklist');
    
    if (authorityChecklist && checklistContainer) {
        let html = `
            <div class="checklist-items">
        `;
        
        authorityChecklist.documents.forEach((doc, index) => {
            html += `
                <div class="checklist-item" data-document-type="${doc.type}">
                    <div class="checklist-item-header">
                        <h4>${doc.name}</h4>
                        <span class="document-status status-pending">Pending</span>
                    </div>
                    <div class="checklist-item-details">
                        <p>${doc.description}</p>
                        <div class="document-upload-area">
                            <input type="file" id="upload-${doc.type}" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" onchange="uploadDocumentFile('${doc.type}', this.files[0])">
                            <button class="btn btn-outline" onclick="document.getElementById('upload-${doc.type}').click()">
                                <i class="fas fa-upload"></i> Upload ${doc.name}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
            </div>
        `;
        
        checklistContainer.innerHTML = html;
    }
}

// Document Upload Functions
function uploadDocumentFile(documentType, file) {
    if (!file) return;
    
    // Create file reader
    const reader = new FileReader();
    reader.onload = function(e) {
        const documentData = {
            id: Date.now().toString(),
            name: file.name,
            type: documentType,
            size: file.size,
            data: e.target.result,
            uploadedAt: new Date().toISOString(),
            country: documentSelectionState.country,
            visaType: documentSelectionState.visaType,
            authority: documentSelectionState.authority,
            status: 'pending'
        };
        
        // Save to localStorage
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        documents.push(documentData);
        localStorage.setItem('documents', JSON.stringify(documents));
        
        // Update UI
        updateDocumentStatus(documentType, 'uploaded');
        showNotification('Document uploaded successfully', 'success');
    };
    
    reader.readAsDataURL(file);
}

function updateDocumentStatus(documentType, status) {
    const checklistItem = document.querySelector(`[data-document-type="${documentType}"]`);
    if (checklistItem) {
        const statusElement = checklistItem.querySelector('.document-status');
        if (statusElement) {
            statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusElement.className = `document-status status-${status}`;
        }
    }
}

// Occupation List Modal Functions
function showOccupationListModal() {
    const modal = document.getElementById('occupationListModal');
    if (modal) {
        loadModalOccupationList();
        modal.style.display = 'flex';
    }
}

function closeOccupationListModal() {
    const modal = document.getElementById('occupationListModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function loadModalOccupationList() {
    const occupationGrid = document.getElementById('modalOccupationGrid');
    if (!occupationGrid) return;

    let html = '';
    OCCUPATION_LIST.forEach(occupation => {
        const demandClass = `demand-${occupation.demand}`;
        html += `
            <div class="occupation-card" data-authority="${occupation.authority}">
                <div class="occupation-header">
                    <div class="occupation-title">
                        <h3>${occupation.title}</h3>
                        <div class="occupation-code">ANZSCO: ${occupation.code}</div>
                    </div>
                </div>
                <div class="occupation-authority">
                    <i class="fas fa-certificate"></i>
                    <span class="authority-badge">${occupation.authorityName}</span>
                </div>
                <div class="occupation-details">
                    <p>${occupation.description}</p>
                </div>
                <div class="occupation-requirements">
                    <div class="points-requirement">
                        <i class="fas fa-star"></i>
                        <span>${occupation.points} Points</span>
                    </div>
                    <span class="demand-status ${demandClass}">
                        ${occupation.demand.charAt(0).toUpperCase() + occupation.demand.slice(1)} Demand
                    </span>
                </div>
            </div>
        `;
    });
    occupationGrid.innerHTML = html;
}

function filterModalOccupations() {
    const authorityFilter = document.getElementById('modalAuthorityFilter')?.value || '';
    const searchTerm = document.getElementById('modalOccupationSearch')?.value.toLowerCase() || '';
    const occupationCards = document.querySelectorAll('#modalOccupationGrid .occupation-card');

    occupationCards.forEach(card => {
        const authority = card.getAttribute('data-authority');
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.occupation-details p').textContent.toLowerCase();

        const matchesAuthority = !authorityFilter || authority === authorityFilter;
        const matchesSearch = !searchTerm ||
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            card.querySelector('.occupation-code').textContent.toLowerCase().includes(searchTerm);

        if (matchesAuthority && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Utility Functions for Document Selection
function getCountryDisplayName(country) {
    const displayNames = {
        'australia': 'Australia',
        'canada': 'Canada',
        'newzealand': 'New Zealand'
    };
    return displayNames[country] || country;
}

function getVisaTypeDisplayName(visaType) {
    const allVisaTypes = Object.values(VISA_TYPES).flat();
    const visaTypeObj = allVisaTypes.find(vt => vt.id === visaType);
    return visaTypeObj ? visaTypeObj.name : visaType;
}

function getAuthorityDisplayName(authority) {
    const displayNames = {
        'acs': 'ACS',
        'vetassess': 'VETASSESS',
        'engineers-australia': 'Engineers Australia',
        'ahpra': 'AHPRA',
        'osap-tra': 'OSAP TRA',
        'msa-tra': 'MSA TRA'
    };
    return displayNames[authority] || authority;
}

// Restore Document Selection State
function restoreDocumentSelectionState() {
    const savedCountry = localStorage.getItem('documentCountry');
    const savedVisaType = localStorage.getItem('documentVisaType');
    const savedAuthority = localStorage.getItem('documentAuthority');
    
    if (savedCountry) {
        selectDocumentCountry(savedCountry);
    }
    
    if (savedVisaType) {
        selectDocumentVisaType(savedVisaType);
    }
    
    if (savedAuthority) {
        selectDocumentAuthority(savedAuthority);
    }
}

// Restore dashboard state from localStorage
function restoreDashboardState() {
    const savedCountry = localStorage.getItem('selectedCountry');
    const savedVisaType = localStorage.getItem('selectedVisaType');
    const savedAuthority = localStorage.getItem('selectedAuthority');
    const savedOccupation = localStorage.getItem('selectedOccupation');
    
    if (savedCountry) {
        selectedCountry = savedCountry;
    }
    
    if (savedVisaType) {
        selectedVisaType = savedVisaType;
    }
    
    if (savedAuthority) {
        selectedAuthority = savedAuthority;
    }
    
    if (savedOccupation) {
        try {
            selectedOccupation = JSON.parse(savedOccupation);
        } catch (e) {
            console.error('Error parsing saved occupation:', e);
        }
    }
}

// Load occupation list
function loadOccupationList() {
    const occupationGrid = document.getElementById('occupationGrid');
    if (!occupationGrid) return;

    let html = '';
    OCCUPATION_LIST.forEach(occupation => {
        const demandClass = `demand-${occupation.demand}`;
        html += `
            <div class="occupation-card" data-authority="${occupation.authority}">
                <div class="occupation-header">
                    <div class="occupation-title">
                        <h3>${occupation.title}</h3>
                        <div class="occupation-code">ANZSCO: ${occupation.code}</div>
                    </div>
                </div>
                <div class="occupation-authority">
                    <i class="fas fa-certificate"></i>
                    <span class="authority-badge">${occupation.authorityName}</span>
                </div>
                <div class="occupation-details">
                    <p>${occupation.description}</p>
                </div>
                <div class="occupation-requirements">
                    <div class="points-requirement">
                        <i class="fas fa-star"></i>
                        <span>${occupation.points} Points</span>
                    </div>
                    <span class="demand-status ${demandClass}">
                        ${occupation.demand.charAt(0).toUpperCase() + occupation.demand.slice(1)} Demand
                    </span>
                </div>
            </div>
        `;
    });
    occupationGrid.innerHTML = html;
}

function filterOccupations() {
    const authorityFilter = document.getElementById('occupationAuthorityFilter')?.value || '';
    const searchTerm = document.getElementById('occupationSearch')?.value.toLowerCase() || '';
    const occupationCards = document.querySelectorAll('.occupation-card');

    occupationCards.forEach(card => {
        const authority = card.getAttribute('data-authority');
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.occupation-details p').textContent.toLowerCase();

        const matchesAuthority = !authorityFilter || authority === authorityFilter;
        const matchesSearch = !searchTerm ||
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            card.querySelector('.occupation-code').textContent.toLowerCase().includes(searchTerm);

        if (matchesAuthority && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// PWA Service Worker Registration
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

// Export functions for global access
window.showSection = showSection;
window.logout = logout;

// Multi-Step Document Upload State Management
let currentUploadStep = 1;
let uploadedDocuments = {};
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

// Multi-Step Upload Functions
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
    uploadedDocuments = {};
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

// Export document selection functions (legacy - kept for compatibility)
window.uploadDocumentFile = uploadDocumentFile;
window.showOccupationListModal = showOccupationListModal;
window.closeOccupationListModal = closeOccupationListModal;
window.filterModalOccupations = filterModalOccupations;
window.loadOccupationList = loadOccupationList;
window.filterOccupations = filterOccupations;

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

// Export multi-step upload functions
window.handleFileUpload = handleFileUpload;
window.removeFile = removeFile;
window.viewFile = viewFile;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.submitAllDocuments = submitAllDocuments;
window.initializeMultiStepUpload = initializeMultiStepUpload;
