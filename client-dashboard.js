// Client Dashboard JavaScript for Tonio & Senora
// FIXED: Removed duplicate currentUser declaration - script.js declares it already
// Cache Buster: 2025-01-01

console.log('🚀 Loading Client Dashboard JavaScript...');

// NOTE: currentUser and isAuthenticated are declared in script.js
// DO NOT redeclare them here - just use the existing globals

// Document Selection state management
let documentSelectionState = {
    country: null,
    visaType: null,
    authority: null
};

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
    
    // Clear the proceeded to documentation flag
    localStorage.removeItem('proceededToDocumentation');
    
    // Reset the document selection state object
    documentSelectionState = {
        country: null,
        visaType: null,
        authority: null
    };
    
    // Hide any visible checklist
    hideDocumentChecklist();
    
    console.log('✅ Previous client checklist state cleared');
}

// Data structures - Visa Types with metadata
const VISA_TYPES_DATA = {
    australia: {
        'general-skilled-migration': {
            id: 'general-skilled-migration',
            name: 'Skilled Migration (GSM)',
            requiresAuthority: true,
            description: 'Points-based skilled migration program requiring skills assessment'
        },
        'student-visa': {
            id: 'student-visa',
            name: 'Student Visa',
            requiresAuthority: false,
            description: 'Study in Australia with work rights'
        },
        'partner-visa': {
            id: 'partner-visa',
            name: 'Partner Visa',
            requiresAuthority: false,
            description: 'Join your partner in Australia'
        },
        'parent-visa': {
            id: 'parent-visa',
            name: 'Parent Visa',
            requiresAuthority: false,
            description: 'Family reunion for parents'
        },
        'business-visa': {
            id: 'business-visa',
            name: 'Business Visa',
            requiresAuthority: false,
            description: 'Invest and do business in Australia'
        },
        'family-visa': {
            id: 'family-visa',
            name: 'Family Visa',
            requiresAuthority: false,
            description: 'Family reunion and sponsorship'
        },
        'visit-visa': {
            id: 'visit-visa',
            name: 'Visitor/Tourist Visa',
            requiresAuthority: false,
            description: 'Tourism and short-term visits'
        }
    },
    canada: {
        'express-entry': {
            id: 'express-entry',
            name: 'Express Entry',
            requiresAuthority: false,
            description: 'Federal skilled worker program for permanent residence'
        },
        'provincial-nominee-program': {
            id: 'provincial-nominee-program',
            name: 'Provincial Nominee Program',
            requiresAuthority: false,
            description: 'Provincial nomination pathway'
        },
        'family-sponsorship': {
            id: 'family-sponsorship',
            name: 'Family Sponsorship',
            requiresAuthority: false,
            description: 'Sponsor family members'
        },
        'study-permit': {
            id: 'study-permit',
            name: 'Student Visa',
            requiresAuthority: false,
            description: 'Study in Canada'
        },
        'work-permit': {
            id: 'work-permit',
            name: 'Work Permit',
            requiresAuthority: false,
            description: 'Work in Canada temporarily'
        },
        'visitor-visa': {
            id: 'visitor-visa',
            name: 'Visitor Visa',
            requiresAuthority: false,
            description: 'Tourism and short-term visits'
        }
    },
    'new-zealand': {
        'skilled-migrant-category': {
            id: 'skilled-migrant-category',
            name: 'Skilled Migrant Resident',
            requiresAuthority: false,
            description: 'Points-based skilled migration'
        },
        'student-visa': {
            id: 'student-visa',
            name: 'Student Visa',
            requiresAuthority: false,
            description: 'Study in New Zealand'
        },
        'visitor-visa': {
            id: 'visitor-visa',
            name: 'Visitor Visa',
            requiresAuthority: false,
            description: 'Tourism and short-term visits'
        },
        'work-visa': {
            id: 'work-visa',
            name: 'Work Visa',
            requiresAuthority: false,
            description: 'Work in New Zealand'
        },
        'partnership-visa': {
            id: 'partnership-visa',
            name: 'Partnership Visa',
            requiresAuthority: false,
            description: 'Join your partner in New Zealand'
        },
        'permanent-resident': {
            id: 'permanent-resident',
            name: 'Permanent Resident',
            requiresAuthority: false,
            description: 'Permanent residence in New Zealand'
        }
    },
    'united-kingdom': {
        'skilled-worker-visa': {
            id: 'skilled-worker-visa',
            name: 'Skilled Worker Visa',
            requiresAuthority: false,
            description: 'Work in the UK with a licensed sponsor'
        },
        'student-visa': {
            id: 'student-visa',
            name: 'Student Visa',
            requiresAuthority: false,
            description: 'Study in the UK'
        },
        'visitor-visa': {
            id: 'visitor-visa',
            name: 'Visitor Visa',
            requiresAuthority: false,
            description: 'Tourism and short-term visits'
        },
        'spouse-partner-visa': {
            id: 'spouse-partner-visa',
            name: 'Spouse/Partner Visa',
            requiresAuthority: false,
            description: 'Join your spouse/partner in the UK'
        },
        'indefinite-leave-to-remain': {
            id: 'indefinite-leave-to-remain',
            name: 'Indefinite Leave to Remain',
            requiresAuthority: false,
            description: 'Settlement visa after continuous residence'
        },
        'health-care-worker-visa': {
            id: 'health-care-worker-visa',
            name: 'Health Care Worker Visa',
            requiresAuthority: false,
            description: 'Work in UK healthcare sector'
        },
        'graduate-visa': {
            id: 'graduate-visa',
            name: 'Graduate Visa',
            requiresAuthority: false,
            description: 'Stay in UK after graduation'
        }
    },
    'united-states': {
        'h1b': {
            id: 'h1b',
            name: 'Work Visa',
            requiresAuthority: false,
            description: 'Specialty occupation work visa'
        },
        'f1-student-visa': {
            id: 'f1-student-visa',
            name: 'Student Visa',
            requiresAuthority: false,
            description: 'Study at SEVP-approved institution'
        },
        'b1-b2-visitor-visa': {
            id: 'b1-b2-visitor-visa',
            name: 'Visitor Visa',
            requiresAuthority: false,
            description: 'Business and tourism visits'
        },
        'l1-intracompany-transfer': {
            id: 'l1-intracompany-transfer',
            name: 'Intra-company Transfer Visa',
            requiresAuthority: false,
            description: 'Transfer within multinational company'
        },
        'employment-based-green-card': {
            id: 'employment-based-green-card',
            name: 'Employment-Based Green Card',
            requiresAuthority: false,
            description: 'Permanent residence through employment'
        },
        'j1-exchange-visitor': {
            id: 'j1-exchange-visitor',
            name: 'Exchange Visitor Visa',
            requiresAuthority: false,
            description: 'Cultural exchange and work programs'
        },
        'o1-extraordinary-ability': {
            id: 'o1-extraordinary-ability',
            name: 'Extraordinary Ability Visa',
            requiresAuthority: false,
            description: 'For individuals with extraordinary ability'
        },
        'k1-fiance-visa': {
            id: 'k1-fiance-visa',
            name: 'Fiancé Visa',
            requiresAuthority: false,
            description: 'Fiancé of US citizen'
        }
    }
};

// Legacy VISA_TYPES for backward compatibility (array of IDs)
const VISA_TYPES = {};
Object.keys(VISA_TYPES_DATA).forEach(country => {
    VISA_TYPES[country] = Object.keys(VISA_TYPES_DATA[country]);
});

const SKILL_ASSESSMENT_AUTHORITIES = {
    'acs': { name: 'Australian Computer Society', country: 'australia' },
    'vetassess': { name: 'VETASSESS', country: 'australia' },
    'engineers-australia': { name: 'Engineers Australia', country: 'australia' },
    'ahpra': { name: 'Australian Health Practitioner Regulation Agency', country: 'australia' },
    'osap-tra': { name: 'OSAP TRA', country: 'australia' },
    'msa-tra': { name: 'MSA TRA', country: 'australia' }
};

// Document Requirements Mapping by Country and Visa Type
const DOCUMENT_REQUIREMENTS = {
    australia: {
        'general-skilled-migration': [
            'Passport (bio page and all pages with visas)',
            'Skills assessment letter from relevant authority',
            'Degree certificates and official transcripts',
            'Employment reference letters (detailed with duties)',
            'Payslips and bank statements (employment proof)',
            'English test results (IELTS, PTE, TOEFL, etc.)',
            'Police clearance certificates (all countries lived 12+ months since age 16)',
            'Medical examination results',
            'Form 80 and Form 1221 (if required)',
            'Identity documents (birth certificate, national ID)',
            'Photos (passport-sized as per specifications)'
        ],
        'student-visa': [
            'CoE (Confirmation of Enrolment)',
            'Offer letter from educational institution',
            'Passport (valid with sufficient validity)',
            'Academic transcripts and certificates',
            'Financial proof (bank statements showing sufficient funds)',
            'Loan documents or scholarship letters (if applicable)',
            'Sponsor documents and statutory declarations (if sponsored)',
            'English test score (IELTS, TOEFL, PTE, etc.)',
            'OSHC (Overseas Student Health Cover) proof',
            'Statement of Purpose (SOP) explaining genuine temporary entrant',
            'Passport photos (as per specifications)',
            'Health examination results (if required)',
            'Police clearance certificate (if required)'
        ],
        'partner-visa': [
            'Passport and identity documents',
            'Marriage certificate or relationship evidence',
            'Joint relationship evidence (bank accounts, leases, photos, etc.)',
            'Sponsor documents (Australian citizen/permanent resident)',
            'Police clearance certificates',
            'Medical examination results',
            'Financial capacity proof',
            'Character references',
            'Passport photos'
        ],
        'parent-visa': [
            'Passport and identity documents',
            'Birth certificates (for children)',
            'Evidence of dependency (if applicable)',
            'Sponsor documents (Australian citizen/permanent resident child)',
            'Balance of family test documents',
            'Financial capacity proof',
            'Police clearance certificates',
            'Medical examination results',
            'Passport photos'
        ],
        'family-visa': [
            'Passport and identity documents',
            'Birth certificates or adoption papers',
            'Relationship evidence',
            'Sponsor documents',
            'Police clearance certificates',
            'Medical examination results',
            'Financial capacity proof',
            'Passport photos'
        ],
        'visit-visa': [
            'Passport (valid for duration of stay)',
            'Invitation letter (if visiting family/friends)',
            'Proof of financial capacity',
            'Travel itinerary',
            'Proof of ties to home country',
            'Health insurance (recommended)',
            'Passport photos'
        ],
        'business-visa': [
            'Passport (valid)',
            'Business plan and proposal',
            'Financial statements and bank records',
            'Company registration documents',
            'Business registration certificates',
            'Tax returns and financial records',
            'Invitation letter from Australian business partner (if applicable)',
            'Proof of previous business experience',
            'Character references',
            'Police clearance certificate',
            'Medical examination results (if required)',
            'Passport photos'
        ]
    },
    canada: {
        'express-entry': [
            'Passport (valid and bio page)',
            'ECA (Educational Credential Assessment) report',
            'Language test results (IELTS, CELPIP, TEF)',
            'Work reference letters (detailed with duties, hours, salary)',
            'Payslips and employment contracts',
            'Police clearance certificates',
            'Medical examination results',
            'Education documents (degrees, diplomas, transcripts)',
            'Marriage certificate (if applicable)',
            'Birth certificates for children',
            'Proof of settlement funds (bank statements)',
            'Photos (as per IRCC specifications)'
        ],
        'study-permit': [
            'LoA (Letter of Acceptance) from DLI institution',
            'Passport (valid)',
            'Academic transcripts and certificates',
            'Language test score (IELTS, TOEFL, etc.)',
            'Tuition fee receipt',
            'GIC (Guaranteed Investment Certificate) or bank statements',
            'Sponsorship letters or loan documents',
            'Statement of Purpose (SOP)',
            'Passport photos',
            'Medical examination (if required)',
            'Police clearance certificate (if required)',
            'Proof of ties to home country'
        ],
        'family-sponsorship': [
            'Passport and identity documents',
            'Marriage certificate or relationship proof',
            'Sponsor documents (Canadian citizen/permanent resident)',
            'Birth certificates for children',
            'Joint relationship evidence',
            'Police clearance certificates',
            'Medical examination results',
            'Financial capacity proof',
            'Photos'
        ],
        'visitor-visa': [
            'Passport',
            'Invitation letter (if applicable)',
            'Proof of financial capacity',
            'Travel itinerary',
            'Proof of ties to home country',
            'Photos'
        ],
        'provincial-nominee-program': [
            'Passport (valid and bio page)',
            'Provincial nomination certificate',
            'ECA (Educational Credential Assessment) report',
            'Language test results (IELTS, CELPIP, TEF)',
            'Work reference letters (detailed with duties, hours, salary)',
            'Payslips and employment contracts',
            'Police clearance certificates',
            'Medical examination results',
            'Education documents (degrees, diplomas, transcripts)',
            'Proof of settlement funds (bank statements)',
            'Provincial-specific documents',
            'Photos (as per IRCC specifications)'
        ],
        'work-permit': [
            'Passport (valid)',
            'LMIA (Labor Market Impact Assessment) or LMIA exemption proof',
            'Job offer letter and employment contract',
            'Employer compliance fee receipt',
            'Work permit application form',
            'Biometrics confirmation',
            'Police clearance certificate (if required)',
            'Medical examination (if required)',
            'Financial capacity proof',
            'Photos',
            'Supporting documents based on work permit category'
        ]
    },
    'united-kingdom': {
        'skilled-worker-visa': [
            'Passport (valid)',
            'CoS (Certificate of Sponsorship)',
            'Job offer letter and employment contract',
            'English test result (B1 level minimum)',
            'Qualification documents (degrees, professional certificates)',
            'Bank statements (maintenance funds)',
            'TB test certificate (if from specified countries)',
            'Criminal record certificate (if required)',
            'Photos (as per UKVI specifications)',
            'Sponsor license details'
        ],
        'student-visa': [
            'Passport (valid)',
            'CAS (Confirmation of Acceptance for Studies) letter',
            'Financial proof (bank statements showing tuition + living costs)',
            'Tuition fee receipt',
            'Academic transcripts and certificates',
            'English test result (IELTS, etc.)',
            'ATAS certificate (if required for certain courses)',
            'TB test certificate (if from specified countries)',
            'Parental consent letter (if under 18)',
            'Birth certificate (if under 18)',
            'Photos'
        ],
        'spouse-partner-visa': [
            'Passport and identity documents',
            'Marriage certificate or civil partnership',
            'Joint relationship evidence (bank accounts, utility bills, etc.)',
            'Sponsor documents (British citizen/settled person)',
            'Financial requirement proof (income threshold)',
            'Accommodation proof',
            'English test result (if required)',
            'Photos'
        ],
        'indefinite-leave-to-remain': [
            'Passport and all previous passports',
            'Proof of continuous residence',
            'Life in the UK test certificate',
            'Employment proof and payslips',
            'Financial documents',
            'English language proof',
            'Photos',
            'Police registration certificate (if applicable)'
        ],
        'visitor-visa': [
            'Passport',
            'Invitation letter (if applicable)',
            'Proof of financial capacity',
            'Travel itinerary',
            'Accommodation proof',
            'Photos'
        ],
        'health-care-worker-visa': [
            'Passport (valid)',
            'CoS (Certificate of Sponsorship)',
            'Job offer letter from NHS or approved healthcare provider',
            'English test result (B1 level minimum)',
            'Healthcare qualification documents',
            'Professional registration (if applicable)',
            'Bank statements (maintenance funds)',
            'TB test certificate (if from specified countries)',
            'Criminal record certificate (if required)',
            'Photos (as per UKVI specifications)'
        ],
        'graduate-visa': [
            'Passport (valid)',
            'Confirmation of UK degree completion',
            'Academic transcripts',
            'Tier 4 or Student visa reference number',
            'Bank statements showing maintenance funds',
            'Evidence of continuous study in UK',
            'ATAS certificate (if applicable)',
            'Photos',
            'Biometric residence permit (if applicable)'
        ]
    },
    'new-zealand': {
        'skilled-migrant-category': [
            'Passport (valid)',
            'Job offer letter and employment contract',
            'Degree certificates and NZQA assessment',
            'Work reference letters',
            'English test results',
            'Medical examination results',
            'Police clearance certificates',
            'Proof of funds',
            'Identity documents',
            'Photos'
        ],
        'student-visa': [
            'Letter of Acceptance from NZQA-approved institution',
            'Passport',
            'Academic transcripts',
            'Financial proof (bank statements, scholarship letters)',
            'English test results',
            'Health insurance proof',
            'Medical examination (if required)',
            'Police clearance (if required)',
            'Photos'
        ],
        'work-visa': [
            'Passport',
            'Job offer letter',
            'Qualifications and certificates',
            'Work experience evidence',
            'Medical examination',
            'Police clearance',
            'Photos'
        ],
        'partnership-visa': [
            'Passport',
            'Marriage certificate or relationship evidence',
            'Joint evidence of relationship',
            'Sponsor documents',
            'Medical examination',
            'Police clearance',
            'Photos'
        ],
        'visitor-visa': [
            'Passport',
            'Proof of funds',
            'Travel itinerary',
            'Proof of ties to home country',
            'Photos'
        ]
    },
    'united-states': {
        'h1b': [
            'Passport (valid)',
            'Form DS-160 confirmation page',
            'I-797 Approval Notice (H-1B petition approval)',
            'Job offer letter',
            'LCA (Labor Condition Application)',
            'Degree certificates and professional qualifications',
            'Payslips (from previous employment)',
            'Tax documents (if applicable)',
            'Employment reference letters',
            'Visa photos (as per US specifications)',
            'Appointment confirmation letter'
        ],
        'f1-student-visa': [
            'Passport (valid)',
            'I-20 Form from SEVP-approved institution',
            'SEVIS fee receipt',
            'DS-160 confirmation page',
            'Financial documents (bank statements, affidavits of support)',
            'Loan documents or scholarship letters (if applicable)',
            'Academic transcripts and test scores',
            'English proficiency proof (if required)',
            'Photos (as per US specifications)',
            'Appointment confirmation letter',
            'Proof of intent to return to home country'
        ],
        'b1-b2-visitor-visa': [
            'Passport',
            'DS-160 confirmation page',
            'Proof of travel purpose',
            'Financial capacity proof',
            'Proof of ties to home country',
            'Invitation letter (if visiting family/friends)',
            'Travel itinerary',
            'Photos',
            'Appointment confirmation'
        ],
        'l1-intracompany-transfer': [
            'Passport',
            'I-129S petition approval',
            'DS-160 confirmation',
            'Employment letters from both companies',
            'Company documents',
            'Photos',
            'Appointment confirmation'
        ],
        'employment-based-green-card': [
            'Passport',
            'I-140 approval (employer petition)',
            'Labor certification',
            'Degree certificates and qualifications',
            'Employment evidence',
            'Medical examination',
            'Police clearance certificates',
            'Financial documents',
            'Photos'
        ],
        'k1-fiance-visa': [
            'Passport',
            'I-129F approval',
            'Evidence of relationship',
            'Financial support documents (I-134)',
            'Meeting evidence',
            'Photos',
            'Medical examination',
            'Police clearance'
        ],
        'j1-exchange-visitor': [
            'Passport (valid)',
            'DS-2019 Form (Certificate of Eligibility)',
            'DS-160 confirmation page',
            'SEVIS fee receipt',
            'Program acceptance letter',
            'Financial documents',
            'English proficiency proof',
            'Medical insurance proof',
            'Photos (as per US specifications)',
            'Appointment confirmation letter'
        ],
        'o1-extraordinary-ability': [
            'Passport (valid)',
            'I-129 petition approval (O-1)',
            'DS-160 confirmation page',
            'Evidence of extraordinary ability (awards, publications, etc.)',
            'Employment offer letter',
            'Professional qualifications and credentials',
            'Support letters from experts',
            'Press articles and media coverage',
            'Photos',
            'Appointment confirmation'
        ]
    }
};

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
                                // New content is available
                                console.log('[PWA] New version available');
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

// Initialize client dashboard
function initializeClientDashboard() {
    console.log('🚀 Initializing client dashboard...');
    
    // Clear any previous state
    clearClientChecklistState();
    
    // Hide document checklist by default
    hideDocumentChecklist();
    
    // Load saved selections
    loadSavedSelections();
    
    // Load dashboard data
    loadDashboardData();
    
    // Ensure visa types are populated after a short delay to ensure DOM is ready
    setTimeout(function() {
        console.log('🔄 Ensuring visa types are populated...');
        ensureVisaTypesPopulated();
        console.log('✅ Visa types population check completed');
    }, 100);
    
    // Verify AI Agent is ready (Built-in AI - no API key needed)
    console.log('✅ AI Agent: Built-in chatbot ready - no API key required');
    
    console.log('✅ Client dashboard initialized');
}

// Load dashboard data
function loadDashboardData() {
    loadApplicationStatus();
    loadNextSteps();
    loadRecentActivity();
    updateCountryIllustrations();
}

// Load Application Status
function loadApplicationStatus() {
    const statusCard = document.querySelector('.dashboard-cards .card:first-child .card-content');
    if (!statusCard) return;
    
    // Get user's selections
    const country = localStorage.getItem('documentCountry') || '';
    const visaType = localStorage.getItem('documentVisaType') || '';
    const authority = localStorage.getItem('documentAuthority') || '';
    
    // Get uploaded documents
    const uploadedDocs = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
    const docCount = uploadedDocs.length;
    
    // Calculate progress based on selections and documents
    let progress = 0;
    let status = 'Not Started';
    let statusClass = 'not-started';
    let statusMessage = 'Please complete your selections and upload documents to begin your application.';
    
    if (country && visaType) {
        progress += 20; // Country and visa type selected
        status = 'In Progress';
        statusClass = 'in-progress';
        statusMessage = 'Your application is being prepared. Please continue uploading required documents.';
    }
    
    if (authority && (visaType === 'general-skilled-migration' || visaType.includes('skilled'))) {
        progress += 10; // Authority selected
    }
    
    // Calculate document progress
    const requiredDocs = getRequiredDocumentCount(country, visaType, authority);
    if (requiredDocs > 0) {
        const docProgress = Math.min((docCount / requiredDocs) * 70, 70);
        progress += docProgress;
    }
    
    if (progress >= 90) {
        status = 'Under Review';
        statusClass = 'under-review';
        statusMessage = 'Your application is being reviewed by our legal team.';
    } else if (progress >= 50) {
        status = 'In Progress';
        statusClass = 'in-progress';
        statusMessage = 'Your application is progressing well. Keep uploading documents.';
    } else if (progress > 0) {
        status = 'Started';
        statusClass = 'started';
        statusMessage = 'Your application process has begun. Please continue with document uploads.';
    }
    
    // Update status badge
    const statusBadge = statusCard.closest('.card').querySelector('.status-badge-animated');
    if (statusBadge) {
        statusBadge.textContent = status;
        statusBadge.className = `status-badge-animated status-${statusClass}`;
    }
    
    // Update progress bar
    const progressBar = statusCard.querySelector('.progress-bar-animated');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    // Update progress text
    const progressText = statusCard.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}% Complete`;
    }
    
    // Update message
    const message = statusCard.querySelector('p');
    if (message) {
        message.textContent = statusMessage;
    }
}

// Get required document count
function getRequiredDocumentCount(country, visaType, authority) {
    if (!country || !visaType) return 0;
    
    const requirements = DOCUMENT_REQUIREMENTS[country];
    if (!requirements) return 0;
    
    const visaReqs = requirements[visaType];
    if (!visaReqs || !Array.isArray(visaReqs)) return 0;
    
    return visaReqs.length;
}

// Load Next Steps
function loadNextSteps() {
    const nextStepsCard = document.querySelector('.dashboard-cards .card:nth-child(2) .card-content');
    if (!nextStepsCard) return;
    
    const steps = [];
    
    // Get user's selections
    const country = localStorage.getItem('documentCountry') || '';
    const visaType = localStorage.getItem('documentVisaType') || '';
    const authority = localStorage.getItem('documentAuthority') || '';
    
    // Step 1: Complete selections
    if (!country || !visaType) {
        steps.push({
            icon: 'fas fa-check-circle',
            text: 'Complete your country and visa type selection',
            link: '#documents',
            completed: false
        });
    } else if ((visaType === 'general-skilled-migration' || visaType.includes('skilled')) && !authority) {
        steps.push({
            icon: 'fas fa-check-circle',
            text: 'Select your skills assessment authority',
            link: '#documents',
            completed: false
        });
    }
    
    // Step 2: Upload documents
    const uploadedDocs = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
    const requiredDocs = getRequiredDocumentCount(country, visaType, authority);
    const remainingDocs = Math.max(0, requiredDocs - uploadedDocs.length);
    
    if (country && visaType) {
        if (remainingDocs > 0) {
            steps.push({
                icon: 'fas fa-upload',
                text: `Upload ${remainingDocs} remaining document${remainingDocs > 1 ? 's' : ''}`,
                link: '#documents',
                completed: false
            });
        } else if (uploadedDocs.length > 0) {
            steps.push({
                icon: 'fas fa-check-circle',
                text: 'All documents uploaded ✓',
                link: '#documents',
                completed: true
            });
        } else {
            steps.push({
                icon: 'fas fa-file-upload',
                text: 'Begin uploading required documents',
                link: '#documents',
                completed: false
            });
        }
    }
    
    // Step 3: Review documents
    if (uploadedDocs.length > 0) {
        steps.push({
            icon: 'fas fa-eye',
            text: 'Review uploaded documents',
            link: '#documents',
            completed: false
        });
    }
    
    // Step 4: Wait for review
    if (uploadedDocs.length >= requiredDocs && requiredDocs > 0) {
        steps.push({
            icon: 'fas fa-clock',
            text: 'Wait for legal team review',
            link: '#progress',
            completed: false
        });
    }
    
    // Display steps
    if (steps.length === 0) {
        nextStepsCard.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-list-check" style="font-size: 2rem; color: #D4AF37; margin-bottom: 1rem; display: block;"></i>
                <h4>No Next Steps Available</h4>
                <p>Next steps will appear here once you begin your application process.</p>
            </div>
        `;
    } else {
        nextStepsCard.innerHTML = `
            <ul class="next-steps-list" style="list-style: none; padding: 0; margin: 0;">
                ${steps.map((step, index) => `
                    <li style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; margin-bottom: 0.75rem; background: ${step.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(212, 175, 55, 0.1)'}; border-radius: 8px; border-left: 3px solid ${step.completed ? '#10b981' : '#D4AF37'};">
                        <i class="${step.icon}" style="color: ${step.completed ? '#10b981' : '#D4AF37'}; margin-top: 0.25rem;"></i>
                        <div style="flex: 1;">
                            <p style="margin: 0; font-weight: 500; color: ${step.completed ? '#10b981' : 'inherit'};">
                                ${step.text}
                            </p>
                            ${step.link ? `<a href="${step.link}" onclick="showSection('${step.link.replace('#', '')}'); return false;" style="font-size: 0.875rem; color: #D4AF37; text-decoration: none; margin-top: 0.25rem; display: inline-block;">View →</a>` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}

// Load Recent Activity
function loadRecentActivity() {
    const activityCard = document.querySelector('.dashboard-cards .card:nth-child(3) .card-content');
    if (!activityCard) return;
    
    // Get activities from localStorage
    let activities = JSON.parse(localStorage.getItem('clientActivities') || '[]');
    
    // If no activities, check for recent actions
    if (activities.length === 0) {
        activities = generateActivitiesFromUserActions();
    }
    
    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Limit to 5 most recent
    activities = activities.slice(0, 5);
    
    // Display activities
    if (activities.length === 0) {
        activityCard.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history" style="font-size: 2rem; color: #D4AF37; margin-bottom: 1rem; display: block;"></i>
                <h4>No Recent Activity</h4>
                <p>Your recent activity will appear here as you interact with the system.</p>
            </div>
        `;
    } else {
        activityCard.innerHTML = `
            <ul class="activity-list" style="list-style: none; padding: 0; margin: 0;">
                ${activities.map(activity => `
                    <li style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; margin-bottom: 0.75rem; background: rgba(212, 175, 55, 0.05); border-radius: 8px; border-left: 3px solid #D4AF37;">
                        <i class="${activity.icon}" style="color: #D4AF37; margin-top: 0.25rem;"></i>
                        <div style="flex: 1;">
                            <p style="margin: 0; font-weight: 500;">${activity.title}</p>
                            ${activity.description ? `<p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #666;">${activity.description}</p>` : ''}
                            <span style="font-size: 0.75rem; color: #999; margin-top: 0.5rem; display: block;">${formatActivityTime(activity.timestamp)}</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}

// Generate activities from user actions
function generateActivitiesFromUserActions() {
    const activities = [];
    
    // Check selections
    const country = localStorage.getItem('documentCountry');
    const visaType = localStorage.getItem('documentVisaType');
    const authority = localStorage.getItem('documentAuthority');
    
    if (country && visaType) {
        const countryName = country.charAt(0).toUpperCase() + country.slice(1).replace('-', ' ');
        const visaTypeName = VISA_TYPES_DATA[country]?.[visaType]?.name || visaType;
        
        activities.push({
            icon: 'fas fa-check-circle',
            title: `Selected ${countryName} - ${visaTypeName}`,
            description: 'Application pathway configured',
            timestamp: localStorage.getItem('selectionTimestamp') || new Date().toISOString(),
            type: 'selection'
        });
    }
    
    if (authority) {
        const authorityName = authority.toUpperCase().replace('-', ' ');
        activities.push({
            icon: 'fas fa-certificate',
            title: `Selected ${authorityName} as assessment authority`,
            description: 'Skills assessment authority chosen',
            timestamp: localStorage.getItem('authoritySelectionTimestamp') || new Date().toISOString(),
            type: 'selection'
        });
    }
    
    // Check document uploads
    const uploadedDocs = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
    if (uploadedDocs.length > 0) {
        uploadedDocs.forEach((doc, index) => {
            if (index < 3) { // Show only 3 most recent uploads
                activities.push({
                    icon: 'fas fa-file-upload',
                    title: `Uploaded ${doc.name || 'Document'}`,
                    description: 'Document added to application',
                    timestamp: doc.uploadedAt || new Date().toISOString(),
                    type: 'upload'
                });
            }
        });
    }
    
    return activities;
}

// Format activity time
function formatActivityTime(timestamp) {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diff = now - activityTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (days < 7) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
        return activityTime.toLocaleDateString();
    }
}

// Function to add activity (can be called from other parts of the app)
function addActivity(title, description, icon = 'fas fa-info-circle', type = 'info') {
    let activities = JSON.parse(localStorage.getItem('clientActivities') || '[]');
    
    activities.unshift({
        icon,
        title,
        description,
        timestamp: new Date().toISOString(),
        type
    });
    
    // Keep only last 50 activities
    activities = activities.slice(0, 50);
    
    localStorage.setItem('clientActivities', JSON.stringify(activities));
    
    // Reload activity display if on dashboard
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection && currentSection.id === 'dashboard') {
        loadRecentActivity();
    }
}

// Country-themed illustrations data
const COUNTRY_ILLUSTRATIONS = {
    'australia': {
        type: 'skyline',
        svg: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 60 L10 50 L20 55 L30 45 L40 50 L50 35 L60 45 L70 30 L80 40 L90 25 L100 35 L110 20 L120 30 L130 25 L140 35 L150 30 L160 40 L170 35 L180 45 L190 40 L200 50 L200 80 L0 80 Z" fill="url(#ausGrad)" opacity="0.6"/>
                <path d="M85 45 Q100 25 115 45" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>
                <path d="M90 50 Q100 30 110 50" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>
                <circle cx="30" cy="20" r="1.5" fill="rgba(255,255,255,0.5)"/>
                <circle cx="35" cy="18" r="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="38" cy="22" r="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="33" cy="24" r="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="37" cy="26" r="1" fill="rgba(255,255,255,0.5)"/>
                <defs>
                    <linearGradient id="ausGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(59,130,246,0.5);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(20,184,166,0.5);stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>`
    },
    'canada': {
        type: 'skyline',
        svg: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 55 L15 50 L25 55 L35 45 L45 50 L55 40 L65 45 L75 35 L85 40 L95 30 L105 35 L115 25 L125 30 L135 25 L145 30 L155 25 L165 30 L175 25 L185 30 L200 35 L200 80 L0 80 Z" fill="url(#canGrad)" opacity="0.6"/>
                <rect x="92" y="15" width="4" height="35" fill="rgba(255,255,255,0.5)"/>
                <rect x="90" y="12" width="8" height="5" fill="rgba(255,255,255,0.4)"/>
                <rect x="91" y="20" width="6" height="3" fill="rgba(255,255,255,0.3)"/>
                <path d="M30 15 Q32 18 35 15 Q32 20 30 22 Q28 20 25 15 Q28 18 30 15" fill="rgba(220,38,38,0.4)" stroke="rgba(220,38,38,0.5)" stroke-width="0.5"/>
                <defs>
                    <linearGradient id="canGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(59,130,246,0.5);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(147,51,234,0.5);stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>`
    },
    'united-kingdom': {
        type: 'skyline',
        svg: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 50 L10 45 L20 50 L30 40 L40 45 L50 35 L60 40 L70 30 L80 35 L90 25 L100 30 L110 20 L120 25 L130 20 L140 25 L150 20 L160 25 L170 20 L180 25 L190 20 L200 25 L200 80 L0 80 Z" fill="url(#ukGrad)" opacity="0.6"/>
                <rect x="85" y="15" width="6" height="30" fill="rgba(255,255,255,0.5)"/>
                <rect x="83" y="13" width="10" height="4" fill="rgba(255,255,255,0.4)"/>
                <rect x="86" y="22" width="4" height="2" fill="rgba(255,255,255,0.3)"/>
                <path d="M10 25 Q50 20 90 18 Q130 16 170 15" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none" stroke-dasharray="2,2"/>
                <circle cx="170" cy="15" r="2" fill="rgba(255,255,255,0.4)"/>
                <defs>
                    <linearGradient id="ukGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(147,51,234,0.5);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(20,184,166,0.5);stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>`
    },
    'new-zealand': {
        type: 'skyline',
        svg: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 55 L12 50 L22 55 L32 45 L42 50 L52 40 L62 45 L72 35 L82 40 L92 30 L102 35 L112 25 L122 30 L132 25 L142 30 L152 25 L162 30 L172 25 L182 30 L200 35 L200 80 L0 80 Z" fill="url(#nzGrad)" opacity="0.6"/>
                <rect x="95" y="12" width="3" height="38" fill="rgba(255,255,255,0.5)"/>
                <rect x="94" y="10" width="5" height="4" fill="rgba(255,255,255,0.4)"/>
                <circle cx="96.5" cy="25" r="2" fill="rgba(255,255,255,0.3)"/>
                <circle cx="25" cy="20" r="1.5" fill="rgba(255,255,255,0.6)"/>
                <circle cx="30" cy="18" r="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="33" cy="22" r="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="28" cy="24" r="1" fill="rgba(255,255,255,0.5)"/>
                <defs>
                    <linearGradient id="nzGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(20,184,166,0.5);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(59,130,246,0.5);stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>`
    },
    'united-states': {
        type: 'skyline',
        svg: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 50 L8 48 L15 52 L22 45 L30 50 L38 42 L45 48 L52 38 L60 45 L68 35 L75 42 L82 32 L90 38 L98 28 L105 35 L112 25 L120 32 L128 22 L135 28 L142 20 L150 25 L158 18 L165 22 L172 16 L180 20 L188 15 L195 18 L200 20 L200 80 L0 80 Z" fill="url(#usGrad)" opacity="0.6"/>
                <path d="M25 45 L28 35 L30 30 L28 35 L25 45" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>
                <circle cx="28" cy="28" r="2" fill="rgba(255,255,255,0.3)"/>
                <path d="M5 15 Q60 12 115 10 Q140 9 165 8" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none" stroke-dasharray="2,2"/>
                <path d="M165 8 L175 7" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>
                <circle cx="175" cy="7" r="2" fill="rgba(255,255,255,0.4)"/>
                <defs>
                    <linearGradient id="usGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(59,130,246,0.5);stop-opacity:1" />
                        <stop offset="50%" style="stop-color:rgba(147,51,234,0.5);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(20,184,166,0.5);stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>`
    }
};

// Update country illustrations based on selected country
function updateCountryIllustrations() {
    // Only show in dark theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    if (!isDarkTheme) {
        // Remove illustrations if light theme
        document.querySelectorAll('.country-illustration').forEach(el => el.remove());
        return;
    }
    
    const selectedCountry = localStorage.getItem('documentCountry') || '';
    const illustration = COUNTRY_ILLUSTRATIONS[selectedCountry];
    
    // Get all section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        // Remove existing illustration
        const existing = header.querySelector('.country-illustration');
        if (existing) existing.remove();
        
        // Add illustration if country is selected
        if (illustration && selectedCountry) {
            const illustrationDiv = document.createElement('div');
            illustrationDiv.className = 'country-illustration';
            illustrationDiv.innerHTML = illustration.svg;
            header.appendChild(illustrationDiv);
        }
    });
}

// Watch for theme changes and update illustrations
let themeObserver = null;
function observeThemeChanges() {
    if (themeObserver) return; // Already observing
    
    themeObserver = new MutationObserver(() => {
        updateCountryIllustrations();
    });
    
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// Initialize theme observation and illustrations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        observeThemeChanges();
        updateCountryIllustrations();
    });
} else {
    // DOM already loaded
    observeThemeChanges();
    updateCountryIllustrations();
}

// Load saved selections from localStorage
function loadSavedSelections() {
    const savedCountry = localStorage.getItem('documentCountry');
    const savedVisaType = localStorage.getItem('documentVisaType');
    const savedAuthority = localStorage.getItem('documentAuthority');
    
    if (savedCountry) {
        documentSelectionState.country = savedCountry;
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            countrySelect.value = savedCountry;
        }
    }
    
    if (savedVisaType) {
        documentSelectionState.visaType = savedVisaType;
        const visaTypeSelect = document.getElementById('visaTypeSelect');
        if (visaTypeSelect) {
            visaTypeSelect.value = savedVisaType;
        }
    }
    
    if (savedAuthority) {
        documentSelectionState.authority = savedAuthority;
        const authoritySelect = document.getElementById('authoritySelect');
        if (authoritySelect) {
            authoritySelect.value = savedAuthority;
        }
    }
}

// Handle country selection
function handleCountrySelection() {
    const countrySelect = document.getElementById('countrySelect');
    if (!countrySelect) {
        console.error('❌ Country select element not found');
        return;
    }
    
    const selectedCountry = countrySelect.value;
    
    console.log('🌍 Country selected:', selectedCountry);
    
    // Debug: Check available data
    if (typeof VISA_TYPES_DATA !== 'undefined' && VISA_TYPES_DATA) {
        console.log('✅ VISA_TYPES_DATA is available. Countries:', Object.keys(VISA_TYPES_DATA));
    } else {
        console.error('❌ VISA_TYPES_DATA is NOT defined or accessible!');
    }
    
    if (typeof VISA_TYPES !== 'undefined' && VISA_TYPES) {
        console.log('📋 VISA_TYPES available. Countries:', Object.keys(VISA_TYPES));
    } else {
        console.warn('⚠️ VISA_TYPES not available');
    }
    
    if (selectedCountry) {
        documentSelectionState.country = selectedCountry;
        localStorage.setItem('documentCountry', selectedCountry);
        localStorage.setItem('selectionTimestamp', new Date().toISOString());
        
        // Add activity
        const countryName = selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1).replace('-', ' ');
        addActivity(`Selected ${countryName}`, 'Country selection updated', 'fas fa-globe', 'selection');
        
        // Update illustrations
        updateCountryIllustrations();
        
        // Enable visa type selection
        const visaTypeSelect = document.getElementById('visaTypeSelect');
        if (visaTypeSelect) {
            visaTypeSelect.disabled = false;
            console.log('✅ Visa type selection enabled');
        } else {
            console.error('❌ Visa type select element not found');
            return;
        }
        
        // IMMEDIATELY Update visa type options - MULTIPLE ATTEMPTS
        console.log('🔄 Calling updateVisaTypeOptions for:', selectedCountry);
        
        // Call immediately
        updateVisaTypeOptions(selectedCountry);
        
        // Refresh dashboard
        loadDashboardData();
        
        // Call again after short delay to ensure it sticks
        setTimeout(function() {
            const visaTypeSelect = document.getElementById('visaTypeSelect');
            const optionCount = visaTypeSelect ? visaTypeSelect.options.length : 0;
            console.log('🔍 FIRST VERIFICATION (50ms): Dropdown has', optionCount, 'options');
            if (optionCount <= 1) {
                console.error('❌❌❌ DROPDOWN EMPTY - Retrying immediately...');
                updateVisaTypeOptions(selectedCountry);
            }
        }, 50);
        
        // Verify again after longer delay
        setTimeout(function() {
            const visaTypeSelect = document.getElementById('visaTypeSelect');
            const optionCount = visaTypeSelect ? visaTypeSelect.options.length : 0;
            console.log('🔍 SECOND VERIFICATION (200ms): Dropdown has', optionCount, 'options');
            if (optionCount <= 1) {
                console.error('❌❌❌ STILL EMPTY - Last attempt...');
                updateVisaTypeOptions(selectedCountry);
                
                // Final check - if still empty, add manual option
                setTimeout(function() {
                    if (visaTypeSelect && visaTypeSelect.options.length <= 1) {
                        console.error('❌❌❌ FINAL ATTEMPT - Adding manual test option');
                        const test = document.createElement('option');
                        test.value = 'manual-test';
                        test.textContent = 'MANUAL TEST - If you see this, dropdown works but data failed';
                        visaTypeSelect.appendChild(test);
                        console.error('✅✅✅ MANUAL TEST ADDED');
                    }
                }, 100);
            }
        }, 200);
        
        // Hide authority selection initially
        const authoritySection = document.getElementById('authority-selection');
        if (authoritySection) {
            authoritySection.style.display = 'none';
            console.log('✅ Authority section hidden initially');
        } else {
            console.log('❌ Authority section element not found');
        }
        
        // Hide checklist
        hideDocumentChecklist();
        
    } else {
        // Country deselected - clear visa types
        const visaTypeSelect = document.getElementById('visaTypeSelect');
        if (visaTypeSelect) {
            visaTypeSelect.innerHTML = '<option value="">Select Visa Type</option>';
            visaTypeSelect.disabled = true;
        }
        hideDocumentChecklist();
    }
}

// Update visa type options based on country - ABSOLUTE FINAL VERSION WITH HARDCODED DATA
function updateVisaTypeOptions(country) {
    console.log('🔄🔄🔄 updateVisaTypeOptions STARTING for country:', country);
    
    const visaTypeSelect = document.getElementById('visaTypeSelect');
    if (!visaTypeSelect) {
        console.error('❌❌❌ Visa type select element not found');
        return;
    }
    
    // Store current value if any
    const currentValue = visaTypeSelect.value;
    
    // FORCE CLEAR - Use multiple methods
    visaTypeSelect.innerHTML = '';
    while (visaTypeSelect.firstChild) {
        visaTypeSelect.removeChild(visaTypeSelect.firstChild);
    }
    
    // HARDCODED DATA MAP - This will ALWAYS work
    const HARDCODED_VISA_DATA = {
        'australia': [
            { id: 'general-skilled-migration', name: 'Skilled Migration (GSM)' },
            { id: 'student-visa', name: 'Student Visa' },
            { id: 'partner-visa', name: 'Partner Visa' },
            { id: 'parent-visa', name: 'Parent Visa' },
            { id: 'business-visa', name: 'Business Visa' },
            { id: 'family-visa', name: 'Family Visa' },
            { id: 'visit-visa', name: 'Visitor/Tourist Visa' }
        ],
        'canada': [
            { id: 'express-entry', name: 'Express Entry' },
            { id: 'provincial-nominee-program', name: 'Provincial Nominee Program' },
            { id: 'family-sponsorship', name: 'Family Sponsorship' },
            { id: 'study-permit', name: 'Student Visa' },
            { id: 'work-permit', name: 'Work Permit' },
            { id: 'visitor-visa', name: 'Visitor Visa' }
        ],
        'new-zealand': [
            { id: 'skilled-migrant-category', name: 'Skilled Migrant Resident' },
            { id: 'student-visa', name: 'Student Visa' },
            { id: 'visitor-visa', name: 'Visitor Visa' },
            { id: 'work-visa', name: 'Work Visa' },
            { id: 'partnership-visa', name: 'Partnership Visa' },
            { id: 'permanent-resident', name: 'Permanent Resident' }
        ],
        'united-kingdom': [
            { id: 'skilled-worker-visa', name: 'Skilled Worker Visa' },
            { id: 'student-visa', name: 'Student Visa' },
            { id: 'visitor-visa', name: 'Visitor Visa' },
            { id: 'spouse-partner-visa', name: 'Spouse/Partner Visa' },
            { id: 'indefinite-leave-to-remain', name: 'Indefinite Leave to Remain' },
            { id: 'health-care-worker-visa', name: 'Health Care Worker Visa' },
            { id: 'graduate-visa', name: 'Graduate Visa' }
        ],
        'united-states': [
            { id: 'h1b', name: 'Work Visa' },
            { id: 'f1-student-visa', name: 'Student Visa' },
            { id: 'b1-b2-visitor-visa', name: 'Visitor Visa' },
            { id: 'l1-intracompany-transfer', name: 'Intra-company Transfer Visa' },
            { id: 'employment-based-green-card', name: 'Employment-Based Green Card' },
            { id: 'j1-exchange-visitor', name: 'Exchange Visitor Visa' },
            { id: 'o1-extraordinary-ability', name: 'Extraordinary Ability Visa' },
            { id: 'k1-fiance-visa', name: 'Fiancé Visa' }
        ]
    };
    
    // Add placeholder FIRST
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select Visa Type';
    visaTypeSelect.appendChild(placeholder);
    
    // USE HARDCODED DATA FIRST (always works)
    let visaList = HARDCODED_VISA_DATA[country];
    
    if (!visaList) {
        console.error('❌ Country not in hardcoded data:', country);
        // Try to get from VISA_TYPES_DATA or VISA_TYPES
        try {
            if (window.VISA_TYPES_DATA && window.VISA_TYPES_DATA[country]) {
                const countryData = window.VISA_TYPES_DATA[country];
                visaList = Object.keys(countryData).map(id => ({
                    id: id,
                    name: countryData[id].name || id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                }));
                console.log('✅ Using window.VISA_TYPES_DATA');
            } else if (VISA_TYPES_DATA && VISA_TYPES_DATA[country]) {
                const countryData = VISA_TYPES_DATA[country];
                visaList = Object.keys(countryData).map(id => ({
                    id: id,
                    name: countryData[id].name || id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                }));
                console.log('✅ Using VISA_TYPES_DATA');
            } else if (window.VISA_TYPES && window.VISA_TYPES[country]) {
                visaList = window.VISA_TYPES[country].map(id => ({
                    id: id,
                    name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                }));
                console.log('✅ Using window.VISA_TYPES');
            } else if (VISA_TYPES && VISA_TYPES[country]) {
                visaList = VISA_TYPES[country].map(id => ({
                    id: id,
                    name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                }));
                console.log('✅ Using VISA_TYPES');
            }
        } catch (e) {
            console.error('❌ Error accessing data sources:', e);
        }
    } else {
        console.log('✅✅✅ Using HARDCODED data for', country);
    }
    
    // Add all visa types
    if (visaList && Array.isArray(visaList) && visaList.length > 0) {
        console.log('✅✅✅ Adding', visaList.length, 'visa types');
        visaList.forEach(visa => {
            const opt = document.createElement('option');
            opt.value = visa.id;
            opt.textContent = visa.name;
            visaTypeSelect.appendChild(opt);
            console.log('✅ Added:', visa.id, '->', visa.name);
        });
    } else {
        console.error('❌❌❌ NO VISA LIST FOUND - Adding emergency option');
        const emergency = document.createElement('option');
        emergency.value = 'error';
        emergency.textContent = 'ERROR - No visa types found for ' + country;
        visaTypeSelect.appendChild(emergency);
    }
    
    visaTypeSelect.disabled = false;
    
    // VERIFY
    const finalCount = visaTypeSelect.options.length - 1;
    console.log('✅✅✅ FINAL COUNT:', finalCount, 'options');
    
    // Log all options for debugging
    console.log('🔍 ALL OPTIONS:');
    for (let i = 0; i < visaTypeSelect.options.length; i++) {
        console.log('  [' + i + ']', visaTypeSelect.options[i].textContent);
    }
    
    // Restore value
    if (currentValue && finalCount > 0) {
        visaTypeSelect.value = currentValue;
    }
}

// Expose functions and data globally
window.updateVisaTypeOptions = updateVisaTypeOptions;
window.handleCountrySelection = handleCountrySelection;
window.handleVisaTypeSelection = handleVisaTypeSelection;
window.handleAuthoritySelection = handleAuthoritySelection;
window.VISA_TYPES = VISA_TYPES;
window.VISA_TYPES_DATA = VISA_TYPES_DATA;
window.DOCUMENT_REQUIREMENTS = DOCUMENT_REQUIREMENTS;

// Handle visa type selection
function handleVisaTypeSelection() {
    const visaSelect = document.getElementById('visaTypeSelect');
    const selectedVisaType = visaSelect.value;
    
    console.log('📋 Visa type selected:', selectedVisaType);
    
    if (selectedVisaType) {
        documentSelectionState.visaType = selectedVisaType;
        localStorage.setItem('documentVisaType', selectedVisaType);
        
        // Add activity
        const country = documentSelectionState.country;
        const visaData = country && VISA_TYPES_DATA[country] ? VISA_TYPES_DATA[country][selectedVisaType] : null;
        const visaTypeName = visaData ? visaData.name : selectedVisaType;
        if (country) {
            const countryName = country.charAt(0).toUpperCase() + country.slice(1).replace('-', ' ');
            addActivity(`Selected ${countryName} - ${visaTypeName}`, 'Visa type selection updated', 'fas fa-file-alt', 'selection');
        }
        
        // Get visa type metadata
        const requiresAuthority = visaData ? visaData.requiresAuthority : false;
        
        console.log('📋 Visa type requires authority:', requiresAuthority);
        
            const authoritySection = document.getElementById('authority-selection');
        const authoritySelect = document.getElementById('authoritySelect');
        
        if (requiresAuthority) {
            // Show authority selection section
            console.log('✅ Visa type requires authority - showing skill assessment authority section');
            if (authoritySection) {
                authoritySection.style.display = 'block';
                console.log('✅ Authority section shown');
            }
                if (authoritySelect) {
                    authoritySelect.disabled = false;
                authoritySelect.required = true;
                console.log('✅ Authority select enabled and required');
            }
            // Clear authority selection to force user to select
            if (authoritySelect) {
                authoritySelect.value = '';
                documentSelectionState.authority = null;
                localStorage.removeItem('documentAuthority');
            }
            // Hide document checklist until authority is selected
            hideDocumentChecklist();
        } else {
            // Hide authority selection section (but keep it in DOM as requested)
            console.log('✅ Visa type does not require authority - hiding authority section');
            if (authoritySection) {
                authoritySection.style.display = 'none';
                console.log('✅ Authority section hidden');
            }
                if (authoritySelect) {
                    authoritySelect.disabled = true;
                authoritySelect.required = false;
                    authoritySelect.value = ''; // Clear selection
                documentSelectionState.authority = null;
                localStorage.removeItem('documentAuthority');
                    console.log('✅ Authority select disabled and cleared');
            }
            
            // For non-authority visas, show visa-specific upload interface immediately if country is selected
            if (country) {
                console.log('📋 Showing visa-specific upload interface for:', selectedVisaType);
                showVisaSpecificUploadInterface(selectedVisaType);
            } else {
                hideDocumentChecklist();
            }
        }
    } else {
        // No visa type selected
        hideDocumentChecklist();
        if (authoritySection) authoritySection.style.display = 'none';
    }
}

// Handle authority selection
function handleAuthoritySelection() {
    console.log('🏛️ Authority selection triggered');
    
    const authoritySelect = document.getElementById('authoritySelect');
    if (!authoritySelect) {
        console.error('❌ Authority select element not found');
        return;
    }
    
    const selectedAuthority = authoritySelect.value;
    console.log('🏛️ Authority selected:', selectedAuthority);
    
    if (selectedAuthority) {
        documentSelectionState.authority = selectedAuthority;
        localStorage.setItem('documentAuthority', selectedAuthority);
        localStorage.setItem('authoritySelectionTimestamp', new Date().toISOString());
        
        // Add activity
        const authorityName = selectedAuthority.toUpperCase().replace('-', ' ');
        addActivity(`Selected ${authorityName} as assessment authority`, 'Skills assessment authority chosen', 'fas fa-certificate', 'selection');
        
        // Get current selections
        const country = documentSelectionState.country;
        const visaType = documentSelectionState.visaType;
        
        console.log('📋 Current selections:', { country, visaType, selectedAuthority });
        // Show authority-specific upload interface immediately
        showVisaSpecificUploadInterface(visaType, selectedAuthority);
        
        // Refresh dashboard
        loadDashboardData();
    } else {
        console.log('❌ Not all selections complete yet');
        console.log('📋 Missing selections:', { country, visaType, selectedAuthority });
        // Ensure checklist is hidden if selections incomplete
        hideDocumentChecklist();
        // Refresh dashboard
        loadDashboardData();
    }
}


// Hide document checklist
function hideDocumentChecklist() {
    const container = document.getElementById('documentChecklistContainer');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
        console.log('✅ Document checklist hidden');
    }
}

// Generate upload interface from DOCUMENT_REQUIREMENTS
function generateUploadInterfaceFromRequirements(country, visaType, authority = null) {
    const countryRequirements = DOCUMENT_REQUIREMENTS[country];
    if (!countryRequirements) {
        console.warn('⚠️ No document requirements found for country:', country);
        return null;
    }
    
    const visaRequirements = countryRequirements[visaType];
    if (!visaRequirements || !Array.isArray(visaRequirements)) {
        console.warn('⚠️ No document requirements found for visa type:', visaType);
        return null;
    }
    
    // Get visa type name
    const visaData = VISA_TYPES_DATA[country] && VISA_TYPES_DATA[country][visaType];
    const visaName = visaData ? visaData.name : visaType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let html = `
        <div class="visa-upload-container glass-panel">
            <div class="upload-header">
                <h2>${visaName} - Document Upload</h2>
                <p>Please upload the required documents for your ${visaName} application</p>
            </div>
            
            <div class="document-categories">
                <div class="document-category glass-panel">
                    <div class="category-header">
                        <i class="fas fa-file-alt"></i>
                        <h3>Required Documents</h3>
                        <span class="category-status">Required</span>
                    </div>
                    <div class="upload-fields">
    `;
    
    // Generate upload field for each required document
    visaRequirements.forEach((docName, index) => {
        const fieldId = `doc_${visaType}_${index}`;
        html += `
            <div class="upload-field">
                <label for="${fieldId}">
                    <i class="fas fa-file-pdf"></i> ${docName}
                </label>
                <div class="file-upload-zone glass" onclick="document.getElementById('${fieldId}').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p class="upload-zone-text">Click to Upload</p>
                    <p class="upload-zone-subtext">PDF, JPG, PNG up to 10MB</p>
                </div>
                <input type="file" id="${fieldId}" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" 
                       onchange="handleFileSelection(event, '${fieldId}')">
                <div class="uploaded-files" id="${fieldId}_files"></div>
            </div>
        `;
    });
    
    html += `
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitAllDocuments()">
                    <i class="fas fa-check"></i> Submit All Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
    
    return html;
}

// NEW VISA-SPECIFIC DOCUMENT UPLOAD SYSTEM
function showVisaSpecificUploadInterface(visaType, authority = null) {
    console.log('📋 Showing visa-specific upload interface for:', visaType, authority ? `with authority: ${authority}` : '');
    
    const container = document.getElementById('documentChecklistContainer');
    if (!container) {
        console.error('❌ Upload container not found');
        return;
    }
    
    // Check if all required selections are complete
    const country = documentSelectionState.country;
    if (!country) {
        console.warn('⚠️ Country not selected - hiding documents');
        hideDocumentChecklist();
        return;
    }
    
    if (!visaType) {
        console.warn('⚠️ Visa type not selected - hiding documents');
        hideDocumentChecklist();
        return;
    }
    
    // Check if authority is required
    const visaData = VISA_TYPES_DATA[country] && VISA_TYPES_DATA[country][visaType];
    const requiresAuthority = visaData ? visaData.requiresAuthority : false;
    
    if (requiresAuthority && !authority) {
        // Show message to select authority
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px;">
                <i class="fas fa-info-circle" style="font-size: 48px; color: #007bff; margin-bottom: 20px;"></i>
                <h3 style="color: #007bff; margin-bottom: 15px;">Please Select Skill Assessment Authority</h3>
                <p style="color: #6c757d;">Choose your skill assessment authority to see the specific document requirements.</p>
            </div>
        `;
        container.style.display = 'block';
        console.log('⚠️ Authority required but not selected - showing message');
        return;
    }
    
    // Clear previous content
    container.innerHTML = '';
    container.style.display = 'block';
    
    let uploadHTML = '';
    
    // Try to generate from DOCUMENT_REQUIREMENTS first
    uploadHTML = generateUploadInterfaceFromRequirements(country, visaType, authority);
    
    // Check if uploadHTML was successfully generated
    const hasUploadHTML = uploadHTML && uploadHTML.trim() !== '' && uploadHTML.trim() !== 'null';
    console.log('📋 generateUploadInterfaceFromRequirements result:', hasUploadHTML ? 'SUCCESS - Using DOCUMENT_REQUIREMENTS' : 'FAILED - will use fallback');
    
    // If no requirements found, fallback to existing specific functions
    if (!hasUploadHTML) {
        console.log('📋 Using specific upload interface functions as fallback');
    
    // EXACT CONDITIONAL LOGIC AS REQUESTED
    if (visaType === 'general-skilled-migration') {
        if (authority) {
            // SHOW GSM authority-specific detailed documents
            uploadHTML = generateGSMUploadInterface(authority);
            console.log('✅ Showing GSM authority-specific documents for:', authority);
        } else {
            // SHOW message 'Please select skill assessment authority'
            uploadHTML = `
                <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px;">
                    <i class="fas fa-info-circle" style="font-size: 48px; color: #007bff; margin-bottom: 20px;"></i>
                    <h3 style="color: #007bff; margin-bottom: 15px;">Please Select Skill Assessment Authority</h3>
                    <p style="color: #6c757d;">Choose your skill assessment authority to see the specific document requirements.</p>
                </div>
            `;
            console.log('⚠️ GSM selected but no authority - showing message');
        }
    } else if (visaType === 'student-visa') {
        // SHOW student visa documents only
        uploadHTML = generateStudentVisaUploadInterface();
        console.log('✅ Showing student visa documents only');
    } else if (visaType === 'partner-visa') {
        // SHOW partner visa documents only
        uploadHTML = generatePartnerVisaUploadInterface();
        console.log('✅ Showing partner visa documents only');
    } else if (visaType === 'parent-visa') {
        // SHOW parent visa documents only
        uploadHTML = generateParentVisaUploadInterface();
        console.log('✅ Showing parent visa documents only');
    } else if (visaType === 'business-visa') {
        // SHOW business visa documents only
        uploadHTML = generateBusinessVisaUploadInterface();
        console.log('✅ Showing business visa documents only');
    } else if (visaType === 'family-visa') {
        // SHOW family visa documents only
        uploadHTML = generateFamilyVisaUploadInterface();
        console.log('✅ Showing family visa documents only');
    } else if (visaType === 'visit-visa') {
        // SHOW visit visa documents only (Australia)
        uploadHTML = generateVisitVisaUploadInterface();
        console.log('✅ Showing visit visa documents only');
    } else if (visaType === 'express-entry') {
        // SHOW Canada Express Entry (PR) documents
        uploadHTML = generateCanadaExpressEntryUploadInterface();
        console.log('✅ Showing Canada Express Entry documents');
    } else if (visaType === 'study-permit') {
        // SHOW Canada Study Permit documents
        uploadHTML = generateCanadaStudyPermitUploadInterface();
        console.log('✅ Showing Canada Study Permit documents');
    } else if (visaType === 'provincial-nominee-program') {
        // SHOW Canada Provincial Nominee Program documents (using Express Entry structure)
        uploadHTML = generateCanadaExpressEntryUploadInterface();
        console.log('✅ Showing Canada PNP documents');
    } else if (visaType === 'family-sponsorship') {
        // SHOW Canada Family Sponsorship documents
        uploadHTML = generateCanadaFamilySponsorshipUploadInterface();
        console.log('✅ Showing Canada Family Sponsorship documents');
    } else if (visaType === 'work-permit') {
        // SHOW Canada Work Permit documents
        uploadHTML = generateCanadaWorkPermitUploadInterface();
        console.log('✅ Showing Canada Work Permit documents');
    } else if (visaType === 'visitor-visa' && documentSelectionState.country === 'canada') {
        // SHOW Canada Visitor/Tourist Visa documents
        uploadHTML = generateCanadaVisitorVisaUploadInterface();
        console.log('✅ Showing Canada Visitor Visa documents');
    } else if (visaType === 'skilled-migrant-category') {
        // SHOW New Zealand Skilled Migrant Category documents
        uploadHTML = generateNZSkilledMigrantUploadInterface();
        console.log('✅ Showing NZ Skilled Migrant Category documents');
    } else if (visaType === 'student-visa' && documentSelectionState.country === 'new-zealand') {
        // SHOW New Zealand Student Visa documents
        uploadHTML = generateNZStudentVisaUploadInterface();
        console.log('✅ Showing NZ Student Visa documents');
    } else if (visaType === 'visitor-visa' && documentSelectionState.country === 'new-zealand') {
        // SHOW New Zealand Visitor/Tourist Visa documents
        uploadHTML = generateNZVisitorVisaUploadInterface();
        console.log('✅ Showing NZ Visitor Visa documents');
    } else if (visaType === 'work-visa') {
        // SHOW New Zealand Work Visa documents
        uploadHTML = generateNZWorkVisaUploadInterface();
        console.log('✅ Showing NZ Work Visa documents');
    } else if (visaType === 'partnership-visa') {
        // SHOW New Zealand Partnership Visa documents
        uploadHTML = generateNZPartnershipVisaUploadInterface();
        console.log('✅ Showing NZ Partnership Visa documents');
    } else if (visaType === 'permanent-resident') {
        // SHOW New Zealand Permanent Resident Visa documents
        uploadHTML = generateNZPermanentResidentUploadInterface();
        console.log('✅ Showing NZ Permanent Resident Visa documents');
    } else if (visaType === 'skilled-worker-visa') {
        // SHOW UK Skilled Worker Visa documents
        uploadHTML = generateUKSkilledWorkerUploadInterface();
        console.log('✅ Showing UK Skilled Worker Visa documents');
    } else if (visaType === 'student-visa' && documentSelectionState.country === 'united-kingdom') {
        // SHOW UK Student Visa documents
        uploadHTML = generateUKStudentVisaUploadInterface();
        console.log('✅ Showing UK Student Visa documents');
    } else if (visaType === 'visitor-visa' && documentSelectionState.country === 'united-kingdom') {
        // SHOW UK Visitor/Tourist Visa documents
        uploadHTML = generateUKVisitorVisaUploadInterface();
        console.log('✅ Showing UK Visitor Visa documents');
    } else if (visaType === 'spouse-partner-visa') {
        // SHOW UK Spouse/Partner Visa documents
        uploadHTML = generateUKSpousePartnerUploadInterface();
        console.log('✅ Showing UK Spouse/Partner Visa documents');
    } else if (visaType === 'indefinite-leave-to-remain') {
        // SHOW UK Indefinite Leave to Remain documents
        uploadHTML = generateUKILRUploadInterface();
        console.log('✅ Showing UK ILR documents');
    } else if (visaType === 'health-care-worker-visa') {
        // SHOW UK Health and Care Worker Visa documents
        uploadHTML = generateUKHealthCareWorkerUploadInterface();
        console.log('✅ Showing UK Health and Care Worker Visa documents');
    } else if (visaType === 'graduate-visa') {
        // SHOW UK Graduate Visa documents
        uploadHTML = generateUKGraduateVisaUploadInterface();
        console.log('✅ Showing UK Graduate Visa documents');
    } else if (visaType === 'h1b') {
        // SHOW US H-1B documents
        uploadHTML = generateUSH1BUploadInterface();
        console.log('✅ Showing US H-1B documents');
    } else if (visaType === 'f1-student-visa') {
        // SHOW US F-1 Student Visa documents
        uploadHTML = generateUSF1UploadInterface();
        console.log('✅ Showing US F-1 Student Visa documents');
    } else if (visaType === 'b1-b2-visitor-visa') {
        // SHOW US B1/B2 Visitor/Tourist Visa documents
        uploadHTML = generateUSB1B2UploadInterface();
        console.log('✅ Showing US B1/B2 Visitor/Tourist Visa documents');
    } else if (visaType === 'l1-intracompany-transfer') {
        // SHOW US L-1 Intracompany Transfer Visa documents
        uploadHTML = generateUSL1UploadInterface();
        console.log('✅ Showing US L-1 documents');
    } else if (visaType === 'employment-based-green-card') {
        // SHOW US Employment-Based Green Card documents
        uploadHTML = generateUSEmploymentBasedUploadInterface();
        console.log('✅ Showing US Employment-Based Green Card documents');
    } else if (visaType === 'j1-exchange-visitor') {
        // SHOW US J-1 Exchange Visitor documents
        uploadHTML = generateUSJ1UploadInterface();
        console.log('✅ Showing US J-1 documents');
    } else if (visaType === 'o1-extraordinary-ability') {
        // SHOW US O-1 Extraordinary Ability documents
        uploadHTML = generateUSO1UploadInterface();
        console.log('✅ Showing US O-1 documents');
    } else if (visaType === 'k1-fiance-visa') {
        // SHOW US K-1 Fiancé(e) Visa documents
        uploadHTML = generateUSK1UploadInterface();
        console.log('✅ Showing US K-1 documents');
    } else {
        // Unknown visa type
        uploadHTML = `
            <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ffc107; margin-bottom: 20px;"></i>
                <h3 style="color: #ffc107; margin-bottom: 15px;">Document Upload Not Available</h3>
                <p style="color: #6c757d;">Document upload interface is not available for this visa type.</p>
            </div>
        `;
        console.log('❌ Unknown visa type:', visaType);
        }
    } // End of if (!uploadHTML) fallback
    
    // If still no uploadHTML, try one more direct lookup
    if (!uploadHTML || uploadHTML.trim() === '' || uploadHTML.trim() === 'null') {
        console.warn('⚠️ No upload interface generated, attempting direct DOCUMENT_REQUIREMENTS lookup');
        const countryReq = DOCUMENT_REQUIREMENTS[country];
        if (countryReq && countryReq[visaType] && Array.isArray(countryReq[visaType]) && countryReq[visaType].length > 0) {
            console.log('✅ Found requirements in DOCUMENT_REQUIREMENTS, generating interface directly');
            uploadHTML = generateUploadInterfaceFromRequirements(country, visaType, authority);
        }
    }
    
    // Final check - if still no uploadHTML, show helpful error message
    const finalCheck = uploadHTML && uploadHTML.trim() !== '' && uploadHTML.trim() !== 'null';
    if (!finalCheck) {
        const visaData = VISA_TYPES_DATA[country] && VISA_TYPES_DATA[country][visaType];
        const visaName = visaData ? visaData.name : visaType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        uploadHTML = `
            <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ffc107; margin-bottom: 20px;"></i>
                <h3 style="color: #ffc107; margin-bottom: 15px;">Document Upload Interface Not Available</h3>
                <p style="color: #6c757d; margin-bottom: 20px;">Document requirements for ${visaName} are currently being configured.</p>
                <p style="color: #6c757d;">Please contact support or try selecting a different visa type.</p>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 20px;">
                    <i class="fas fa-refresh"></i> Refresh Page
                </button>
            </div>
        `;
        console.error('❌ Failed to generate upload interface for:', visaType, 'in country:', country);
        console.error('❌ DOCUMENT_REQUIREMENTS check:', DOCUMENT_REQUIREMENTS[country] ? 'country exists' : 'country missing', DOCUMENT_REQUIREMENTS[country] && DOCUMENT_REQUIREMENTS[country][visaType] ? '- visa type found' : '- visa type missing');
    }
    
    container.innerHTML = uploadHTML;
    
    // Add event listeners for file upload zones
    setupFileUploadListeners();
    
    console.log('✅ Visa-specific upload interface displayed');
}

// Generate GSM authority-specific detailed upload interface
function generateGSMUploadInterface(authority) {
    const authorityName = authority.toUpperCase();
    
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-upload"></i> ${authorityName} Document Upload</h2>
                <p>Upload your required documents for ${authorityName} skills assessment</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="gsmProgressBar"></div>
                    <span class="progress-text" id="gsmProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Educational Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Educational Documents</h3>
                        <span class="category-status" id="educationStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Degree Certificates</label>
                            <div class="file-upload-zone" data-field="degree-certificates">
                                <i class="fas fa-certificate"></i>
                                <p>Upload degree certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="degree-certificates-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Academic Transcripts</label>
                            <div class="file-upload-zone" data-field="transcripts">
                                <i class="fas fa-scroll"></i>
                                <p>Upload official transcripts</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="transcripts-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Year-by-Year Marksheets</label>
                            <div class="file-upload-zone" data-field="marksheets">
                                <i class="fas fa-list-alt"></i>
                                <p>Upload year-by-year marksheets</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="marksheets-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Syllabus Documents</label>
                            <div class="file-upload-zone" data-field="syllabus">
                                <i class="fas fa-book"></i>
                                <p>Upload syllabus documents (for non-accredited qualifications)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="syllabus-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Employment Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-briefcase"></i>
                        <h3>Employment Documents</h3>
                        <span class="category-status" id="employmentStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Employment Reference Letters</label>
                            <div class="file-upload-zone" data-field="employment-letters">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload detailed employment reference letters</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="employment-letters-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Payslips</label>
                            <div class="file-upload-zone" data-field="payslips">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload month-by-month payslips</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="payslips-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Bank Statements</label>
                            <div class="file-upload-zone" data-field="bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing salary credits</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Employment Contracts</label>
                            <div class="file-upload-zone" data-field="employment-contracts">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload employment contracts and agreements</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="employment-contracts-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Resignation/Relieving Letters</label>
                            <div class="file-upload-zone" data-field="resignation-letters">
                                <i class="fas fa-handshake"></i>
                                <p>Upload resignation and relieving letters</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="resignation-letters-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Professional Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-tie"></i>
                        <h3>Professional Documents</h3>
                        <span class="category-status" id="professionalStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Skills Assessment Letter</label>
                            <div class="file-upload-zone" data-field="skills-assessment">
                                <i class="fas fa-award"></i>
                                <p>Upload ${authorityName} skills assessment letter</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="skills-assessment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Professional Registration</label>
                            <div class="file-upload-zone" data-field="professional-registration">
                                <i class="fas fa-id-card"></i>
                                <p>Upload professional registration certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="professional-registration-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>CPD Records</label>
                            <div class="file-upload-zone" data-field="cpd-records">
                                <i class="fas fa-chart-line"></i>
                                <p>Upload Continuing Professional Development records</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="cpd-records-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Identity & Character Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity & Character Documents</h3>
                        <span class="category-status" id="identityStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport Bio Page</label>
                            <div class="file-upload-zone" data-field="passport-bio">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport bio page</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="passport-bio-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificate</label>
                            <div class="file-upload-zone" data-field="birth-certificate">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="birth-certificate-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearances</label>
                            <div class="file-upload-zone" data-field="police-clearances">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearances from all countries</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="police-clearances-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination Results</label>
                            <div class="file-upload-zone" data-field="medical-exam">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="medical-exam-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitGSMDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Student Visa upload interface
function generateStudentVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-graduation-cap"></i> Student Visa Document Upload</h2>
                <p>Upload your required documents for Australian student visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="studentProgressBar"></div>
                    <span class="progress-text" id="studentProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Study Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-book-open"></i>
                        <h3>Study Documents</h3>
                        <span class="category-status" id="studyStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Confirmation of Enrolment (CoE)</label>
                            <div class="file-upload-zone" data-field="coe">
                                <i class="fas fa-certificate"></i>
                                <p>Upload CoE from your Australian education provider</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="coe-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Offer Letter from Educational Institution</label>
                            <div class="file-upload-zone" data-field="offer-letter">
                                <i class="fas fa-envelope-open"></i>
                                <p>Upload offer letter from your Australian education provider</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="offer-letter-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Academic Transcripts and Certificates</label>
                            <div class="file-upload-zone" data-field="academic-transcripts">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload academic transcripts and certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="academic-transcripts-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>OSHC Documentation</label>
                            <div class="file-upload-zone" data-field="oshc">
                                <i class="fas fa-heartbeat"></i>
                                <p>Upload Overseas Student Health Cover policy</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="oshc-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Documents</h3>
                        <span class="category-status" id="financialStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Financial Proof (Bank Statements)</label>
                            <div class="file-upload-zone" data-field="financial-proof">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing sufficient funds</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="financial-proof-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Loan Documents or Scholarship Letters</label>
                            <div class="file-upload-zone" data-field="loan-scholarship">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload loan documents or scholarship letters (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="loan-scholarship-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsor Documents and Statutory Declarations</label>
                            <div class="file-upload-zone" data-field="sponsor-documents">
                                <i class="fas fa-handshake"></i>
                                <p>Upload sponsor documents and statutory declarations (if sponsored)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="sponsor-documents-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Language and Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Language and Identity Documents</h3>
                        <span class="category-status" id="identityStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>English Test Score (IELTS, TOEFL, PTE, etc.)</label>
                            <div class="file-upload-zone" data-field="english-test">
                                <i class="fas fa-language"></i>
                                <p>Upload English test score results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="english-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport (Valid with Sufficient Validity)</label>
                            <div class="file-upload-zone" data-field="student-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport with sufficient validity</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="student-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Statement of Purpose (SOP)</label>
                            <div class="file-upload-zone" data-field="gte-statement">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload Statement of Purpose explaining genuine temporary entrant</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="gte-statement-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport Photos</label>
                            <div class="file-upload-zone" data-field="passport-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload passport photos (as per specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="passport-photos-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health and Character Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heartbeat"></i>
                        <h3>Health and Character Documents</h3>
                        <span class="category-status" id="healthStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Health Examination Results</label>
                            <div class="file-upload-zone" data-field="health-examination">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload health examination results (if required)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="health-examination-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificate</label>
                            <div class="file-upload-zone" data-field="police-clearance">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificate (if required)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="police-clearance-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitStudentDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Partner Visa upload interface
function generatePartnerVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-heart"></i> Partner Visa Document Upload</h2>
                <p>Upload your required documents for Australian partner visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="partnerProgressBar"></div>
                    <span class="progress-text" id="partnerProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="identityStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport and Identity Documents</label>
                            <div class="file-upload-zone" data-field="partner-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport and identity documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="partner-passport-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Relationship Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heart"></i>
                        <h3>Relationship Documents</h3>
                        <span class="category-status" id="relationshipStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Marriage Certificate or Relationship Evidence</label>
                            <div class="file-upload-zone" data-field="marriage-certificate">
                                <i class="fas fa-certificate"></i>
                                <p>Upload official marriage certificate or relationship evidence</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="marriage-certificate-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Joint Relationship Evidence</label>
                            <div class="file-upload-zone" data-field="joint-evidence">
                                <i class="fas fa-handshake"></i>
                                <p>Upload joint bank accounts, leases, photos, utility bills, etc.</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="joint-evidence-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Character References</label>
                            <div class="file-upload-zone" data-field="character-references">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload character references supporting your relationship</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="character-references-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Sponsor Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-friends"></i>
                        <h3>Sponsor Documents</h3>
                        <span class="category-status" id="sponsorStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Sponsor Documents (Australian Citizen/PR)</label>
                            <div class="file-upload-zone" data-field="sponsor-documents">
                                <i class="fas fa-certificate"></i>
                                <p>Upload sponsor's Australian citizenship or permanent residency documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="sponsor-documents-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial and Supporting Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial and Supporting Documents</h3>
                        <span class="category-status" id="financialStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Financial Capacity Proof</label>
                            <div class="file-upload-zone" data-field="financial-capacity">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements and financial capacity proof</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="financial-capacity-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health and Character Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heartbeat"></i>
                        <h3>Health and Character Documents</h3>
                        <span class="category-status" id="healthStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="police-clearance">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="police-clearance-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination Results</label>
                            <div class="file-upload-zone" data-field="medical-examination">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="medical-examination-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Photos -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-camera"></i>
                        <h3>Photos</h3>
                        <span class="category-status" id="photosStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport Photos</label>
                            <div class="file-upload-zone" data-field="passport-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload passport photos (as per specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="passport-photos-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitPartnerDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Parent Visa upload interface
function generateParentVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-users"></i> Parent Visa Document Upload</h2>
                <p>Upload your required documents for Australian parent visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="parentProgressBar"></div>
                    <span class="progress-text" id="parentProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="identityStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport and Identity Documents</label>
                            <div class="file-upload-zone" data-field="parent-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport and identity documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="parent-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificates (for Children)</label>
                            <div class="file-upload-zone" data-field="birth-certificates">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificates for children</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="birth-certificates-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Evidence of Dependency (if applicable)</label>
                            <div class="file-upload-zone" data-field="dependency-evidence">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload evidence of dependency (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="dependency-evidence-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Sponsor Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-friends"></i>
                        <h3>Sponsor Documents</h3>
                        <span class="category-status" id="sponsorStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Sponsor Documents (Australian Citizen/PR Child)</label>
                            <div class="file-upload-zone" data-field="sponsor-documents">
                                <i class="fas fa-certificate"></i>
                                <p>Upload sponsor's Australian citizenship or permanent residency documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="sponsor-documents-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Balance of Family Test Documents</label>
                            <div class="file-upload-zone" data-field="balance-of-family">
                                <i class="fas fa-users"></i>
                                <p>Upload balance of family test documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="balance-of-family-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Documents</h3>
                        <span class="category-status" id="financialStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Financial Capacity Proof</label>
                            <div class="file-upload-zone" data-field="financial-capacity">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements and financial capacity proof</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="financial-capacity-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health and Character Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heartbeat"></i>
                        <h3>Health and Character Documents</h3>
                        <span class="category-status" id="healthStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="police-clearance">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="police-clearance-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination Results</label>
                            <div class="file-upload-zone" data-field="medical-examination">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="medical-examination-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Photos -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-camera"></i>
                        <h3>Photos</h3>
                        <span class="category-status" id="photosStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport Photos</label>
                            <div class="file-upload-zone" data-field="passport-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload passport photos (as per specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="passport-photos-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitParentDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Business Visa upload interface
function generateBusinessVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-briefcase"></i> Business Visa Document Upload</h2>
                <p>Upload your required documents for Australian business visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="businessProgressBar"></div>
                    <span class="progress-text" id="businessProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="identityStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport (Valid)</label>
                            <div class="file-upload-zone" data-field="business-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="business-passport-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Business Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-chart-line"></i>
                        <h3>Business Documents</h3>
                        <span class="category-status" id="businessStatus">0/6</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Business Plan and Proposal</label>
                            <div class="file-upload-zone" data-field="business-plan">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload detailed business plan and proposal</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="business-plan-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Financial Statements and Bank Records</label>
                            <div class="file-upload-zone" data-field="financial-statements">
                                <i class="fas fa-chart-bar"></i>
                                <p>Upload financial statements and bank records</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="financial-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Company Registration Documents</label>
                            <div class="file-upload-zone" data-field="company-registration">
                                <i class="fas fa-building"></i>
                                <p>Upload company registration documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="company-registration-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Business Registration Certificates</label>
                            <div class="file-upload-zone" data-field="business-registration">
                                <i class="fas fa-certificate"></i>
                                <p>Upload business registration certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="business-registration-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tax Returns and Financial Records</label>
                            <div class="file-upload-zone" data-field="tax-returns">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload tax returns and financial records</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="tax-returns-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Invitation Letter from Australian Business Partner</label>
                            <div class="file-upload-zone" data-field="business-invitation">
                                <i class="fas fa-envelope"></i>
                                <p>Upload invitation letter from Australian business partner (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="business-invitation-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Experience and Character Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-tie"></i>
                        <h3>Experience and Character Documents</h3>
                        <span class="category-status" id="experienceStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Proof of Previous Business Experience</label>
                            <div class="file-upload-zone" data-field="business-experience">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload proof of previous business experience</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="business-experience-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Character References</label>
                            <div class="file-upload-zone" data-field="character-references">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload character references</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="character-references-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health and Character Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heartbeat"></i>
                        <h3>Health and Character Documents</h3>
                        <span class="category-status" id="healthStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Clearance Certificate</label>
                            <div class="file-upload-zone" data-field="police-clearance">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="police-clearance-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination Results</label>
                            <div class="file-upload-zone" data-field="medical-examination">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results (if required)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="medical-examination-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Photos -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-camera"></i>
                        <h3>Photos</h3>
                        <span class="category-status" id="photosStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport Photos</label>
                            <div class="file-upload-zone" data-field="passport-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload passport photos (as per specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="passport-photos-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitBusinessDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Family Visa upload interface
function generateFamilyVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-users"></i> Family Visa Document Upload</h2>
                <p>Upload your required documents for Australian family visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="familyProgressBar"></div>
                    <span class="progress-text" id="familyProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="identityStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport and Identity Documents</label>
                            <div class="file-upload-zone" data-field="family-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport and identity documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="family-passport-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Family Relationship Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heart"></i>
                        <h3>Family Relationship Documents</h3>
                        <span class="category-status" id="familyStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Birth Certificates or Adoption Papers</label>
                            <div class="file-upload-zone" data-field="birth-adoption">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificates or adoption papers</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="birth-adoption-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Relationship Evidence</label>
                            <div class="file-upload-zone" data-field="relationship-evidence">
                                <i class="fas fa-users"></i>
                                <p>Upload relationship evidence documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="relationship-evidence-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Sponsor Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-friends"></i>
                        <h3>Sponsor Documents</h3>
                        <span class="category-status" id="sponsorStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Sponsor Documents</label>
                            <div class="file-upload-zone" data-field="sponsor-documents">
                                <i class="fas fa-certificate"></i>
                                <p>Upload sponsor's Australian citizenship or permanent residency documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="sponsor-documents-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Documents</h3>
                        <span class="category-status" id="financialStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Financial Capacity Proof</label>
                            <div class="file-upload-zone" data-field="financial-capacity">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements and financial capacity proof</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="financial-capacity-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health and Character Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heartbeat"></i>
                        <h3>Health and Character Documents</h3>
                        <span class="category-status" id="healthStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="police-clearance">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="police-clearance-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination Results</label>
                            <div class="file-upload-zone" data-field="medical-examination">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="medical-examination-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Photos -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-camera"></i>
                        <h3>Photos</h3>
                        <span class="category-status" id="photosStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport Photos</label>
                            <div class="file-upload-zone" data-field="passport-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload passport photos (as per specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="passport-photos-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitFamilyDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Visit Visa upload interface
function generateVisitVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-plane"></i> Visit Visa Document Upload</h2>
                <p>Upload your required documents for Australian visit visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="visitProgressBar"></div>
                    <span class="progress-text" id="visitProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="identityStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport (Valid for Duration of Stay)</label>
                            <div class="file-upload-zone" data-field="visit-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport with validity for duration of stay</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="visit-passport-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Travel Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-plane"></i>
                        <h3>Travel Documents</h3>
                        <span class="category-status" id="travelStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Travel Itinerary</label>
                            <div class="file-upload-zone" data-field="travel-itinerary">
                                <i class="fas fa-map"></i>
                                <p>Upload detailed travel itinerary, flight bookings</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="travel-itinerary-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Invitation Letter (if visiting family/friends)</label>
                            <div class="file-upload-zone" data-field="invitation-letter">
                                <i class="fas fa-envelope"></i>
                                <p>Upload invitation letter from Australian host (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="invitation-letter-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Documents</h3>
                        <span class="category-status" id="financialStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Proof of Financial Capacity</label>
                            <div class="file-upload-zone" data-field="financial-capacity">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing sufficient funds</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="financial-capacity-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Supporting Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-alt"></i>
                        <h3>Supporting Documents</h3>
                        <span class="category-status" id="supportingStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Proof of Ties to Home Country</label>
                            <div class="file-upload-zone" data-field="home-country-ties">
                                <i class="fas fa-home"></i>
                                <p>Upload employment letters, property documents, family ties, etc.</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="home-country-ties-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Health Insurance (Recommended)</label>
                            <div class="file-upload-zone" data-field="health-insurance">
                                <i class="fas fa-heartbeat"></i>
                                <p>Upload health insurance documentation (recommended)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="health-insurance-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Photos -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-camera"></i>
                        <h3>Photos</h3>
                        <span class="category-status" id="photosStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Passport Photos</label>
                            <div class="file-upload-zone" data-field="passport-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload passport photos (as per specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="passport-photos-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitVisitDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// ==================== CANADA VISA UPLOAD INTERFACES ====================

// Generate Canada Express Entry (PR) upload interface
function generateCanadaExpressEntryUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-map-marker-alt"></i> Canada PR (Permanent Residence) via Express Entry</h2>
                <p>Upload your required documents for Canada Express Entry application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="canadaPRProgressBar"></div>
                    <span class="progress-text" id="canadaPRProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="canadaIdentityStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport (6+ months validity) - Applicant & Family</label>
                            <div class="file-upload-zone" data-field="canada-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport bio pages for applicant and all family members</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Recent Passport-Sized Photos</label>
                            <div class="file-upload-zone" data-field="canada-passport-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload recent passport-sized photos (Canadian visa specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-passport-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificate</label>
                            <div class="file-upload-zone" data-field="canada-birth-certificate">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-birth-certificate-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>National Identity Card (if applicable)</label>
                            <div class="file-upload-zone" data-field="canada-national-id">
                                <i class="fas fa-id-card"></i>
                                <p>Upload national identity card if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-national-id-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Educational Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Educational Documents</h3>
                        <span class="category-status" id="canadaEducationStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Educational Credential Assessment (ECA)</label>
                            <div class="file-upload-zone" data-field="canada-eca">
                                <i class="fas fa-certificate"></i>
                                <p>Upload ECA from WES, IQAS, or ICES</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-eca-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Degree Certificates, Diplomas, Transcripts</label>
                            <div class="file-upload-zone" data-field="canada-academic-docs">
                                <i class="fas fa-scroll"></i>
                                <p>Upload all degree certificates, diplomas, and transcripts (all levels)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-academic-docs-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Certified Translations</label>
                            <div class="file-upload-zone" data-field="canada-translations">
                                <i class="fas fa-language"></i>
                                <p>Upload certified translations (if not in English/French)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-translations-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Language Proficiency -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-language"></i>
                        <h3>Language Proficiency</h3>
                        <span class="category-status" id="canadaLanguageStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>English Test Scores</label>
                            <div class="file-upload-zone" data-field="canada-english-test">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload IELTS General Training / CELPIP-General / PTE scores</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-english-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>French Test Scores (if applicable)</label>
                            <div class="file-upload-zone" data-field="canada-french-test">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload TEF Canada / TCF Canada scores</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-french-test-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Work Experience Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-briefcase"></i>
                        <h3>Work Experience Documents</h3>
                        <span class="category-status" id="canadaWorkStatus">0/7</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Employment Reference Letters</label>
                            <div class="file-upload-zone" data-field="canada-reference-letters">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload reference letters from all employers with job title, dates, duties, salary, hours, supervisor contact</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-reference-letters-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Offer Letters, Appointment Letters, Confirmation Letters</label>
                            <div class="file-upload-zone" data-field="canada-offer-letters">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload offer letters, appointment letters, confirmation letters</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-offer-letters-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Promotion/Increment Letters</label>
                            <div class="file-upload-zone" data-field="canada-promotion-letters">
                                <i class="fas fa-file-invoice"></i>
                                <p>Upload promotion and increment letters</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-promotion-letters-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Pay Slips (Last 6 Months)</label>
                            <div class="file-upload-zone" data-field="canada-payslips">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload pay slips for last 6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-payslips-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Income Tax Returns with Form 16 (Last 3 Years)</label>
                            <div class="file-upload-zone" data-field="canada-tax-returns">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload income tax returns with Form 16 for last 3 years</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-tax-returns-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Bank Statements Showing Salary Credits (Last 6 Months)</label>
                            <div class="file-upload-zone" data-field="canada-salary-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing salary credits for last 6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-salary-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Experience/Relieving Letters</label>
                            <div class="file-upload-zone" data-field="canada-relieving-letters">
                                <i class="fas fa-handshake"></i>
                                <p>Upload experience and relieving letters</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-relieving-letters-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Proof of Funds -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-piggy-bank"></i>
                        <h3>Proof of Funds</h3>
                        <span class="category-status" id="canadaFundsStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Bank Statements (6 Months)</label>
                            <div class="file-upload-zone" data-field="canada-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements for last 6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Fixed Deposits, Mutual Funds, Investments</label>
                            <div class="file-upload-zone" data-field="canada-investments">
                                <i class="fas fa-chart-line"></i>
                                <p>Upload fixed deposits, mutual funds, and investment documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-investments-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Property Ownership Documents</label>
                            <div class="file-upload-zone" data-field="canada-property">
                                <i class="fas fa-home"></i>
                                <p>Upload property ownership documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-property-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Assets in Applicant or Spouse Name Only</label>
                            <div class="file-upload-zone" data-field="canada-assets">
                                <i class="fas fa-wallet"></i>
                                <p>Upload documents showing assets in applicant or spouse name only</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-assets-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Police Clearance & Medical -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Police Clearance & Medical</h3>
                        <span class="category-status" id="canadaClearanceStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Clearance Certificates (PCC)</label>
                            <div class="file-upload-zone" data-field="canada-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload PCC from all countries where lived 6+ months in last 10 years (not required for those under 18)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination</label>
                            <div class="file-upload-zone" data-field="canada-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical exam by IRCC-approved panel physician (valid for 12 months)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-medical-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-alt"></i>
                        <h3>Additional Documents</h3>
                        <span class="category-status" id="canadaAdditionalStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Marriage Certificate (if applicable)</label>
                            <div class="file-upload-zone" data-field="canada-marriage-cert">
                                <i class="fas fa-certificate"></i>
                                <p>Upload marriage certificate if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-marriage-cert-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Children's Birth Certificates</label>
                            <div class="file-upload-zone" data-field="canada-children-birth">
                                <i class="fas fa-baby"></i>
                                <p>Upload children's birth certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-children-birth-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Relationship to Relatives in Canada</label>
                            <div class="file-upload-zone" data-field="canada-relative-proof">
                                <i class="fas fa-users"></i>
                                <p>Upload proof of relationship to relatives in Canada (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-relative-proof-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Digital Photos for Identity Confirmation</label>
                            <div class="file-upload-zone" data-field="canada-digital-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload digital photos for identity confirmation</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-digital-photos-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitCanadaExpressEntryDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Canada Study Permit upload interface
function generateCanadaStudyPermitUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-graduation-cap"></i> Canada Student Visa (Study Permit)</h2>
                <p>Upload your required documents for Canada Study Permit application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="canadaStudyProgressBar"></div>
                    <span class="progress-text" id="canadaStudyProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Mandatory Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Mandatory Documents</h3>
                        <span class="category-status" id="canadaStudyMandatoryStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Letter of Acceptance (LOA) from DLI</label>
                            <div class="file-upload-zone" data-field="canada-loa">
                                <i class="fas fa-certificate"></i>
                                <p>Upload Letter of Acceptance from Designated Learning Institution</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-loa-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Provincial Attestation Letter (PAL) or Territorial Attestation Letter (TAL)</label>
                            <div class="file-upload-zone" data-field="canada-pal">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload Provincial or Territorial Attestation Letter</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-pal-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Valid Passport (6+ months validity)</label>
                            <div class="file-upload-zone" data-field="canada-study-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport with 6+ months validity</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport Photos (2 recent with name and DOB on back)</label>
                            <div class="file-upload-zone" data-field="canada-study-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 recent passport-sized photos with name and DOB on back</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>English Language Test</label>
                            <div class="file-upload-zone" data-field="canada-study-english">
                                <i class="fas fa-language"></i>
                                <p>Upload IELTS (minimum 6.0-6.5), PTE, TOEFL, or CELPIP scores</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-english-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tuition Fee Payment Receipt</label>
                            <div class="file-upload-zone" data-field="canada-tuition-receipt">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload tuition fee payment receipt</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-tuition-receipt-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>GIC (Guaranteed Investment Certificate) - CAD $20,635</label>
                            <div class="file-upload-zone" data-field="canada-gic">
                                <i class="fas fa-piggy-bank"></i>
                                <p>Upload GIC certificate - CAD $20,635</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-gic-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Documents</h3>
                        <span class="category-status" id="canadaStudyFinancialStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Bank Statements (6 months)</label>
                            <div class="file-upload-zone" data-field="canada-study-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements for last 6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Funds for Tuition + Living Expenses</label>
                            <div class="file-upload-zone" data-field="canada-study-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload proof of funds for tuition and living expenses</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-funds-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsor Financial Documents (if applicable)</label>
                            <div class="file-upload-zone" data-field="canada-sponsor-financial">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload sponsor financial documents and income proof (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-sponsor-financial-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Academic Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Academic Documents</h3>
                        <span class="category-status" id="canadaStudyAcademicStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Academic Transcripts and Certificates</label>
                            <div class="file-upload-zone" data-field="canada-study-transcripts">
                                <i class="fas fa-scroll"></i>
                                <p>Upload all academic transcripts and certificates (10th, 12th, bachelor's, etc.)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-transcripts-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Degree/Diploma Certificates</label>
                            <div class="file-upload-zone" data-field="canada-study-degrees">
                                <i class="fas fa-certificate"></i>
                                <p>Upload degree and diploma certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-degrees-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Statement of Purpose (SOP)</label>
                            <div class="file-upload-zone" data-field="canada-sop">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload Statement of Purpose</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-sop-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Letters of Recommendation (LOR) - 2-3</label>
                            <div class="file-upload-zone" data-field="canada-lor">
                                <i class="fas fa-envelope-open-text"></i>
                                <p>Upload 2-3 Letters of Recommendation</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-lor-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-alt"></i>
                        <h3>Additional Documents</h3>
                        <span class="category-status" id="canadaStudyAdditionalStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>OSHC (Overseas Student Health Cover) - if applicable</label>
                            <div class="file-upload-zone" data-field="canada-oshc">
                                <i class="fas fa-heartbeat"></i>
                                <p>Upload OSHC documentation if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-oshc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificate</label>
                            <div class="file-upload-zone" data-field="canada-study-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination Certificate</label>
                            <div class="file-upload-zone" data-field="canada-study-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-medical-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Travel Itinerary</label>
                            <div class="file-upload-zone" data-field="canada-study-itinerary">
                                <i class="fas fa-map"></i>
                                <p>Upload travel itinerary</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-study-itinerary-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Family Information Form (IMM 5645)</label>
                            <div class="file-upload-zone" data-field="canada-imm5645">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload Family Information Form IMM 5645</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-imm5645-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>For Students Under 18: Form 157N, Form 1229, Custodianship Declaration</label>
                            <div class="file-upload-zone" data-field="canada-under18-forms">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload Form 157N (Student Guardian Nomination), Form 1229 (Parental Consent), and Custodianship Declaration (if under 18)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-under18-forms-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitCanadaStudyPermitDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Canada Visitor/Tourist Visa (TRV) upload interface
function generateCanadaVisitorVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-plane"></i> Canada Visitor/Tourist Visa (TRV)</h2>
                <p>Upload your required documents for Canada Visitor/Tourist Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="canadaVisitorProgressBar"></div>
                    <span class="progress-text" id="canadaVisitorProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Required Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Required Documents</h3>
                        <span class="category-status" id="canadaVisitorRequiredStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport (6+ months validity)</label>
                            <div class="file-upload-zone" data-field="canada-visitor-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport with 6+ months validity</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Old Passports for Travel History</label>
                            <div class="file-upload-zone" data-field="canada-old-passports">
                                <i class="fas fa-passport"></i>
                                <p>Upload old passports showing travel history</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-old-passports-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport Photos (2 recent)</label>
                            <div class="file-upload-zone" data-field="canada-visitor-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 recent passport-sized photos</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Completed Application Forms</label>
                            <div class="file-upload-zone" data-field="canada-visitor-forms">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload completed IMM 5257 (Visitor Visa Application) and IMM 5645 (Family Information Form)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-forms-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Proof -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Proof</h3>
                        <span class="category-status" id="canadaVisitorFinancialStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Bank Statements (3-6 months)</label>
                            <div class="file-upload-zone" data-field="canada-visitor-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements for last 3-6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Pay Slips</label>
                            <div class="file-upload-zone" data-field="canada-visitor-payslips">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload pay slips</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-payslips-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tax Returns</label>
                            <div class="file-upload-zone" data-field="canada-visitor-tax">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload tax returns</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-tax-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Assets/Property</label>
                            <div class="file-upload-zone" data-field="canada-visitor-assets">
                                <i class="fas fa-home"></i>
                                <p>Upload proof of assets and property</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-assets-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsorship Letter (if sponsored by someone in Canada)</label>
                            <div class="file-upload-zone" data-field="canada-visitor-sponsorship">
                                <i class="fas fa-envelope-open-text"></i>
                                <p>Upload sponsorship letter if sponsored by someone in Canada</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-sponsorship-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Travel Documentation -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-map"></i>
                        <h3>Travel Documentation</h3>
                        <span class="category-status" id="canadaVisitorTravelStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Flight Reservations (not mandatory before approval)</label>
                            <div class="file-upload-zone" data-field="canada-visitor-flights">
                                <i class="fas fa-plane"></i>
                                <p>Upload flight reservations (not mandatory before approval)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-flights-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Detailed Travel Itinerary</label>
                            <div class="file-upload-zone" data-field="canada-visitor-itinerary">
                                <i class="fas fa-map-marked-alt"></i>
                                <p>Upload detailed travel itinerary (cities, dates, places)</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-itinerary-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Hotel Reservations / Accommodation Proof</label>
                            <div class="file-upload-zone" data-field="canada-visitor-accommodation">
                                <i class="fas fa-hotel"></i>
                                <p>Upload hotel reservations or accommodation proof</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-accommodation-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Invitation Letter -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-envelope"></i>
                        <h3>Invitation Letter (if visiting family/friends)</h3>
                        <span class="category-status" id="canadaVisitorInvitationStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Invitation Letter</label>
                            <div class="file-upload-zone" data-field="canada-visitor-invitation">
                                <i class="fas fa-envelope-open-text"></i>
                                <p>Upload invitation letter with host's name, address, relationship</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-invitation-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Host's Canadian Status Documents</label>
                            <div class="file-upload-zone" data-field="canada-host-status">
                                <i class="fas fa-id-card"></i>
                                <p>Upload copy of host's Canadian status (passport, PR card, citizenship)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-host-status-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Ties to Home Country -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-anchor"></i>
                        <h3>Ties to Home Country</h3>
                        <span class="category-status" id="canadaVisitorTiesStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Employment Letter / NOC from Employer</label>
                            <div class="file-upload-zone" data-field="canada-visitor-employment">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload employment letter or NOC from employer</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-employment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Leave Approval</label>
                            <div class="file-upload-zone" data-field="canada-visitor-leave">
                                <i class="fas fa-calendar-check"></i>
                                <p>Upload proof of leave approval</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-leave-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Property Documents</label>
                            <div class="file-upload-zone" data-field="canada-visitor-property">
                                <i class="fas fa-home"></i>
                                <p>Upload property documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-property-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Family Ties Proof</label>
                            <div class="file-upload-zone" data-field="canada-visitor-family-ties">
                                <i class="fas fa-users"></i>
                                <p>Upload proof of family ties</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-family-ties-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Business Ownership Documents</label>
                            <div class="file-upload-zone" data-field="canada-visitor-business">
                                <i class="fas fa-store"></i>
                                <p>Upload business ownership documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-business-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-alt"></i>
                        <h3>Additional Documents</h3>
                        <span class="category-status" id="canadaVisitorAdditionalStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Cover Letter</label>
                            <div class="file-upload-zone" data-field="canada-visitor-cover-letter">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload cover letter explaining purpose of visit</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-cover-letter-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Marriage Certificate (if applicable)</label>
                            <div class="file-upload-zone" data-field="canada-visitor-marriage">
                                <i class="fas fa-certificate"></i>
                                <p>Upload marriage certificate if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-marriage-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Biometrics Appointment Confirmation</label>
                            <div class="file-upload-zone" data-field="canada-visitor-biometrics">
                                <i class="fas fa-fingerprint"></i>
                                <p>Upload biometrics appointment confirmation</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-biometrics-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Visa Fee Receipt</label>
                            <div class="file-upload-zone" data-field="canada-visitor-fee-receipt">
                                <i class="fas fa-receipt"></i>
                                <p>Upload visa fee receipt</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-visitor-fee-receipt-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitCanadaVisitorDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Canada Family Sponsorship upload interface
function generateCanadaFamilySponsorshipUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-users"></i> Canada Family Sponsorship Visa</h2>
                <p>Upload your required documents for Canada Family Sponsorship application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="canadaFamilyProgressBar"></div>
                    <span class="progress-text" id="canadaFamilyProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Sponsor Requirements -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-tie"></i>
                        <h3>Sponsor Requirements</h3>
                        <span class="category-status" id="canadaFamilySponsorStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Proof of Canadian Citizenship or PR Status</label>
                            <div class="file-upload-zone" data-field="canada-sponsor-status">
                                <i class="fas fa-id-card"></i>
                                <p>Upload proof of Canadian citizenship or PR status</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-sponsor-status-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport Copies</label>
                            <div class="file-upload-zone" data-field="canada-sponsor-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport copies</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-sponsor-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsorship Application Forms</label>
                            <div class="file-upload-zone" data-field="canada-sponsor-forms">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload completed sponsorship application forms</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-sponsor-forms-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Financial Capacity Documents</label>
                            <div class="file-upload-zone" data-field="canada-sponsor-financial">
                                <i class="fas fa-dollar-sign"></i>
                                <p>Upload financial capacity documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-sponsor-financial-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tax Returns (3 years) and Employment Letter</label>
                            <div class="file-upload-zone" data-field="canada-sponsor-tax-employment">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload tax returns for last 3 years and employment letter</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-sponsor-tax-employment-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Applicant Requirements -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user"></i>
                        <h3>Applicant Requirements</h3>
                        <span class="category-status" id="canadaFamilyApplicantStatus">0/6</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport</label>
                            <div class="file-upload-zone" data-field="canada-family-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-family-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificate</label>
                            <div class="file-upload-zone" data-field="canada-family-birth-cert">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-family-birth-cert-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Marriage Certificate (for spouse sponsorship)</label>
                            <div class="file-upload-zone" data-field="canada-family-marriage">
                                <i class="fas fa-certificate"></i>
                                <p>Upload marriage certificate (for spouse sponsorship)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-family-marriage-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Relationship Evidence</label>
                            <div class="file-upload-zone" data-field="canada-family-relationship">
                                <i class="fas fa-heart"></i>
                                <p>Upload relationship evidence (photos, communication records, joint financial documents)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-family-relationship-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="canada-family-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-family-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination and Passport Photos</label>
                            <div class="file-upload-zone" data-field="canada-family-medical-photos">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results and passport photos</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-family-medical-photos-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitCanadaFamilySponsorshipDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate Canada Work Permit upload interface
function generateCanadaWorkPermitUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-briefcase"></i> Canada Work Permit</h2>
                <p>Upload your required documents for Canada Work Permit application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="canadaWorkProgressBar"></div>
                    <span class="progress-text" id="canadaWorkProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Required Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Required Documents</h3>
                        <span class="category-status" id="canadaWorkRequiredStatus">0/10</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport</label>
                            <div class="file-upload-zone" data-field="canada-work-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Job Offer Letter from Canadian Employer</label>
                            <div class="file-upload-zone" data-field="canada-work-offer">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload job offer letter from Canadian employer</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-offer-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Labour Market Impact Assessment (LMIA) or LMIA-exempt Documents</label>
                            <div class="file-upload-zone" data-field="canada-work-lmia">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload LMIA or LMIA-exempt documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-lmia-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Qualifications/Credentials</label>
                            <div class="file-upload-zone" data-field="canada-work-qualifications">
                                <i class="fas fa-certificate"></i>
                                <p>Upload proof of qualifications and credentials</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-qualifications-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Work Experience Letters</label>
                            <div class="file-upload-zone" data-field="canada-work-experience">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload work experience letters</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-experience-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Educational Certificates</label>
                            <div class="file-upload-zone" data-field="canada-work-education">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload educational certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-education-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Language Test Results</label>
                            <div class="file-upload-zone" data-field="canada-work-language">
                                <i class="fas fa-language"></i>
                                <p>Upload IELTS/CELPIP language test results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-language-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificate</label>
                            <div class="file-upload-zone" data-field="canada-work-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination</label>
                            <div class="file-upload-zone" data-field="canada-work-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-medical-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Funds and Resume/CV</label>
                            <div class="file-upload-zone" data-field="canada-work-funds-resume">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload proof of funds and resume/CV</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="canada-work-funds-resume-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitCanadaWorkPermitDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// ==================== NEW ZEALAND VISA UPLOAD INTERFACES ====================

// Generate New Zealand Skilled Migrant Category upload interface
function generateNZSkilledMigrantUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-user-graduate"></i> New Zealand Skilled Migrant Category (SMC) Resident Visa</h2>
                <p>Upload your required documents for NZ Skilled Migrant Category application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="nzSMCProgressBar"></div>
                    <span class="progress-text" id="nzSMCProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="nzSMCIdentityStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport (6+ months validity)</label>
                            <div class="file-upload-zone" data-field="nz-smc-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport with 6+ months validity</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Recent Passport Photos</label>
                            <div class="file-upload-zone" data-field="nz-smc-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload recent passport photos (visa specifications)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificate</label>
                            <div class="file-upload-zone" data-field="nz-smc-birth-cert">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-birth-cert-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Name Change Documents (if applicable)</label>
                            <div class="file-upload-zone" data-field="nz-smc-name-change">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload name change documents if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-name-change-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Educational Qualifications -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Educational Qualifications</h3>
                        <span class="category-status" id="nzSMCEducationStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Degree Certificates, Diplomas, Transcripts</label>
                            <div class="file-upload-zone" data-field="nz-smc-academic-docs">
                                <i class="fas fa-scroll"></i>
                                <p>Upload all degree certificates, diplomas, and transcripts</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-academic-docs-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>NZQA Assessment (if not on exempt list)</label>
                            <div class="file-upload-zone" data-field="nz-smc-nzqa">
                                <i class="fas fa-certificate"></i>
                                <p>Upload NZQA assessment if qualification not on exempt list</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-nzqa-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Academic Transcripts (All Levels)</label>
                            <div class="file-upload-zone" data-field="nz-smc-transcripts">
                                <i class="fas fa-list-alt"></i>
                                <p>Upload academic transcripts for all levels of education</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-transcripts-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Professional Certifications</label>
                            <div class="file-upload-zone" data-field="nz-smc-professional-certs">
                                <i class="fas fa-award"></i>
                                <p>Upload professional registration certificates (if claiming points)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-professional-certs-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Work Experience -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-briefcase"></i>
                        <h3>Work Experience</h3>
                        <span class="category-status" id="nzSMCWorkStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Employment Contracts/Offer Letters</label>
                            <div class="file-upload-zone" data-field="nz-smc-employment-contracts">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload employment contracts or offer letters from accredited NZ employers</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-employment-contracts-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Reference Letters</label>
                            <div class="file-upload-zone" data-field="nz-smc-reference-letters">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload detailed reference letters with job descriptions, dates, and salary</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-reference-letters-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Pay Slips and Tax Returns</label>
                            <div class="file-upload-zone" data-field="nz-smc-payslips-tax">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload pay slips and tax returns</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-payslips-tax-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Professional Registration Certificates</label>
                            <div class="file-upload-zone" data-field="nz-smc-registration">
                                <i class="fas fa-id-card"></i>
                                <p>Upload professional registration certificates (if claiming points)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-registration-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- English Language -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-language"></i>
                        <h3>English Language</h3>
                        <span class="category-status" id="nzSMCLanguageStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>English Test Results</label>
                            <div class="file-upload-zone" data-field="nz-smc-english-test">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload IELTS (minimum 6.5 overall), PTE, or TOEFL results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-english-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Evidence of English-Speaking Country Education</label>
                            <div class="file-upload-zone" data-field="nz-smc-english-education">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload evidence of education from English-speaking country (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-english-education-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Evidence -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Evidence</h3>
                        <span class="category-status" id="nzSMCFinancialStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Bank Statements (3-6 months)</label>
                            <div class="file-upload-zone" data-field="nz-smc-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements for last 3-6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Funds for Settlement</label>
                            <div class="file-upload-zone" data-field="nz-smc-settlement-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload proof of funds for settlement in New Zealand</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-settlement-funds-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health & Character -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Health & Character</h3>
                        <span class="category-status" id="nzSMCHealthStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Medical Examination</label>
                            <div class="file-upload-zone" data-field="nz-smc-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination by approved panel physician</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-medical-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Chest X-ray Certificate</label>
                            <div class="file-upload-zone" data-field="nz-smc-chest-xray">
                                <i class="fas fa-x-ray"></i>
                                <p>Upload chest X-ray certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-chest-xray-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="nz-smc-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates from all countries lived 12+ months since age 17</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-pcc-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Family Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-users"></i>
                        <h3>Family Documents</h3>
                        <span class="category-status" id="nzSMCFamilyStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Marriage Certificate (if applicable)</label>
                            <div class="file-upload-zone" data-field="nz-smc-marriage-cert">
                                <i class="fas fa-certificate"></i>
                                <p>Upload marriage certificate if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-marriage-cert-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Children's Birth Certificates</label>
                            <div class="file-upload-zone" data-field="nz-smc-children-birth">
                                <i class="fas fa-baby"></i>
                                <p>Upload children's birth certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-children-birth-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Partner's Qualification/Work Documents</label>
                            <div class="file-upload-zone" data-field="nz-smc-partner-docs">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload partner's qualification and work documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-smc-partner-docs-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitNZSkilledMigrantDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate New Zealand Student Visa upload interface
function generateNZStudentVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-graduation-cap"></i> New Zealand Student Visa</h2>
                <p>Upload your required documents for NZ Student Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="nzStudentProgressBar"></div>
                    <span class="progress-text" id="nzStudentProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Essential Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Essential Documents</h3>
                        <span class="category-status" id="nzStudentEssentialStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Letter of Acceptance</label>
                            <div class="file-upload-zone" data-field="nz-student-loa">
                                <i class="fas fa-certificate"></i>
                                <p>Upload Letter of Acceptance from NZQA-approved education provider</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-loa-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Valid Passport (3+ months after planned departure)</label>
                            <div class="file-upload-zone" data-field="nz-student-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport with 3+ months validity after planned departure</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport Photos (2 recent)</label>
                            <div class="file-upload-zone" data-field="nz-student-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 recent passport-sized photos</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Completed Application Form</label>
                            <div class="file-upload-zone" data-field="nz-student-application">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload completed student visa application form</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-application-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Documents</h3>
                        <span class="category-status" id="nzStudentFinancialStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Proof of Funds - NZD $20,000 per year</label>
                            <div class="file-upload-zone" data-field="nz-student-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload proof of funds: NZD $20,000 per year for living expenses</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-funds-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tuition Fee Payment Receipts</label>
                            <div class="file-upload-zone" data-field="nz-student-tuition">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload tuition fee payment receipts</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-tuition-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Bank Statements (6 months history)</label>
                            <div class="file-upload-zone" data-field="nz-student-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing 6 months history</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsor Financial Documents (if applicable)</label>
                            <div class="file-upload-zone" data-field="nz-student-sponsor-financial">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload sponsor financial documents if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-sponsor-financial-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Academic Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Academic Documents</h3>
                        <span class="category-status" id="nzStudentAcademicStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Academic Transcripts and Certificates</label>
                            <div class="file-upload-zone" data-field="nz-student-academic-docs">
                                <i class="fas fa-scroll"></i>
                                <p>Upload academic transcripts and certificates (all levels)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-academic-docs-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>English Language Proficiency Test Results</label>
                            <div class="file-upload-zone" data-field="nz-student-english">
                                <i class="fas fa-language"></i>
                                <p>Upload English language proficiency test results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-english-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Previous Qualifications</label>
                            <div class="file-upload-zone" data-field="nz-student-previous-qual">
                                <i class="fas fa-certificate"></i>
                                <p>Upload previous qualification certificates and transcripts</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-previous-qual-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health & Travel -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heartbeat"></i>
                        <h3>Health & Travel</h3>
                        <span class="category-status" id="nzStudentHealthStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Travel Insurance</label>
                            <div class="file-upload-zone" data-field="nz-student-insurance">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload comprehensive travel insurance (medical and travel coverage)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-insurance-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination (if staying 12+ months)</label>
                            <div class="file-upload-zone" data-field="nz-student-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results (if staying 12+ months)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-medical-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Chest X-ray (if from certain countries)</label>
                            <div class="file-upload-zone" data-field="nz-student-chest-xray">
                                <i class="fas fa-x-ray"></i>
                                <p>Upload chest X-ray certificate (if required)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-chest-xray-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificate (if 17+ years)</label>
                            <div class="file-upload-zone" data-field="nz-student-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificate (if 17+ years)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Letter of Support from Parents/Guardians (if under 18)</label>
                            <div class="file-upload-zone" data-field="nz-student-parental-support">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload letter of support from parents/guardians (if under 18)</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-parental-support-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Accommodation Arrangements Proof</label>
                            <div class="file-upload-zone" data-field="nz-student-accommodation">
                                <i class="fas fa-home"></i>
                                <p>Upload proof of accommodation arrangements</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-student-accommodation-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitNZStudentDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate New Zealand Visitor/Tourist Visa upload interface
function generateNZVisitorVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-plane"></i> New Zealand Visitor/Tourist Visa</h2>
                <p>Upload your required documents for NZ Visitor/Tourist Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="nzVisitorProgressBar"></div>
                    <span class="progress-text" id="nzVisitorProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity & Travel -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity & Travel</h3>
                        <span class="category-status" id="nzVisitorIdentityStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport (3+ months after departure)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport with 3+ months validity after planned departure date</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport Photos (2 for paper application)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 recent passport-sized photos</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Completed Application Form</label>
                            <div class="file-upload-zone" data-field="nz-visitor-application">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload completed visitor visa application form</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-application-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Travel Itinerary/Plans</label>
                            <div class="file-upload-zone" data-field="nz-visitor-itinerary">
                                <i class="fas fa-map"></i>
                                <p>Upload detailed travel itinerary and plans</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-itinerary-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Proof -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Proof</h3>
                        <span class="category-status" id="nzVisitorFinancialStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Bank Statements (3-6 months history)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing 3-6 months history</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Evidence of Prepaid Accommodation</label>
                            <div class="file-upload-zone" data-field="nz-visitor-accommodation">
                                <i class="fas fa-hotel"></i>
                                <p>Upload evidence of prepaid accommodation</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-accommodation-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Onward Travel Tickets or Funds</label>
                            <div class="file-upload-zone" data-field="nz-visitor-onward-travel">
                                <i class="fas fa-plane"></i>
                                <p>Upload proof of onward travel tickets or funds to purchase return tickets</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-onward-travel-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsorship Form INZ 1025 (if sponsored)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-sponsorship">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload completed sponsorship form INZ 1025 if sponsored by someone in NZ</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-sponsorship-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Ties to Home Country -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-anchor"></i>
                        <h3>Ties to Home Country</h3>
                        <span class="category-status" id="nzVisitorTiesStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Employment Letter (Leave Approval, Return Date)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-employment">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload employment letter showing leave approval and return date</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-employment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Student Enrollment Letter (if studying)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-enrollment">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload student enrollment letter if currently studying</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-enrollment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Property Ownership Documents</label>
                            <div class="file-upload-zone" data-field="nz-visitor-property">
                                <i class="fas fa-home"></i>
                                <p>Upload property ownership documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-property-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Family Relationship Proof</label>
                            <div class="file-upload-zone" data-field="nz-visitor-family-ties">
                                <i class="fas fa-users"></i>
                                <p>Upload proof of family relationships in home country</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-family-ties-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Purpose of Visit -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-map-marked-alt"></i>
                        <h3>Purpose of Visit</h3>
                        <span class="category-status" id="nzVisitorPurposeStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Invitation Letter (if visiting family/friends)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-invitation">
                                <i class="fas fa-envelope-open-text"></i>
                                <p>Upload invitation letter if visiting family or friends</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-invitation-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Business Meeting Confirmation (if business visit)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-business">
                                <i class="fas fa-handshake"></i>
                                <p>Upload business meeting confirmation if visiting for business</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-business-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tourism Bookings/Reservations</label>
                            <div class="file-upload-zone" data-field="nz-visitor-tourism">
                                <i class="fas fa-ticket-alt"></i>
                                <p>Upload tourism bookings and reservations</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-tourism-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health & Character -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Health & Character</h3>
                        <span class="category-status" id="nzVisitorHealthStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Clearance (if staying 24+ months)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificate (if staying 24+ months)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination (if staying 12+ months)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results (if staying 12+ months)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-medical-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Chest X-ray (if staying 6+ months)</label>
                            <div class="file-upload-zone" data-field="nz-visitor-chest-xray">
                                <i class="fas fa-x-ray"></i>
                                <p>Upload chest X-ray certificate (if staying 6+ months)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-visitor-chest-xray-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitNZVisitorDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate New Zealand Work Visa upload interface
function generateNZWorkVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-briefcase"></i> New Zealand Work Visa (Accredited Employer Work Visa - AEWV)</h2>
                <p>Upload your required documents for NZ Work Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="nzWorkProgressBar"></div>
                    <span class="progress-text" id="nzWorkProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Required Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Required Documents</h3>
                        <span class="category-status" id="nzWorkRequiredStatus">0/7</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Job Offer from Accredited NZ Employer</label>
                            <div class="file-upload-zone" data-field="nz-work-job-offer">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload job offer letter from accredited New Zealand employer</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-work-job-offer-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Valid Passport and Photos</label>
                            <div class="file-upload-zone" data-field="nz-work-passport-photos">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport and recent passport photos</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-work-passport-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Employment Agreement/Contract</label>
                            <div class="file-upload-zone" data-field="nz-work-employment-agreement">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload signed employment agreement or contract</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-work-employment-agreement-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Qualifications and Experience</label>
                            <div class="file-upload-zone" data-field="nz-work-qualifications">
                                <i class="fas fa-certificate"></i>
                                <p>Upload proof of qualifications and relevant work experience</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-work-qualifications-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination and Chest X-ray</label>
                            <div class="file-upload-zone" data-field="nz-work-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results and chest X-ray certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-work-medical-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="nz-work-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates from all countries lived 12+ months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-work-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Evidence of Relevant Work Experience</label>
                            <div class="file-upload-zone" data-field="nz-work-experience">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload evidence of relevant work experience (reference letters, contracts, etc.)</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-work-experience-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitNZWorkDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate New Zealand Partnership Visa upload interface
function generateNZPartnershipVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-heart"></i> New Zealand Partnership Visas</h2>
                <p>Upload your required documents for NZ Partnership Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="nzPartnershipProgressBar"></div>
                    <span class="progress-text" id="nzPartnershipProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="nzPartnershipIdentityStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passports (Both Partners)</label>
                            <div class="file-upload-zone" data-field="nz-partnership-passports">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passports for both partners</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-passports-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Recent Passport Photos</label>
                            <div class="file-upload-zone" data-field="nz-partnership-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload recent passport photos for both partners</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificates</label>
                            <div class="file-upload-zone" data-field="nz-partnership-birth-certs">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificates for both partners</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-birth-certs-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Relationship Evidence -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heart"></i>
                        <h3>Relationship Evidence</h3>
                        <span class="category-status" id="nzPartnershipRelationshipStatus">0/8</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Marriage/Civil Union Certificate</label>
                            <div class="file-upload-zone" data-field="nz-partnership-marriage">
                                <i class="fas fa-certificate"></i>
                                <p>Upload marriage certificate or civil union certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-marriage-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Joint Bank Account Statements</label>
                            <div class="file-upload-zone" data-field="nz-partnership-joint-bank">
                                <i class="fas fa-university"></i>
                                <p>Upload joint bank account statements showing financial partnership</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-joint-bank-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Joint Rental Agreements/Mortgage Documents</label>
                            <div class="file-upload-zone" data-field="nz-partnership-housing">
                                <i class="fas fa-home"></i>
                                <p>Upload joint rental agreements or mortgage documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-housing-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Joint Utility Bills and Correspondence</label>
                            <div class="file-upload-zone" data-field="nz-partnership-utilities">
                                <i class="fas fa-file-invoice"></i>
                                <p>Upload joint utility bills and official correspondence addressed to both</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-utilities-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Photos Together (Various Dates/Locations)</label>
                            <div class="file-upload-zone" data-field="nz-partnership-photos">
                                <i class="fas fa-images"></i>
                                <p>Upload photos together showing relationship over time (various dates and locations)</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Communication Records</label>
                            <div class="file-upload-zone" data-field="nz-partnership-communication">
                                <i class="fas fa-envelope"></i>
                                <p>Upload communication records (emails, messages, call logs)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-communication-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Travel Records Together</label>
                            <div class="file-upload-zone" data-field="nz-partnership-travel">
                                <i class="fas fa-plane"></i>
                                <p>Upload travel records showing trips taken together</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-travel-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Statutory Declarations from Friends/Family</label>
                            <div class="file-upload-zone" data-field="nz-partnership-declarations">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload statutory declarations from friends and family supporting the relationship</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-declarations-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Partner Support -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-friends"></i>
                        <h3>Partner Support</h3>
                        <span class="category-status" id="nzPartnershipSupportStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>NZ Partner's Citizenship/Residence Proof</label>
                            <div class="file-upload-zone" data-field="nz-partnership-nz-status">
                                <i class="fas fa-id-card"></i>
                                <p>Upload NZ partner's proof of citizenship or residence</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-nz-status-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Partner Support Form Completed</label>
                            <div class="file-upload-zone" data-field="nz-partnership-support-form">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload completed partner support form</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-support-form-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>NZ Partner's Employment/Income Evidence</label>
                            <div class="file-upload-zone" data-field="nz-partnership-income">
                                <i class="fas fa-dollar-sign"></i>
                                <p>Upload NZ partner's employment letter and income evidence</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-income-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health & Character -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Health & Character</h3>
                        <span class="category-status" id="nzPartnershipHealthStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Medical Examination</label>
                            <div class="file-upload-zone" data-field="nz-partnership-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-medical-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="nz-partnership-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates from all countries</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Character References</label>
                            <div class="file-upload-zone" data-field="nz-partnership-character">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload character references</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-character-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Support -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Support</h3>
                        <span class="category-status" id="nzPartnershipFinancialStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Evidence of Funds (NZD $4,200+ per person)</label>
                            <div class="file-upload-zone" data-field="nz-partnership-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload evidence of funds: NZD $4,200+ per person</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-funds-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsor's Financial Capacity (if sponsored)</label>
                            <div class="file-upload-zone" data-field="nz-partnership-sponsor-capacity">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload sponsor's financial capacity documents if sponsored</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-partnership-sponsor-capacity-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitNZPartnershipDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate New Zealand Permanent Resident Visa upload interface
function generateNZPermanentResidentUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-check-circle"></i> New Zealand Permanent Resident Visa</h2>
                <p>Upload your required documents for NZ Permanent Resident Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="nzPRProgressBar"></div>
                    <span class="progress-text" id="nzPRProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Required Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Required Documents</h3>
                        <span class="category-status" id="nzPRRequiredStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Current Valid Passport</label>
                            <div class="file-upload-zone" data-field="nz-pr-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload current valid passport</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Resident Visa Evidence</label>
                            <div class="file-upload-zone" data-field="nz-pr-resident-visa">
                                <i class="fas fa-id-card"></i>
                                <p>Upload evidence of current or expired resident visa (expired ≤90 days ago acceptable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-resident-visa-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Proof of Compliance -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-check-double"></i>
                        <h3>Proof of Compliance with Resident Visa Conditions</h3>
                        <span class="category-status" id="nzPRComplianceStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Compliance Evidence</label>
                            <div class="file-upload-zone" data-field="nz-pr-compliance">
                                <i class="fas fa-file-check"></i>
                                <p>Upload proof of compliance with all resident visa conditions</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-compliance-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Evidence of Commitment to NZ -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heart"></i>
                        <h3>Evidence of Commitment to New Zealand (Choose One)</h3>
                        <span class="category-status" id="nzPRCommitmentStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Living in NZ - Tax Returns, Employment, Accommodation</label>
                            <div class="file-upload-zone" data-field="nz-pr-living">
                                <i class="fas fa-home"></i>
                                <p>Upload evidence of living in NZ (tax returns, employment records, accommodation proof)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-living-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Investment in NZ - Property, Business, Financial</label>
                            <div class="file-upload-zone" data-field="nz-pr-investment">
                                <i class="fas fa-chart-line"></i>
                                <p>Upload evidence of investment in NZ (property ownership, business ownership, financial investments)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-investment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Business Operations in NZ</label>
                            <div class="file-upload-zone" data-field="nz-pr-business">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload evidence of business operations in New Zealand</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-business-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Family Ties with Citizens/Residents</label>
                            <div class="file-upload-zone" data-field="nz-pr-family-ties">
                                <i class="fas fa-users"></i>
                                <p>Upload evidence of family ties with NZ citizens or residents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-family-ties-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Talent/Employment Contributions</label>
                            <div class="file-upload-zone" data-field="nz-pr-talent">
                                <i class="fas fa-star"></i>
                                <p>Upload evidence of talent or employment contributions to New Zealand</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-talent-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-alt"></i>
                        <h3>Additional Documents</h3>
                        <span class="category-status" id="nzPRAdditionalStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Clearance Certificates</label>
                            <div class="file-upload-zone" data-field="nz-pr-pcc">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police clearance certificates</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-pcc-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Medical Examination</label>
                            <div class="file-upload-zone" data-field="nz-pr-medical">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload medical examination results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="nz-pr-medical-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitNZPermanentResidentDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// ==================== UNITED KINGDOM VISA UPLOAD INTERFACES ====================

// Generate UK Skilled Worker Visa upload interface
function generateUKSkilledWorkerUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-briefcase"></i> UK Skilled Worker Visa</h2>
                <p>Upload your required documents for UK Skilled Worker Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="ukSkilledWorkerProgressBar"></div>
                    <span class="progress-text" id="ukSkilledWorkerProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="ukSkilledWorkerIdentityStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport with Blank Page</label>
                            <div class="file-upload-zone" data-field="uk-skilled-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport with blank page for visa</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Recent Passport-Sized Photos (2)</label>
                            <div class="file-upload-zone" data-field="uk-skilled-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 recent passport-sized photos</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Previous Passports (if applicable)</label>
                            <div class="file-upload-zone" data-field="uk-skilled-previous-passports">
                                <i class="fas fa-passport"></i>
                                <p>Upload previous passports if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-previous-passports-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Employment Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-briefcase"></i>
                        <h3>Employment Documents</h3>
                        <span class="category-status" id="ukSkilledWorkerEmploymentStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Certificate of Sponsorship (CoS) Reference Number</label>
                            <div class="file-upload-zone" data-field="uk-skilled-cos">
                                <i class="fas fa-certificate"></i>
                                <p>Upload Certificate of Sponsorship reference number</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-cos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Job Offer Letter from UK Employer</label>
                            <div class="file-upload-zone" data-field="uk-skilled-job-offer">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload job offer letter from UK Home Office licensed sponsor</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-job-offer-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Employment Contract with Salary Details</label>
                            <div class="file-upload-zone" data-field="uk-skilled-employment-contract">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload employment contract with salary details (minimum £38,700/year)</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-employment-contract-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Job Title and SOC Code</label>
                            <div class="file-upload-zone" data-field="uk-skilled-soc-code">
                                <i class="fas fa-tag"></i>
                                <p>Upload document showing job title and Standard Occupational Classification (SOC) code</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-soc-code-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Employer's Sponsor License Number</label>
                            <div class="file-upload-zone" data-field="uk-skilled-sponsor-license">
                                <i class="fas fa-id-badge"></i>
                                <p>Upload document showing employer's UK Home Office sponsor license number</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-sponsor-license-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- English Language Proof -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-language"></i>
                        <h3>English Language Proof</h3>
                        <span class="category-status" id="ukSkilledWorkerEnglishStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>IELTS/PTE/TOEFL Results (B1 Level)</label>
                            <div class="file-upload-zone" data-field="uk-skilled-english-test">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload IELTS (minimum 4.0 each component), PTE, or TOEFL results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-english-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Degree Taught in English (with UK NARIC confirmation)</label>
                            <div class="file-upload-zone" data-field="uk-skilled-degree-english">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload degree certificate and UK NARIC confirmation if degree was taught in English</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-degree-english-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport from English-Speaking Majority Country</label>
                            <div class="file-upload-zone" data-field="uk-skilled-english-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport from English-speaking majority country (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-english-passport-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Evidence -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Evidence</h3>
                        <span class="category-status" id="ukSkilledWorkerFinancialStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Bank Statements (£1,270 for 28 consecutive days)</label>
                            <div class="file-upload-zone" data-field="uk-skilled-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing £1,270 for 28 consecutive days</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsor Certification of Maintenance (if applicable)</label>
                            <div class="file-upload-zone" data-field="uk-skilled-sponsor-maintenance">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload sponsor certification of maintenance on CoS (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-sponsor-maintenance-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Educational/Professional Qualifications -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Educational/Professional Qualifications</h3>
                        <span class="category-status" id="ukSkilledWorkerQualificationsStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Degree Certificates and Transcripts</label>
                            <div class="file-upload-zone" data-field="uk-skilled-degree">
                                <i class="fas fa-scroll"></i>
                                <p>Upload degree certificates and transcripts</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-degree-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Professional Certifications/Licenses</label>
                            <div class="file-upload-zone" data-field="uk-skilled-professional-certs">
                                <i class="fas fa-award"></i>
                                <p>Upload professional certifications/licenses if required for job</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-professional-certs-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>UK PhD Certificate or Ecctis Reference</label>
                            <div class="file-upload-zone" data-field="uk-skilled-phd">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload UK PhD certificate or Ecctis reference (if claiming PhD points)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-phd-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health & Character -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Health & Character</h3>
                        <span class="category-status" id="ukSkilledWorkerHealthStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>TB Test Certificate</label>
                            <div class="file-upload-zone" data-field="uk-skilled-tb-test">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload TB test certificate from approved countries</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-tb-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Criminal Record Certificate</label>
                            <div class="file-upload-zone" data-field="uk-skilled-criminal-record">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload criminal record certificate (for certain roles: healthcare, education, social work)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-criminal-record-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- For Dependents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-users"></i>
                        <h3>For Dependents (if applicable)</h3>
                        <span class="category-status" id="ukSkilledWorkerDependentsStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Marriage Certificate or Civil Partnership Certificate</label>
                            <div class="file-upload-zone" data-field="uk-skilled-marriage">
                                <i class="fas fa-certificate"></i>
                                <p>Upload marriage certificate or civil partnership certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-marriage-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificates for Children</label>
                            <div class="file-upload-zone" data-field="uk-skilled-children-birth">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificates for children</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-children-birth-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Relationship</label>
                            <div class="file-upload-zone" data-field="uk-skilled-relationship">
                                <i class="fas fa-heart"></i>
                                <p>Upload proof of relationship with dependents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-relationship-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Additional Maintenance Funds</label>
                            <div class="file-upload-zone" data-field="uk-skilled-additional-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload evidence of additional maintenance funds (£285 partner, £315 first child, £200 each additional child)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-skilled-additional-funds-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUKSkilledWorkerDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// ==================== UNITED STATES VISA UPLOAD INTERFACES ====================

function generateUSH1BUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-briefcase"></i> US H-1B Specialty Occupation Visa</h2>
                <p>Upload required documents for the H-1B visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="usH1BProgressBar"></div>
                    <span class="progress-text" id="usH1BProgressText">0% Complete</span>
                </div>
            </div>
            <div class="document-categories">
                <div class="document-category">
                    <div class="category-header"><i class="fas fa-id-card"></i><h3>Identity Documents</h3><span class="category-status">0/4</span></div>
                    <div class="upload-fields">
                        <div class="upload-field"><label>Valid Passport (6+ months)</label><div class="file-upload-zone" data-field="us-h1b-passport"><i class="fas fa-passport"></i><p>Upload passport</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-h1b-passport-files"></div></div>
                        <div class="upload-field"><label>Old Passports (if any)</label><div class="file-upload-zone" data-field="us-h1b-old-passports"><i class="fas fa-passport"></i><p>Upload old passports</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-h1b-old-passports-files"></div></div>
                        <div class="upload-field"><label>US Visa Photos</label><div class="file-upload-zone" data-field="us-h1b-photos"><i class="fas fa-camera"></i><p>Upload 2 recent photos</p><input type="file" multiple accept=".jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-h1b-photos-files"></div></div>
                        <div class="upload-field"><label>Birth Certificate</label><div class="file-upload-zone" data-field="us-h1b-birth"><i class="fas fa-baby"></i><p>Upload birth certificate</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-h1b-birth-files"></div></div>
                    </div>
                </div>
                <div class="document-category">
                    <div class="category-header"><i class="fas fa-file-alt"></i><h3>Application Forms</h3><span class="category-status">0/4</span></div>
                    <div class="upload-fields">
                        <div class="upload-field"><label>Form DS-160 Confirmation</label><div class="file-upload-zone" data-field="us-h1b-ds160"><i class="fas fa-file-signature"></i><p>Upload DS-160 confirmation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-ds160-files"></div></div>
                        <div class="upload-field"><label>Form I-797 Approval Notice</label><div class="file-upload-zone" data-field="us-h1b-i797"><i class="fas fa-file"></i><p>Upload I-797 (H-1B approval)</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-i797-files"></div></div>
                        <div class="upload-field"><label>Interview Appointment Confirmation</label><div class="file-upload-zone" data-field="us-h1b-appointment"><i class="fas fa-calendar-check"></i><p>Upload appointment confirmation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-appointment-files"></div></div>
                        <div class="upload-field"><label>Visa Fee Receipt</label><div class="file-upload-zone" data-field="us-h1b-fee"><i class="fas fa-receipt"></i><p>Upload $205 fee receipt</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-h1b-fee-files"></div></div>
                    </div>
                </div>
                <div class="document-category">
                    <div class="category-header"><i class="fas fa-briefcase"></i><h3>Employment Documents</h3><span class="category-status">0/6</span></div>
                    <div class="upload-fields">
                        <div class="upload-field"><label>Approved H-1B Petition (I-129)</label><div class="file-upload-zone" data-field="us-h1b-i129"><i class="fas fa-file-contract"></i><p>Upload Form I-129 (copy)</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-i129-files"></div></div>
                        <div class="upload-field"><label>Certified LCA</label><div class="file-upload-zone" data-field="us-h1b-lca"><i class="fas fa-balance-scale"></i><p>Upload certified Labor Condition Application</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-lca-files"></div></div>
                        <div class="upload-field"><label>Offer Letter</label><div class="file-upload-zone" data-field="us-h1b-offer"><i class="fas fa-file-alt"></i><p>Upload US employer offer letter</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-h1b-offer-files"></div></div>
                        <div class="upload-field"><label>Employment Verification (current)</label><div class="file-upload-zone" data-field="us-h1b-employment-verification"><i class="fas fa-building"></i><p>Upload current employment letter</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-h1b-employment-verification-files"></div></div>
                        <div class="upload-field"><label>Job Description & Duties</label><div class="file-upload-zone" data-field="us-h1b-job-desc"><i class="fas fa-list"></i><p>Upload job description and duties</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-h1b-job-desc-files"></div></div>
                        <div class="upload-field"><label>Client/Vendor Letters (if applicable)</label><div class="file-upload-zone" data-field="us-h1b-client-vendor"><i class="fas fa-handshake"></i><p>Upload client letter, SOW, MSA</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-client-vendor-files"></div></div>
                    </div>
                </div>
                <div class="document-category">
                    <div class="category-header"><i class="fas fa-graduation-cap"></i><h3>Educational Qualifications</h3><span class="category-status">0/4</span></div>
                    <div class="upload-fields">
                        <div class="upload-field"><label>Degree Certificates</label><div class="file-upload-zone" data-field="us-h1b-degrees"><i class="fas fa-scroll"></i><p>Upload Bachelor's/Master's/PhD</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-degrees-files"></div></div>
                        <div class="upload-field"><label>Academic Transcripts</label><div class="file-upload-zone" data-field="us-h1b-transcripts"><i class="fas fa-list-alt"></i><p>Upload transcripts</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-transcripts-files"></div></div>
                        <div class="upload-field"><label>Credential Evaluation</label><div class="file-upload-zone" data-field="us-h1b-evaluation"><i class="fas fa-certificate"></i><p>Upload US credential evaluation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-evaluation-files"></div></div>
                        <div class="upload-field"><label>Professional Licenses/Certifications</label><div class="file-upload-zone" data-field="us-h1b-licenses"><i class="fas fa-id-badge"></i><p>Upload licenses/certifications</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-licenses-files"></div></div>
                    </div>
                </div>
                <div class="document-category">
                    <div class="category-header"><i class="fas fa-briefcase"></i><h3>Work Experience</h3><span class="category-status">0/3</span></div>
                    <div class="upload-fields">
                        <div class="upload-field"><label>Resume/CV</label><div class="file-upload-zone" data-field="us-h1b-resume"><i class="fas fa-file"></i><p>Upload resume/CV</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-h1b-resume-files"></div></div>
                        <div class="upload-field"><label>Employment Reference Letters</label><div class="file-upload-zone" data-field="us-h1b-references"><i class="fas fa-file-alt"></i><p>Upload reference letters</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-h1b-references-files"></div></div>
                        <div class="upload-field"><label>Experience Letters with Job Descriptions</label><div class="file-upload-zone" data-field="us-h1b-experience"><i class="fas fa-clipboard"></i><p>Upload experience letters with duties</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-h1b-experience-files"></div></div>
                    </div>
                </div>
                <div class="document-category">
                    <div class="category-header"><i class="fas fa-dollar-sign"></i><h3>Financial (If already in US)</h3><span class="category-status">0/3</span></div>
                    <div class="upload-fields">
                        <div class="upload-field"><label>Recent Paystubs (3-6 months)</label><div class="file-upload-zone" data-field="us-h1b-paystubs"><i class="fas fa-file-invoice-dollar"></i><p>Upload paystubs</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-paystubs-files"></div></div>
                        <div class="upload-field"><label>W-2 Tax Forms</label><div class="file-upload-zone" data-field="us-h1b-w2"><i class="fas fa-file-invoice"></i><p>Upload W-2 forms</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-h1b-w2-files"></div></div>
                        <div class="upload-field"><label>Employment Confirmation</label><div class="file-upload-zone" data-field="us-h1b-employment-confirm"><i class="fas fa-briefcase"></i><p>Upload employment confirmation</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-h1b-employment-confirm-files"></div></div>
                    </div>
                </div>
            </div>
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUSH1BDocuments()"><i class="fas fa-paper-plane"></i> Submit Documents</button>
                <button class="btn btn-secondary" onclick="saveProgress()"><i class="fas fa-save"></i> Save Progress</button>
            </div>
        </div>
    `;
}

function generateUSF1UploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-graduation-cap"></i> US F-1 Student Visa</h2>
                <p>Upload required documents for the F-1 student visa</p>
                <div class="progress-indicator"><div class="progress-bar" id="usF1ProgressBar"></div><span class="progress-text" id="usF1ProgressText">0% Complete</span></div>
            </div>
            <div class="document-categories">
                <div class="document-category"><div class="category-header"><i class="fas fa-file-alt"></i><h3>Essential Documents</h3><span class="category-status">0/7</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Passport</label><div class="file-upload-zone" data-field="us-f1-passport"><i class="fas fa-passport"></i><p>Upload passport</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-passport-files"></div></div>
                    <div class="upload-field"><label>Form I-20</label><div class="file-upload-zone" data-field="us-f1-i20"><i class="fas fa-file"></i><p>Upload I-20</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-i20-files"></div></div>
                    <div class="upload-field"><label>SEVIS Fee Receipt (I-901)</label><div class="file-upload-zone" data-field="us-f1-sevis"><i class="fas fa-receipt"></i><p>Upload $350 SEVIS receipt</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-sevis-files"></div></div>
                    <div class="upload-field"><label>DS-160 Confirmation</label><div class="file-upload-zone" data-field="us-f1-ds160"><i class="fas fa-file-signature"></i><p>Upload DS-160 confirmation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-ds160-files"></div></div>
                    <div class="upload-field"><label>Visa Fee Receipt</label><div class="file-upload-zone" data-field="us-f1-visa-fee"><i class="fas fa-receipt"></i><p>Upload $185 fee receipt</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-visa-fee-files"></div></div>
                    <div class="upload-field"><label>Photos</label><div class="file-upload-zone" data-field="us-f1-photos"><i class="fas fa-camera"></i><p>Upload 2 passport photos</p><input type="file" multiple accept=".jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-photos-files"></div></div>
                    <div class="upload-field"><label>Interview Appointment Confirmation</label><div class="file-upload-zone" data-field="us-f1-appointment"><i class="fas fa-calendar-check"></i><p>Upload appointment confirmation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-appointment-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-dollar-sign"></i><h3>Financial Proof</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Bank Statements (3-6 months)</label><div class="file-upload-zone" data-field="us-f1-bank"><i class="fas fa-university"></i><p>Upload bank statements</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-bank-files"></div></div>
                    <div class="upload-field"><label>Sponsor Financials</label><div class="file-upload-zone" data-field="us-f1-sponsor"><i class="fas fa-user-friends"></i><p>Upload sponsor bank, ITRs, employment letter</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-sponsor-files"></div></div>
                    <div class="upload-field"><label>Affidavit of Support</label><div class="file-upload-zone" data-field="us-f1-affidavit"><i class="fas fa-file"></i><p>Upload affidavit of support</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-affidavit-files"></div></div>
                    <div class="upload-field"><label>Scholarship/Loan Letters</label><div class="file-upload-zone" data-field="us-f1-funding"><i class="fas fa-file-invoice-dollar"></i><p>Upload scholarship/education loan</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-funding-files"></div></div>
                    <div class="upload-field"><label>Fixed Deposits</label><div class="file-upload-zone" data-field="us-f1-fd"><i class="fas fa-coins"></i><p>Upload FD certificates</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-fd-files"></div></div>
                    <div class="upload-field"><label>Property Valuation (optional)</label><div class="file-upload-zone" data-field="us-f1-property"><i class="fas fa-home"></i><p>Upload property valuation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-property-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-school"></i><h3>Academic Documents</h3><span class="category-status">0/7</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Transcripts & Certificates</label><div class="file-upload-zone" data-field="us-f1-transcripts"><i class="fas fa-scroll"></i><p>Upload 10th, 12th, bachelor's, etc.</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-transcripts-files"></div></div>
                    <div class="upload-field"><label>Degree/Diploma Certificates</label><div class="file-upload-zone" data-field="us-f1-degrees"><i class="fas fa-certificate"></i><p>Upload degrees/diplomas</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-degrees-files"></div></div>
                    <div class="upload-field"><label>English Proficiency</label><div class="file-upload-zone" data-field="us-f1-english"><i class="fas fa-language"></i><p>Upload IELTS/TOEFL/PTE/Duolingo</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-english-files"></div></div>
                    <div class="upload-field"><label>Admission Tests</label><div class="file-upload-zone" data-field="us-f1-tests"><i class="fas fa-file-alt"></i><p>Upload GRE/GMAT/SAT/ACT as required</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-tests-files"></div></div>
                    <div class="upload-field"><label>LORs (2-3)</label><div class="file-upload-zone" data-field="us-f1-lor"><i class="fas fa-envelope"></i><p>Upload recommendation letters</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-f1-lor-files"></div></div>
                    <div class="upload-field"><label>SOP</label><div class="file-upload-zone" data-field="us-f1-sop"><i class="fas fa-file-alt"></i><p>Upload Statement of Purpose</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-f1-sop-files"></div></div>
                    <div class="upload-field"><label>Resume/CV</label><div class="file-upload-zone" data-field="us-f1-resume"><i class="fas fa-file"></i><p>Upload resume/CV</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-f1-resume-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-plus-circle"></i><h3>Additional</h3><span class="category-status">0/4</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Ties to Home Country</label><div class="file-upload-zone" data-field="us-f1-ties"><i class="fas fa-anchor"></i><p>Upload property, family, employment ties</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-ties-files"></div></div>
                    <div class="upload-field"><label>Awards/Research</label><div class="file-upload-zone" data-field="us-f1-awards"><i class="fas fa-award"></i><p>Upload awards, papers, publications</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-awards-files"></div></div>
                    <div class="upload-field"><label>Internship Certificates</label><div class="file-upload-zone" data-field="us-f1-internships"><i class="fas fa-briefcase"></i><p>Upload internships</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-f1-internships-files"></div></div>
                    <div class="upload-field"><label>F-2 Dependents (if any)</label><div class="file-upload-zone" data-field="us-f1-f2"><i class="fas fa-users"></i><p>Upload marriage/birth certs, dependent I-20</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-f1-f2-files"></div></div>
                </div></div>
            </div>
            <div class="upload-actions"><button class="btn btn-primary" onclick="submitUSF1Documents()"><i class="fas fa-paper-plane"></i> Submit Documents</button><button class="btn btn-secondary" onclick="saveProgress()"><i class="fas fa-save"></i> Save Progress</button></div>
        </div>
    `;
}

function generateUSB1B2UploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header"><h2><i class="fas fa-plane"></i> US B-1/B-2 Visitor/Tourist Visa</h2><p>Upload documents for business/tourism/medical/family visits</p><div class="progress-indicator"><div class="progress-bar" id="usB1B2ProgressBar"></div><span class="progress-text" id="usB1B2ProgressText">0% Complete</span></div></div>
            <div class="document-categories">
                <div class="document-category"><div class="category-header"><i class="fas fa-id-card"></i><h3>Identity & Application</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Passport</label><div class="file-upload-zone" data-field="us-b1b2-passport"><i class="fas fa-passport"></i><p>Upload passport</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-passport-files"></div></div>
                    <div class="upload-field"><label>Previous Passports</label><div class="file-upload-zone" data-field="us-b1b2-old-passports"><i class="fas fa-passport"></i><p>Upload previous passports</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-old-passports-files"></div></div>
                    <div class="upload-field"><label>Photos</label><div class="file-upload-zone" data-field="us-b1b2-photos"><i class="fas fa-camera"></i><p>Upload photos</p><input type="file" multiple accept=".jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-photos-files"></div></div>
                    <div class="upload-field"><label>DS-160 Confirmation</label><div class="file-upload-zone" data-field="us-b1b2-ds160"><i class="fas fa-file-signature"></i><p>Upload DS-160 confirmation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-ds160-files"></div></div>
                    <div class="upload-field"><label>Visa Fee Receipt</label><div class="file-upload-zone" data-field="us-b1b2-fee"><i class="fas fa-receipt"></i><p>Upload $185 fee receipt</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-fee-files"></div></div>
                    <div class="upload-field"><label>Interview Appointment</label><div class="file-upload-zone" data-field="us-b1b2-appointment"><i class="fas fa-calendar-check"></i><p>Upload appointment letter</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-appointment-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-map"></i><h3>Travel Plans</h3><span class="category-status">0/3</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Itinerary</label><div class="file-upload-zone" data-field="us-b1b2-itinerary"><i class="fas fa-map-marked-alt"></i><p>Upload detailed itinerary</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-itinerary-files"></div></div>
                    <div class="upload-field"><label>Flight Reservations</label><div class="file-upload-zone" data-field="us-b1b2-flights"><i class="fas fa-plane"></i><p>Upload roundtrip reservations</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-flights-files"></div></div>
                    <div class="upload-field"><label>Hotel/Accommodation</label><div class="file-upload-zone" data-field="us-b1b2-hotel"><i class="fas fa-hotel"></i><p>Upload hotel bookings</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-hotel-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-dollar-sign"></i><h3>Financial Proof</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Bank Statements</label><div class="file-upload-zone" data-field="us-b1b2-bank"><i class="fas fa-university"></i><p>Upload 3-6 months statements</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-bank-files"></div></div>
                    <div class="upload-field"><label>Fixed Deposits</label><div class="file-upload-zone" data-field="us-b1b2-fd"><i class="fas fa-coins"></i><p>Upload FD certificates</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-fd-files"></div></div>
                    <div class="upload-field"><label>Income Tax Returns</label><div class="file-upload-zone" data-field="us-b1b2-itr"><i class="fas fa-file-invoice"></i><p>Upload last 3 years ITR</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-itr-files"></div></div>
                    <div class="upload-field"><label>Property Documents</label><div class="file-upload-zone" data-field="us-b1b2-property"><i class="fas fa-home"></i><p>Upload property documents</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-property-files"></div></div>
                    <div class="upload-field"><label>Investments</label><div class="file-upload-zone" data-field="us-b1b2-investments"><i class="fas fa-chart-line"></i><p>Upload investment portfolio</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-investments-files"></div></div>
                    <div class="upload-field"><label>Payslips</label><div class="file-upload-zone" data-field="us-b1b2-payslips"><i class="fas fa-file-invoice-dollar"></i><p>Upload 3-6 months payslips</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-payslips-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-anchor"></i><h3>Ties to Home Country</h3><span class="category-status">0/4</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Employment Letter</label><div class="file-upload-zone" data-field="us-b1b2-employment"><i class="fas fa-briefcase"></i><p>Upload employment letter with leave approval</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-employment-files"></div></div>
                    <div class="upload-field"><label>Business Ownership</label><div class="file-upload-zone" data-field="us-b1b2-business"><i class="fas fa-building"></i><p>Upload business documents</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-business-files"></div></div>
                    <div class="upload-field"><label>Student Enrollment (if applicable)</label><div class="file-upload-zone" data-field="us-b1b2-student"><i class="fas fa-school"></i><p>Upload enrollment letter</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-student-files"></div></div>
                    <div class="upload-field"><label>Family/Property Ties</label><div class="file-upload-zone" data-field="us-b1b2-family"><i class="fas fa-users"></i><p>Upload family/property ties</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-family-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-briefcase"></i><h3>Purpose-specific</h3><span class="category-status">0/4</span></div><div class="upload-fields">
                    <div class="upload-field"><label>B-1: Business Invite</label><div class="file-upload-zone" data-field="us-b1b2-business-invite"><i class="fas fa-envelope"></i><p>Upload invite, registrations, confirmations</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-business-invite-files"></div></div>
                    <div class="upload-field"><label>B-2: Tourism Plans</label><div class="file-upload-zone" data-field="us-b1b2-tourism"><i class="fas fa-route"></i><p>Upload tour plans</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-tourism-files"></div></div>
                    <div class="upload-field"><label>Medical Treatment</label><div class="file-upload-zone" data-field="us-b1b2-medical"><i class="fas fa-stethoscope"></i><p>Upload reports, US doctor letter, cost estimate</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-medical-files"></div></div>
                    <div class="upload-field"><label>Visiting Family/Friends</label><div class="file-upload-zone" data-field="us-b1b2-visiting"><i class="fas fa-home"></i><p>Upload host invitation, status, utility bills, relationship proof</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-b1b2-visiting-files"></div></div>
                </div></div>
            </div>
            <div class="upload-actions"><button class="btn btn-primary" onclick="submitUSB1B2Documents()"><i class="fas fa-paper-plane"></i> Submit Documents</button><button class="btn btn-secondary" onclick="saveProgress()"><i class="fas fa-save"></i> Save Progress</button></div>
        </div>
    `;
}

function generateUSL1UploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header"><h2><i class="fas fa-exchange-alt"></i> US L-1 Intracompany Transfer Visa</h2><p>Upload documents for L-1A/L-1B</p><div class="progress-indicator"><div class="progress-bar" id="usL1ProgressBar"></div><span class="progress-text" id="usL1ProgressText">0% Complete</span></div></div>
            <div class="document-categories">
                <div class="document-category"><div class="category-header"><i class="fas fa-file-alt"></i><h3>Application Documents</h3><span class="category-status">0/9</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Passport</label><div class="file-upload-zone" data-field="us-l1-passport"><i class="fas fa-passport"></i><p>Upload passport</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-l1-passport-files"></div></div>
                    <div class="upload-field"><label>Previous Passports</label><div class="file-upload-zone" data-field="us-l1-old-passports"><i class="fas fa-passport"></i><p>Upload previous passports</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-l1-old-passports-files"></div></div>
                    <div class="upload-field"><label>DS-160 Confirmation</label><div class="file-upload-zone" data-field="us-l1-ds160"><i class="fas fa-file-signature"></i><p>Upload DS-160 confirmation</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-ds160-files"></div></div>
                    <div class="upload-field"><label>I-129 (copy) & I-797</label><div class="file-upload-zone" data-field="us-l1-i129-i797"><i class="fas fa-file"></i><p>Upload I-129 & I-797 approval</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-i129-i797-files"></div></div>
                    <div class="upload-field"><label>I-129S (blanket)</label><div class="file-upload-zone" data-field="us-l1-i129s"><i class="fas fa-copy"></i><p>Upload I-129S + 3 copies of I-797</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-i129s-files"></div></div>
                    <div class="upload-field"><label>Interview Appointment</label><div class="file-upload-zone" data-field="us-l1-appointment"><i class="fas fa-calendar-check"></i><p>Upload appointment letter</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-appointment-files"></div></div>
                    <div class="upload-field"><label>Visa Fee Receipt</label><div class="file-upload-zone" data-field="us-l1-fee"><i class="fas fa-receipt"></i><p>Upload $205 fee receipt</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-l1-fee-files"></div></div>
                    <div class="upload-field"><label>Fraud Prevention Fee</label><div class="file-upload-zone" data-field="us-l1-fraud"><i class="fas fa-shield-alt"></i><p>Upload $500 fee proof (first-time)</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-l1-fraud-files"></div></div>
                    <div class="upload-field"><label>Photographs</label><div class="file-upload-zone" data-field="us-l1-photos"><i class="fas fa-camera"></i><p>Upload 2 color photographs</p><input type="file" multiple accept=".jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-l1-photos-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-briefcase"></i><h3>Employment Documents</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Transfer Letter</label><div class="file-upload-zone" data-field="us-l1-transfer-letter"><i class="fas fa-file-alt"></i><p>Upload employer transfer letter</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-l1-transfer-letter-files"></div></div>
                    <div class="upload-field"><label>US Job Offer</label><div class="file-upload-zone" data-field="us-l1-offer"><i class="fas fa-file-contract"></i><p>Upload US offer letter</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-l1-offer-files"></div></div>
                    <div class="upload-field"><label>Job Description</label><div class="file-upload-zone" data-field="us-l1-job-desc"><i class="fas fa-list"></i><p>Upload detailed job description</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-l1-job-desc-files"></div></div>
                    <div class="upload-field"><label>Foreign Company Employment Verification</label><div class="file-upload-zone" data-field="us-l1-foreign-verification"><i class="fas fa-building"></i><p>Upload verification letter</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-l1-foreign-verification-files"></div></div>
                    <div class="upload-field"><label>Board Resolution/Appointment</label><div class="file-upload-zone" data-field="us-l1-board"><i class="fas fa-gavel"></i><p>Upload board/appointment docs</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-board-files"></div></div>
                    <div class="upload-field"><label>Organizational Charts</label><div class="file-upload-zone" data-field="us-l1-org-charts"><i class="fas fa-sitemap"></i><p>Upload org charts (both entities)</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-org-charts-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-user-tie"></i><h3>Work Experience</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Resume/CV</label><div class="file-upload-zone" data-field="us-l1-resume"><i class="fas fa-file"></i><p>Upload resume/CV</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-l1-resume-files"></div></div>
                    <div class="upload-field"><label>Reference Letters</label><div class="file-upload-zone" data-field="us-l1-references"><i class="fas fa-file-alt"></i><p>Upload reference letters</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-l1-references-files"></div></div>
                    <div class="upload-field"><label>Coworker Contacts (2)</label><div class="file-upload-zone" data-field="us-l1-contacts"><i class="fas fa-address-book"></i><p>Upload contact info (current/previous)</p><input type="file" multiple accept=".pdf,.doc,.docx" style="display:none;"></div><div class="uploaded-files" id="us-l1-contacts-files"></div></div>
                    <div class="upload-field"><label>Payslips (6 months)</label><div class="file-upload-zone" data-field="us-l1-payslips"><i class="fas fa-file-invoice-dollar"></i><p>Upload payslips</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-payslips-files"></div></div>
                    <div class="upload-field"><label>Income Tax Records</label><div class="file-upload-zone" data-field="us-l1-tax"><i class="fas fa-file-invoice"></i><p>Upload tax records</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-tax-files"></div></div>
                    <div class="upload-field"><label>W-2 (if previously in US)</label><div class="file-upload-zone" data-field="us-l1-w2"><i class="fas fa-file-invoice"></i><p>Upload W-2 forms</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-w2-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-link"></i><h3>Company Relationship Proof</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Corporate Documents</label><div class="file-upload-zone" data-field="us-l1-corporate"><i class="fas fa-file-alt"></i><p>Upload articles, agreements</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-corporate-files"></div></div>
                    <div class="upload-field"><label>Financial Statements / Tax Returns</label><div class="file-upload-zone" data-field="us-l1-financial"><i class="fas fa-coins"></i><p>Upload financials</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-financial-files"></div></div>
                    <div class="upload-field"><label>Inter-company Contracts</label><div class="file-upload-zone" data-field="us-l1-contracts"><i class="fas fa-file-contract"></i><p>Upload contracts between entities</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-contracts-files"></div></div>
                    <div class="upload-field"><label>Org Structure & Annual Reports</label><div class="file-upload-zone" data-field="us-l1-structure"><i class="fas fa-sitemap"></i><p>Upload structure/reports</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-structure-files"></div></div>
                    <div class="upload-field"><label>Business Licenses</label><div class="file-upload-zone" data-field="us-l1-licenses"><i class="fas fa-id-badge"></i><p>Upload licenses</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-licenses-files"></div></div>
                    <div class="upload-field"><label>New Office (if applicable)</label><div class="file-upload-zone" data-field="us-l1-new-office"><i class="fas fa-city"></i><p>Upload lease, plan, projections, funding</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-l1-new-office-files"></div></div>
                </div></div>
            </div>
            <div class="upload-actions"><button class="btn btn-primary" onclick="submitUSL1Documents()"><i class="fas fa-paper-plane"></i> Submit Documents</button><button class="btn btn-secondary" onclick="saveProgress()"><i class="fas fa-save"></i> Save Progress</button></div>
        </div>
    `;
}

function generateUSEmploymentBasedUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header"><h2><i class="fas fa-id-card"></i> US Employment-Based Green Card (EB-1 / EB-2 / EB-3)</h2><p>Upload documents for EB categories</p><div class="progress-indicator"><div class="progress-bar" id="usEBProgressBar"></div><span class="progress-text" id="usEBProgressText">0% Complete</span></div></div>
            <div class="document-categories">
                <div class="document-category"><div class="category-header"><i class="fas fa-file-alt"></i><h3>General Documents</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Form I-140</label><div class="file-upload-zone" data-field="us-eb-i140"><i class="fas fa-file"></i><p>Upload I-140 petition</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb-i140-files"></div></div>
                    <div class="upload-field"><label>PERM Labor Certification</label><div class="file-upload-zone" data-field="us-eb-perm"><i class="fas fa-balance-scale"></i><p>Upload PERM (if required)</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb-perm-files"></div></div>
                    <div class="upload-field"><label>Passport & Birth Certificate</label><div class="file-upload-zone" data-field="us-eb-passport-birth"><i class="fas fa-id-card"></i><p>Upload passport and birth certificate</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-eb-passport-birth-files"></div></div>
                    <div class="upload-field"><label>Marriage Certificate (if applicable)</label><div class="file-upload-zone" data-field="us-eb-marriage"><i class="fas fa-ring"></i><p>Upload marriage certificate</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;"></div><div class="uploaded-files" id="us-eb-marriage-files"></div></div>
                    <div class="upload-field"><label>Educational Credentials</label><div class="file-upload-zone" data-field="us-eb-education"><i class="fas fa-graduation-cap"></i><p>Upload degrees, transcripts, evaluations</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb-education-files"></div></div>
                    <div class="upload-field"><label>Employment/Ability to Pay</label><div class="file-upload-zone" data-field="us-eb-employer"><i class="fas fa-briefcase"></i><p>Upload job offer, employer taxes/financials</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb-employer-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-star"></i><h3>EB-1A (Extraordinary Ability)</h3><span class="category-status">0/8</span></div><div class="upload-fields">
                    <div class="upload-field"><label>Major Awards</label><div class="file-upload-zone" data-field="us-eb1a-awards"><i class="fas fa-trophy"></i><p>Upload awards (e.g., major prizes)</p><input type="file" multiple accept=".pdf,.jpg,.png" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-awards-files"></div></div>
                    <div class="upload-field"><label>Selective Memberships</label><div class="file-upload-zone" data-field="us-eb1a-memberships"><i class="fas fa-users"></i><p>Upload memberships evidence</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-memberships-files"></div></div>
                    <div class="upload-field"><label>Published Material</label><div class="file-upload-zone" data-field="us-eb1a-media"><i class="fas fa-newspaper"></i><p>Upload media about your work</p><input type="file" multiple accept=".pdf,.jpg,.png" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-media-files"></div></div>
                    <div class="upload-field"><label>Original Contributions</label><div class="file-upload-zone" data-field="us-eb1a-contributions"><i class="fas fa-lightbulb"></i><p>Upload proof of significant contributions</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-contributions-files"></div></div>
                    <div class="upload-field"><label>Scholarly Publications</label><div class="file-upload-zone" data-field="us-eb1a-publications"><i class="fas fa-book"></i><p>Upload publications</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-publications-files"></div></div>
                    <div class="upload-field"><label>Judging Others' Work</label><div class="file-upload-zone" data-field="us-eb1a-judging"><i class="fas fa-gavel"></i><p>Upload judging evidence</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-judging-files"></div></div>
                    <div class="upload-field"><label>High Salary Evidence</label><div class="file-upload-zone" data-field="us-eb1a-salary"><i class="fas fa-dollar-sign"></i><p>Upload salary evidence</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-salary-files"></div></div>
                    <div class="upload-field"><label>Exhibition/Critical Role</label><div class="file-upload-zone" data-field="us-eb1a-role"><i class="fas fa-theater-masks"></i><p>Upload exhibition/critical role evidence</p><input type="file" multiple accept=".pdf,.jpg,.png" style="display:none;"></div><div class="uploaded-files" id="us-eb1a-role-files"></div></div>
                </div></div>
                <div class="document-category"><div class="category-header"><i class="fas fa-university"></i><h3>EB-1B/EB-1C & EB-2/EB-3 Specifics</h3><span class="category-status">0/6</span></div><div class="upload-fields">
                    <div class="upload-field"><label>EB-1B: Job Offer & 3+ Years Experience</label><div class="file-upload-zone" data-field="us-eb1b-offer"><i class="fas fa-briefcase"></i><p>Upload offer and experience proof</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb1b-offer-files"></div></div>
                    <div class="upload-field"><label>EB-1C: Multinational Manager Evidence</label><div class="file-upload-zone" data-field="us-eb1c"><i class="fas fa-project-diagram"></i><p>Upload managerial/executive evidence</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb1c-files"></div></div>
                    <div class="upload-field"><label>EB-2: Advanced Degree/Exceptional Ability</label><div class="file-upload-zone" data-field="us-eb2"><i class="fas fa-user-graduate"></i><p>Upload degree, 5 years experience, license, memberships</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb2-files"></div></div>
                    <div class="upload-field"><label>EB-2 NIW: National Interest Evidence</label><div class="file-upload-zone" data-field="us-eb2-niw"><i class="fas fa-flag-usa"></i><p>Upload NIW evidence & proposal</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb2-niw-files"></div></div>
                    <div class="upload-field"><label>EB-3: Credentials per Subcategory</label><div class="file-upload-zone" data-field="us-eb3"><i class="fas fa-certificate"></i><p>Upload EB-3 specific credentials</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb3-files"></div></div>
                    <div class="upload-field"><label>Prevailing Wage/Ability to Pay</label><div class="file-upload-zone" data-field="us-eb-pay"><i class="fas fa-money-bill"></i><p>Upload prevailing wage, employer financials</p><input type="file" multiple accept=".pdf" style="display:none;"></div><div class="uploaded-files" id="us-eb-pay-files"></div></div>
                </div></div>
            </div>
            <div class="upload-actions"><button class="btn btn-primary" onclick="submitUSEmploymentBasedDocuments()"><i class="fas fa-paper-plane"></i> Submit Documents</button><button class="btn btn-secondary" onclick="saveProgress()"><i class="fas fa-save"></i> Save Progress</button></div>
        </div>
    `;
}

function generateUSJ1UploadInterface() { return basicTwoColUSInterface('US J-1 Exchange Visitor Visa','usJ1', [
    {label:'Passport', field:'passport', icon:'fa-passport'},
    {label:'Form DS-2019', field:'ds2019', icon:'fa-file'},
    {label:'SEVIS Fee Receipt (I-901)', field:'sevis', icon:'fa-receipt'},
    {label:'DS-160 Confirmation', field:'ds160', icon:'fa-file-signature'},
    {label:'Visa Fee Receipt', field:'fee', icon:'fa-receipt'},
    {label:'Program Acceptance Letter', field:'accept', icon:'fa-envelope'},
    {label:'Financial Support Evidence', field:'funds', icon:'fa-dollar-sign'},
    {label:'Academic Credentials', field:'academics', icon:'fa-graduation-cap'},
    {label:'Resume/CV', field:'resume', icon:'fa-file'},
    {label:'Proof of Ties to Home Country', field:'ties', icon:'fa-anchor'}
]); }

function generateUSO1UploadInterface() { return basicTwoColUSInterface('US O-1 Extraordinary Ability Visa','usO1', [
    {label:'Passport', field:'passport', icon:'fa-passport'},
    {label:'I-129 & I-797 Approval', field:'i129i797', icon:'fa-file'},
    {label:'DS-160 Confirmation', field:'ds160', icon:'fa-file-signature'},
    {label:'Awards & Honors', field:'awards', icon:'fa-trophy'},
    {label:'Media Coverage', field:'media', icon:'fa-newspaper'},
    {label:'High Salary Evidence', field:'salary', icon:'fa-dollar-sign'},
    {label:'Critical Role Evidence', field:'role', icon:'fa-briefcase'},
    {label:'Published Materials', field:'publications', icon:'fa-book'},
    {label:'Employer/Agent Contract', field:'contract', icon:'fa-file-contract'},
    {label:'Itinerary of Events', field:'itinerary', icon:'fa-route'},
    {label:'Consultation Letters', field:'consultation', icon:'fa-comment-dots'}
]); }

function generateUSK1UploadInterface() { return basicTwoColUSInterface('US K-1 Fiancé(e) Visa','usK1', [
    {label:'Passport', field:'passport', icon:'fa-passport'},
    {label:'Approved I-129F Petition', field:'i129f', icon:'fa-file'},
    {label:'DS-160 Confirmation', field:'ds160', icon:'fa-file-signature'},
    {label:'Relationship Evidence (photos, chats, trips)', field:'relationship', icon:'fa-heart'},
    {label:'Proof of In-Person Meeting (past 2 years)', field:'meeting', icon:'fa-users'},
    {label:'Police Clearance Certificates', field:'pcc', icon:'fa-shield-alt'},
    {label:'Medical Examination', field:'medical', icon:'fa-stethoscope'},
    {label:'Financial Support (I-134)', field:'i134', icon:'fa-file-invoice'},
    {label:'Divorce Decrees (if any)', field:'divorce', icon:'fa-file-alt'}
]); }

function basicTwoColUSInterface(title, prefix, items) {
    const fields = items.map(it => `
        <div class="upload-field">
            <label>${it.label}</label>
            <div class="file-upload-zone" data-field="${prefix}-${it.field}">
                <i class="fas ${it.icon}"></i>
                <p>Upload ${it.label.toLowerCase()}</p>
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="display:none;">
            </div>
            <div class="uploaded-files" id="${prefix}-${it.field}-files"></div>
        </div>`).join('\n');
    return `
        <div class="visa-upload-container">
            <div class="upload-header"><h2>${title}</h2><p>Upload required documents</p><div class="progress-indicator"><div class="progress-bar"></div><span class="progress-text">0% Complete</span></div></div>
            <div class="document-categories"><div class="document-category"><div class="category-header"><i class="fas fa-folder-open"></i><h3>Required Documents</h3><span class="category-status">0/${items.length}</span></div><div class="upload-fields">${fields}</div></div></div>
            <div class="upload-actions"><button class="btn btn-primary" onclick="submitGenericUSDocuments('${prefix}')"><i class="fas fa-paper-plane"></i> Submit Documents</button><button class="btn btn-secondary" onclick="saveProgress()"><i class="fas fa-save"></i> Save Progress</button></div>
        </div>`;
}

// Generate UK Student Visa upload interface
function generateUKStudentVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-graduation-cap"></i> UK Student Visa</h2>
                <p>Upload your required documents for UK Student Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="ukStudentProgressBar"></div>
                    <span class="progress-text" id="ukStudentProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Essential Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Essential Documents</h3>
                        <span class="category-status" id="ukStudentEssentialStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport (Blank Page Required)</label>
                            <div class="file-upload-zone" data-field="uk-student-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport with blank page for visa</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Confirmation of Acceptance for Studies (CAS)</label>
                            <div class="file-upload-zone" data-field="uk-student-cas">
                                <i class="fas fa-certificate"></i>
                                <p>Upload CAS from UK institution</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-cas-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>CAS Reference Number</label>
                            <div class="file-upload-zone" data-field="uk-student-cas-reference">
                                <i class="fas fa-hashtag"></i>
                                <p>Upload document showing CAS reference number</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-cas-reference-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport-Sized Photos (2 recent)</label>
                            <div class="file-upload-zone" data-field="uk-student-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 recent passport-sized photos</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-photos-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Proof -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Proof</h3>
                        <span class="category-status" id="ukStudentFinancialStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Evidence of Funds for Tuition + Living Expenses</label>
                            <div class="file-upload-zone" data-field="uk-student-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload evidence of funds: London £1,483/month, Outside London £1,136/month (up to 9 months)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-funds-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Bank Statements (28 days history, within 31 days of application)</label>
                            <div class="file-upload-zone" data-field="uk-student-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements showing 28 days history, within 31 days of application</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tuition Fee Payment Receipts (if paid)</label>
                            <div class="file-upload-zone" data-field="uk-student-tuition-receipts">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload tuition fee payment receipts if already paid</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-tuition-receipts-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsorship Letters (if applicable)</label>
                            <div class="file-upload-zone" data-field="uk-student-sponsorship">
                                <i class="fas fa-user-friends"></i>
                                <p>Upload sponsorship letters if applicable</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-sponsorship-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Academic Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Academic Documents</h3>
                        <span class="category-status" id="ukStudentAcademicStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Previous Degree Certificates and Transcripts</label>
                            <div class="file-upload-zone" data-field="uk-student-previous-degree">
                                <i class="fas fa-scroll"></i>
                                <p>Upload previous degree certificates and transcripts</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-previous-degree-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Academic Qualifications (10th, 12th, Bachelor's, etc.)</label>
                            <div class="file-upload-zone" data-field="uk-student-academic-qual">
                                <i class="fas fa-certificate"></i>
                                <p>Upload academic qualifications (10th, 12th, bachelor's, etc.)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-academic-qual-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Letters of Recommendation (2-3)</label>
                            <div class="file-upload-zone" data-field="uk-student-lor">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload 2-3 letters of recommendation</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-lor-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Statement of Purpose (SOP)</label>
                            <div class="file-upload-zone" data-field="uk-student-sop">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload Statement of Purpose</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-sop-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- English Language -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-language"></i>
                        <h3>English Language</h3>
                        <span class="category-status" id="ukStudentEnglishStatus">0/2</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>IELTS for UKVI / PTE Academic UKVI / TOEFL iBT</label>
                            <div class="file-upload-zone" data-field="uk-student-english-test">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload IELTS for UKVI (5.5-6.5), PTE Academic UKVI, or TOEFL iBT results</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-english-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Exemption Proof (Previous Degree Taught in English)</label>
                            <div class="file-upload-zone" data-field="uk-student-english-exemption">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload exemption proof if previous degree was taught in English</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-english-exemption-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Requirements -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-plus"></i>
                        <h3>Additional Requirements</h3>
                        <span class="category-status" id="ukStudentAdditionalStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>ATAS Certificate (if required)</label>
                            <div class="file-upload-zone" data-field="uk-student-atas">
                                <i class="fas fa-certificate"></i>
                                <p>Upload ATAS certificate if required for course/nationality (STEM subjects)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-atas-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>TB Test Certificate (if from listed countries)</label>
                            <div class="file-upload-zone" data-field="uk-student-tb-test">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload TB test certificate if from listed countries</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-tb-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Accommodation Confirmation/Contract</label>
                            <div class="file-upload-zone" data-field="uk-student-accommodation">
                                <i class="fas fa-home"></i>
                                <p>Upload accommodation confirmation or contract</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-accommodation-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Under-18 Documents (if applicable)</label>
                            <div class="file-upload-zone" data-field="uk-student-under18">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificate, written consent from parents, parent passport copies (if under 18)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-student-under18-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUKStudentDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate UK Visitor/Tourist Visa upload interface
function generateUKVisitorVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-plane"></i> UK Standard Visitor/Tourist Visa</h2>
                <p>Upload your required documents for UK Visitor/Tourist Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="ukVisitorProgressBar"></div>
                    <span class="progress-text" id="ukVisitorProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity & Travel -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity & Travel</h3>
                        <span class="category-status" id="ukVisitorIdentityStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport (Blank Page Required)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport with blank page for visa</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Previous Passports (Travel History)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-previous-passports">
                                <i class="fas fa-passport"></i>
                                <p>Upload previous passports showing travel history</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-previous-passports-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport-Sized Photos (2)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 passport-sized photos</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-photos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Completed Application Form</label>
                            <div class="file-upload-zone" data-field="uk-visitor-application">
                                <i class="fas fa-file-signature"></i>
                                <p>Upload completed visitor visa application form</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-application-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Travel Plans -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-map"></i>
                        <h3>Travel Plans</h3>
                        <span class="category-status" id="ukVisitorTravelStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Detailed Travel Itinerary</label>
                            <div class="file-upload-zone" data-field="uk-visitor-itinerary">
                                <i class="fas fa-map-marked-alt"></i>
                                <p>Upload detailed travel itinerary</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-itinerary-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Flight Bookings (Return Tickets or Reservation)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-flight-bookings">
                                <i class="fas fa-plane"></i>
                                <p>Upload flight bookings showing return tickets or reservation</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-flight-bookings-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Hotel Bookings or Accommodation Details</label>
                            <div class="file-upload-zone" data-field="uk-visitor-accommodation">
                                <i class="fas fa-hotel"></i>
                                <p>Upload hotel bookings or accommodation details</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-accommodation-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Invitation Letter (if visiting family/friends)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-invitation">
                                <i class="fas fa-envelope-open-text"></i>
                                <p>Upload invitation letter if visiting family or friends</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-invitation-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Proof -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Proof</h3>
                        <span class="category-status" id="ukVisitorFinancialStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Bank Statements (3-6 months)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements for last 3-6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Pay Slips (Last 3-6 months)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-payslips">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload pay slips for last 3-6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-payslips-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Income Tax Returns (ITR-V)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-tax-returns">
                                <i class="fas fa-file-invoice"></i>
                                <p>Upload income tax returns (ITR-V)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-tax-returns-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Fixed Deposits, Property Documents, Investments</label>
                            <div class="file-upload-zone" data-field="uk-visitor-assets">
                                <i class="fas fa-chart-line"></i>
                                <p>Upload fixed deposits, property documents, and investment proofs</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-assets-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Funds to Cover Entire Trip</label>
                            <div class="file-upload-zone" data-field="uk-visitor-trip-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload proof of funds to cover entire trip</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-trip-funds-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Employment/Ties to Home Country -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-anchor"></i>
                        <h3>Employment/Ties to Home Country</h3>
                        <span class="category-status" id="ukVisitorTiesStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Employment Letter (Leave Approval, Salary, Position)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-employment">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload employment letter with leave approval, salary, and position</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-employment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Business Registration Documents (if self-employed)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-business-registration">
                                <i class="fas fa-building"></i>
                                <p>Upload business registration documents if self-employed</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-business-registration-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Student Enrollment Letter (if student)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-student-enrollment">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload student enrollment letter if currently studying</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-student-enrollment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Property Ownership Documents</label>
                            <div class="file-upload-zone" data-field="uk-visitor-property">
                                <i class="fas fa-home"></i>
                                <p>Upload property ownership documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-property-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Sponsorship (if applicable) -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-friends"></i>
                        <h3>Sponsorship (if applicable)</h3>
                        <span class="category-status" id="ukVisitorSponsorshipStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Sponsor's Invitation Letter</label>
                            <div class="file-upload-zone" data-field="uk-visitor-sponsor-invitation">
                                <i class="fas fa-envelope-open-text"></i>
                                <p>Upload sponsor's invitation letter</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-sponsor-invitation-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsor's Financial Documents</label>
                            <div class="file-upload-zone" data-field="uk-visitor-sponsor-financial">
                                <i class="fas fa-dollar-sign"></i>
                                <p>Upload sponsor's financial documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-sponsor-financial-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Sponsor's UK Status Proof</label>
                            <div class="file-upload-zone" data-field="uk-visitor-sponsor-status">
                                <i class="fas fa-id-card"></i>
                                <p>Upload sponsor's UK status proof (passport, visa, PR)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-sponsor-status-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-plus"></i>
                        <h3>Additional</h3>
                        <span class="category-status" id="ukVisitorAdditionalStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Cover Letter Explaining Purpose of Visit</label>
                            <div class="file-upload-zone" data-field="uk-visitor-cover-letter">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload cover letter explaining purpose of visit</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-cover-letter-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Previous UK Visa History</label>
                            <div class="file-upload-zone" data-field="uk-visitor-previous-visas">
                                <i class="fas fa-history"></i>
                                <p>Upload previous UK visa history</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-previous-visas-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>TB Certificate (if staying 6+ months)</label>
                            <div class="file-upload-zone" data-field="uk-visitor-tb-certificate">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload TB certificate if staying 6+ months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-visitor-tb-certificate-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUKVisitorDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate UK Spouse/Partner Visa upload interface
function generateUKSpousePartnerUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-heart"></i> UK Spouse/Partner Visa</h2>
                <p>Upload your required documents for UK Spouse/Partner Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="ukSpousePartnerProgressBar"></div>
                    <span class="progress-text" id="ukSpousePartnerProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity Documents</h3>
                        <span class="category-status" id="ukSpousePartnerIdentityStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passports (Both Partners)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-passports">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passports for both partners</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-passports-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Previous Passports</label>
                            <div class="file-upload-zone" data-field="uk-spouse-previous-passports">
                                <i class="fas fa-passport"></i>
                                <p>Upload previous passports for both partners</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-previous-passports-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Birth Certificates</label>
                            <div class="file-upload-zone" data-field="uk-spouse-birth-certificates">
                                <i class="fas fa-baby"></i>
                                <p>Upload birth certificates for both partners</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-birth-certificates-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport-Sized Photos (2 each)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 passport-sized photos for each partner</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-photos-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Relationship Proof -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-heart"></i>
                        <h3>Relationship Proof</h3>
                        <span class="category-status" id="ukSpousePartnerRelationshipStatus">0/6</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Marriage Certificate or Civil Partnership Certificate</label>
                            <div class="file-upload-zone" data-field="uk-spouse-marriage-cert">
                                <i class="fas fa-certificate"></i>
                                <p>Upload marriage certificate or civil partnership certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-marriage-cert-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Photos Together (Throughout Relationship Timeline)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-photos-together">
                                <i class="fas fa-images"></i>
                                <p>Upload photos together throughout relationship timeline</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-photos-together-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Communication Records</label>
                            <div class="file-upload-zone" data-field="uk-spouse-communication">
                                <i class="fas fa-envelope"></i>
                                <p>Upload communication records (emails, messages, video call logs)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-communication-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Travel Documents (Trips Taken Together)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-travel-docs">
                                <i class="fas fa-plane"></i>
                                <p>Upload travel documents showing trips taken together</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-travel-docs-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Booking Confirmations (Holidays, Events)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-booking-confirmations">
                                <i class="fas fa-ticket-alt"></i>
                                <p>Upload booking confirmations for holidays and events</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-booking-confirmations-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Joint Financial Documents</label>
                            <div class="file-upload-zone" data-field="uk-spouse-joint-financial">
                                <i class="fas fa-university"></i>
                                <p>Upload joint financial documents (bank accounts, bills)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-joint-financial-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- UK Sponsor Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-user-friends"></i>
                        <h3>UK Sponsor Documents</h3>
                        <span class="category-status" id="ukSpousePartnerSponsorStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>British Passport or Settled Status Proof</label>
                            <div class="file-upload-zone" data-field="uk-spouse-british-status">
                                <i class="fas fa-id-card"></i>
                                <p>Upload British passport or settled status proof</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-british-status-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Residence in UK</label>
                            <div class="file-upload-zone" data-field="uk-spouse-residence-proof">
                                <i class="fas fa-home"></i>
                                <p>Upload proof of residence in UK</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-residence-proof-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Employment Letter or Pay Slips</label>
                            <div class="file-upload-zone" data-field="uk-spouse-employment">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload employment letter or pay slips</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-employment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Bank Statements</label>
                            <div class="file-upload-zone" data-field="uk-spouse-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-bank-statements-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Evidence (£29,000 requirement) -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Evidence (£29,000 requirement)</h3>
                        <span class="category-status" id="ukSpousePartnerFinancialStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Employment Income (6 months payslips, contract, employer letter)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-employment-income">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload 6 months payslips, employment contract, and employer letter</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-employment-income-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Self-Employment (Tax returns SA302, business accounts)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-self-employment">
                                <i class="fas fa-chart-line"></i>
                                <p>Upload tax returns (SA302) and business accounts if self-employed</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-self-employment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Cash Savings (£16,000+ held for 6 months)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-cash-savings">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload evidence of cash savings £16,000+ held for 6 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-cash-savings-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Pension Income or Combination of Sources</label>
                            <div class="file-upload-zone" data-field="uk-spouse-pension-combination">
                                <i class="fas fa-piggy-bank"></i>
                                <p>Upload pension income or combination of above sources</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-pension-combination-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- English Language -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-language"></i>
                        <h3>English Language</h3>
                        <span class="category-status" id="ukSpousePartnerEnglishStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>SELT Certificate (A1 level) from Approved Provider</label>
                            <div class="file-upload-zone" data-field="uk-spouse-selt-certificate">
                                <i class="fas fa-certificate"></i>
                                <p>Upload SELT certificate (A1 level) from approved provider</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-selt-certificate-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Degree Taught in English</label>
                            <div class="file-upload-zone" data-field="uk-spouse-degree-english">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload degree certificate if taught in English</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-degree-english-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Citizenship from English-Speaking Country</label>
                            <div class="file-upload-zone" data-field="uk-spouse-english-citizenship">
                                <i class="fas fa-passport"></i>
                                <p>Upload passport from English-speaking country (if applicable)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-english-citizenship-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Accommodation -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-home"></i>
                        <h3>Accommodation</h3>
                        <span class="category-status" id="ukSpousePartnerAccommodationStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Tenancy Agreement</label>
                            <div class="file-upload-zone" data-field="uk-spouse-tenancy">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload tenancy agreement</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-tenancy-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Mortgage Documents</label>
                            <div class="file-upload-zone" data-field="uk-spouse-mortgage">
                                <i class="fas fa-home"></i>
                                <p>Upload mortgage documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-mortgage-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Property Ownership Proof</label>
                            <div class="file-upload-zone" data-field="uk-spouse-property-ownership">
                                <i class="fas fa-key"></i>
                                <p>Upload property ownership proof</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-property-ownership-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Letter from Landlord/Homeowner</label>
                            <div class="file-upload-zone" data-field="uk-spouse-landlord-letter">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload letter from landlord or homeowner</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-landlord-letter-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Health & Character -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Health & Character</h3>
                        <span class="category-status" id="ukSpousePartnerHealthStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>TB Test Certificate (if applicable)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-tb-test">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload TB test certificate if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-tb-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Details of Criminal Convictions (if any)</label>
                            <div class="file-upload-zone" data-field="uk-spouse-criminal-convictions">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload details of criminal convictions if any</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-criminal-convictions-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Divorce Certificates from Previous Marriages</label>
                            <div class="file-upload-zone" data-field="uk-spouse-divorce-certificates">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload divorce certificates from previous marriages if applicable</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-spouse-divorce-certificates-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUKSpousePartnerDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate UK Indefinite Leave to Remain (ILR) upload interface
function generateUKILRUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-check-circle"></i> UK Indefinite Leave to Remain (ILR) - Settlement</h2>
                <p>Upload your required documents for UK ILR application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="ukILRProgressBar"></div>
                    <span class="progress-text" id="ukILRProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Identity & Immigration -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Identity & Immigration</h3>
                        <span class="category-status" id="ukILRIdentityStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Current Passport</label>
                            <div class="file-upload-zone" data-field="uk-ilr-current-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid current passport</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-current-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Previous Passports (Covering Residence Period)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-previous-passports">
                                <i class="fas fa-passport"></i>
                                <p>Upload previous passports covering residence period</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-previous-passports-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Biometric Residence Permit (BRP) - if have one</label>
                            <div class="file-upload-zone" data-field="uk-ilr-brp">
                                <i class="fas fa-id-card"></i>
                                <p>Upload Biometric Residence Permit (BRP) if you have one</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-brp-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>eVisa/Online Immigration Status Proof</label>
                            <div class="file-upload-zone" data-field="uk-ilr-evisa">
                                <i class="fas fa-laptop"></i>
                                <p>Upload eVisa or online immigration status proof</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-evisa-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Passport-Sized Photos (2)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-photos">
                                <i class="fas fa-camera"></i>
                                <p>Upload 2 passport-sized photos</p>
                                <input type="file" multiple accept=".jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-photos-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Continuous Residence Proof -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-calendar-check"></i>
                        <h3>Continuous Residence Proof</h3>
                        <span class="category-status" id="ukILRResidenceStatus">0/6</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Complete Absence Records</label>
                            <div class="file-upload-zone" data-field="uk-ilr-absence-records">
                                <i class="fas fa-calendar-times"></i>
                                <p>Upload complete absence records (dates, destinations, reasons)</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-absence-records-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Utility Bills (Spanning 5 years)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-utility-bills">
                                <i class="fas fa-file-invoice"></i>
                                <p>Upload utility bills spanning 5 years</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-utility-bills-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Council Tax Bills</label>
                            <div class="file-upload-zone" data-field="uk-ilr-council-tax">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload council tax bills</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-council-tax-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Tenancy Agreements or Mortgage Statements</label>
                            <div class="file-upload-zone" data-field="uk-ilr-housing-docs">
                                <i class="fas fa-home"></i>
                                <p>Upload tenancy agreements or mortgage statements</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-housing-docs-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Bank Statements (Covering Residency Period)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-bank-statements">
                                <i class="fas fa-university"></i>
                                <p>Upload bank statements covering residency period</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-bank-statements-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>NHS Registration</label>
                            <div class="file-upload-zone" data-field="uk-ilr-nhs-registration">
                                <i class="fas fa-hospital"></i>
                                <p>Upload NHS registration documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-nhs-registration-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- English Language -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-language"></i>
                        <h3>English Language</h3>
                        <span class="category-status" id="ukILREnglishStatus">0/3</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>B1 Level SELT Certificate</label>
                            <div class="file-upload-zone" data-field="uk-ilr-selt-certificate">
                                <i class="fas fa-certificate"></i>
                                <p>Upload B1 level SELT certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-selt-certificate-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Degree Taught in English (UK NARIC confirmation)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-degree-english">
                                <i class="fas fa-graduation-cap"></i>
                                <p>Upload degree certificate and UK NARIC confirmation if taught in English</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-degree-english-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Previous English Test for Visa</label>
                            <div class="file-upload-zone" data-field="uk-ilr-previous-english-test">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload previous English test results used for visa</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-previous-english-test-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Life in the UK Test -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Life in the UK Test</h3>
                        <span class="category-status" id="ukILRLifeInUKStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Life in the UK Test Pass Certificate</label>
                            <div class="file-upload-zone" data-field="uk-ilr-life-in-uk-test">
                                <i class="fas fa-certificate"></i>
                                <p>Upload Life in the UK Test pass certificate (must be valid)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-life-in-uk-test-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Employment Evidence -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-briefcase"></i>
                        <h3>Employment Evidence</h3>
                        <span class="category-status" id="ukILREmploymentStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Current Employment Letter</label>
                            <div class="file-upload-zone" data-field="uk-ilr-current-employment">
                                <i class="fas fa-briefcase"></i>
                                <p>Upload current employment letter</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-current-employment-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Pay Slips (6-12 months)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-payslips">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <p>Upload pay slips for last 6-12 months</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-payslips-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>P60 Tax Documents</label>
                            <div class="file-upload-zone" data-field="uk-ilr-p60">
                                <i class="fas fa-file-invoice"></i>
                                <p>Upload P60 tax documents</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-p60-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Employment Contracts</label>
                            <div class="file-upload-zone" data-field="uk-ilr-employment-contracts">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload employment contracts</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-employment-contracts-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-plus"></i>
                        <h3>Additional Documents</h3>
                        <span class="category-status" id="ukILRAdditionalStatus">0/4</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Police Registration Certificate (if required)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-police-registration">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload police registration certificate if required</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-police-registration-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Criminal Record Certificates (if lived abroad 12+ months in last 10 years)</label>
                            <div class="file-upload-zone" data-field="uk-ilr-criminal-record">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload criminal record certificates if lived abroad 12+ months in last 10 years</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-criminal-record-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Documents Showing Changed Circumstances</label>
                            <div class="file-upload-zone" data-field="uk-ilr-changed-circumstances">
                                <i class="fas fa-file-alt"></i>
                                <p>Upload documents showing changed circumstances</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-changed-circumstances-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Financial Evidence</label>
                            <div class="file-upload-zone" data-field="uk-ilr-financial-evidence">
                                <i class="fas fa-dollar-sign"></i>
                                <p>Upload financial evidence meeting requirements for your route</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-ilr-financial-evidence-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUKILRDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate UK Health and Care Worker Visa upload interface
function generateUKHealthCareWorkerUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-user-md"></i> UK Health and Care Worker Visa</h2>
                <p>Upload your required documents for UK Health and Care Worker Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="ukHealthCareProgressBar"></div>
                    <span class="progress-text" id="ukHealthCareProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Required Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Required Documents</h3>
                        <span class="category-status" id="ukHealthCareRequiredStatus">0/7</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport</label>
                            <div class="file-upload-zone" data-field="uk-healthcare-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-healthcare-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Certificate of Sponsorship from NHS or Approved Employer</label>
                            <div class="file-upload-zone" data-field="uk-healthcare-cos">
                                <i class="fas fa-certificate"></i>
                                <p>Upload Certificate of Sponsorship from NHS or approved employer</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-healthcare-cos-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Professional Registration Certificate</label>
                            <div class="file-upload-zone" data-field="uk-healthcare-professional-registration">
                                <i class="fas fa-id-badge"></i>
                                <p>Upload professional registration certificate (NMC, HCPC, GMC, etc.)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-healthcare-professional-registration-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of English Language (B1 level - IELTS 4.0 each skill)</label>
                            <div class="file-upload-zone" data-field="uk-healthcare-english">
                                <i class="fas fa-language"></i>
                                <p>Upload proof of English language (B1 level - IELTS 4.0 each skill)</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-healthcare-english-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Job Offer in Eligible Health/Care Role</label>
                            <div class="file-upload-zone" data-field="uk-healthcare-job-offer">
                                <i class="fas fa-file-contract"></i>
                                <p>Upload job offer in eligible health/care role</p>
                                <input type="file" multiple accept=".pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-healthcare-job-offer-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>TB Test Certificate</label>
                            <div class="file-upload-zone" data-field="uk-healthcare-tb-test">
                                <i class="fas fa-stethoscope"></i>
                                <p>Upload TB test certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-healthcare-tb-test-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Criminal Record Certificate</label>
                            <div class="file-upload-zone" data-field="uk-healthcare-criminal-record">
                                <i class="fas fa-shield-alt"></i>
                                <p>Upload criminal record certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-healthcare-criminal-record-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUKHealthCareWorkerDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Generate UK Graduate Visa upload interface
function generateUKGraduateVisaUploadInterface() {
    return `
        <div class="visa-upload-container">
            <div class="upload-header">
                <h2><i class="fas fa-graduation-cap"></i> UK Graduate Visa (Post-Study Work)</h2>
                <p>Upload your required documents for UK Graduate Visa application</p>
                <div class="progress-indicator">
                    <div class="progress-bar" id="ukGraduateProgressBar"></div>
                    <span class="progress-text" id="ukGraduateProgressText">0% Complete</span>
                </div>
            </div>
            
            <div class="document-categories">
                <!-- Required Documents -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-file-check"></i>
                        <h3>Required Documents</h3>
                        <span class="category-status" id="ukGraduateRequiredStatus">0/5</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Valid Passport</label>
                            <div class="file-upload-zone" data-field="uk-graduate-passport">
                                <i class="fas fa-passport"></i>
                                <p>Upload valid passport</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-graduate-passport-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Current Student Visa or Tier 4 Visa</label>
                            <div class="file-upload-zone" data-field="uk-graduate-current-visa">
                                <i class="fas fa-id-card"></i>
                                <p>Upload current Student visa or Tier 4 visa</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-graduate-current-visa-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Confirmation of Degree Award from UK Institution</label>
                            <div class="file-upload-zone" data-field="uk-graduate-degree-award">
                                <i class="fas fa-certificate"></i>
                                <p>Upload confirmation of degree award from UK institution</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-graduate-degree-award-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Academic Transcripts and Degree Certificate</label>
                            <div class="file-upload-zone" data-field="uk-graduate-academic-docs">
                                <i class="fas fa-scroll"></i>
                                <p>Upload academic transcripts and degree certificate</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-graduate-academic-docs-files"></div>
                        </div>
                        
                        <div class="upload-field">
                            <label>Proof of Successful Course Completion</label>
                            <div class="file-upload-zone" data-field="uk-graduate-course-completion">
                                <i class="fas fa-check-circle"></i>
                                <p>Upload proof of successful course completion</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-graduate-course-completion-files"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Financial Evidence -->
                <div class="document-category">
                    <div class="category-header">
                        <i class="fas fa-dollar-sign"></i>
                        <h3>Financial Evidence</h3>
                        <span class="category-status" id="ukGraduateFinancialStatus">0/1</span>
                    </div>
                    <div class="upload-fields">
                        <div class="upload-field">
                            <label>Maintenance Funds: £1,270</label>
                            <div class="file-upload-zone" data-field="uk-graduate-maintenance-funds">
                                <i class="fas fa-money-bill-wave"></i>
                                <p>Upload evidence of maintenance funds: £1,270</p>
                                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div class="uploaded-files" id="uk-graduate-maintenance-funds-files"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upload-actions">
                <button class="btn btn-primary" onclick="submitUKGraduateDocuments()">
                    <i class="fas fa-paper-plane"></i> Submit Documents
                </button>
                <button class="btn btn-secondary" onclick="saveProgress()">
                    <i class="fas fa-save"></i> Save Progress
                </button>
            </div>
        </div>
    `;
}

// Submit functions for each visa type
function submitGSMDocuments() {
    console.log('📤 Submitting GSM documents...');
    alert('GSM documents submitted successfully!');
}

function submitStudentDocuments() {
    console.log('📤 Submitting Student visa documents...');
    alert('Student visa documents submitted successfully!');
}

function submitPartnerDocuments() {
    console.log('📤 Submitting Partner visa documents...');
    alert('Partner visa documents submitted successfully!');
}

function submitParentDocuments() {
    console.log('📤 Submitting Parent visa documents...');
    alert('Parent visa documents submitted successfully!');
}

function submitBusinessDocuments() {
    console.log('📤 Submitting Business visa documents...');
    alert('Business visa documents submitted successfully!');
}

function submitFamilyDocuments() {
    console.log('📤 Submitting Family visa documents...');
    alert('Family visa documents submitted successfully!');
}

function submitVisitDocuments() {
    console.log('📤 Submitting Visit visa documents...');
    alert('Visit visa documents submitted successfully!');
}

// Canada visa submit functions
function submitCanadaExpressEntryDocuments() {
    console.log('📤 Submitting Canada Express Entry documents...');
    alert('Canada Express Entry documents submitted successfully!');
}

function submitCanadaStudyPermitDocuments() {
    console.log('📤 Submitting Canada Study Permit documents...');
    alert('Canada Study Permit documents submitted successfully!');
}

function submitCanadaVisitorDocuments() {
    console.log('📤 Submitting Canada Visitor Visa documents...');
    alert('Canada Visitor Visa documents submitted successfully!');
}

function submitCanadaFamilySponsorshipDocuments() {
    console.log('📤 Submitting Canada Family Sponsorship documents...');
    alert('Canada Family Sponsorship documents submitted successfully!');
}

function submitCanadaWorkPermitDocuments() {
    console.log('📤 Submitting Canada Work Permit documents...');
    alert('Canada Work Permit documents submitted successfully!');
}

// New Zealand visa submit functions
function submitNZSkilledMigrantDocuments() {
    console.log('📤 Submitting NZ Skilled Migrant Category documents...');
    alert('New Zealand Skilled Migrant Category documents submitted successfully!');
}

function submitNZStudentDocuments() {
    console.log('📤 Submitting NZ Student Visa documents...');
    alert('New Zealand Student Visa documents submitted successfully!');
}

function submitNZVisitorDocuments() {
    console.log('📤 Submitting NZ Visitor Visa documents...');
    alert('New Zealand Visitor Visa documents submitted successfully!');
}

function submitNZWorkDocuments() {
    console.log('📤 Submitting NZ Work Visa documents...');
    alert('New Zealand Work Visa documents submitted successfully!');
}

function submitNZPartnershipDocuments() {
    console.log('📤 Submitting NZ Partnership Visa documents...');
    alert('New Zealand Partnership Visa documents submitted successfully!');
}

function submitNZPermanentResidentDocuments() {
    console.log('📤 Submitting NZ Permanent Resident Visa documents...');
    alert('New Zealand Permanent Resident Visa documents submitted successfully!');
}

// UK visa submit functions
function submitUKSkilledWorkerDocuments() {
    console.log('📤 Submitting UK Skilled Worker Visa documents...');
    alert('UK Skilled Worker Visa documents submitted successfully!');
}

// US visa submit functions
function submitUSH1BDocuments() { console.log('📤 Submitting US H-1B documents...'); alert('US H-1B documents submitted successfully!'); }
function submitUSF1Documents() { console.log('📤 Submitting US F-1 documents...'); alert('US F-1 documents submitted successfully!'); }
function submitUSB1B2Documents() { console.log('📤 Submitting US B1/B2 documents...'); alert('US B1/B2 documents submitted successfully!'); }
function submitUSL1Documents() { console.log('📤 Submitting US L-1 documents...'); alert('US L-1 documents submitted successfully!'); }
function submitUSEmploymentBasedDocuments() { console.log('📤 Submitting US Employment-Based documents...'); alert('US Employment-Based documents submitted successfully!'); }
function submitGenericUSDocuments(prefix) { console.log('📤 Submitting US documents for', prefix); alert('US documents submitted successfully!'); }

function submitUKStudentDocuments() {
    console.log('📤 Submitting UK Student Visa documents...');
    alert('UK Student Visa documents submitted successfully!');
}

function submitUKVisitorDocuments() {
    console.log('📤 Submitting UK Visitor Visa documents...');
    alert('UK Visitor Visa documents submitted successfully!');
}

function submitUKSpousePartnerDocuments() {
    console.log('📤 Submitting UK Spouse/Partner Visa documents...');
    alert('UK Spouse/Partner Visa documents submitted successfully!');
}

function submitUKILRDocuments() {
    console.log('📤 Submitting UK ILR documents...');
    alert('UK Indefinite Leave to Remain documents submitted successfully!');
}

function submitUKHealthCareWorkerDocuments() {
    console.log('📤 Submitting UK Health and Care Worker Visa documents...');
    alert('UK Health and Care Worker Visa documents submitted successfully!');
}

function submitUKGraduateDocuments() {
    console.log('📤 Submitting UK Graduate Visa documents...');
    alert('UK Graduate Visa documents submitted successfully!');
}

function saveProgress() {
    console.log('💾 Saving progress...');
    
    // Collect all uploaded files
    const uploadedFiles = {};
    const allUploadZones = document.querySelectorAll('.file-upload-zone');
    
    allUploadZones.forEach(zone => {
        const fieldName = zone.getAttribute('data-field');
        const filesContainer = document.getElementById(`${fieldName}-files`);
        
        if (filesContainer && filesContainer.children.length > 0) {
            const files = Array.from(filesContainer.querySelectorAll('.file-item')).map(item => {
                const fileName = item.querySelector('.file-name')?.textContent || '';
                const fileSize = item.querySelector('.file-size')?.textContent || '';
                return { name: fileName, size: fileSize };
            });
            uploadedFiles[fieldName] = files;
        }
    });
    
    // Save to localStorage
    const country = documentSelectionState.country;
    const visaType = documentSelectionState.visaType;
    const saveKey = `uploadedFiles_${country}_${visaType}`;
    localStorage.setItem(saveKey, JSON.stringify(uploadedFiles));
    
    // Also save overall progress
    const progressPercentage = calculateProgress();
    localStorage.setItem('documentUploadProgress', progressPercentage.toString());
    
    console.log('✅ Progress saved:', uploadedFiles);
    alert('Progress saved successfully!');
}

// Submit all documents
function submitAllDocuments() {
    console.log('📤 Submitting all documents...');
    
    // Collect all uploaded files
    const uploadedFiles = {};
    const allUploadZones = document.querySelectorAll('.file-upload-zone');
    let totalFiles = 0;
    
    allUploadZones.forEach(zone => {
        const fieldName = zone.getAttribute('data-field');
        const filesContainer = document.getElementById(`${fieldName}-files`);
        
        if (filesContainer && filesContainer.children.length > 0) {
            const files = Array.from(filesContainer.querySelectorAll('.file-item')).map(item => {
                const fileName = item.querySelector('.file-name')?.textContent || '';
                const fileSize = item.querySelector('.file-size')?.textContent || '';
                return { name: fileName, size: fileSize };
            });
            uploadedFiles[fieldName] = files;
            totalFiles += files.length;
        }
    });
    
    if (totalFiles === 0) {
        alert('Please upload at least one document before submitting.');
        return;
    }
    
    // Save submission
    const country = documentSelectionState.country;
    const visaType = documentSelectionState.visaType;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Save to document submissions
    const submissionKey = `documentSubmission_${country}_${visaType}_${Date.now()}`;
    localStorage.setItem(submissionKey, JSON.stringify({
        country,
        visaType,
        files: uploadedFiles,
        submittedAt: new Date().toISOString(),
        totalFiles,
        clientId: currentUser.id,
        clientName: currentUser.name,
        clientEmail: currentUser.email
    }));
    
    // Also save to documentReviews for admin panel
    const documentReviews = JSON.parse(localStorage.getItem('documentReviews') || '[]');
    Object.keys(uploadedFiles).forEach(fieldName => {
        uploadedFiles[fieldName].forEach(file => {
            documentReviews.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                title: `${fieldName}: ${file.name}`,
                type: fieldName,
                client: currentUser.name || 'Unknown',
                clientEmail: currentUser.email || '',
                clientId: currentUser.id || '',
                uploadedAt: new Date().toISOString(),
                status: 'pending',
                country: country,
                visaType: visaType
            });
        });
    });
    localStorage.setItem('documentReviews', JSON.stringify(documentReviews));
    
    // Add activity
    addActivity(`Documents Submitted`, `Submitted ${totalFiles} file(s) for ${visaType}`, 'fas fa-check-circle', 'success');
    
    console.log('✅ Documents submitted:', uploadedFiles);
    alert(`Successfully submitted ${totalFiles} document(s)!`);
}

// Calculate progress percentage
function calculateProgress() {
    const allUploadZones = document.querySelectorAll('.file-upload-zone');
    let totalFields = 0;
    let completedFields = 0;
    
    allUploadZones.forEach(zone => {
        const fieldName = zone.getAttribute('data-field');
        const filesContainer = document.getElementById(`${fieldName}-files`);
        
        if (filesContainer) {
            totalFields++;
            if (filesContainer.children.length > 0) {
                completedFields++;
            }
        }
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
}

// Setup file upload listeners for drag and drop functionality
function setupFileUploadListeners() {
    const uploadZones = document.querySelectorAll('.file-upload-zone');
    
    uploadZones.forEach(zone => {
        const input = zone.querySelector('input[type="file"]');
        const fieldName = zone.getAttribute('data-field');
        
        // Click to upload
        zone.addEventListener('click', () => {
            input.click();
        });
        
        // File selection
        input.addEventListener('change', (e) => {
            handleFileSelection(e, fieldName);
        });
        
        // Drag and drop
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover', 'active');
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            zone.style.borderColor = '#0056b3';
            zone.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
            }
        });
        
        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover', 'active');
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            zone.style.borderColor = '#007bff';
            zone.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)';
            }
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover', 'active');
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            zone.style.borderColor = '#007bff';
            zone.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)';
            }
            
            const files = e.dataTransfer.files;
            handleFileSelection({ target: { files } }, fieldName);
        });
    });
}

// Handle file selection
function handleFileSelection(event, fieldName) {
    // Support both event object and direct fieldName
    let files, containerId;
    
    if (event && event.target) {
        // Called from onchange handler
        files = event.target.files;
        containerId = `${fieldName}-files`;
    } else if (event && event.target && event.target.files) {
        // Direct event with files
        files = event.target.files;
        containerId = `${fieldName}-files`;
    } else {
        // Fallback: fieldName might be the actual field name
        const input = typeof fieldName === 'string' ? document.getElementById(fieldName) : null;
        if (input) {
            files = input.files;
            containerId = `${fieldName}-files`;
        } else {
            console.error('❌ Invalid parameters for handleFileSelection');
            return;
        }
    }
    
    if (!files || files.length === 0) {
        return;
    }
    
    const filesContainer = document.getElementById(containerId);
    
    if (!filesContainer) {
        console.error('❌ Files container not found for field:', containerId);
        return;
    }
    
    // Clear existing files
    filesContainer.innerHTML = '';
    
    // Add each file
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file file-icon"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="file-remove" onclick="removeFile(this, '${fieldName}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        filesContainer.appendChild(fileItem);
    });
    
    // Update progress
    updateProgress();
}

// Remove file
function removeFile(button, fieldName) {
    const fileItem = button.closest('.file-item');
    fileItem.remove();
    updateProgress();
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Update progress indicator with animated progress bars
function updateProgress() {
    const allUploadZones = document.querySelectorAll('.file-upload-zone');
    let totalFields = 0;
    let completedFields = 0;
    
    allUploadZones.forEach(zone => {
        const fieldName = zone.getAttribute('data-field');
        const filesContainer = document.getElementById(`${fieldName}-files`);
        
        if (filesContainer) {
            totalFields++;
            if (filesContainer.children.length > 0) {
                completedFields++;
            }
        }
    });
    
    const progressPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    
    // Update animated progress bars (new style)
    const animatedProgressBars = document.querySelectorAll('.progress-bar-animated, .progress-fill');
    animatedProgressBars.forEach(bar => {
        bar.style.width = `${progressPercentage}%`;
    });
    
    // Update old style progress bars (backward compatibility)
    const progressBars = document.querySelectorAll('.progress-bar:not(.progress-bar-animated):not(.progress-bar-container)');
    progressBars.forEach(bar => {
        const fill = bar.querySelector('.progress-fill');
        if (fill) {
            fill.style.width = `${progressPercentage}%`;
        }
    });
    
    // Update progress texts
    const progressTexts = document.querySelectorAll('.progress-text');
    progressTexts.forEach(text => {
        text.textContent = `${progressPercentage}% Complete`;
    });
    
    // Update overall progress bar
    const overallBar = document.getElementById('overallProgressBar');
    if (overallBar) {
        overallBar.style.width = `${progressPercentage}%`;
    }
    
    // Update timeline progress
    updateTimelineProgress(progressPercentage);
    
    // Update category status
    updateCategoryStatus();
}

// Update timeline progress with step indicators
function updateTimelineProgress(percentage) {
    const timelineFill = document.getElementById('timelineFill');
    const timeline = document.querySelector('.progress-timeline');
    
    // Update timeline connecting line width (dark theme)
    if (timeline && document.documentElement.getAttribute('data-theme') === 'dark') {
        const timelineAfter = window.getComputedStyle(timeline, '::after');
        const timelineElement = timeline;
        // Create pseudo-element width update via CSS variable
        timelineElement.style.setProperty('--timeline-progress', `${percentage}%`);
        
        // Update the animated line width
        if (!timeline.querySelector('.timeline-progress-line')) {
            const progressLine = document.createElement('div');
            progressLine.className = 'timeline-progress-line';
            progressLine.style.cssText = `
                position: absolute;
                top: 50%;
                left: 0;
                height: 4px;
                width: ${percentage}%;
                background: linear-gradient(90deg, 
                    rgba(59, 130, 246, 0.8),
                    rgba(20, 184, 166, 0.8),
                    rgba(147, 51, 234, 0.8)
                );
                transform: translateY(-50%);
                z-index: 1;
                transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 
                    0 0 10px rgba(59, 130, 246, 0.5),
                    0 0 20px rgba(20, 184, 166, 0.3);
                animation: lineFlow 3s ease-in-out infinite;
            `;
            timeline.appendChild(progressLine);
        } else {
            const progressLine = timeline.querySelector('.timeline-progress-line');
            progressLine.style.width = `${percentage}%`;
        }
    }
    
    if (timelineFill) {
        timelineFill.style.width = `${percentage}%`;
    }
    
    // Update step states based on percentage
    const uploadStep = document.getElementById('uploadStep');
    const reviewStep = document.getElementById('reviewStep');
    const submitStep = document.getElementById('submitStep');
    
    // Remove active class from all
    [uploadStep, reviewStep, submitStep].forEach(step => {
        if (step) {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Set active/completed states
    if (percentage >= 25 && percentage < 50) {
        if (uploadStep) uploadStep.classList.add('active');
    } else if (percentage >= 50 && percentage < 75) {
        if (uploadStep) uploadStep.classList.add('completed');
        if (reviewStep) reviewStep.classList.add('active');
    } else if (percentage >= 75 && percentage < 100) {
        if (uploadStep) uploadStep.classList.add('completed');
        if (reviewStep) reviewStep.classList.add('completed');
        if (submitStep) submitStep.classList.add('active');
    } else if (percentage >= 100) {
        if (uploadStep) uploadStep.classList.add('completed');
        if (reviewStep) reviewStep.classList.add('completed');
        if (submitStep) submitStep.classList.add('completed');
    }
}

// Update category status
function updateCategoryStatus() {
    const categories = document.querySelectorAll('.document-category');
    
    categories.forEach(category => {
        const uploadFields = category.querySelectorAll('.upload-field');
        let totalFields = uploadFields.length;
        let completedFields = 0;
        
        uploadFields.forEach(field => {
            const uploadZone = field.querySelector('.file-upload-zone');
            const fieldName = uploadZone.getAttribute('data-field');
            const filesContainer = document.getElementById(`${fieldName}-files`);
            
            if (filesContainer && filesContainer.children.length > 0) {
                completedFields++;
            }
        });
        
        const statusElement = category.querySelector('.category-status');
        if (statusElement) {
            statusElement.textContent = `${completedFields}/${totalFields}`;
        }
    });
}

// Proceed to documentation

// Show section
function showSection(sectionId) {
    console.log('📋 Showing section:', sectionId);
    
    // Hide all main content sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    
    // Update sidebar active state
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => link.classList.remove('active'));
    const targetLink = document.querySelector(`.sidebar-link[href="#${sectionId}"]`) || document.querySelector(`.sidebar-link[onclick*="'${sectionId}'"]`);
    if (targetLink) targetLink.classList.add('active');
    
    // Show requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        // Update hash for deep linking and scroll into view
        try { history.replaceState(null, '', `#${sectionId}`); } catch(_) { location.hash = `#${sectionId}`; }
        
        // Update illustrations when switching sections
        updateCountryIllustrations();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // If dashboard section, refresh data
        if (sectionId === 'dashboard') {
            loadDashboardData();
        }
        
        // If documents section, ensure selects are interactive
        if (sectionId === 'documents') {
            try { ensureSelectionInteractivity(); } catch(_) {}
            try { ensureVisaTypesPopulated(); } catch(_) {}
            try { setupVisaSelectGuard(); } catch(_) {}
        }
        
        // Ensure no overlays block interactions
        try {
            document.querySelectorAll('.modal, .update-notification, .pwa-splash, .pwa-install-prompt, .offline-indicator').forEach(el => {
                if (el.classList.contains('modal')) {
                    el.style.display = 'none';
                } else {
                    el.parentNode && el.parentNode.removeChild(el);
                }
            });
        } catch (_) {}
        console.log('✅ Section displayed:', sectionId);
    } else {
        console.error('❌ Section not found:', sectionId);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing client dashboard...');
    initializeClientDashboard();
    registerServiceWorker(); // Register PWA service worker

    // Ensure no modal overlays block interactions
    try {
        document.querySelectorAll('.modal').forEach(m => { m.style.display = 'none'; });
    } catch (_) {}

    // Normalize section visibility based on .active
    try {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(sec => {
            if (sec.classList.contains('active')) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });
    } catch(_) {}

    // Deep-link support: open section from URL hash
    if (location.hash && location.hash.length > 1) {
        const targetId = location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            showSection(targetId);
        }
    }
    
    // Ensure selection fields are interactive when documents section is present
    try { ensureSelectionInteractivity(); } catch(_) {}
    // Make sure visa types are populated at least once
    try { ensureVisaTypesPopulated(); } catch(_) {}
    // Guard to keep visa types populated
    try { setupVisaSelectGuard(); } catch(_) {}

    // Populate visa types when user focuses the dropdown (if country already chosen)
    try {
        const countrySelect = document.getElementById('countrySelect');
        const visaTypeSelect = document.getElementById('visaTypeSelect');
        if (visaTypeSelect) {
            const populateIfPossible = function() {
                const country = (countrySelect && countrySelect.value) || documentSelectionState.country;
                if (country) {
                    updateVisaTypeOptions(country);
                } else {
                    // Pre-populate with union if no country chosen yet
                    try {
                        const all = Object.values(VISA_TYPES).reduce((acc, arr) => acc.concat(arr), []);
                        const union = Array.from(new Set(all));
                        visaTypeSelect.innerHTML = '<option value="">Select Visa Type</option>';
                        union.forEach(v => {
                            const opt = document.createElement('option');
                            opt.value = v;
                            // Try to find display name from VISA_TYPES_DATA
                            let displayName = v.replace(/-/g,' ').replace(/\b\w/g, l=>l.toUpperCase());
                            // Try to find in any country's visa types
                            for (const countryKey in VISA_TYPES_DATA) {
                                if (VISA_TYPES_DATA[countryKey][v]) {
                                    displayName = VISA_TYPES_DATA[countryKey][v].name;
                                    break;
                                }
                            }
                            opt.textContent = displayName;
                            visaTypeSelect.appendChild(opt);
                        });
                    } catch(_) {}
                }
                visaTypeSelect.disabled = false;
            };
            visaTypeSelect.addEventListener('focus', populateIfPossible, { passive: true });
            visaTypeSelect.addEventListener('click', populateIfPossible, { passive: true });
        }
        // Also bind change to country select defensively
        if (countrySelect) {
            countrySelect.addEventListener('change', function(){
                documentSelectionState.country = this.value;
                updateVisaTypeOptions(this.value);
                if (visaTypeSelect) visaTypeSelect.disabled = false;
            });
        }
    } catch(_) {}

    // Make sidebar navigation robust
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Always prevent default anchor jump; use our SPA switcher
            e.preventDefault();
            const href = this.getAttribute('href') || '';
            const target = href.startsWith('#') ? href.substring(1) : null;
            const onclickAttr = this.getAttribute('onclick') || '';
            if (target) {
                showSection(target);
            } else if (onclickAttr.includes("showSection('")) {
                // onclick already calls showSection; nothing else to do
            }
        });
    });

    // Event delegation on sidebar for extra safety
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu) {
        sidebarMenu.addEventListener('click', function(e) {
            const link = e.target.closest && e.target.closest('.sidebar-link');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href') || '';
                if (href && href.indexOf('#') === 0) {
                    const sectionId = href.slice(1);
                    showSection(sectionId);
                }
            }
        }, true);
    }
});

// Ensure all selection fields are enabled and clickable
function ensureSelectionInteractivity() {
    const countrySelect = document.getElementById('countrySelect');
    const visaTypeSelect = document.getElementById('visaTypeSelect');
    const authoritySelect = document.getElementById('authoritySelect');
    
    if (countrySelect) {
        countrySelect.disabled = false;
        countrySelect.style.pointerEvents = 'auto';
        countrySelect.style.opacity = '1';
        countrySelect.style.position = 'relative';
        countrySelect.style.zIndex = '1';
    }
    
    if (visaTypeSelect) {
        // Enable by default once country is selected
        if (documentSelectionState.country) {
            visaTypeSelect.disabled = false;
            updateVisaTypeOptions(documentSelectionState.country);
        }
        visaTypeSelect.style.pointerEvents = 'auto';
        visaTypeSelect.style.opacity = '1';
        visaTypeSelect.style.position = 'relative';
        visaTypeSelect.style.zIndex = '1';
    }
    
    if (authoritySelect) {
        const isGSM = documentSelectionState.visaType === 'general-skilled-migration';
        authoritySelect.disabled = !isGSM;
        authoritySelect.style.pointerEvents = 'auto';
        authoritySelect.style.opacity = '1';
        authoritySelect.style.position = 'relative';
        authoritySelect.style.zIndex = '1';
        const authoritySection = document.getElementById('authority-selection');
        if (authoritySection) {
            authoritySection.style.display = isGSM ? 'block' : 'none';
        }
    }
}

// Ensure visa type list is populated based on current country; fallback to union if empty
function ensureVisaTypesPopulated() {
    const visaTypeSelect = document.getElementById('visaTypeSelect');
    if (!visaTypeSelect) {
        console.error('❌ ensureVisaTypesPopulated: visaTypeSelect element not found');
        return;
    }
    
    console.log('🔄 ensureVisaTypesPopulated called');
    console.log('📋 VISA_TYPES object:', typeof VISA_TYPES, VISA_TYPES ? 'exists' : 'missing');
    console.log('📋 VISA_TYPES keys:', VISA_TYPES ? Object.keys(VISA_TYPES) : 'N/A');
    
    const countrySelect = document.getElementById('countrySelect');
    const country = (countrySelect && countrySelect.value) || documentSelectionState.country;
    const currentOptions = visaTypeSelect.options ? visaTypeSelect.options.length : 0;
    
    console.log('📋 Current country:', country || 'none');
    console.log('📋 Current options count:', currentOptions);
    
    if (country) {
        console.log('✅ Country selected, updating visa types for:', country);
        updateVisaTypeOptions(country);
    } else {
        console.log('⚠️ No country selected, populating with all visa types');
    }
    
    // Always ensure dropdown has options (fallback to union if empty or no country)
    const finalOptions = visaTypeSelect.options ? visaTypeSelect.options.length : 0;
    if (finalOptions <= 1) {
        console.log('⚠️ Dropdown is empty or has only placeholder, populating with all visa types');
        try {
            if (!VISA_TYPES || typeof VISA_TYPES !== 'object') {
                console.error('❌ VISA_TYPES is not defined or invalid');
                return;
            }
            const all = Object.values(VISA_TYPES).reduce((acc, arr) => {
                if (Array.isArray(arr)) {
                    return acc.concat(arr);
                }
                return acc;
            }, []);
            const union = Array.from(new Set(all));
            console.log('📋 Populating with', union.length, 'visa types');
            visaTypeSelect.innerHTML = '<option value="">Select Visa Type</option>';
            union.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v;
                // Try to find display name from VISA_TYPES_DATA
                let displayName = v.replace(/-/g,' ').replace(/\b\w/g, l=>l.toUpperCase());
                // Try to find in any country's visa types
                for (const countryKey in VISA_TYPES_DATA) {
                    if (VISA_TYPES_DATA[countryKey][v]) {
                        displayName = VISA_TYPES_DATA[countryKey][v].name;
                        break;
                    }
                }
                opt.textContent = displayName;
                visaTypeSelect.appendChild(opt);
            });
            console.log('✅ Populated dropdown with', visaTypeSelect.options.length, 'options');
        } catch(e) {
            console.error('❌ Failed to populate visa types:', e);
    }
    } else {
        console.log('✅ Dropdown already has', finalOptions, 'options');
    }
    
    visaTypeSelect.disabled = false;
    console.log('✅ ensureVisaTypesPopulated completed. Final option count:', visaTypeSelect.options.length);
}

// Keep visa type dropdown populated and enabled robustly
function setupVisaSelectGuard() {
    const visaTypeSelect = document.getElementById('visaTypeSelect');
    if (!visaTypeSelect) return;
    const countrySelect = document.getElementById('countrySelect');
    
    // PREVENT CLEARING - flag to prevent observer from interfering
    let isUpdating = false;
    
    const repopulate = () => {
        if (isUpdating) return; // Don't interfere while updating
        const country = (countrySelect && countrySelect.value) || documentSelectionState.country;
        if (country && (visaTypeSelect.options.length <= 1)) {
            console.log('🔄 Guard triggered repopulation for country:', country);
            isUpdating = true;
            updateVisaTypeOptions(country);
            setTimeout(() => { isUpdating = false; }, 500);
        }
        visaTypeSelect.disabled = false;
    };
    
    // DISABLED MutationObserver - it was interfering!
    // Observe option list changes; if emptied, repopulate
    // try {
    //     const obs = new MutationObserver(() => {
    //         if (!isUpdating && (!visaTypeSelect.options || visaTypeSelect.options.length <= 1)) {
    //             repopulate();
    //         }
    //     });
    //     obs.observe(visaTypeSelect, { childList: true });
    // } catch(_) {}
    
    // Only repopulate on focus/click if dropdown is actually empty
    visaTypeSelect.addEventListener('focus', function() {
        if (this.options.length <= 1) repopulate();
    }, { passive: true });
    visaTypeSelect.addEventListener('click', function() {
        if (this.options.length <= 1) repopulate();
    }, { passive: true });
}

// Global function exposure
window.handleCountrySelection = handleCountrySelection;
window.handleVisaTypeSelection = handleVisaTypeSelection;
window.handleAuthoritySelection = handleAuthoritySelection;
window.hideDocumentChecklist = hideDocumentChecklist;
window.showVisaSpecificUploadInterface = showVisaSpecificUploadInterface;
window.showSection = showSection;
window.setupFileUploadListeners = setupFileUploadListeners;
window.handleFileSelection = handleFileSelection;
window.removeFile = removeFile;
window.formatFileSize = formatFileSize;
window.updateProgress = updateProgress;
window.updateCategoryStatus = updateCategoryStatus;
window.submitGSMDocuments = submitGSMDocuments;
window.submitStudentDocuments = submitStudentDocuments;
window.submitPartnerDocuments = submitPartnerDocuments;
window.submitParentDocuments = submitParentDocuments;
window.submitBusinessDocuments = submitBusinessDocuments;
window.submitFamilyDocuments = submitFamilyDocuments;
window.submitVisitDocuments = submitVisitDocuments;
window.submitCanadaExpressEntryDocuments = submitCanadaExpressEntryDocuments;
window.submitCanadaStudyPermitDocuments = submitCanadaStudyPermitDocuments;
window.submitCanadaVisitorDocuments = submitCanadaVisitorDocuments;
window.submitCanadaFamilySponsorshipDocuments = submitCanadaFamilySponsorshipDocuments;
window.submitCanadaWorkPermitDocuments = submitCanadaWorkPermitDocuments;
window.submitNZSkilledMigrantDocuments = submitNZSkilledMigrantDocuments;
window.submitNZStudentDocuments = submitNZStudentDocuments;
window.submitNZVisitorDocuments = submitNZVisitorDocuments;
window.submitNZWorkDocuments = submitNZWorkDocuments;
window.submitNZPartnershipDocuments = submitNZPartnershipDocuments;
window.submitNZPermanentResidentDocuments = submitNZPermanentResidentDocuments;
window.submitUKSkilledWorkerDocuments = submitUKSkilledWorkerDocuments;
window.submitUKStudentDocuments = submitUKStudentDocuments;
window.submitUKVisitorDocuments = submitUKVisitorDocuments;
window.submitUKSpousePartnerDocuments = submitUKSpousePartnerDocuments;
window.submitUKILRDocuments = submitUKILRDocuments;
window.submitUKHealthCareWorkerDocuments = submitUKHealthCareWorkerDocuments;
window.submitUKGraduateDocuments = submitUKGraduateDocuments;
window.submitUSH1BDocuments = submitUSH1BDocuments;
window.submitUSF1Documents = submitUSF1Documents;
window.submitUSB1B2Documents = submitUSB1B2Documents;
window.submitUSL1Documents = submitUSL1Documents;
window.submitUSEmploymentBasedDocuments = submitUSEmploymentBasedDocuments;
window.submitGenericUSDocuments = submitGenericUSDocuments;
window.saveProgress = saveProgress;
window.submitAllDocuments = submitAllDocuments;
window.calculateProgress = calculateProgress;
window.showOccupationListModal = showOccupationListModal;
window.closeOccupationListModal = closeOccupationListModal;
window.filterOccupations = filterOccupations;
window.clearSearch = clearSearch;
window.selectOccupation = selectOccupation;

console.log('✅ Client Dashboard JavaScript loaded successfully');

// ==================== OCCUPATION LIST FUNCTIONALITY ====================

// Occupation data structure
const OCCUPATION_DATA = {
    'acs': [
        { code: '261311', title: 'Analyst Programmer', description: 'Designs, develops, and maintains computer programs and systems' },
        { code: '261312', title: 'Developer Programmer', description: 'Creates, modifies, and tests computer programs and systems' },
        { code: '261313', title: 'Software Engineer', description: 'Designs, develops, and maintains software applications' },
        { code: '261314', title: 'Software Tester', description: 'Tests software applications to ensure quality and functionality' },
        { code: '262111', title: 'Database Administrator', description: 'Manages and maintains database systems' },
        { code: '262112', title: 'ICT Security Specialist', description: 'Designs and implements security measures for ICT systems' },
        { code: '263111', title: 'Computer Network and Systems Engineer', description: 'Designs, builds, and maintains computer networks' },
        { code: '263112', title: 'Network Administrator', description: 'Manages and maintains computer networks' },
        { code: '263113', title: 'Network Analyst', description: 'Analyzes and optimizes computer networks' },
        { code: '263211', title: 'ICT Quality Assurance Engineer', description: 'Ensures quality of ICT systems and processes' },
        { code: '263212', title: 'ICT Support Engineer', description: 'Provides technical support for ICT systems' },
        { code: '263213', title: 'ICT Systems Test Engineer', description: 'Tests ICT systems and applications' }
    ],
    'vetassess': [
        { code: '133111', title: 'Construction Project Manager', description: 'Manages construction projects from planning to completion' },
        { code: '133112', title: 'Project Builder', description: 'Oversees residential and commercial building projects' },
        { code: '133211', title: 'Engineering Manager', description: 'Manages engineering projects and teams' },
        { code: '134111', title: 'Child Care Centre Manager', description: 'Manages child care centers and early childhood services' },
        { code: '134211', title: 'Medical Administrator', description: 'Manages medical facilities and health services' },
        { code: '134212', title: 'Nursing Clinical Director', description: 'Directs clinical nursing operations' },
        { code: '134213', title: 'Primary Health Organisation Manager', description: 'Manages primary health care organizations' },
        { code: '134214', title: 'Welfare Centre Manager', description: 'Manages welfare and community service centers' },
        { code: '135111', title: 'Chief Information Officer', description: 'Oversees information technology strategy and operations' },
        { code: '135112', title: 'ICT Project Manager', description: 'Manages information technology projects' },
        { code: '135199', title: 'ICT Managers nec', description: 'Other ICT managers not elsewhere classified' }
    ],
    'engineers-australia': [
        { code: '233111', title: 'Chemical Engineer', description: 'Designs and develops chemical processes and equipment' },
        { code: '233112', title: 'Materials Engineer', description: 'Develops and tests materials for engineering applications' },
        { code: '233211', title: 'Civil Engineer', description: 'Designs and manages construction of infrastructure projects' },
        { code: '233212', title: 'Geotechnical Engineer', description: 'Specializes in soil and rock mechanics for construction' },
        { code: '233213', title: 'Quantity Surveyor', description: 'Estimates costs and manages budgets for construction projects' },
        { code: '233214', title: 'Structural Engineer', description: 'Designs and analyzes structures for safety and stability' },
        { code: '233215', title: 'Transport Engineer', description: 'Designs and manages transportation systems and infrastructure' },
        { code: '233311', title: 'Electrical Engineer', description: 'Designs and develops electrical systems and equipment' },
        { code: '233411', title: 'Electronics Engineer', description: 'Designs and develops electronic systems and components' },
        { code: '233511', title: 'Industrial Engineer', description: 'Optimizes production processes and systems' },
        { code: '233512', title: 'Mechanical Engineer', description: 'Designs and develops mechanical systems and equipment' },
        { code: '233611', title: 'Mining Engineer (excluding Petroleum)', description: 'Manages mining operations and processes' },
        { code: '233612', title: 'Petroleum Engineer', description: 'Designs and manages oil and gas extraction processes' },
        { code: '233911', title: 'Aeronautical Engineer', description: 'Designs and develops aircraft and aerospace systems' },
        { code: '233912', title: 'Agricultural Engineer', description: 'Applies engineering principles to agricultural systems' },
        { code: '233913', title: 'Biomedical Engineer', description: 'Develops medical devices and healthcare technologies' },
        { code: '233914', title: 'Engineering Technologist', description: 'Applies engineering technology to solve technical problems' },
        { code: '233915', title: 'Environmental Engineer', description: 'Addresses environmental challenges through engineering solutions' },
        { code: '233916', title: 'Naval Architect', description: 'Designs and develops ships and marine structures' }
    ],
    'ahpra': [
        { code: '251211', title: 'Medical Diagnostic Radiographer', description: 'Uses imaging technology to diagnose medical conditions' },
        { code: '251212', title: 'Medical Radiation Therapist', description: 'Uses radiation therapy to treat cancer patients' },
        { code: '251213', title: 'Nuclear Medicine Technologist', description: 'Uses radioactive materials for medical imaging and treatment' },
        { code: '251214', title: 'Sonographer', description: 'Uses ultrasound technology for medical imaging' },
        { code: '251411', title: 'Optometrist', description: 'Provides eye care and vision correction services' },
        { code: '251412', title: 'Orthoptist', description: 'Diagnoses and treats eye movement disorders' },
        { code: '251511', title: 'Pharmacist (Hospital)', description: 'Provides pharmaceutical services in hospital settings' },
        { code: '251512', title: 'Pharmacist (Retail)', description: 'Provides pharmaceutical services in retail settings' },
        { code: '251911', title: 'Health Promotion Officer', description: 'Develops and implements health promotion programs' },
        { code: '251912', title: 'Orthotist or Prosthetist', description: 'Designs and fits orthopedic devices and prosthetics' },
        { code: '251999', title: 'Health Diagnostic and Promotion Professionals nec', description: 'Other health diagnostic and promotion professionals' }
    ],
    'osap-tra': [
        { code: '322211', title: 'Sheetmetal Trades Worker', description: 'Works with sheet metal for construction and manufacturing' },
        { code: '322311', title: 'Metal Fabricator', description: 'Fabricates metal components and structures' },
        { code: '322312', title: 'Welder (First Class)', description: 'Performs advanced welding operations' },
        { code: '323211', title: 'Fitter (General)', description: 'Fits and assembles metal parts and components' },
        { code: '323212', title: 'Fitter and Turner', description: 'Fits and machines metal parts and components' },
        { code: '323213', title: 'Metal Machinist (First Class)', description: 'Operates machine tools to produce metal parts' },
        { code: '323214', title: 'Precision Instrument Maker and Repairer', description: 'Makes and repairs precision instruments' },
        { code: '323299', title: 'Metal Fitters and Machinists nec', description: 'Other metal fitters and machinists' },
        { code: '324111', title: 'Panelbeater', description: 'Repairs and restores vehicle body panels' },
        { code: '324211', title: 'Vehicle Body Builder', description: 'Builds and modifies vehicle bodies' },
        { code: '324212', title: 'Vehicle Trimmer', description: 'Trims and upholsters vehicle interiors' }
    ],
    'msa-tra': [
        { code: '321111', title: 'Automotive Electrician', description: 'Installs and repairs automotive electrical systems' },
        { code: '321211', title: 'Motor Mechanic (General)', description: 'Repairs and maintains motor vehicles' },
        { code: '321212', title: 'Diesel Motor Mechanic', description: 'Repairs and maintains diesel engines and vehicles' },
        { code: '321213', title: 'Motorcycle Mechanic', description: 'Repairs and maintains motorcycles and scooters' },
        { code: '321214', title: 'Small Engine Mechanic', description: 'Repairs and maintains small engines and equipment' },
        { code: '322211', title: 'Sheetmetal Trades Worker', description: 'Works with sheet metal for construction and manufacturing' },
        { code: '322311', title: 'Metal Fabricator', description: 'Fabricates metal components and structures' },
        { code: '322312', title: 'Welder (First Class)', description: 'Performs advanced welding operations' },
        { code: '323211', title: 'Fitter (General)', description: 'Fits and assembles metal parts and components' },
        { code: '323212', title: 'Fitter and Turner', description: 'Fits and machines metal parts and components' }
    ]
};

// Show occupation list modal
function showOccupationListModal() {
    console.log('📋 Opening occupation list modal...');
    
    const modal = document.getElementById('occupationListModal');
    if (!modal) {
        console.error('❌ Occupation list modal not found');
        return;
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Load occupation data
    loadOccupationData();
    
    console.log('✅ Occupation list modal opened');
}

// Close occupation list modal
function closeOccupationListModal() {
    console.log('📋 Closing occupation list modal...');
    
    const modal = document.getElementById('occupationListModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        console.log('✅ Occupation list modal closed');
    }
}

// Load occupation data
function loadOccupationData() {
    console.log('📋 Loading occupation data...');
    
    const occupationList = document.getElementById('occupationList');
    const loadingIndicator = document.getElementById('occupationLoading');
    const noResults = document.getElementById('noResults');
    
    if (!occupationList) {
        console.error('❌ Occupation list container not found');
        return;
    }
    
    // Show loading indicator
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    occupationList.innerHTML = '';
    
    // Simulate loading delay
    setTimeout(() => {
        displayOccupations();
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }, 500);
}

// Display occupations
function displayOccupations(filteredData = null) {
    const occupationList = document.getElementById('occupationList');
    const totalOccupations = document.getElementById('totalOccupations');
    const filteredOccupations = document.getElementById('filteredOccupations');
    const noResults = document.getElementById('noResults');
    
    if (!occupationList) return;
    
    let dataToDisplay = filteredData || getAllOccupations();
    
    // Update statistics
    if (totalOccupations) {
        totalOccupations.textContent = getAllOccupations().length;
    }
    if (filteredOccupations) {
        filteredOccupations.textContent = dataToDisplay.length;
    }
    
    // Clear previous content
    occupationList.innerHTML = '';
    
    if (dataToDisplay.length === 0) {
        if (noResults) {
            noResults.style.display = 'block';
        }
        return;
    }
    
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // Display occupations
    dataToDisplay.forEach(occupation => {
        const occupationCard = createOccupationCard(occupation);
        occupationList.appendChild(occupationCard);
    });
    
    console.log(`✅ Displayed ${dataToDisplay.length} occupations`);
}

// Get all occupations from all authorities
function getAllOccupations() {
    let allOccupations = [];
    
    Object.keys(OCCUPATION_DATA).forEach(authority => {
        OCCUPATION_DATA[authority].forEach(occupation => {
            allOccupations.push({
                ...occupation,
                authority: authority,
                authorityName: getAuthorityName(authority)
            });
        });
    });
    
    return allOccupations;
}

// Get authority display name
function getAuthorityName(authority) {
    const authorityNames = {
        'acs': 'Australian Computer Society',
        'vetassess': 'VETASSESS',
        'engineers-australia': 'Engineers Australia',
        'ahpra': 'Australian Health Practitioner Regulation Agency',
        'osap-tra': 'OSAP TRA',
        'msa-tra': 'MSA TRA'
    };
    
    return authorityNames[authority] || authority;
}

// Create occupation card
function createOccupationCard(occupation) {
    const card = document.createElement('div');
    card.className = 'occupation-card';
    card.innerHTML = `
        <div class="occupation-header">
            <h3 class="occupation-title">${occupation.title}</h3>
            <span class="occupation-code">${occupation.code}</span>
        </div>
        <div class="occupation-body">
            <p class="occupation-description">${occupation.description}</p>
            <div class="occupation-meta">
                <span class="occupation-authority">${occupation.authorityName}</span>
                <button class="btn btn-outline btn-sm" onclick="selectOccupation('${occupation.code}', '${occupation.title}')">
                    <i class="fas fa-check"></i> Select
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Filter occupations
function filterOccupations() {
    console.log('🔍 Filtering occupations...');
    
    const searchInput = document.getElementById('occupationSearchInput');
    const authorityFilter = document.getElementById('occupationAuthorityFilter');
    const selectedAuthorityName = document.getElementById('selectedAuthorityName');
    
    if (!searchInput || !authorityFilter) {
        console.error('❌ Filter elements not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedAuthority = authorityFilter.value;
    
    // Update selected authority display
    if (selectedAuthorityName) {
        selectedAuthorityName.textContent = selectedAuthority ? getAuthorityName(selectedAuthority) : 'All';
    }
    
    // Get all occupations
    let filteredData = getAllOccupations();
    
    // Filter by authority
    if (selectedAuthority) {
        filteredData = filteredData.filter(occupation => occupation.authority === selectedAuthority);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredData = filteredData.filter(occupation => 
            occupation.title.toLowerCase().includes(searchTerm) ||
            occupation.code.includes(searchTerm) ||
            occupation.description.toLowerCase().includes(searchTerm) ||
            occupation.authorityName.toLowerCase().includes(searchTerm)
        );
    }
    
    // Display filtered results
    displayOccupations(filteredData);
    
    // Show/hide clear search button
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
    }
    
    console.log(`✅ Filtered to ${filteredData.length} occupations`);
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('occupationSearchInput');
    if (searchInput) {
        searchInput.value = '';
        filterOccupations();
    }
}

// Select occupation
function selectOccupation(code, title) {
    console.log(`📋 Selected occupation: ${title} (${code})`);
    
    // Store selected occupation
    localStorage.setItem('selectedOccupation', JSON.stringify({ code, title }));
    
    // Show confirmation
    alert(`Selected occupation: ${title} (${code})\n\nThis occupation has been saved to your profile.`);
    
    // Close modal
    closeOccupationListModal();
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('occupationListModal');
    if (event.target === modal) {
        closeOccupationListModal();
    }
});

// Debug function to test if everything is working
window.testSelections = function() {
    console.log('🧪 Testing selections...');
    console.log('Country select element:', document.getElementById('countrySelect'));
    console.log('Visa type select element:', document.getElementById('visaTypeSelect'));
    console.log('Authority select element:', document.getElementById('authoritySelect'));
    console.log('handleCountrySelection function:', typeof handleCountrySelection);
    console.log('handleVisaTypeSelection function:', typeof handleVisaTypeSelection);
    console.log('handleAuthoritySelection function:', typeof handleAuthoritySelection);
    console.log('updateVisaTypeOptions function:', typeof updateVisaTypeOptions);
    console.log('showVisaSpecificUploadInterface function:', typeof showVisaSpecificUploadInterface);
};

// Default Questions and Answers Database
const DEFAULT_QA_DATABASE = {
    'australia': {
        'general-skilled-migration': {
            'acs': [
                {
                    question: 'What documents do I need for ACS skills assessment?',
                    keywords: ['documents', 'acs', 'skills assessment', 'required', 'need'],
                    answer: 'For ACS skills assessment, you need: 1) Passport bio page, 2) Academic qualifications (degrees, transcripts), 3) Employment reference letters with detailed job descriptions, 4) Payslips and bank statements, 5) CV/Resume. All documents must be certified copies.'
                },
                {
                    question: 'How long does ACS assessment take?',
                    keywords: ['how long', 'processing time', 'duration', 'weeks', 'months', 'acs'],
                    answer: 'ACS skills assessment typically takes 8-12 weeks from the date of application submission. However, this can vary depending on the complexity of your case and document completeness. We recommend submitting all required documents at once to avoid delays.'
                },
                {
                    question: 'What is the ACS assessment result validity?',
                    keywords: ['validity', 'valid for', 'expiry', 'how long valid', 'acs result'],
                    answer: 'ACS skills assessment results are valid for 3 years from the date of issue. This means you can use the same assessment result for your visa application within this timeframe. After 3 years, you may need to renew your assessment.'
                },
                {
                    question: 'Can I include my spouse in the application?',
                    keywords: ['spouse', 'partner', 'family', 'dependents', 'include', 'partner visa'],
                    answer: 'Yes, you can include your spouse or de facto partner and dependent children in your GSM application. They will need to meet health and character requirements. Your partner\'s skills and English proficiency can also contribute to your points score.'
                },
                {
                    question: 'What is the minimum points required for GSM?',
                    keywords: ['points', 'minimum', 'points test', 'how many points', 'score'],
                    answer: 'The minimum points required for GSM (General Skilled Migration) is 65 points. However, higher scores have better chances of receiving an invitation. Points are awarded for age, English proficiency, work experience, qualifications, and other factors. We can help you calculate your points accurately.'
                }
            ],
            'engineers-australia': [
                {
                    question: 'What documents do I need for Engineers Australia assessment?',
                    keywords: ['documents', 'engineers australia', 'required', 'need'],
                    answer: 'For Engineers Australia assessment, you need: 1) Passport bio page, 2) Engineering degree certificates and transcripts, 3) Detailed CV showing engineering work experience, 4) Continuing Professional Development (CPD) records, 5) Employment reference letters, 6) Professional registration (if applicable). All documents must be certified.'
                },
                {
                    question: 'How long does Engineers Australia assessment take?',
                    keywords: ['how long', 'processing time', 'duration', 'weeks', 'months'],
                    answer: 'Engineers Australia skills assessment typically takes 12-16 weeks for standard applications. Fast-track options may be available for an additional fee, reducing processing time to 4-6 weeks. Complete applications with all required documents are processed faster.'
                },
                {
                    question: 'Which engineering categories are assessed?',
                    keywords: ['engineering categories', 'types', 'disciplines', 'which engineering'],
                    answer: 'Engineers Australia assesses various engineering disciplines including: Civil, Mechanical, Electrical, Chemical, Software, Biomedical, and Environmental Engineering. Your qualifications and work experience must match your nominated engineering category for the visa application.'
                },
                {
                    question: 'Do I need professional registration?',
                    keywords: ['professional registration', 'registration', 'license', 'required'],
                    answer: 'Professional registration is not always mandatory but can strengthen your application. Some engineering categories and certain visa types may require or prefer professional registration. We can advise you based on your specific engineering discipline and visa pathway.'
                },
                {
                    question: 'Can I get positive assessment with overseas degree?',
                    keywords: ['overseas degree', 'foreign degree', 'international', 'accredited'],
                    answer: 'Yes, Engineers Australia can assess overseas engineering degrees. They compare your qualifications against Australian engineering standards. If your degree is accredited by the Washington Accord, Sydney Accord, or Dublin Accord signatory countries, the assessment process is typically faster and more straightforward.'
                }
            ],
            'vetassess': [
                {
                    question: 'What documents do I need for VETASSESS assessment?',
                    keywords: ['documents', 'vetassess', 'required', 'need'],
                    answer: 'For VETASSESS skills assessment, you need: 1) Passport bio page, 2) Educational qualifications (certificates, transcripts, and proof of completion), 3) Employment evidence including detailed reference letters, 4) Organizational charts, 5) Payslips and contracts, 6) Professional membership certificates (if applicable). All documents must be certified.'
                },
                {
                    question: 'How long does VETASSESS assessment take?',
                    keywords: ['how long', 'processing time', 'duration', 'weeks', 'months'],
                    answer: 'VETASSESS skills assessment typically takes 10-12 weeks for standard processing. Priority processing (for an additional fee) reduces this to 4-6 weeks. Ensure all documents are complete and properly certified to avoid processing delays.'
                },
                {
                    question: 'What occupations does VETASSESS assess?',
                    keywords: ['occupations', 'jobs', 'professions', 'which occupations'],
                    answer: 'VETASSESS assesses a wide range of professional and trade occupations including: Accountants, Architects, Business Analysts, Human Resource Managers, Marketing Specialists, and many skilled trade occupations. Check the VETASSESS website or consult with us to confirm if your occupation is assessable.'
                },
                {
                    question: 'Do I need work experience for VETASSESS?',
                    keywords: ['work experience', 'experience required', 'years of experience'],
                    answer: 'Yes, work experience requirements vary by occupation. Generally, you need at least 1-3 years of post-qualification work experience in your nominated occupation. Some occupations may require more. The experience must be at the required skill level and relevant to your qualifications.'
                },
                {
                    question: 'Can I use VETASSESS assessment for multiple visa types?',
                    keywords: ['multiple visa types', 'different visas', 'use for'],
                    answer: 'A positive VETASSESS assessment result is valid for 3 years and can be used for various visa types including Skilled Independent (subclass 189), Skilled Nominated (subclass 190), and Skilled Regional (subclass 491) visas. However, ensure the assessment is suitable for your chosen visa pathway.'
                }
            ]
        },
        'student-visa': [
            {
                question: 'What documents do I need for student visa application?',
                keywords: ['documents', 'student visa', 'required', 'need', 'application'],
                answer: 'For Australian Student Visa (Subclass 500), you need: 1) Confirmation of Enrolment (CoE) from your educational institution, 2) Genuine Temporary Entrant (GTE) statement, 3) Proof of financial capacity (bank statements, loans, or sponsor documents), 4) English language test results (IELTS, TOEFL, PTE), 5) Overseas Student Health Cover (OSHC), 6) Passport and passport photos, 7) Academic transcripts and certificates.'
            },
            {
                question: 'How much money do I need to show for student visa?',
                keywords: ['money', 'funds', 'financial', 'how much', 'requirements', 'bank statement'],
                answer: 'You need to demonstrate sufficient funds to cover: 1) Tuition fees for your course, 2) Living costs (approximately AUD 21,041 per year), 3) Travel costs. For a 2-year course, you typically need to show around AUD 60,000-80,000 depending on tuition fees. You can provide bank statements, loan letters, or sponsor declarations as proof.'
            },
            {
                question: 'Can I work while studying in Australia?',
                keywords: ['work', 'working', 'part time', 'while studying', 'work rights'],
                answer: 'Yes, Student Visa holders can work up to 40 hours per fortnight (every 2 weeks) during term time and unlimited hours during scheduled course breaks. However, you cannot start working until your course has commenced. Some courses may have different work restrictions, so check your visa conditions.'
            },
            {
                question: 'How long can I stay in Australia on student visa?',
                keywords: ['how long', 'duration', 'stay', 'valid for', 'length'],
                answer: 'Your Student Visa is valid for the duration of your course plus a short period (usually 1-2 months) after course completion. The exact length depends on your course duration. For example, a 2-year master\'s degree would typically give you a visa valid for approximately 26 months.'
            },
            {
                question: 'Can I bring my family on student visa?',
                keywords: ['family', 'spouse', 'children', 'dependents', 'bring', 'include'],
                answer: 'Yes, you can include family members (spouse and dependent children) in your Student Visa application. They will have the same visa conditions as you. They can also work up to 40 hours per fortnight if you are studying a master\'s or doctoral degree. Family members must meet health and character requirements.'
            }
        ]
    },
    'canada': {
        'express-entry': [
            {
                question: 'What documents do I need for Express Entry?',
                keywords: ['documents', 'express entry', 'required', 'need'],
                answer: 'For Express Entry, you need: 1) Valid passport, 2) Educational Credential Assessment (ECA) report, 3) Language test results (IELTS/CELPIP for English or TEF for French), 4) Employment reference letters, 5) Police clearance certificates, 6) Medical examination results, 7) Proof of settlement funds, 8) Educational certificates and transcripts.'
            },
            {
                question: 'What is the minimum CRS score for Express Entry?',
                keywords: ['crs score', 'minimum', 'points', 'what score', 'cut off'],
                answer: 'There is no fixed minimum CRS score for Express Entry. The cutoff score varies with each draw (usually every 2 weeks). Recent draws have had cutoff scores ranging from 470-500 points. Higher scores have better chances. You can improve your score through: provincial nomination, job offer, French language skills, or additional qualifications.'
            },
            {
                question: 'How long does Express Entry processing take?',
                keywords: ['how long', 'processing time', 'duration', 'weeks', 'months'],
                answer: 'Express Entry processing typically takes 6 months from the date you receive an Invitation to Apply (ITA). This includes processing time for your permanent residence application. However, the time to receive an ITA depends on your CRS score and the cutoff scores in the draws.'
            },
            {
                question: 'Do I need a job offer for Express Entry?',
                keywords: ['job offer', 'employment', 'lmia', 'required'],
                answer: 'A job offer is not mandatory for Express Entry, but it can significantly boost your CRS score (adding 50-200 points depending on the type). A valid job offer must be supported by a Labour Market Impact Assessment (LMIA) or be LMIA-exempt. Even without a job offer, you can still be selected if your CRS score is high enough.'
            },
            {
                question: 'Can I apply without Canadian work experience?',
                keywords: ['canadian work experience', 'foreign experience', 'work experience', 'required'],
                answer: 'Yes, you can apply for Express Entry with foreign work experience. However, having Canadian work experience gives you additional CRS points. The Federal Skilled Worker Program accepts foreign work experience, while the Canadian Experience Class (CEC) specifically requires Canadian work experience. Choose the program that matches your profile.'
            }
        ]
    }
};

// ============================================
// CUSTOM AI CHATBOT - Migration Expert (Built-in, No API Needed!)
// ============================================

// AI Agent Configuration
const AI_AGENT_CONFIG = {
    enabled: true,
    provider: 'custom',  // Custom built-in chatbot
    name: 'Migration Expert AI',
    version: '1.0'
};

// Initialize Custom AI Chatbot
(function() {
    console.log('✅ Custom Migration Expert AI initialized');
    console.log('✅ No external API needed - completely self-contained!');
    console.log('✅ Knowledge base includes all migration details for your app');
    console.log('✅ Ready to answer questions about visas, documents, processing times, and more!');
})();

// ============================================
// CUSTOM AI CHATBOT ENGINE - Migration Expert
// ============================================

// Enhanced Knowledge Base with comprehensive migration information
const MIGRATION_KNOWLEDGE_BASE = {
    // General migration information
    general: [
        {
            keywords: ['hello', 'hi', 'hey', 'greeting', 'good morning', 'good afternoon', 'good evening'],
            answer: 'Hello! I\'m your Migration Expert AI assistant. I can help you with questions about visa requirements, documents, processing times, eligibility, and all aspects of migration to Australia, Canada, New Zealand, UK, and USA. What would you like to know?'
        },
        {
            keywords: ['help', 'assistance', 'support', 'what can you do', 'capabilities', 'features'],
            answer: 'I can help you with: 1) Document requirements for different visas, 2) Processing times and timelines, 3) Eligibility criteria and points systems, 4) Skills assessment requirements, 5) Financial requirements, 6) Work rights and conditions, 7) Family inclusion options, 8) Visa validity and renewal, 9) Application procedures, 10) Health and character requirements. Just ask me anything about migration!'
        },
        {
            keywords: ['thank', 'thanks', 'appreciate', 'grateful'],
            answer: 'You\'re welcome! I\'m here to help with all your migration questions. Feel free to ask anything else about visa processes, requirements, or procedures. If you need more detailed assistance, our human migration consultants are available to help as well.'
        },
        {
            keywords: ['bye', 'goodbye', 'see you', 'farewell'],
            answer: 'Goodbye! Feel free to come back anytime if you have more questions about migration. We\'re here to help you on your migration journey. Good luck!'
        }
    ],
    
    // Question type patterns and responses
    questionTypes: {
        documents: {
            keywords: ['documents', 'document', 'papers', 'paperwork', 'required', 'need', 'what do i need', 'what documents', 'documentation', 'certificates', 'certificate'],
            patterns: [/what documents|what do i need|required documents|need documents|paperwork|documentation/gi],
            responses: {
                default: 'The required documents vary by visa type. Generally, you\'ll need: passport, identity documents, educational certificates, employment records, English test results, health checks, police clearances, and financial proof. Tell me your visa type and I can provide the complete document checklist.'
            }
        },
        processingTime: {
            keywords: ['processing time', 'how long', 'duration', 'timeline', 'when', 'how soon', 'timeframe', 'waiting time', 'processing period'],
            patterns: [/how long|processing time|duration|timeline|when will|how soon|timeframe|waiting/gi],
            responses: {
                default: 'Processing times vary significantly by visa type and country. Student visas typically take 4-8 weeks, Skilled visas 6-12 months, Partner visas 12-24 months, and Visitor visas 2-4 weeks. The actual time depends on application completeness, country of origin, and current processing volumes.'
            }
        },
        cost: {
            keywords: ['cost', 'fee', 'price', 'how much', 'charges', 'payment', 'fees', 'expense', 'total cost', 'application fee'],
            patterns: [/how much|cost|fee|price|charges|payment|expense|total cost/gi],
            responses: {
                default: 'Visa application fees vary by type: Student visas (AUD 630), Skilled visas (AUD 4,045-6,620), Partner visas (AUD 7,715-8,850), Visitor visas (AUD 145-1,065). Additional costs include health checks (AUD 300-500), police clearances (varies), translations (AUD 50-100 per document), and skills assessments (AUD 500-1,500).'
            }
        },
        eligibility: {
            keywords: ['eligibility', 'qualify', 'requirements', 'criteria', 'can i apply', 'am i eligible', 'eligible', 'qualification', 'qualify for'],
            patterns: [/eligibility|qualify|requirements|criteria|can i apply|am i eligible|qualify for/gi],
            responses: {
                default: 'Eligibility depends on visa type. Common requirements include: age limits (usually under 45 for skilled visas), English proficiency (IELTS 6.0-7.0+), relevant qualifications, work experience (1-3+ years), health and character checks, financial capacity, and genuine intentions. Tell me your visa type for specific criteria.'
            }
        },
        workRights: {
            keywords: ['work', 'working', 'work rights', 'employment', 'job', 'can i work', 'work permit', 'work visa', 'employment rights'],
            patterns: [/work|working|work rights|employment|can i work|work permit|employment rights/gi],
            responses: {
                default: 'Work rights vary by visa type. Student visas allow 40 hours per fortnight during term, unlimited during breaks. Skilled visas usually provide full work rights. Partner visas allow work. Visitor visas generally don\'t permit work. Tell me your specific visa type for detailed work rights.'
            }
        },
        family: {
            keywords: ['family', 'spouse', 'partner', 'children', 'dependents', 'bring', 'include', 'dependent', 'wife', 'husband', 'kids'],
            patterns: [/family|spouse|partner|children|dependents|bring|include|wife|husband|kids/gi],
            responses: {
                default: 'Most visa types allow you to include family members. You can typically include your spouse/de facto partner and dependent children (usually under 18 or 23 if studying). They must meet health and character requirements. Some visas allow family members to work or study. Tell me your visa type for specific family inclusion rules.'
            }
        },
        english: {
            keywords: ['english', 'ielts', 'toefl', 'pte', 'language test', 'english test', 'english requirement', 'language requirement'],
            patterns: [/english|ielts|toefl|pte|language test|english test|english requirement/gi],
            responses: {
                default: 'English requirements vary by visa type. Skilled visas typically require IELTS 6.0-7.0 (or equivalent PTE/TOEFL). Student visas require IELTS 5.5-6.5 depending on course. Some visas may accept English medium education or native speaker status. Tests are valid for 2-3 years. Tell me your visa type for specific requirements.'
            }
        },
        health: {
            keywords: ['health', 'medical', 'health check', 'medical exam', 'health requirement', 'medical examination', 'health checkup'],
            patterns: [/health|medical|health check|medical exam|health requirement|medical examination/gi],
            responses: {
                default: 'Health requirements are mandatory for most visas. You\'ll need to undergo a medical examination by approved panel physicians. Tests typically include chest X-ray, blood tests, and general health check. Costs vary (AUD 300-500). Results are usually valid for 12 months. Some conditions may affect eligibility.'
            }
        },
        character: {
            keywords: ['character', 'police', 'police clearance', 'criminal record', 'character check', 'police check', 'criminal check'],
            patterns: [/character|police|police clearance|criminal record|character check|police check/gi],
            responses: {
                default: 'Character requirements are mandatory. You must provide police clearance certificates from all countries where you\'ve lived for 12+ months in the past 10 years. Processing time varies by country (2-8 weeks). Some criminal convictions may affect eligibility. Tell me your visa type for specific character requirements.'
            }
        },
        points: {
            keywords: ['points', 'points test', 'crs score', 'points system', 'points calculation', 'how many points', 'points required'],
            patterns: [/points|points test|crs score|points system|points calculation|how many points/gi],
            responses: {
                default: 'Points systems vary by country. Australia GSM requires minimum 65 points (awarded for age, English, qualifications, experience, etc.). Canada Express Entry uses CRS score (recent cutoffs 470-500). Higher scores increase invitation chances. Points are awarded for age (under 33 is best), English proficiency, qualifications, experience, and additional factors.'
            }
        }
    },
    
    // Country-specific information
    countries: {
        australia: {
            general: [
                'Australia offers various visa pathways including skilled migration, student visas, partner visas, and business visas.',
                'Australia has a points-based system for skilled migration requiring minimum 65 points.',
                'Student visas in Australia allow part-time work (40 hours per fortnight) and can lead to permanent residency.',
                'Australia requires health checks and police clearances for most visa types.',
                'English proficiency is required for most Australian visas (typically IELTS 6.0-7.0).'
            ],
            visaTypes: {
                'student-visa': 'Student Visa (Subclass 500) allows study in Australia with work rights and pathway to permanent residency.',
                'general-skilled-migration': 'Skilled Migration includes subclasses 189, 190, and 491 requiring skills assessment and points test.',
                'partner-visa': 'Partner visas (820/801 or 309/100) allow partners of Australian citizens/residents to live in Australia.',
                'business-visa': 'Business visas (188/888) are for investors and entrepreneurs wanting to establish businesses in Australia.'
            }
        },
        canada: {
            general: [
                'Canada uses Express Entry system for skilled workers with points-based selection (CRS score).',
                'Provincial Nominee Programs (PNP) offer additional pathways to Canadian permanent residency.',
                'Canada requires Educational Credential Assessment (ECA) for foreign qualifications.',
                'French language skills can significantly boost your CRS score in Express Entry.',
                'Canada has various programs: Federal Skilled Worker, Canadian Experience Class, and Provincial Nominee Programs.'
            ]
        }
    },
    
    // Visa-specific tips
    tips: {
        application: [
            'Always submit complete applications with all required documents to avoid delays.',
            'Keep certified copies of all documents - originals may not be returned.',
            'Ensure all documents are translated if not in English.',
            'Submit applications well before visa expiry to avoid gaps.',
            'Keep track of processing times and follow up if delayed beyond normal timeframe.'
        ],
        documents: [
            'Get documents certified by authorized persons (lawyers, notaries, etc.).',
            'Translations must be done by NAATI-certified translators.',
            'Keep copies of everything you submit.',
            'Ensure documents are recent (usually within 3-6 months for financial documents).',
            'Check expiry dates on passports and other documents.'
        ],
        preparation: [
            'Start preparing documents early - some take weeks to obtain.',
            'Take English tests early as booking slots fill quickly.',
            'Research your occupation requirements thoroughly.',
            'Keep detailed employment records and reference letters.',
            'Maintain financial records and bank statements.'
        ]
    }
};

// Enhanced smart search function with better matching - searches everywhere
function searchKnowledgeBase(userMessage, clientContext) {
    const message = userMessage.toLowerCase().trim();
    const results = [];
    
    // Get country and visa type from context
    const country = (clientContext?.country || '').toLowerCase();
    const visaType = (clientContext?.visaType || '').toLowerCase();
    const authority = (clientContext?.authority || '').toLowerCase();
    
    // Extract key terms from message
    const messageWords = message.split(/\s+/).filter(w => w.length > 2);
    
    // Also try to detect country and visa type from message itself
    const detectedCountry = detectCountryFromMessage(message) || country;
    const detectedVisaType = detectVisaTypeFromMessage(message) || visaType;
    
    // Search in DEFAULT_QA_DATABASE (highest priority)
    // Try with detected values first, then context values
    const countriesToSearch = [detectedCountry, country].filter(c => c && DEFAULT_QA_DATABASE[c]);
    const visaTypesToSearch = [detectedVisaType, visaType].filter(v => v);
    
    countriesToSearch.forEach(searchCountry => {
        if (!searchCountry || !DEFAULT_QA_DATABASE[searchCountry]) return;
        
        // Try visa-specific first
        visaTypesToSearch.forEach(searchVisaType => {
            if (searchVisaType && DEFAULT_QA_DATABASE[searchCountry][searchVisaType]) {
            let qaList = [];
            
            if (typeof DEFAULT_QA_DATABASE[country][visaType] === 'object' && !Array.isArray(DEFAULT_QA_DATABASE[country][visaType])) {
                // Authority-specific QAs
                if (authority && DEFAULT_QA_DATABASE[searchCountry][searchVisaType][authority]) {
                    qaList = DEFAULT_QA_DATABASE[searchCountry][searchVisaType][authority];
                } else {
                    // Search all authorities
                    Object.values(DEFAULT_QA_DATABASE[searchCountry][searchVisaType]).forEach(authQAs => {
                        if (Array.isArray(authQAs)) {
                            qaList = qaList.concat(authQAs);
                        }
                    });
                }
            } else if (Array.isArray(DEFAULT_QA_DATABASE[searchCountry][searchVisaType])) {
                qaList = DEFAULT_QA_DATABASE[searchCountry][searchVisaType];
            }
            
            // Enhanced scoring
            qaList.forEach(qa => {
                let score = 0;
                const qaKeywords = (qa.keywords || []).map(k => k.toLowerCase());
                const qaQuestion = (qa.question || '').toLowerCase();
                const qaAnswer = (qa.answer || '').toLowerCase();
                
                // Exact keyword matches (higher weight)
                qaKeywords.forEach(keyword => {
                    if (message.includes(keyword)) {
                        score += 3;
                    }
                    // Partial matches
                    if (message.includes(keyword.substring(0, Math.min(4, keyword.length)))) {
                        score += 1;
                    }
                });
                
                // Question word matches
                const questionWords = qaQuestion.split(/\s+/).filter(w => w.length > 3);
                questionWords.forEach(word => {
                    if (message.includes(word)) {
                        score += 2;
                    }
                });
                
                // Answer content matches
                const answerWords = qaAnswer.split(/\s+/).filter(w => w.length > 4);
                answerWords.forEach(word => {
                    if (message.includes(word)) {
                        score += 1;
                    }
                });
                
                // Exact phrase matches in question (highest weight)
                if (message.includes(qaQuestion.substring(0, Math.min(20, qaQuestion.length)))) {
                    score += 10;
                }
                
                if (score > 0) {
                    results.push({
                        answer: qa.answer,
                        score: score,
                        source: 'qa_database',
                        question: qa.question
                    });
                }
            });
        }
        });
        
        // Also search all visa types in this country if no specific visa type match or score is low
        if (results.length === 0 || (results.length > 0 && results[0].score < 8)) {
            Object.keys(DEFAULT_QA_DATABASE[searchCountry]).forEach(allVisaType => {
                let qaList = [];
                const visaData = DEFAULT_QA_DATABASE[searchCountry][allVisaType];
                
                if (typeof visaData === 'object' && !Array.isArray(visaData)) {
                    // Authority-specific
                    Object.values(visaData).forEach(authQAs => {
                        if (Array.isArray(authQAs)) {
                            qaList = qaList.concat(authQAs);
                        }
                    });
                } else if (Array.isArray(visaData)) {
                    qaList = visaData;
                }
                
                // Score each QA
                qaList.forEach(qa => {
                    let score = 0;
                    const qaKeywords = (qa.keywords || []).map(k => k.toLowerCase());
                    const qaQuestion = (qa.question || '').toLowerCase();
                    
                    qaKeywords.forEach(keyword => {
                        if (message.includes(keyword)) {
                            score += 2;
                        }
                    });
                    
                    const questionWords = qaQuestion.split(/\s+/).filter(w => w.length > 3);
                    questionWords.forEach(word => {
                        if (message.includes(word)) {
                            score += 1;
                        }
                    });
                    
                    if (score > 0) {
                        results.push({
                            answer: qa.answer,
                            score: score - 1, // Slightly lower score for non-specific visa type
                            source: 'qa_database',
                            question: qa.question
                        });
                    }
                });
            });
        }
    });
    
    // Search question types (medium priority)
    Object.keys(MIGRATION_KNOWLEDGE_BASE.questionTypes).forEach(qType => {
        const qTypeData = MIGRATION_KNOWLEDGE_BASE.questionTypes[qType];
        let score = 0;
        
        // Check keywords
        qTypeData.keywords.forEach(keyword => {
            if (message.includes(keyword.toLowerCase())) {
                score += 3;
            }
        });
        
        // Check patterns
        if (qTypeData.patterns) {
            qTypeData.patterns.forEach(pattern => {
                if (pattern.test(message)) {
                    score += 5;
                }
            });
        }
        
        if (score > 0) {
            results.push({
                answer: qTypeData.responses.default,
                score: score,
                source: 'question_type',
                type: qType
            });
        }
    });
    
    // Search general knowledge base
    MIGRATION_KNOWLEDGE_BASE.general.forEach(item => {
        let score = 0;
        item.keywords.forEach(keyword => {
            if (message.includes(keyword.toLowerCase())) {
                score += 4;
            }
        });
        if (score > 0) {
            results.push({
                answer: item.answer,
                score: score,
                source: 'general_kb'
            });
        }
    });
    
    // Search country-specific information
    if (country && MIGRATION_KNOWLEDGE_BASE.countries[country]) {
        const countryInfo = MIGRATION_KNOWLEDGE_BASE.countries[country];
        
        // Check if message mentions visa type
        if (visaType && countryInfo.visaTypes && countryInfo.visaTypes[visaType]) {
            let score = 0;
            messageWords.forEach(word => {
                if (countryInfo.visaTypes[visaType].toLowerCase().includes(word)) {
                    score += 2;
                }
            });
            if (score > 0) {
                results.push({
                    answer: countryInfo.visaTypes[visaType],
                    score: score,
                    source: 'country_info'
                });
            }
        }
    }
    
    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    return results;
}

// Enhanced AI Chatbot - Generates highly detailed, specific, intelligent responses
function generateAIResponse(userMessage, clientContext, searchResults) {
    const message = userMessage.toLowerCase().trim();
    const country = (clientContext?.country || '').toLowerCase();
    const visaType = (clientContext?.visaType || '').toLowerCase();
    const authority = (clientContext?.authority || '').toLowerCase();
    
    // ALWAYS use the best match if we have any results - never show generic message first
    if (searchResults.length > 0) {
        let response = searchResults[0].answer;
        const bestMatch = searchResults[0];
        
        // Use detected country/visa type if context doesn't have it
        const finalCountry = country || detectCountryFromMessage(message);
        const finalVisaType = visaType || detectVisaTypeFromMessage(message);
        
        // ENHANCEMENT: Add detailed document list from DOCUMENT_REQUIREMENTS if asking about documents
        if ((message.includes('document') || message.includes('paper') || message.includes('need') || message.includes('require') || message.includes('what do i need')) && 
            finalCountry && finalVisaType && typeof DOCUMENT_REQUIREMENTS !== 'undefined') {
            const docReq = DOCUMENT_REQUIREMENTS[finalCountry]?.[finalVisaType];
            if (docReq && Array.isArray(docReq) && docReq.length > 0) {
                // Replace or enhance with complete document list
                if (response.toLowerCase().includes('document') || response.toLowerCase().includes('need') || message.includes('document')) {
                    response = `For ${getCountryName(finalCountry)} ${VISA_TYPES_DATA[finalCountry]?.[finalVisaType]?.name || finalVisaType}, here is the complete document checklist:\n\n`;
                    docReq.forEach((doc, index) => {
                        response += `${index + 1}. ${doc}\n`;
                    });
                    response += `\n📋 Important Notes:\n`;
                    response += `• All documents must be certified copies (not originals)\n`;
                    response += `• Documents not in English must be translated by NAATI-certified translators\n`;
                    response += `• Police clearances needed from all countries where you lived 12+ months since age 16\n`;
                    response += `• Medical examinations must be done by approved panel physicians\n`;
                    response += `• Financial documents should be recent (within 3-6 months)\n`;
                    response += `• Passport must be valid for at least 6 months beyond intended stay`;
                }
            }
        }
        
        // ENHANCEMENT: Add specific visa subclass information
        if (finalCountry === 'australia' && finalVisaType) {
            const subclassInfo = getVisaSubclassInfo(finalCountry, finalVisaType);
            if (subclassInfo && !response.includes('Subclass')) {
                response = `${subclassInfo}\n\n${response}`;
            }
        }
        
        // ENHANCEMENT: Add specific processing times with exact weeks/months
        if (message.includes('how long') || message.includes('processing time') || message.includes('duration') || message.includes('when') || message.includes('timeframe')) {
            const specificTimes = getSpecificProcessingTimes(finalCountry, finalVisaType);
            if (specificTimes && !response.includes('weeks') && !response.includes('months')) {
                response += `\n\n⏱️ Specific Processing Times:\n${specificTimes}`;
            }
        }
        
        // ENHANCEMENT: Add exact costs with breakdown
        if (message.includes('cost') || message.includes('fee') || message.includes('how much') || message.includes('price') || message.includes('charges')) {
            const exactCosts = getExactCosts(finalCountry, finalVisaType);
            if (exactCosts && !response.includes('AUD') && !response.includes('CAD') && !response.includes('$')) {
                response += `\n\n💰 Cost Breakdown:\n${exactCosts}`;
            }
        }
        
        // ENHANCEMENT: Add specific eligibility points breakdown
        if (message.includes('point') || message.includes('eligibility') || message.includes('qualify') || message.includes('score') || message.includes('crs')) {
            const pointsBreakdown = getPointsBreakdown(finalCountry, finalVisaType);
            if (pointsBreakdown && !response.includes('points are awarded') && !response.includes('points')) {
                response += `\n\n📊 Points Breakdown:\n${pointsBreakdown}`;
            }
        }
        
        // ENHANCEMENT: Add step-by-step procedure if asking about application process
        if (message.includes('how to apply') || message.includes('process') || message.includes('procedure') || message.includes('step') || message.includes('application process')) {
            const steps = getApplicationSteps(finalCountry, finalVisaType);
            if (steps && !response.includes('Step 1') && !response.includes('Step 2')) {
                response += `\n\n📝 Application Process:\n${steps}`;
            }
        }
        
        // Add context-specific enhancements
        if (finalCountry) {
            const countryName = getCountryName(finalCountry);
            if (!response.toLowerCase().includes(countryName.toLowerCase()) && countryName !== '') {
                response = `For ${countryName}, ${response}`;
            }
        }
        
        // Add additional detailed information from other matches
        if (searchResults.length > 1) {
            searchResults.slice(1, 3).forEach((match, index) => {
                if (match.score >= 5 && match.answer && match.answer.length > 50 && match.answer.length < 300) {
                    response += `\n\n💡 Additional Information:\n${match.answer}`;
                }
            });
        }
        
        // Add relevant detailed tips
        if (message.includes('document')) {
            response += `\n\n📌 Document Preparation Tips:\n`;
            response += `• Start gathering documents 3-6 months before application\n`;
            response += `• Get police clearances early (they can take 4-8 weeks)\n`;
            response += `• Book medical examinations at approved centers only\n`;
            response += `• Keep digital copies of all documents\n`;
            response += `• Ensure all certifications are current`;
        }
        
        if (message.includes('application') || message.includes('apply')) {
            response += `\n\n📌 Application Tips:\n`;
            response += `• Submit complete applications to avoid requests for additional documents\n`;
            response += `• Double-check all forms before submission\n`;
            response += `• Keep track of your application reference number\n`;
            response += `• Respond promptly to any requests from immigration authorities`;
        }
        
        return response;
    } 
    // No good match - try to provide information anyway
    else {
        // Try to detect country and visa type from message
        const detectedCountry = detectCountryFromMessage(message);
        const detectedVisaType = detectVisaTypeFromMessage(message);
        const finalCountry = detectedCountry || country;
        const finalVisaType = detectedVisaType || visaType;
        
        let response = '';
        
        // If we can detect country/visa type, provide detailed info
        if (finalCountry && finalVisaType && typeof DOCUMENT_REQUIREMENTS !== 'undefined') {
            const countryName = getCountryName(finalCountry);
            const visaTypeName = VISA_TYPES_DATA[finalCountry]?.[finalVisaType]?.name || finalVisaType;
            
            // Provide detailed document list
            const docReq = DOCUMENT_REQUIREMENTS[finalCountry]?.[finalVisaType];
            if (docReq && docReq.length > 0) {
                response = `For ${countryName} ${visaTypeName}, here is the complete information:\n\n`;
                response += `📋 Required Documents:\n`;
                docReq.forEach((doc, index) => {
                    response += `${index + 1}. ${doc}\n`;
                });
                
                // Add processing times
                const specificTimes = getSpecificProcessingTimes(finalCountry, finalVisaType);
                if (specificTimes) {
                    response += `\n\n⏱️ Processing Times:\n${specificTimes}`;
                }
                
                // Add costs
                const exactCosts = getExactCosts(finalCountry, finalVisaType);
                if (exactCosts) {
                    response += `\n\n💰 Costs:\n${exactCosts}`;
                }
                
                // Add application steps
                const steps = getApplicationSteps(finalCountry, finalVisaType);
                if (steps) {
                    response += `\n\n📝 Application Process:\n${steps}`;
                }
                
                // Add visa subclass info
                const subclassInfo = getVisaSubclassInfo(finalCountry, finalVisaType);
                if (subclassInfo) {
                    response = `${subclassInfo}\n\n${response}`;
                }
                
                return response;
            }
        }
        
        // Last resort - provide helpful response
        const messageWords = message.split(/\s+/).filter(w => w.length > 2);
        const keyTerms = messageWords.filter(word => 
            word.length > 3 && 
            !['what', 'where', 'when', 'how', 'why', 'which', 'can', 'will', 'does', 'do', 'about', 'for', 'the', 'this', 'that', 'visa', 'need', 'want', 'details', 'information'].includes(word.toLowerCase())
        );
        
        if (finalCountry && finalVisaType) {
            const countryName = getCountryName(finalCountry);
            const visaTypeName = VISA_TYPES_DATA[finalCountry]?.[finalVisaType]?.name || finalVisaType;
            response = `For ${countryName} ${visaTypeName}, I can help you with detailed information about:\n\n`;
            response += `• Complete document requirements\n`;
            response += `• Processing times and timelines\n`;
            response += `• Eligibility criteria and points\n`;
            response += `• Application procedures\n`;
            response += `• Costs and fees\n`;
            response += `• Work rights and conditions\n\n`;
            response += `What specific information would you like about ${visaTypeName}?`;
        } else {
            response = `I can help you with migration information. `;
            if (keyTerms.length > 0) {
                response += `I see you're asking about ${keyTerms.slice(0, 2).join(' and ')}. `;
            }
            response += `Please specify:\n\n`;
            response += `1. Country (Australia, Canada, New Zealand, UK, or USA)\n`;
            response += `2. Visa type (Student, Skilled, Partner, etc.)\n`;
            response += `3. Your specific question\n\n`;
            response += `Or ask something like: "What documents do I need for Australia student visa?"`;
        }
        
        return response;
    }
}

// Helper functions to detect country and visa type from message
function detectCountryFromMessage(message) {
    const countryKeywords = {
        'australia': ['australia', 'australian', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide'],
        'canada': ['canada', 'canadian', 'toronto', 'vancouver', 'montreal', 'ottawa'],
        'united-kingdom': ['uk', 'united kingdom', 'britain', 'british', 'london', 'england'],
        'new-zealand': ['new zealand', 'nz', 'auckland', 'wellington'],
        'united-states': ['usa', 'us', 'united states', 'america', 'american', 'new york', 'los angeles']
    };
    
    for (const [country, keywords] of Object.entries(countryKeywords)) {
        if (keywords.some(keyword => message.includes(keyword))) {
            return country;
        }
    }
    return null;
}

function detectVisaTypeFromMessage(message) {
    const visaKeywords = {
        'student-visa': ['student', 'study', 'education', 'university', 'college', 'course', 'enrollment', 'coe'],
        'general-skilled-migration': ['skilled', 'gsm', 'migration', 'points', 'skills assessment', 'occupation'],
        'partner-visa': ['partner', 'spouse', 'wife', 'husband', 'marriage', 'relationship'],
        'business-visa': ['business', 'invest', 'investor', 'entrepreneur', 'businessman'],
        'parent-visa': ['parent', 'mother', 'father', 'aged parent'],
        'visit-visa': ['visit', 'tourist', 'travel', 'holiday', 'visitor'],
        'family-visa': ['family', 'relative', 'sibling', 'brother', 'sister']
    };
    
    for (const [visaType, keywords] of Object.entries(visaKeywords)) {
        if (keywords.some(keyword => message.includes(keyword))) {
            return visaType;
        }
    }
    return null;
}

// Helper functions to get highly specific information
function getVisaSubclassInfo(country, visaType) {
    const subclassMap = {
        'australia': {
            'student-visa': 'Student Visa (Subclass 500) - This visa allows you to study full-time in Australia at an approved educational institution. It includes work rights and can lead to post-study work visas.',
            'general-skilled-migration': 'General Skilled Migration includes: Subclass 189 (Skilled Independent), Subclass 190 (Skilled Nominated), and Subclass 491 (Skilled Regional). All require skills assessment and points test (minimum 65 points).',
            'partner-visa': 'Partner visas include: Subclass 820/801 (onshore) and Subclass 309/100 (offshore). These allow partners of Australian citizens or permanent residents to live in Australia.',
            'business-visa': 'Business visas include: Subclass 188 (Provisional) and Subclass 888 (Permanent). These are for investors and entrepreneurs.',
            'parent-visa': 'Parent visas include: Subclass 103 (Parent), Subclass 143 (Contributory Parent), and Subclass 804 (Aged Parent). Processing times vary significantly.',
            'visit-visa': 'Visitor visas include: Subclass 600 (Tourist), Subclass 601 (ETA), and Subclass 651 (eVisitor). Duration and conditions vary.'
        }
    };
    return subclassMap[country]?.[visaType] || '';
}

function getSpecificProcessingTimes(country, visaType) {
    const times = {
        'australia': {
            'student-visa': 'Student Visa (Subclass 500): 75% of applications processed within 4-8 weeks, 90% within 8-12 weeks. Processing faster for complete applications with all documents.',
            'general-skilled-migration': 'Skilled Migration: Subclass 189 (6-12 months), Subclass 190 (6-12 months), Subclass 491 (6-12 months). Actual time depends on points score and invitation rounds.',
            'partner-visa': 'Partner Visas: Onshore (820) 12-18 months, Offshore (309) 12-24 months. Permanent stage (801/100) additional 12-18 months after provisional.',
            'business-visa': 'Business Visas: Subclass 188 (12-18 months), Subclass 888 (18-24 months). Processing depends on investment amount and business proposal.',
            'visit-visa': 'Visitor Visas: Subclass 600 (2-4 weeks for standard, 48 hours for fast-track). ETA/eVisitor (instant to 24 hours).',
            'parent-visa': 'Parent Visas: Subclass 103 (30+ years), Subclass 143 (4-6 years), Subclass 804 (30+ years). Contributory options are faster but more expensive.'
        },
        'canada': {
            'express-entry': 'Express Entry: 6 months from ITA (Invitation to Apply) to PR decision. Time to receive ITA varies (2 weeks to 2 years) depending on CRS score and draw cutoffs.',
            'study-permit': 'Study Permit: 4-8 weeks for standard processing, 2-4 weeks for Student Direct Stream (SDS) if eligible.',
            'work-permit': 'Work Permit: 4-8 weeks for online applications, 8-12 weeks for paper applications. LMIA processing adds 4-6 weeks.'
        }
    };
    return times[country]?.[visaType] || '';
}

function getExactCosts(country, visaType) {
    const costs = {
        'australia': {
            'student-visa': 'Student Visa (Subclass 500): AUD 630 application fee. Additional: OSHC (AUD 500-1,500/year), English tests (AUD 300-400), Medical (AUD 300-500), Police clearance (varies by country).',
            'general-skilled-migration': 'Skilled Migration: Subclass 189 (AUD 4,045), Subclass 190 (AUD 4,045), Subclass 491 (AUD 4,045). Additional: Skills assessment (AUD 500-1,500), English tests (AUD 300-400), Medical (AUD 300-500), Police clearance (varies).',
            'partner-visa': 'Partner Visas: Subclass 820/801 (AUD 7,715), Subclass 309/100 (AUD 7,715). Additional: Medical (AUD 300-500), Police clearance (varies), Relationship evidence costs.',
            'business-visa': 'Business Visas: Subclass 188 (AUD 6,270-9,195 depending on stream), Subclass 888 (AUD 2,935). Plus investment amounts (varies by stream).',
            'visit-visa': 'Visitor Visas: Subclass 600 (AUD 145-1,065 depending on stream), ETA (AUD 20), eVisitor (free).',
            'parent-visa': 'Parent Visas: Subclass 103 (AUD 4,155), Subclass 143 (AUD 47,755 + 2nd instalment AUD 43,600), Subclass 804 (AUD 4,155).'
        },
        'canada': {
            'express-entry': 'Express Entry: CAD 1,325 (principal applicant), CAD 1,325 (spouse), CAD 225 per child. Additional: ECA (CAD 200-300), Language tests (CAD 300-400), Medical (CAD 200-300), Police clearance (varies).',
            'study-permit': 'Study Permit: CAD 150 application fee. Additional: Biometrics (CAD 85), Medical (if required, CAD 200-300).',
            'work-permit': 'Work Permit: CAD 155 (open), CAD 155 (employer-specific). LMIA processing: CAD 1,000 (if required).'
        }
    };
    return costs[country]?.[visaType] || '';
}

function getPointsBreakdown(country, visaType) {
    if (country === 'australia' && visaType === 'general-skilled-migration') {
        return `Australia GSM Points Breakdown (Minimum 65 points required):
• Age: 25-32 years (30 points), 33-39 years (25 points), 40-44 years (15 points), 45+ (0 points)
• English: Superior (20 points), Proficient (10 points), Competent (0 points)
• Work Experience: 8-10 years overseas (15 points), 5-7 years (10 points), 3-4 years (5 points)
• Qualifications: PhD (20 points), Bachelor/Master (15 points), Diploma/Trade (10 points)
• Australian Study: 2+ years in Australia (5 points)
• Regional Study: 2+ years in regional Australia (5 points)
• Partner Skills: Partner with skills assessment (10 points) or English (5 points)
• State Nomination: Subclass 190 (5 points), Subclass 491 (15 points)
• Professional Year: Completed in Australia (5 points)`;
    }
    if (country === 'canada' && visaType === 'express-entry') {
        return `Canada Express Entry CRS Score Breakdown:
• Core Factors: Age (max 110 points), Education (max 150 points), Language (max 160 points), Work Experience (max 80 points)
• Spouse Factors: Education (max 10 points), Language (max 20 points), Work Experience (max 10 points)
• Skill Transferability: Education + Language (max 50 points), Education + Work (max 50 points), Foreign Work + Language (max 50 points), Foreign Work + Canadian Work (max 50 points)
• Additional: Canadian Education (max 30 points), French Language (max 50 points), Sibling in Canada (15 points), Provincial Nomination (600 points)`;
    }
    return '';
}

function getApplicationSteps(country, visaType) {
    if (country === 'australia' && visaType === 'student-visa') {
        return `Step 1: Get Confirmation of Enrolment (CoE) from your educational institution
Step 2: Obtain Overseas Student Health Cover (OSHC) for entire stay
Step 3: Take English language test (IELTS, PTE, or TOEFL) if required
Step 4: Prepare Genuine Temporary Entrant (GTE) statement
Step 5: Gather financial documents (bank statements, loan letters, sponsor documents)
Step 6: Complete visa application online (ImmiAccount)
Step 7: Upload all required documents
Step 8: Pay application fee (AUD 630)
Step 9: Complete health examination (if requested)
Step 10: Wait for decision (typically 4-8 weeks)
Step 11: If approved, receive visa grant notification`;
    }
    if (country === 'australia' && visaType === 'general-skilled-migration') {
        return `Step 1: Get skills assessment from relevant authority (ACS, Engineers Australia, VETASSESS, etc.)
Step 2: Take English language test (IELTS, PTE, TOEFL)
Step 3: Calculate your points score (minimum 65 required)
Step 4: Submit Expression of Interest (EOI) in SkillSelect
Step 5: Wait for invitation (depends on points and occupation)
Step 6: Upon invitation, lodge visa application within 60 days
Step 7: Complete health examinations
Step 8: Obtain police clearances from all countries
Step 9: Upload all documents to ImmiAccount
Step 10: Pay application fee (AUD 4,045)
Step 11: Wait for decision (6-12 months typically)
Step 12: If approved, receive visa grant and can move to Australia`;
    }
    if (country === 'canada' && visaType === 'express-entry') {
        return `Step 1: Get Educational Credential Assessment (ECA) from designated organization
Step 2: Take language tests (IELTS/CELPIP for English, TEF for French)
Step 3: Create Express Entry profile online
Step 4: Get CRS score calculated automatically
Step 5: Wait for Invitation to Apply (ITA) in Express Entry draw
Step 6: Upon receiving ITA, submit complete application within 60 days
Step 7: Complete medical examination
Step 8: Obtain police certificates from all countries
Step 9: Pay application fees (CAD 1,325+)
Step 10: Submit biometrics (if required)
Step 11: Wait for processing (6 months from ITA)
Step 12: Receive Confirmation of Permanent Residence (COPR) if approved`;
    }
    return '';
}

// Test function
window.testAIAgent = async function() {
    console.log('🧪 Testing Custom Migration Expert AI...');
    
    try {
        const testResponse = await askAIAgent('What documents do I need for student visa?', {
            country: 'australia',
            visaType: 'student-visa',
            userName: 'Test User',
            userEmail: 'test@example.com',
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Custom AI Agent is working!');
        return true;
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    }
};

// Get country display name
function getCountryName(country) {
    const countryNames = {
        'australia': 'Australia',
        'canada': 'Canada',
        'united-kingdom': 'United Kingdom',
        'new-zealand': 'New Zealand',
        'united-states': 'United States'
    };
    return countryNames[country] || country;
}

// Get visa type display name helper (using existing function if available)
function getVisaTypeNameHelper(country, visaType) {
    if (typeof VISA_TYPES_DATA !== 'undefined' && VISA_TYPES_DATA[country] && VISA_TYPES_DATA[country][visaType]) {
        return VISA_TYPES_DATA[country][visaType].name;
    }
    return visaType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Get client context for AI
function getAIContext(clientContext) {
    let context = `You are a professional immigration consultant AI assistant helping clients with their visa applications. `;
    
    if (clientContext.country) {
        const countryName = getCountryName(clientContext.country);
        context += `The client is applying for a visa to ${countryName}. `;
    }
    
    if (clientContext.visaType) {
        const visaTypeName = getVisaTypeNameHelper(clientContext.country, clientContext.visaType);
        context += `They have selected the ${visaTypeName} visa type. `;
    }
    
    if (clientContext.authority) {
        const authorityName = getAuthorityName(clientContext.authority);
        context += `For skills assessment, they are using ${authorityName}. `;
    }
    
    context += `Provide clear, accurate, and helpful answers about visa processing, documentation requirements, procedures, timelines, and any related immigration matters. `;
    context += `Be professional, empathetic, and encourage them to reach out to their human consultant for complex matters. `;
    context += `Keep responses concise but comprehensive (under 300 words). Use bullet points when appropriate for clarity.`;
    
    return context;
}

// Ask AI Agent (Custom Migration Expert - Built-in, No API Needed!)
async function askAIAgent(userMessage, clientContext) {
    // Check if AI is enabled
    if (!AI_AGENT_CONFIG.enabled) {
        console.warn('⚠️ AI Agent is disabled');
        showFallbackMessage('AI Assistant is currently disabled. Our migration consultant will reply within 5 minutes.');
        return;
    }
    
    console.log('🤖 Custom Migration Expert AI processing:', userMessage.substring(0, 50) + '...');
    console.log('📋 Client context:', clientContext);
    
    // Show typing indicator (simulate thinking time)
    showAITypingIndicator();
    
    try {
        // Simulate processing time for natural feel
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        
        // Search knowledge base for relevant answers
        console.log('🔍 Searching knowledge base...');
        const searchResults = searchKnowledgeBase(userMessage, clientContext);
        console.log('📊 Found', searchResults.length, 'potential matches');
        
        // Generate AI response from knowledge base
        const aiResponse = generateAIResponse(userMessage, clientContext, searchResults);
        console.log('✅ AI Response generated:', aiResponse.substring(0, 100) + '...');
        
        // Hide typing indicator
        hideAITypingIndicator();
        
        // Add AI response to thread - with retry logic
        const addResponseWithRetry = (attempt = 0) => {
            if (attempt > 10) {
                // After 2 seconds, use fallback
                console.warn('⚠️ Function not available after retries, using fallback');
                addAIMessageDirectly(aiResponse);
                return;
            }
            
            if (typeof window.addMessageToThread === 'function') {
                console.log('✅ Calling window.addMessageToThread with AI response');
                try {
                    window.addMessageToThread(aiResponse, 'received', 'Migration Expert AI', true);
                    console.log('✅ Message successfully added to thread');
                } catch (err) {
                    console.error('❌ Error calling addMessageToThread:', err);
                    addAIMessageDirectly(aiResponse);
                }
            } else {
                // Retry after 200ms
                setTimeout(() => addResponseWithRetry(attempt + 1), 200);
            }
        };
        
        // Start trying to add the message
        setTimeout(() => {
            addResponseWithRetry();
        }, 300);
        
        // Also save for admin review
        setTimeout(() => {
            if (typeof window.saveMessageForAdmin === 'function') {
                window.saveMessageForAdmin(aiResponse, clientContext, {
                    isAIResponse: true,
                    isAutoResponse: true,
                    userQuestion: userMessage,
                    source: 'custom_ai',
                    confidence: searchResults.length > 0 ? searchResults[0].score : 0
                });
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ AI Agent Error:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        
        // Check for network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
            console.error('❌ Network Error detected - Check your internet connection and CORS settings');
        }
        
        // Hide typing indicator
        hideAITypingIndicator();
        
        // Determine error message based on error type
        let errorMessage = '';
        let shouldShowAdminIndicator = false;
        
        // Custom AI errors are rare, but handle gracefully
        console.error('❌ Custom AI Error:', error);
        errorMessage = 'I apologize, but I encountered an issue processing your question. Our human migration consultant will get back to you within 5 minutes with a detailed answer.';
        shouldShowAdminIndicator = true;
        
        // Show error message
        setTimeout(() => {
            if (typeof window.addMessageToThread === 'function') {
                window.addMessageToThread(errorMessage, 'received', 'Migration Consultant');
            } else {
                addAIMessageDirectly(errorMessage);
            }
            
            // Show admin indicator for critical errors
            if (shouldShowAdminIndicator && typeof window.addAdminResponseIndicator === 'function') {
                window.addAdminResponseIndicator();
            }
        }, 1000);
        
        // Save message for admin to handle
        if (typeof window.saveMessageForAdmin === 'function') {
            window.saveMessageForAdmin(userMessage, clientContext, {
                requiresAdminResponse: true,
                aiError: error.message
            });
        }
    }
}

// Show AI typing indicator
function showAITypingIndicator() {
    const messagesThread = document.querySelector('.messages-thread');
    if (!messagesThread) return;
    
    // Remove existing indicator
    const existing = messagesThread.querySelector('.ai-typing-indicator');
    if (existing) existing.remove();
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message-item received ai-typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-avatar ai-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content-wrapper">
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">AI Assistant</span>
                    <span class="message-time">Typing...</span>
                </div>
                <div class="message-text">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    messagesThread.appendChild(typingIndicator);
    messagesThread.scrollTop = messagesThread.scrollHeight;
}

// Hide AI typing indicator
function hideAITypingIndicator() {
    const typingIndicator = document.querySelector('.ai-typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Helper function to add AI message directly (fallback)
function addAIMessageDirectly(messageText) {
    const messagesThread = document.querySelector('.messages-thread');
    if (!messagesThread) return;
    
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item received ai-message';
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageItem.innerHTML = `
        <div class="message-avatar ai-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content-wrapper">
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">AI Assistant <span class="ai-badge"><i class="fas fa-sparkles"></i> AI Powered</span></span>
                    <span class="message-time">${timeString}</span>
                </div>
                <div class="message-text">
                    <p>${escapeHtml(messageText)}</p>
                </div>
            </div>
        </div>
    `;
    
    messagesThread.appendChild(messageItem);
    messagesThread.scrollTop = messagesThread.scrollHeight;
    
    setTimeout(() => {
        messageItem.style.opacity = '1';
    }, 10);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}

// Helper function to show fallback message (when AI can't be used)
function showFallbackMessage(message) {
    setTimeout(() => {
        if (typeof window.addMessageToThread === 'function') {
            window.addMessageToThread(message, 'received', 'Migration Consultant');
        } else {
            addAIMessageDirectly(message);
        }
        if (typeof window.addAdminResponseIndicator === 'function') {
            window.addAdminResponseIndicator();
        }
    }, 1500);
}

// Message Area Functionality
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const charCount = document.getElementById('charCount');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    // Character counter
    if (messageInput && charCount) {
        messageInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 1000) {
                charCount.style.color = '#ef4444';
                this.value = this.value.substring(0, 1000);
                charCount.textContent = 1000;
            } else if (currentLength > 800) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '';
            }
        });
    }
    
    // Send message functionality
    if (sendMessageBtn && messageInput) {
        sendMessageBtn.addEventListener('click', function() {
            const message = messageInput.value.trim();
            
            if (message === '') {
                // Show error or warning
                messageInput.focus();
                messageInput.style.borderColor = '#ef4444';
                setTimeout(() => {
                    messageInput.style.borderColor = '';
                }, 2000);
                return;
            }
            
            // Get client's selection context
            const clientContext = getClientSelectionContext();
            
            // Check if message matches default questions
            const autoResponse = checkForAutoResponse(message, clientContext);
            
            // Add message to the messages thread
            if (typeof window.addMessageToThread === 'function') {
                window.addMessageToThread(message, 'sent');
            } else {
                // Fallback if function not loaded yet
                setTimeout(() => {
                    if (typeof window.addMessageToThread === 'function') {
                        window.addMessageToThread(message, 'sent');
                    }
                }, 100);
            }
            
            // Store message for admin
            if (typeof window.saveMessageForAdmin === 'function') {
                window.saveMessageForAdmin(message, clientContext, autoResponse);
            }
            
            // Auto-respond if it's a default question
            if (autoResponse) {
                setTimeout(() => {
                    if (typeof window.addMessageToThread === 'function') {
                        window.addMessageToThread(autoResponse.answer, 'received', 'Migration Consultant');
                    }
                    if (typeof window.saveMessageForAdmin === 'function') {
                        window.saveMessageForAdmin(autoResponse.answer, clientContext, { isAutoResponse: true, matchedQuestion: autoResponse.question });
                    }
                }, 1000);
            } else {
                // Try AI agent - it should always respond, not show admin indicator
                console.log('🔍 No default match found, calling AI Agent...');
                askAIAgent(message, clientContext);
            }
            
            // Clear the input
            messageInput.value = '';
            if (charCount) {
                charCount.textContent = '0';
            }
        });
        
        // Allow sending message with Enter key (Shift+Enter for new line)
        if (messageInput) {
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessageBtn.click();
                }
            });
        }
    }
    
    // Get client's current selection context
    function getClientSelectionContext() {
        const country = document.getElementById('countrySelect')?.value || '';
        const visaType = document.getElementById('visaTypeSelect')?.value || '';
        const authority = document.getElementById('authoritySelect')?.value || '';
        const userName = document.getElementById('userName')?.textContent.replace('Welcome, ', '') || 'Client';
        const userEmail = localStorage.getItem('userEmail') || '';
        
        return {
            country,
            visaType,
            authority,
            userName,
            userEmail,
            timestamp: new Date().toISOString()
        };
    }
    
    // Check if message matches any default question
    function checkForAutoResponse(messageText, context) {
        if (!context.country || !context.visaType) return null;
        
        const countryQA = DEFAULT_QA_DATABASE[context.country];
        if (!countryQA) return null;
        
        const visaQA = countryQA[context.visaType];
        if (!visaQA) return null;
        
        // If authority is required, check authority-specific QAs
        let qaList = [];
        if (context.authority && Array.isArray(visaQA)) {
            // If it's an array, it's a list of questions
            qaList = visaQA;
        } else if (context.authority && visaQA[context.authority]) {
            qaList = visaQA[context.authority];
        } else if (Array.isArray(visaQA)) {
            qaList = visaQA;
        }
        
        const messageLower = messageText.toLowerCase();
        
        // Check each question for keyword matches
        for (const qa of qaList) {
            const matchScore = qa.keywords.filter(keyword => 
                messageLower.includes(keyword.toLowerCase())
            ).length;
            
            // If at least 2 keywords match or question is very similar, return answer
            if (matchScore >= 2 || calculateSimilarity(messageLower, qa.question.toLowerCase()) > 0.6) {
                return qa;
            }
        }
        
        return null;
    }
    
    // Simple similarity calculation
    function calculateSimilarity(str1, str2) {
        const words1 = str1.split(/\s+/);
        const words2 = str2.split(/\s+/);
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
    }
    
    // Save message for admin - make it global
    window.saveMessageForAdmin = function(messageText, context, autoResponse) {
        const messages = JSON.parse(localStorage.getItem('adminClientMessages') || '[]');
        
        const messageData = {
            id: Date.now().toString(),
            clientName: context.userName,
            clientEmail: context.userEmail,
            message: messageText,
            timestamp: context.timestamp,
            context: {
                country: context.country,
                visaType: context.visaType,
                authority: context.authority
            },
            isAutoResponse: !!autoResponse,
            matchedQuestion: autoResponse?.question || null,
            requiresAdminResponse: !autoResponse,
            adminResponded: false,
            responseTime: autoResponse ? 'immediate' : '5 minutes'
        };
        
        messages.unshift(messageData);
        localStorage.setItem('adminClientMessages', JSON.stringify(messages));
    }
    
    // Add admin response indicator - make it global
    window.addAdminResponseIndicator = function() {
        const messagesThread = document.querySelector('.messages-thread');
        if (!messagesThread) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'admin-response-indicator';
        indicator.innerHTML = `
            <div class="indicator-content">
                <i class="fas fa-clock"></i>
                <span>Our migration consultant will reply within 5 minutes</span>
            </div>
        `;
        messagesThread.appendChild(indicator);
        messagesThread.scrollTop = messagesThread.scrollHeight;
        
        setTimeout(() => {
            indicator.style.opacity = '1';
        }, 10);
    }
    
    // Function to add message to the thread - make it global so AI agent can access it
    window.addMessageToThread = function(messageText, type, senderName = null, isAI = false) {
        const messagesThread = document.querySelector('.messages-thread');
        if (!messagesThread) return;
        
        // Get sender name
        let userName = senderName;
        if (!userName) {
            userName = type === 'sent' 
                ? (document.getElementById('userName')?.textContent.replace('Welcome, ', '') || 'You')
                : 'Migration Consultant';
        }
        
        // Create message item
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${type} ${isAI ? 'ai-message' : ''}`;
        
        // Get avatar based on type
        let avatarHTML = '';
        if (isAI) {
            avatarHTML = '<div class="message-avatar ai-avatar"><i class="fas fa-robot"></i></div>';
        } else if (type === 'sent') {
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            avatarHTML = `<div class="message-avatar"><span>${initials}</span></div>`;
        } else {
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            avatarHTML = `<div class="message-avatar"><span>${initials}</span></div>`;
        }
        
        // Get current time
        const now = new Date();
        const timeString = formatMessageTime(now);
        
        // AI badge
        const aiBadge = isAI ? '<span class="ai-badge"><i class="fas fa-sparkles"></i> AI Powered</span>' : '';
        
        messageItem.innerHTML = `
            ${avatarHTML}
            <div class="message-content-wrapper">
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">${userName}${aiBadge}</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-text">
                        ${escapeHtml(messageText).split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Add to thread
        messagesThread.appendChild(messageItem);
        
        // Scroll to bottom
        messagesThread.scrollTop = messagesThread.scrollHeight;
        
        // Trigger animation
        setTimeout(() => {
            messageItem.style.opacity = '1';
        }, 10);
    }
    
    // Helper function to format time - Professional format
    function formatMessageTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        // Format time in 12-hour format with AM/PM
        const formatTime = (d) => {
            const hours = d.getHours();
            const mins = d.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
        };
        
        // Today
        if (minutes < 1) {
            return formatTime(date);
        } else if (hours < 1) {
            return formatTime(date);
        } else if (hours < 24 && date.getDate() === now.getDate()) {
            return formatTime(date);
        } 
        // Yesterday
        else if (days === 1) {
            return `Yesterday at ${formatTime(date)}`;
        }
        // This week
        else if (days < 7) {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return `${dayNames[date.getDay()]} at ${formatTime(date)}`;
        }
        // Older
        else {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${formatTime(date)}`;
        }
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
});