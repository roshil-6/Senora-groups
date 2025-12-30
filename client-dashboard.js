// Client Dashboard JavaScript for Gubicoo Migration Navigator
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
        'subclass-189': {
            id: 'subclass-189',
            name: 'Skilled Independent Visa (Subclass 189)',
            requiresAuthority: true,
            description: 'Points-tested permanent residency visa, no state or employer sponsorship required'
        },
        'subclass-190': {
            id: 'subclass-190',
            name: 'Skilled Nominated Visa (Subclass 190)',
            requiresAuthority: true,
            description: 'Points-tested permanent residency visa requiring state/territory nomination'
        },
        'subclass-491': {
            id: 'subclass-491',
            name: 'Skilled Work Regional Visa (Subclass 491)',
            requiresAuthority: true,
            description: 'Points-tested provisional visa for regional Australia, pathway to PR (Subclass 191)'
        },
        'subclass-482': {
            id: 'subclass-482',
            name: 'Temporary Skill Shortage Visa (Subclass 482)',
            requiresAuthority: false,
            description: 'Employer-sponsored temporary visa (2-4 years), can lead to PR'
        },
        'subclass-186': {
            id: 'subclass-186',
            name: 'Employer Nomination Scheme Visa (Subclass 186)',
            requiresAuthority: false,
            description: 'Permanent residency visa requiring employer nomination'
        },
        'subclass-494': {
            id: 'subclass-494',
            name: 'Skilled Employer Sponsored Regional Visa (Subclass 494)',
            requiresAuthority: false,
            description: 'Regional employer-sponsored provisional visa, pathway to PR'
        },
        'subclass-407': {
            id: 'subclass-407',
            name: 'Training Visa (Subclass 407)',
            requiresAuthority: false,
            description: 'Temporary visa for occupational training or professional development, valid up to 2 years'
        },
        'general-skilled-migration': {
            id: 'general-skilled-migration',
            name: 'Skilled Migration (GSM)',
            requiresAuthority: true,
            description: 'Points-based skilled migration program requiring skills assessment'
        },
        'student-visa': {
            id: 'student-visa',
            name: 'Student Visa (Subclass 500)',
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

// Generate checklist from DOCUMENT_REQUIREMENTS (no upload functionality)
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
        <div class="document-checklist-container" style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div class="checklist-header">
                <h2><i class="fas fa-clipboard-list"></i> Required Documents Checklist</h2>
                <p>Documents required for ${visaName} application</p>
            </div>
            
            <div class="document-checklist-list" style="margin-top: 2rem;">
                <ul style="list-style: none; padding: 0;">
    `;
    
    // Generate checklist item for each required document
    visaRequirements.forEach((docName, index) => {
        html += `
            <li style="padding: 1rem; margin-bottom: 0.75rem; background: #f8f9fa; border-left: 4px solid #3B82F6; border-radius: 4px; display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-file-alt" style="color: #3B82F6; font-size: 1.2rem;"></i>
                <span style="font-size: 1rem; color: #333; font-weight: 500;">${docName}</span>
            </li>
        `;
    });
    
    html += `
                </ul>
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
    
    // Convert upload HTML to checklist-only (remove upload functionality)
    let checklistHTML = uploadHTML;
    
    // Remove upload zones and buttons, keep only document names
    checklistHTML = checklistHTML.replace(/<div class="file-upload-zone[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    checklistHTML = checklistHTML.replace(/<input[^>]*type="file"[^>]*>/gi, '');
    checklistHTML = checklistHTML.replace(/<div class="uploaded-files"[^>]*>[\s\S]*?<\/div>/gi, '');
    checklistHTML = checklistHTML.replace(/<div class="upload-actions"[^>]*>[\s\S]*?<\/div>/gi, '');
    checklistHTML = checklistHTML.replace(/onclick="[^"]*"/gi, '');
    checklistHTML = checklistHTML.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');
    
    // Update headers to say "Checklist" instead of "Upload"
    checklistHTML = checklistHTML.replace(/Document Upload/g, 'Document Checklist');
    checklistHTML = checklistHTML.replace(/upload/gi, 'checklist');
    checklistHTML = checklistHTML.replace(/Upload/gi, 'Checklist');
    
    container.innerHTML = checklistHTML;
    
    console.log('✅ Document checklist displayed');
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
    
    // Get current user with email validation
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Ensure email is available - try to get from users array if missing
    if (!currentUser.email || currentUser.email === '') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userFromStorage = users.find(u => u.id === currentUser.id || u.email === (currentUser.email || ''));
        if (userFromStorage && userFromStorage.email) {
            currentUser.email = userFromStorage.email;
            currentUser.name = currentUser.name || userFromStorage.name;
            currentUser.id = currentUser.id || userFromStorage.id;
            // Update currentUser in localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            // Email is required - prompt user
            const email = prompt('Please enter your email address to submit documents:');
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Valid email is required to submit documents. Please try again.');
                return;
            }
            currentUser.email = email;
            if (!currentUser.name) currentUser.name = 'Client';
            if (!currentUser.id) currentUser.id = Date.now().toString();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentUser.email)) {
        alert('Invalid email address. Please update your profile with a valid email.');
        return;
    }
    
    // Collect all uploaded files - support both data-field and id-based fields
    const uploadedFiles = {};
    let totalFiles = 0;
    
    // Method 1: Check upload zones with data-field attribute
    const allUploadZones = document.querySelectorAll('.file-upload-zone');
    allUploadZones.forEach(zone => {
        const fieldName = zone.getAttribute('data-field');
        if (fieldName) {
            const filesContainer = document.getElementById(`${fieldName}-files`);
            if (filesContainer && filesContainer.children.length > 0) {
                const files = Array.from(filesContainer.querySelectorAll('.file-item')).map(item => {
                    const fileName = item.querySelector('.file-name')?.textContent || '';
                    const fileSize = item.querySelector('.file-size')?.textContent || '';
                    return { name: fileName, size: fileSize };
                });
                if (files.length > 0) {
                    uploadedFiles[fieldName] = files;
                    totalFiles += files.length;
                }
            }
        }
    });
    
    // Method 2: Check file inputs directly (for fields like doc_visaType_index)
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    allFileInputs.forEach(input => {
        const inputId = input.id;
        if (inputId && inputId.startsWith('doc_')) {
            const filesContainer = document.getElementById(`${inputId}_files`);
            if (filesContainer && filesContainer.children.length > 0) {
                const files = Array.from(filesContainer.querySelectorAll('.file-item')).map(item => {
                    const fileName = item.querySelector('.file-name')?.textContent || '';
                    const fileSize = item.querySelector('.file-size')?.textContent || '';
                    return { name: fileName, size: fileSize };
                });
                if (files.length > 0) {
                    // Use a readable field name
                    const fieldLabel = input.closest('.upload-field')?.querySelector('label')?.textContent?.trim() || inputId;
                    uploadedFiles[fieldLabel] = files;
                    totalFiles += files.length;
                }
            }
        }
    });
    
    if (totalFiles === 0) {
        alert('Please upload at least one document before submitting.');
        return;
    }
    
    // Save submission
    const country = documentSelectionState.country || 'Unknown';
    const visaType = documentSelectionState.visaType || 'Unknown';
    
    // Save to document submissions
    const submissionKey = `documentSubmission_${country}_${visaType}_${Date.now()}`;
    localStorage.setItem(submissionKey, JSON.stringify({
        country,
        visaType,
        files: uploadedFiles,
        submittedAt: new Date().toISOString(),
        totalFiles,
        clientId: currentUser.id,
        clientName: currentUser.name || 'Unknown Client',
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
                client: currentUser.name || 'Unknown Client',
                clientEmail: currentUser.email,
                clientId: currentUser.id || '',
                uploadedAt: new Date().toISOString(),
                status: 'pending',
                country: country,
                visaType: visaType,
                fileName: file.name,
                fileSize: file.size
            });
        });
    });
    localStorage.setItem('documentReviews', JSON.stringify(documentReviews));
    
    // Add activity
    addActivity(`Documents Submitted`, `Submitted ${totalFiles} file(s) for ${visaType}`, 'fas fa-check-circle', 'success');
    
    console.log('✅ Documents submitted:', uploadedFiles);
    console.log('✅ Client email:', currentUser.email);
    alert(`Successfully submitted ${totalFiles} document(s)! Your email (${currentUser.email}) has been recorded.`);
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
function handleFileSelection(event, fieldNameOrId) {
    // Support both event object and direct fieldName
    let files, containerId, actualFieldName;
    
    if (event && event.target && event.target.files) {
        // Called from onchange handler - event.target is the input
        files = event.target.files;
        const inputId = event.target.id;
        
        // Determine container ID based on input ID
        if (inputId && inputId.startsWith('doc_')) {
            // Format: doc_visaType_index
            containerId = `${inputId}_files`;
            actualFieldName = inputId;
        } else if (fieldNameOrId) {
            // Use provided fieldName
            containerId = `${fieldNameOrId}-files`;
            actualFieldName = fieldNameOrId;
        } else {
            // Fallback: try to find associated container
            const input = event.target;
            const uploadField = input.closest('.upload-field');
            if (uploadField) {
                const label = uploadField.querySelector('label');
                actualFieldName = label ? label.textContent.trim() : inputId;
                containerId = `${inputId}_files`;
            } else {
                containerId = `${inputId}_files`;
                actualFieldName = inputId;
            }
        }
    } else if (event && event.target && event.target.files) {
        // Direct event with files (drag and drop)
        files = event.target.files;
        if (fieldNameOrId) {
            containerId = `${fieldNameOrId}-files`;
            actualFieldName = fieldNameOrId;
        } else {
            console.error('❌ Field name required for file selection');
            return;
        }
    } else {
        // Fallback: fieldNameOrId might be the actual field ID
        const input = typeof fieldNameOrId === 'string' ? document.getElementById(fieldNameOrId) : null;
        if (input && input.files) {
            files = input.files;
            containerId = `${fieldNameOrId}_files`;
            actualFieldName = fieldNameOrId;
        } else {
            console.error('❌ Invalid parameters for handleFileSelection:', { event, fieldNameOrId });
            return;
        }
    }
    
    if (!files || files.length === 0) {
        return;
    }
    
    // Validate file sizes (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
        alert(`Some files exceed the 10MB limit:\n${oversizedFiles.map(f => f.name).join('\n')}\n\nPlease upload smaller files.`);
        return;
    }
    
    // Validate file types
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const invalidFiles = Array.from(files).filter(file => {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        return !allowedTypes.includes(ext);
    });
    if (invalidFiles.length > 0) {
        alert(`Some files have invalid types. Allowed: PDF, JPG, PNG, DOC, DOCX\n\nInvalid files:\n${invalidFiles.map(f => f.name).join('\n')}`);
        return;
    }
    
    const filesContainer = document.getElementById(containerId);
    
    if (!filesContainer) {
        console.error('❌ Files container not found for field:', containerId);
        // Try to create container if it doesn't exist
        const input = document.getElementById(actualFieldName);
        if (input) {
            const uploadField = input.closest('.upload-field');
            if (uploadField) {
                const newContainer = document.createElement('div');
                newContainer.id = containerId;
                newContainer.className = 'uploaded-files';
                input.parentNode.insertBefore(newContainer, input.nextSibling);
                // Retry with new container
                return handleFileSelection(event, fieldNameOrId);
            }
        }
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
                <span class="file-name">${escapeHtml(file.name)}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="file-remove" onclick="removeFile(this, '${actualFieldName}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        filesContainer.appendChild(fileItem);
    });
    
    // Update progress
    updateProgress();
    
    console.log(`✅ ${files.length} file(s) added to ${actualFieldName}`);
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

// ============================================
// ELIGIBILITY CHECKER SYSTEM
// ============================================

// Eligibility Rules Database
const ELIGIBILITY_RULES = {
    canada: {
        'fsw': {
            name: 'Federal Skilled Worker (FSW)',
            minPoints: 67,
            hardRules: {
                ageMin: 18,
                ageMax: 44,
                ieltsMin: 6,
                experienceMin: 1,
                educationMin: 'diploma'
            },
            calculatePoints: function(profile) {
                let points = 0;
                
                // Age points (max 12)
                if (profile.age >= 18 && profile.age <= 35) points += 12;
                else if (profile.age === 36) points += 11;
                else if (profile.age === 37) points += 10;
                else if (profile.age === 38) points += 9;
                else if (profile.age === 39) points += 8;
                else if (profile.age === 40) points += 7;
                else if (profile.age === 41) points += 6;
                else if (profile.age === 42) points += 5;
                else if (profile.age === 43) points += 4;
                else if (profile.age === 44) points += 3;
                
                // Education points (max 25)
                if (profile.highestQualification === 'phd') points += 25;
                else if (profile.highestQualification === 'masters') points += 23;
                else if (profile.highestQualification === 'bachelors') points += 21;
                else if (profile.highestQualification === 'diploma') points += 19;
                
                // Experience points (max 15)
                if (profile.totalExperience >= 4) points += 15;
                else if (profile.totalExperience === 3) points += 11;
                else if (profile.totalExperience === 2) points += 9;
                else if (profile.totalExperience === 1) points += 9;
                
                // IELTS points (max 28)
                const ielts = parseFloat(profile.ieltsOverall) || 0;
                if (ielts >= 8) points += 28;
                else if (ielts >= 7.5) points += 24;
                else if (ielts >= 7) points += 20;
                else if (ielts >= 6.5) points += 16;
                else if (ielts >= 6) points += 12;
                
                // Adaptability points (max 10)
                if (profile.relativeInCountry === 'canada') points += 5;
                if (profile.spouseEducation && profile.spouseEducation !== 'none') points += 5;
                if (profile.jobOffer === 'yes') points += 10;
                
                return Math.min(points, 100);
            }
        },
        'cec': {
            name: 'Canadian Experience Class (CEC)',
            hardRules: {
                canadianExperience: true,
                ieltsMin: 7
            }
        }
    },
    australia: {
        'skilled-migration': {
            name: 'Skilled Migration (189/190/491)',
            minPoints: 65,
            hardRules: {
                ageMax: 44,
                ieltsMin: 6,
                skillsAssessment: true
            },
            calculatePoints: function(profile) {
                let points = 0;
                
                // Age points (max 30)
                if (profile.age >= 18 && profile.age <= 24) points += 25;
                else if (profile.age >= 25 && profile.age <= 32) points += 30;
                else if (profile.age >= 33 && profile.age <= 39) points += 25;
                else if (profile.age >= 40 && profile.age <= 44) points += 15;
                
                // Education points (max 20)
                if (profile.highestQualification === 'phd') points += 20;
                else if (profile.highestQualification === 'masters') points += 15;
                else if (profile.highestQualification === 'bachelors') points += 15;
                else if (profile.highestQualification === 'diploma') points += 10;
                
                // Experience points (max 20)
                if (profile.totalExperience >= 8) points += 20;
                else if (profile.totalExperience >= 5) points += 15;
                else if (profile.totalExperience >= 3) points += 10;
                else if (profile.totalExperience >= 1) points += 5;
                
                // IELTS points (max 20)
                const ielts = parseFloat(profile.ieltsOverall) || 0;
                if (ielts >= 8) points += 20;
                else if (ielts >= 7) points += 10;
                else if (ielts >= 6) points += 0;
                
                // Boosts
                if (profile.relativeInCountry === 'australia') points += 10;
                if (profile.jobOffer === 'yes') points += 5;
                
                return points;
            }
        }
    },
    germany: {
        'opportunity-card': {
            name: 'Germany Opportunity Card',
            hardRules: {
                degree: true,
                language: 'B2',
                experienceMin: 2
            }
        },
        'eu-blue-card': {
            name: 'EU Blue Card',
            hardRules: {
                degree: true,
                salaryThreshold: true
            }
        }
    },
    'united-kingdom': {
        'skilled-worker': {
            name: 'Skilled Worker Visa',
            hardRules: {
                jobOffer: true,
                salaryThreshold: true,
                ieltsMin: 5.5
            }
        }
    },
    'new-zealand': {
        'skilled-migrant': {
            name: 'Skilled Migrant Category',
            hardRules: {
                ageMax: 55,
                skillLevel: 'medium'
            }
        }
    }
};

// Eligibility Checker Engine
function checkEligibility(profile) {
    const results = {};
    
    // Check each country
    Object.keys(ELIGIBILITY_RULES).forEach(country => {
        results[country] = {
            country: country,
            programs: []
        };
        
        const countryRules = ELIGIBILITY_RULES[country];
        Object.keys(countryRules).forEach(programKey => {
            const program = countryRules[programKey];
            const result = evaluateProgram(profile, program, country);
            results[country].programs.push(result);
        });
    });
    
    return results;
}

// Evaluate a single program
function evaluateProgram(profile, program, country) {
    const result = {
        name: program.name,
        status: 'not-eligible',
        score: 0,
        maxScore: 0,
        reasons: [],
        improvements: []
    };
    
    // Check hard rules first
    const hardRules = program.hardRules || {};
    let passedHardRules = true;
    
    // Age checks
    if (hardRules.ageMin && profile.age < hardRules.ageMin) {
        passedHardRules = false;
        result.reasons.push(`Age ${profile.age} is below minimum ${hardRules.ageMin}`);
        result.improvements.push(`Wait until you're ${hardRules.ageMin} years old`);
    }
    if (hardRules.ageMax && profile.age > hardRules.ageMax) {
        passedHardRules = false;
        result.reasons.push(`Age ${profile.age} exceeds maximum ${hardRules.ageMax}`);
        result.improvements.push(`Consider countries without age limits (Germany, Poland, etc.)`);
    }
    
    // IELTS checks
    const ielts = parseFloat(profile.ieltsOverall) || 0;
    if (hardRules.ieltsMin && ielts < hardRules.ieltsMin) {
        passedHardRules = false;
        result.reasons.push(`IELTS score ${ielts} is below minimum ${hardRules.ieltsMin}`);
        result.improvements.push(`Improve IELTS to ${hardRules.ieltsMin}+ to become eligible`);
    }
    
    // Experience checks
    if (hardRules.experienceMin && profile.totalExperience < hardRules.experienceMin) {
        passedHardRules = false;
        result.reasons.push(`Experience ${profile.totalExperience} years is below minimum ${hardRules.experienceMin}`);
        result.improvements.push(`Gain ${hardRules.experienceMin - profile.totalExperience} more years of experience`);
    }
    
    // Education checks
    if (hardRules.educationMin) {
        const eduLevels = { 'phd': 5, 'masters': 4, 'bachelors': 3, 'diploma': 2, 'high-school': 1 };
        const userEdu = eduLevels[profile.highestQualification] || 0;
        const minEdu = eduLevels[hardRules.educationMin] || 0;
        if (userEdu < minEdu) {
            passedHardRules = false;
            result.reasons.push(`Education level is below minimum requirement`);
            result.improvements.push(`Complete ${hardRules.educationMin} to become eligible`);
        }
    }
    
    // Job offer checks
    if (hardRules.jobOffer && profile.jobOffer !== 'yes') {
        passedHardRules = false;
        result.reasons.push(`Job offer is required for this program`);
        result.improvements.push(`Secure a job offer from a ${country === 'united-kingdom' ? 'UK' : country} employer`);
    }
    
    if (!passedHardRules) {
        return result;
    }
    
    // Calculate points if function exists
    if (program.calculatePoints) {
        result.score = program.calculatePoints(profile);
        result.maxScore = 100;
        
        if (result.score >= (program.minPoints || 0)) {
            result.status = 'eligible';
            result.reasons.push(`Scored ${result.score} points (minimum: ${program.minPoints})`);
        } else {
            result.status = 'borderline';
            const pointsNeeded = (program.minPoints || 0) - result.score;
            result.reasons.push(`Scored ${result.score} points, need ${pointsNeeded} more to reach minimum ${program.minPoints}`);
            
            // Suggest improvements
            if (ielts < 7) {
                result.improvements.push(`Improve IELTS to 7.0+ to gain ${10 - (result.score % 10)} points`);
            }
            if (profile.totalExperience < 3) {
                result.improvements.push(`Gain more work experience to increase points`);
            }
            if (profile.highestQualification === 'diploma' || profile.highestQualification === 'bachelors') {
                result.improvements.push(`Consider higher education (Master's/PhD) for more points`);
            }
        }
    } else {
        // Simple pass/fail for programs without point system
        result.status = 'eligible';
        result.reasons.push(`Meets all basic requirements`);
    }
    
    return result;
}

// Display eligibility results
function displayEligibilityResults(results) {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    
    let html = '';
    
    Object.keys(results).forEach(country => {
        const countryData = results[country];
        const countryName = country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, ' ');
        const flagEmoji = {
            'canada': '🇨🇦',
            'australia': '🇦🇺',
            'germany': '🇩🇪',
            'united-kingdom': '🇬🇧',
            'new-zealand': '🇳🇿'
        }[country] || '🌍';
        
        html += `
            <div class="country-result-card">
                <div class="country-result-header">
                    <h3>${flagEmoji} ${countryName}</h3>
                </div>
                <div class="programs-list">
        `;
        
        countryData.programs.forEach(program => {
            const statusIcon = {
                'eligible': '✅',
                'borderline': '⚠️',
                'not-eligible': '❌'
            }[program.status] || '❓';
            
            const statusClass = program.status;
            
            html += `
                <div class="program-result ${statusClass}">
                    <div class="program-header">
                        <span class="status-icon">${statusIcon}</span>
                        <h4>${program.name}</h4>
                        <span class="status-badge ${statusClass}">${program.status.toUpperCase()}</span>
                    </div>
                    ${program.score > 0 ? `<div class="score-display">Score: ${program.score}/${program.maxScore} points</div>` : ''}
                    <div class="reasons">
                        <strong>Why:</strong>
                        <ul>
                            ${program.reasons.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                    ${program.improvements.length > 0 ? `
                        <div class="improvements">
                            <strong>How to Improve:</strong>
                            <ul>
                                ${program.improvements.map(i => `<li>${i}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    resultsContent.innerHTML = html;
    
    // Show results, hide form
    document.getElementById('eligibilityResults').style.display = 'block';
    document.querySelector('.eligibility-form-wrapper').style.display = 'none';
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const eligibilityForm = document.getElementById('eligibilityForm');
    const englishTestSelect = document.getElementById('englishTest');
    const ieltsGroup = document.getElementById('ieltsGroup');
    const ieltsBandsGroup = document.getElementById('ieltsBandsGroup');
    
    // Show/hide IELTS fields based on test selection
    if (englishTestSelect) {
        englishTestSelect.addEventListener('change', function() {
            if (this.value === 'yes') {
                if (ieltsGroup) ieltsGroup.style.display = 'block';
                if (ieltsBandsGroup) ieltsBandsGroup.style.display = 'block';
            } else {
                if (ieltsGroup) ieltsGroup.style.display = 'none';
                if (ieltsBandsGroup) ieltsBandsGroup.style.display = 'none';
            }
        });
    }
    
    // Handle form submission
    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const profile = {
                age: parseInt(document.getElementById('age').value) || 0,
                maritalStatus: document.getElementById('maritalStatus').value,
                dependents: parseInt(document.getElementById('dependents').value) || 0,
                highestQualification: document.getElementById('highestQualification').value,
                fieldOfStudy: document.getElementById('fieldOfStudy').value,
                yearOfCompletion: parseInt(document.getElementById('yearOfCompletion').value) || 0,
                totalExperience: parseInt(document.getElementById('totalExperience').value) || 0,
                currentOccupation: document.getElementById('currentOccupation').value,
                nocCode: document.getElementById('nocCode').value,
                englishTest: document.getElementById('englishTest').value,
                ieltsOverall: document.getElementById('ieltsOverall').value,
                ieltsListening: parseFloat(document.getElementById('ieltsListening').value) || 0,
                ieltsReading: parseFloat(document.getElementById('ieltsReading').value) || 0,
                ieltsWriting: parseFloat(document.getElementById('ieltsWriting').value) || 0,
                ieltsSpeaking: parseFloat(document.getElementById('ieltsSpeaking').value) || 0,
                settlementFunds: parseFloat(document.getElementById('settlementFunds').value) || 0,
                proofOfFunds: document.getElementById('proofOfFunds').value,
                spouseEducation: document.getElementById('spouseEducation').value,
                spouseLanguage: document.getElementById('spouseLanguage').value,
                relativeInCountry: document.getElementById('relativeInCountry').value,
                jobOffer: document.getElementById('jobOffer').value
            };
            
            // Check eligibility
            const results = checkEligibility(profile);
            
            // Display results
            displayEligibilityResults(results);
            
            // Scroll to results
            document.getElementById('eligibilityResults').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// ============================================
// POINTS & CALCULATORS SYSTEM
// ============================================

// Show calculator tab
function showCalculator(calcId) {
    // Hide all panels
    document.querySelectorAll('.calculator-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    const panel = document.getElementById('calc-' + calcId);
    if (panel) {
        panel.classList.add('active');
    }
    
    // Activate selected tab
    event.target.classList.add('active');
}

// Calculate FSW Score
function calculateFSW() {
    const age = parseInt(document.getElementById('fsw-age').value) || 0;
    const education = document.getElementById('fsw-education').value;
    const experience = parseInt(document.getElementById('fsw-experience').value) || 0;
    const listening = parseFloat(document.getElementById('fsw-ielts-listening').value) || 0;
    const reading = parseFloat(document.getElementById('fsw-ielts-reading').value) || 0;
    const writing = parseFloat(document.getElementById('fsw-ielts-writing').value) || 0;
    const speaking = parseFloat(document.getElementById('fsw-ielts-speaking').value) || 0;
    const secondLanguage = document.getElementById('fsw-second-language').value;
    const spouseIELTS = document.getElementById('fsw-spouse-ielts').value;
    const canadaExperience = document.getElementById('fsw-canada-experience').value;
    const relative = document.getElementById('fsw-relative').value;
    
    // Calculate Age Points
    let agePoints = 0;
    if (age >= 18 && age <= 35) agePoints = 12;
    else if (age === 36) agePoints = 11;
    else if (age === 37) agePoints = 10;
    else if (age === 38) agePoints = 9;
    else if (age === 39) agePoints = 8;
    else if (age === 40) agePoints = 7;
    else if (age === 41) agePoints = 6;
    else if (age === 42) agePoints = 5;
    else if (age === 43) agePoints = 4;
    else if (age === 44) agePoints = 3;
    else if (age === 45) agePoints = 2;
    else if (age === 46) agePoints = 1;
    
    // Calculate Education Points
    const eduPoints = {
        'phd': 25,
        'masters': 23,
        'two-degrees': 22,
        'bachelors': 21,
        'diploma-2': 19,
        'diploma-1': 15,
        'secondary': 5
    };
    const educationPoints = eduPoints[education] || 0;
    
    // Calculate Experience Points
    let experiencePoints = 0;
    if (experience >= 6) experiencePoints = 15;
    else if (experience >= 4) experiencePoints = 13;
    else if (experience >= 2) experiencePoints = 11;
    else if (experience >= 1) experiencePoints = 9;
    
    // Calculate Language Points (CLB conversion)
    function getCLBLevel(score) {
        if (score >= 8) return 9;
        if (score >= 7.5) return 8;
        if (score >= 6) return 7;
        return 0;
    }
    
    const clbL = getCLBLevel(listening);
    const clbR = getCLBLevel(reading);
    const clbW = getCLBLevel(writing);
    const clbS = getCLBLevel(speaking);
    
    let languagePoints = 0;
    if (clbL >= 9 && clbR >= 7 && clbW >= 7 && clbS >= 7) languagePoints = 24;
    else if (clbL >= 8 && clbR >= 6.5 && clbW >= 6.5 && clbS >= 6.5) languagePoints = 20;
    else if (clbL >= 7 && clbR >= 6 && clbW >= 6 && clbS >= 6) languagePoints = 16;
    
    if (secondLanguage === 'yes') languagePoints += 4;
    languagePoints = Math.min(languagePoints, 28);
    
    // Calculate Adaptability Points
    let adaptabilityPoints = 0;
    if (spouseIELTS === 'yes') adaptabilityPoints += 5;
    if (canadaExperience === 'yes') adaptabilityPoints += 5;
    if (relative === 'yes') adaptabilityPoints += 5;
    adaptabilityPoints = Math.min(adaptabilityPoints, 10);
    
    const totalPoints = agePoints + educationPoints + experiencePoints + languagePoints + adaptabilityPoints;
    
    // Update point displays
    document.getElementById('fsw-age-points').textContent = agePoints + ' points';
    document.getElementById('fsw-education-points').textContent = educationPoints + ' points';
    document.getElementById('fsw-experience-points').textContent = experiencePoints + ' points';
    document.getElementById('fsw-language-points').textContent = languagePoints + ' points';
    document.getElementById('fsw-adaptability-points').textContent = adaptabilityPoints + ' points';
    
    // Display result
    const resultDiv = document.getElementById('fsw-result');
    let status = '';
    let statusClass = '';
    let improvements = [];
    
    if (totalPoints >= 67) {
        status = '✅ ELIGIBLE';
        statusClass = 'eligible';
    } else if (totalPoints >= 60) {
        status = '⚠️ BORDERLINE';
        statusClass = 'borderline';
        improvements.push(`You need ${67 - totalPoints} more points to be eligible`);
    } else {
        status = '❌ NOT ELIGIBLE';
        statusClass = 'not-eligible';
        improvements.push(`You need ${67 - totalPoints} more points to be eligible`);
    }
    
    if (languagePoints < 20) {
        improvements.push('Improve IELTS to CLB 8+ to gain more language points');
    }
    if (agePoints < 12 && age < 35) {
        improvements.push('Consider applying before age 35 for maximum age points');
    }
    if (educationPoints < 25) {
        improvements.push('Consider higher education (Master\'s/PhD) for more points');
    }
    
    resultDiv.innerHTML = `
        <div class="calc-result-content ${statusClass}">
            <div class="result-header">
                <h3>Your FSW Score: ${totalPoints} / 100</h3>
                <div class="result-status ${statusClass}">${status}</div>
            </div>
            <div class="result-breakdown">
                <h4>Points Breakdown:</h4>
                <ul>
                    <li>Age: ${agePoints} / 12</li>
                    <li>Education: ${educationPoints} / 25</li>
                    <li>Experience: ${experiencePoints} / 15</li>
                    <li>Language: ${languagePoints} / 28</li>
                    <li>Adaptability: ${adaptabilityPoints} / 10</li>
                </ul>
            </div>
            ${improvements.length > 0 ? `
                <div class="result-improvements">
                    <h4>How to Improve:</h4>
                    <ul>
                        ${improvements.map(imp => `<li>${imp}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Calculate CRS Score
function calculateCRS() {
    const age = parseInt(document.getElementById('crs-age').value) || 0;
    const education = document.getElementById('crs-education').value;
    const canadianExp = parseInt(document.getElementById('crs-canadian-exp').value) || 0;
    const ieltsL = parseFloat(document.getElementById('crs-ielts-l').value) || 0;
    const ieltsR = parseFloat(document.getElementById('crs-ielts-r').value) || 0;
    const ieltsW = parseFloat(document.getElementById('crs-ielts-w').value) || 0;
    const ieltsS = parseFloat(document.getElementById('crs-ielts-s').value) || 0;
    const provincial = document.getElementById('crs-provincial').value;
    const jobOffer = document.getElementById('crs-job-offer').value;
    const canadianEdu = document.getElementById('crs-canadian-edu').value;
    const french = document.getElementById('crs-french').value;
    const sibling = document.getElementById('crs-sibling').value;
    
    // Simplified CRS calculation (core factors)
    let corePoints = 0;
    
    // Age points (simplified)
    if (age >= 18 && age <= 35) corePoints += 110;
    else if (age <= 45) corePoints += Math.max(0, 110 - (age - 35) * 8);
    
    // Education points (simplified)
    const eduPoints = {
        'phd': 150,
        'masters': 135,
        'two-degrees': 128,
        'bachelors': 120,
        'diploma': 98
    };
    corePoints += eduPoints[education] || 0;
    
    // Language points (simplified - based on average)
    const avgIELTS = (ieltsL + ieltsR + ieltsW + ieltsS) / 4;
    if (avgIELTS >= 8) corePoints += 160;
    else if (avgIELTS >= 7) corePoints += 120;
    else if (avgIELTS >= 6) corePoints += 80;
    
    // Canadian experience
    if (canadianExp >= 5) corePoints += 80;
    else if (canadianExp >= 3) corePoints += 60;
    else if (canadianExp >= 1) corePoints += 40;
    
    corePoints = Math.min(corePoints, 500);
    
    // Additional points
    let additionalPoints = 0;
    if (provincial === 'yes') additionalPoints += 600;
    if (jobOffer === '50') additionalPoints += 50;
    if (jobOffer === '200') additionalPoints += 200;
    if (canadianEdu === 'yes') additionalPoints += 30;
    if (french === 'yes') additionalPoints += 50;
    if (sibling === 'yes') additionalPoints += 15;
    
    const totalCRS = corePoints + additionalPoints;
    
    // Update displays
    document.getElementById('crs-core-points').textContent = corePoints + ' points';
    document.getElementById('crs-additional-points').textContent = additionalPoints + ' points';
    
    // Display result
    const resultDiv = document.getElementById('crs-result');
    let status = '';
    let statusClass = '';
    
    if (totalCRS >= 480) {
        status = '✅ STRONG PROFILE';
        statusClass = 'eligible';
    } else if (totalCRS >= 430) {
        status = '⚠️ COMPETITIVE';
        statusClass = 'borderline';
    } else {
        status = '❌ NEEDS IMPROVEMENT';
        statusClass = 'not-eligible';
    }
    
    resultDiv.innerHTML = `
        <div class="calc-result-content ${statusClass}">
            <div class="result-header">
                <h3>Your CRS Score: ${totalCRS} / 1200</h3>
                <div class="result-status ${statusClass}">${status}</div>
            </div>
            <div class="result-breakdown">
                <h4>Score Breakdown:</h4>
                <ul>
                    <li>Core Human Capital: ${corePoints} / 500</li>
                    <li>Additional Factors: ${additionalPoints} / 600</li>
                </ul>
            </div>
            ${totalCRS < 480 ? `
                <div class="result-improvements">
                    <h4>How to Improve:</h4>
                    <ul>
                        ${totalCRS < 430 ? '<li>Consider Provincial Nomination (+600 points)</li>' : ''}
                        ${avgIELTS < 7 ? '<li>Improve IELTS to 7.0+ for more language points</li>' : ''}
                        ${canadianExp === 0 ? '<li>Gain Canadian work experience for significant points boost</li>' : ''}
                        ${french === 'no' ? '<li>Learn French for additional 50 points</li>' : ''}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Calculate Australia Points
function calculateAustralia() {
    const age = parseInt(document.getElementById('aus-age').value) || 0;
    const ielts = parseFloat(document.getElementById('aus-ielts').value) || 0;
    const overseasExp = parseInt(document.getElementById('aus-overseas-exp').value) || 0;
    const australianExp = parseInt(document.getElementById('aus-australian-exp').value) || 0;
    const education = document.getElementById('aus-education').value;
    const stateNom = document.getElementById('aus-state-nom').value;
    const regional = document.getElementById('aus-regional').value;
    const partnerSkills = document.getElementById('aus-partner-skills').value;
    const professionalYear = document.getElementById('aus-professional-year').value;
    
    // Age points
    let agePoints = 0;
    if (age >= 25 && age <= 32) agePoints = 30;
    else if (age >= 18 && age <= 24) agePoints = 25;
    else if (age >= 33 && age <= 39) agePoints = 25;
    else if (age >= 40 && age <= 44) agePoints = 15;
    
    // English points
    let englishPoints = 0;
    if (ielts >= 8) englishPoints = 20;
    else if (ielts >= 7) englishPoints = 10;
    
    // Experience points (overseas + Australian)
    let experiencePoints = 0;
    if (overseasExp >= 8) experiencePoints += 15;
    else if (overseasExp >= 5) experiencePoints += 10;
    else if (overseasExp >= 3) experiencePoints += 5;
    
    if (australianExp >= 8) experiencePoints += 20;
    else if (australianExp >= 5) experiencePoints += 15;
    else if (australianExp >= 3) experiencePoints += 10;
    else if (australianExp >= 1) experiencePoints += 5;
    
    experiencePoints = Math.min(experiencePoints, 20);
    
    // Education points
    const eduPoints = {
        'phd': 20,
        'masters': 15,
        'diploma': 10
    };
    const educationPoints = eduPoints[education] || 0;
    
    // Bonus points
    let bonusPoints = 0;
    if (stateNom === 'yes') bonusPoints += 5;
    if (regional === 'yes') bonusPoints += 15;
    if (partnerSkills === 'yes') bonusPoints += 10;
    if (professionalYear === 'yes') bonusPoints += 5;
    
    const totalPoints = agePoints + englishPoints + experiencePoints + educationPoints + bonusPoints;
    
    // Update displays
    document.getElementById('aus-age-points').textContent = agePoints + ' points';
    document.getElementById('aus-english-points').textContent = englishPoints + ' points';
    document.getElementById('aus-experience-points').textContent = experiencePoints + ' points';
    document.getElementById('aus-education-points').textContent = educationPoints + ' points';
    document.getElementById('aus-bonus-points').textContent = bonusPoints + ' points';
    
    // Display result
    const resultDiv = document.getElementById('australia-result');
    let status = '';
    let statusClass = '';
    let improvements = [];
    
    if (totalPoints >= 65) {
        status = '✅ ELIGIBLE';
        statusClass = 'eligible';
    } else {
        status = '❌ NOT ELIGIBLE';
        statusClass = 'not-eligible';
        improvements.push(`You need ${65 - totalPoints} more points to be eligible`);
    }
    
    if (ielts < 7) {
        improvements.push('Improve IELTS to 7.0+ for 10 more points');
    }
    if (regional === 'no') {
        improvements.push('Consider Regional Nomination (491) for +15 points');
    }
    if (partnerSkills === 'no') {
        improvements.push('If spouse has skills, you can get +10 points');
    }
    
    resultDiv.innerHTML = `
        <div class="calc-result-content ${statusClass}">
            <div class="result-header">
                <h3>Your Australia Score: ${totalPoints} / 130+</h3>
                <div class="result-status ${statusClass}">${status}</div>
            </div>
            <div class="result-breakdown">
                <h4>Points Breakdown:</h4>
                <ul>
                    <li>Age: ${agePoints} / 30</li>
                    <li>English: ${englishPoints} / 20</li>
                    <li>Experience: ${experiencePoints} / 20</li>
                    <li>Education: ${educationPoints} / 20</li>
                    <li>Bonus: ${bonusPoints} / 25</li>
                </ul>
            </div>
            ${improvements.length > 0 ? `
                <div class="result-improvements">
                    <h4>How to Improve:</h4>
                    <ul>
                        ${improvements.map(imp => `<li>${imp}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Calculate Germany Opportunity Card
function calculateGermany() {
    const degree = document.getElementById('ger-degree').value;
    const experience = document.getElementById('ger-experience').value;
    const german = document.getElementById('ger-german').value;
    const age = document.getElementById('ger-age').value;
    const previousStay = document.getElementById('ger-previous-stay').value;
    const shortage = document.getElementById('ger-shortage').value;
    
    let totalPoints = 0;
    
    if (degree === 'yes') totalPoints += 4;
    if (experience === 'yes') totalPoints += 3;
    if (german === 'a2') totalPoints += 1;
    else if (german === 'b1') totalPoints += 2;
    else if (german === 'b2') totalPoints += 3;
    if (age === 'yes') totalPoints += 2;
    if (previousStay === 'yes') totalPoints += 1;
    if (shortage === 'yes') totalPoints += 1;
    
    document.getElementById('ger-total-points').textContent = totalPoints + ' / 14 points';
    
    // Display result
    const resultDiv = document.getElementById('germany-result');
    let status = '';
    let statusClass = '';
    let improvements = [];
    
    if (totalPoints >= 6) {
        status = '✅ ELIGIBLE';
        statusClass = 'eligible';
    } else {
        status = '❌ NOT ELIGIBLE';
        statusClass = 'not-eligible';
        improvements.push(`You need ${6 - totalPoints} more points to be eligible`);
    }
    
    if (degree === 'no') {
        improvements.push('Get a recognized degree (+4 points)');
    }
    if (experience === 'no') {
        improvements.push('Gain 2+ years of work experience (+3 points)');
    }
    if (german === 'none' || german === 'a2') {
        improvements.push('Learn German to B1/B2 level for more points');
    }
    if (age === 'no') {
        improvements.push('Age under 35 gives +2 points');
    }
    
    resultDiv.innerHTML = `
        <div class="calc-result-content ${statusClass}">
            <div class="result-header">
                <h3>Your Germany Opportunity Card Score: ${totalPoints} / 14</h3>
                <div class="result-status ${statusClass}">${status}</div>
            </div>
            ${improvements.length > 0 ? `
                <div class="result-improvements">
                    <h4>How to Improve:</h4>
                    <ul>
                        ${improvements.map(imp => `<li>${imp}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Expose functions globally
window.showCalculator = showCalculator;
window.calculateFSW = calculateFSW;
window.calculateCRS = calculateCRS;
window.calculateAustralia = calculateAustralia;
window.calculateGermany = calculateGermany;

// ============================================
// COUNTRIES INFORMATION SYSTEM
// ============================================

// Country Information Database
const COUNTRY_INFO = {
    'canada': {
        name: 'Canada',
        flag: '🇨🇦',
        overview: 'Canada is one of the most popular immigration destinations, offering excellent quality of life, strong economy, and diverse opportunities for skilled workers, students, and families.',
        whyMigrate: [
            'High quality of life and excellent healthcare system',
            'Strong economy with diverse job opportunities',
            'Multicultural society welcoming immigrants',
            'Pathway to citizenship after 3-5 years',
            'Free public education and healthcare'
        ],
        visaTypes: [
            {
                name: 'Express Entry (FSW/CEC/FST)',
                description: 'Points-based system for skilled workers',
                requirements: 'Minimum 67 points (FSW), IELTS 6+, 1+ years experience',
                processingTime: '6-8 months',
                cost: 'CAD $1,325 (principal applicant)'
            },
            {
                name: 'Provincial Nominee Program (PNP)',
                description: 'Provincial nomination for permanent residence',
                requirements: 'Varies by province, job offer often required',
                processingTime: '12-18 months',
                cost: 'CAD $1,325 + provincial fees'
            },
            {
                name: 'Study Permit',
                description: 'Study in Canada with work rights',
                requirements: 'Acceptance letter, proof of funds, IELTS 6+',
                processingTime: '4-6 weeks',
                cost: 'CAD $150'
            },
            {
                name: 'Work Permit',
                description: 'Temporary work authorization',
                requirements: 'LMIA or LMIA-exempt job offer',
                processingTime: '2-4 months',
                cost: 'CAD $155'
            }
        ],
        eligibility: {
            age: '18-44 years (preferred for Express Entry)',
            education: 'Minimum diploma, ECA required',
            language: 'IELTS 6+ (CLB 7+ preferred)',
            experience: 'Minimum 1 year skilled work experience',
            funds: 'CAD $13,310 (single) to CAD $35,000 (family of 4)'
        },
        processing: {
            time: '6-18 months depending on program',
            fees: 'CAD $1,325 (PR application)',
            documents: 'Passport, ECA, IELTS, Police clearance, Medical exam'
        },
        settlement: {
            jobs: 'Strong demand in IT, healthcare, engineering, trades',
            accommodation: 'Average rent: CAD $1,200-2,500/month',
            healthcare: 'Universal healthcare after PR (3 months wait)',
            prPathway: 'Express Entry → PR → Citizenship (after 3 years)',
            citizenship: 'After 3 years as PR, can apply for citizenship'
        },
        costOfLiving: 'CAD $2,000-3,500/month (varies by city)',
        jobMarket: 'Strong demand in tech, healthcare, engineering, finance'
    },
    'australia': {
        name: 'Australia',
        flag: '🇦🇺',
        overview: 'Australia offers a high standard of living, beautiful landscapes, and excellent opportunities for skilled migration through various visa pathways.',
        whyMigrate: [
            'High quality of life and beautiful climate',
            'Strong economy with competitive salaries',
            'Excellent education and healthcare systems',
            'Pathway to PR and citizenship',
            'Diverse and welcoming society'
        ],
        visaTypes: [
            {
                name: 'Skilled Independent Visa (Subclass 189)',
                description: 'Points-based permanent residency, no sponsorship required',
                requirements: '65+ points, age <45, positive skills assessment, IELTS 6+',
                processingTime: '8-12 months',
                cost: 'AUD $4,045'
            },
            {
                name: 'Skilled Nominated Visa (Subclass 190)',
                description: 'State-nominated permanent residency',
                requirements: '65+ points, state nomination, skills assessment',
                processingTime: '8-12 months',
                cost: 'AUD $4,045'
            },
            {
                name: 'Skilled Work Regional Visa (Subclass 491)',
                description: 'Regional provisional visa, pathway to PR',
                requirements: '65+ points, regional nomination, skills assessment',
                processingTime: '8-12 months',
                cost: 'AUD $4,045'
            },
            {
                name: 'Student Visa (Subclass 500)',
                description: 'Study in Australia with work rights',
                requirements: 'CoE, IELTS 6+, proof of funds',
                processingTime: '4-8 weeks',
                cost: 'AUD $630'
            }
        ],
        eligibility: {
            age: 'Under 45 years (for skilled migration)',
            education: 'Recognized degree, skills assessment required',
            language: 'IELTS 6+ (7+ preferred for more points)',
            experience: 'Minimum 2-3 years skilled work experience',
            funds: 'AUD $20,000+ (for student/visitor visas)'
        },
        processing: {
            time: '8-18 months for PR visas',
            fees: 'AUD $4,045 (PR application)',
            documents: 'Passport, Skills assessment, IELTS, Police clearance, Medical exam'
        },
        settlement: {
            jobs: 'High demand in IT, healthcare, engineering, accounting',
            accommodation: 'Average rent: AUD $1,500-3,000/month',
            healthcare: 'Medicare available after PR',
            prPathway: 'Skilled Migration → PR → Citizenship (after 4 years)',
            citizenship: 'After 4 years as PR, can apply for citizenship'
        },
        costOfLiving: 'AUD $2,500-4,000/month (varies by city)',
        jobMarket: 'Strong demand in tech, healthcare, engineering, trades'
    },
    'germany': {
        name: 'Germany',
        flag: '🇩🇪',
        overview: 'Germany offers excellent opportunities for skilled workers, students, and professionals through the EU Blue Card and Opportunity Card programs.',
        whyMigrate: [
            'Strong economy and job market',
            'High quality of life and social benefits',
            'Excellent education system (many free universities)',
            'Pathway to EU permanent residence',
            'Central location in Europe'
        ],
        visaTypes: [
            {
                name: 'EU Blue Card',
                description: 'Work permit for highly qualified professionals',
                requirements: 'Recognized degree, job offer, salary threshold (€58,400)',
                processingTime: '2-4 months',
                cost: '€140'
            },
            {
                name: 'Opportunity Card (Chancenkarte)',
                description: 'Points-based work permit for job seekers',
                requirements: '6+ points, recognized degree, German/English proficiency',
                processingTime: '3-6 months',
                cost: '€140'
            },
            {
                name: 'Student Visa',
                description: 'Study in Germany (many programs are free)',
                requirements: 'University admission, proof of funds (€11,208/year)',
                processingTime: '4-8 weeks',
                cost: '€75'
            },
            {
                name: 'Job Seeker Visa',
                description: '6-month visa to search for jobs',
                requirements: 'Recognized degree, proof of funds',
                processingTime: '2-3 months',
                cost: '€75'
            }
        ],
        eligibility: {
            age: 'No strict age limit (preferred under 45)',
            education: 'Recognized degree required',
            language: 'German A2-B2 or English B2+',
            experience: '2+ years experience preferred',
            funds: '€11,208/year (for student visa)'
        },
        processing: {
            time: '2-6 months depending on visa type',
            fees: '€75-140',
            documents: 'Passport, Degree recognition, Language certificate, Job offer (if applicable)'
        },
        settlement: {
            jobs: 'High demand in IT, engineering, healthcare, manufacturing',
            accommodation: 'Average rent: €800-1,500/month',
            healthcare: 'Mandatory health insurance (€80-200/month)',
            prPathway: 'Work visa → Permanent residence (after 5 years) → Citizenship (after 8 years)',
            citizenship: 'After 8 years (can be reduced to 6-7 years)'
        },
        costOfLiving: '€1,200-2,000/month (varies by city)',
        jobMarket: 'Strong demand in tech, engineering, healthcare, automotive'
    },
    'united-kingdom': {
        name: 'United Kingdom',
        flag: '🇬🇧',
        overview: 'The UK offers various visa pathways for skilled workers, students, and families through its points-based immigration system.',
        whyMigrate: [
            'Strong economy and job opportunities',
            'World-class education system',
            'Multicultural society',
            'Pathway to settlement (ILR)',
            'Access to Europe (with visa)'
        ],
        visaTypes: [
            {
                name: 'Skilled Worker Visa',
                description: 'Points-based work visa with job offer',
                requirements: 'Job offer from licensed sponsor, salary threshold, IELTS B1+',
                processingTime: '3-8 weeks',
                cost: '£625-1,423'
            },
            {
                name: 'Student Visa',
                description: 'Study in the UK',
                requirements: 'CAS letter, IELTS 6+, proof of funds',
                processingTime: '3-6 weeks',
                cost: '£363'
            },
            {
                name: 'Health and Care Worker Visa',
                description: 'For healthcare professionals',
                requirements: 'Job offer in healthcare, IELTS B1+',
                processingTime: '3-8 weeks',
                cost: '£247'
            },
            {
                name: 'Graduate Visa',
                description: 'Stay in UK after graduation',
                requirements: 'UK degree, valid student visa',
                processingTime: '8 weeks',
                cost: '£715'
            }
        ],
        eligibility: {
            age: '18+ years',
            education: 'Varies by visa type',
            language: 'IELTS B1+ (4.0+)',
            experience: 'Job offer required for work visas',
            funds: '£1,334/month (for student visa)'
        },
        processing: {
            time: '3-8 weeks for most visas',
            fees: '£247-1,423 depending on visa type',
            documents: 'Passport, Job offer/CAS, IELTS, TB test (if required)'
        },
        settlement: {
            jobs: 'High demand in tech, finance, healthcare, engineering',
            accommodation: 'Average rent: £800-1,500/month (outside London)',
            healthcare: 'NHS available after paying IHS surcharge',
            prPathway: 'Work visa → ILR (after 5 years) → Citizenship (after 6 years)',
            citizenship: 'After 5 years ILR + 1 year, can apply for citizenship'
        },
        costOfLiving: '£1,200-2,500/month (varies by city, London is higher)',
        jobMarket: 'Strong demand in tech, finance, healthcare, engineering'
    }
};

// Add more countries with basic info (can be expanded)
const additionalCountries = ['ireland', 'new-zealand', 'netherlands', 'poland', 'slovakia', 'romania', 'croatia', 'malta', 'latvia', 'sweden', 'switzerland', 'denmark', 'italy', 'france', 'south-korea', 'singapore', 'uae', 'philippines', 'malaysia', 'russia', 'bulgaria', 'albania', 'united-states'];

additionalCountries.forEach(country => {
    if (!COUNTRY_INFO[country]) {
        COUNTRY_INFO[country] = {
            name: country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            flag: '🌍',
            overview: `Learn about migration opportunities in ${country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}.`,
            whyMigrate: ['Quality of life', 'Job opportunities', 'Education system', 'Pathway to residency'],
            visaTypes: [
                {
                    name: 'Work Visa',
                    description: 'Work permit for skilled professionals',
                    requirements: 'Job offer, relevant qualifications',
                    processingTime: '3-6 months',
                    cost: 'Varies'
                },
                {
                    name: 'Student Visa',
                    description: 'Study opportunities',
                    requirements: 'University admission, proof of funds',
                    processingTime: '2-4 months',
                    cost: 'Varies'
                }
            ],
            eligibility: {
                age: '18+ years',
                education: 'Varies by program',
                language: 'English or local language proficiency',
                experience: 'Varies',
                funds: 'Proof of sufficient funds required'
            },
            processing: {
                time: '3-6 months',
                fees: 'Varies by visa type',
                documents: 'Passport, Qualifications, Language tests, Financial proof'
            },
            settlement: {
                jobs: 'Various opportunities available',
                accommodation: 'Varies by location',
                healthcare: 'Available after obtaining residency',
                prPathway: 'Varies by country',
                citizenship: 'Varies by country'
            },
            costOfLiving: 'Varies by city and lifestyle',
            jobMarket: 'Various sectors available'
        };
    }
});

// Show country details
function showCountryDetails(countryKey) {
    const country = COUNTRY_INFO[countryKey];
    if (!country) {
        console.error('Country not found:', countryKey);
        return;
    }
    
    const modal = document.getElementById('countryModal');
    const modalTitle = document.getElementById('countryModalTitle');
    const modalBody = document.getElementById('countryModalBody');
    
    modalTitle.innerHTML = `${country.flag} ${country.name}`;
    
    let html = `
        <div class="country-details">
            <div class="country-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${country.overview}</p>
            </div>
            
            <div class="country-section">
                <h3><i class="fas fa-star"></i> Why Migrate to ${country.name}?</h3>
                <ul class="country-list">
                    ${country.whyMigrate.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="country-section">
                <h3><i class="fas fa-file-alt"></i> Visa Types</h3>
                <div class="visa-types-grid">
                    ${country.visaTypes.map(visa => `
                        <div class="visa-type-card">
                            <h4>${visa.name}</h4>
                            <p class="visa-description">${visa.description}</p>
                            <div class="visa-details">
                                <p><strong>Requirements:</strong> ${visa.requirements}</p>
                                <p><strong>Processing Time:</strong> ${visa.processingTime}</p>
                                <p><strong>Cost:</strong> ${visa.cost}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="country-section">
                <h3><i class="fas fa-check-circle"></i> Eligibility Criteria</h3>
                <div class="eligibility-grid">
                    <div class="eligibility-item">
                        <strong>Age:</strong> ${country.eligibility.age}
                    </div>
                    <div class="eligibility-item">
                        <strong>Education:</strong> ${country.eligibility.education}
                    </div>
                    <div class="eligibility-item">
                        <strong>Language:</strong> ${country.eligibility.language}
                    </div>
                    <div class="eligibility-item">
                        <strong>Experience:</strong> ${country.eligibility.experience}
                    </div>
                    <div class="eligibility-item">
                        <strong>Funds:</strong> ${country.eligibility.funds}
                    </div>
                </div>
            </div>
            
            <div class="country-section">
                <h3><i class="fas fa-clock"></i> Processing & Cost</h3>
                <div class="processing-info">
                    <p><strong>Processing Time:</strong> ${country.processing.time}</p>
                    <p><strong>Application Fees:</strong> ${country.processing.fees}</p>
                    <p><strong>Required Documents:</strong> ${country.processing.documents}</p>
                </div>
            </div>
            
            <div class="country-section">
                <h3><i class="fas fa-home"></i> Settlement Information</h3>
                <div class="settlement-info">
                    <div class="settlement-item">
                        <strong>Jobs After Arrival:</strong> ${country.settlement.jobs}
                    </div>
                    <div class="settlement-item">
                        <strong>Accommodation:</strong> ${country.settlement.accommodation}
                    </div>
                    <div class="settlement-item">
                        <strong>Healthcare:</strong> ${country.settlement.healthcare}
                    </div>
                    <div class="settlement-item">
                        <strong>PR Pathway:</strong> ${country.settlement.prPathway}
                    </div>
                    <div class="settlement-item">
                        <strong>Citizenship:</strong> ${country.settlement.citizenship}
                    </div>
                </div>
            </div>
            
            <div class="country-section">
                <h3><i class="fas fa-dollar-sign"></i> Cost of Living</h3>
                <p>${country.costOfLiving}</p>
            </div>
            
            <div class="country-section">
                <h3><i class="fas fa-briefcase"></i> Job Market</h3>
                <p>${country.jobMarket}</p>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = html;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close country modal
function closeCountryModal() {
    const modal = document.getElementById('countryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('countryModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCountryModal();
            }
        });
    }
});

// Expose functions globally
window.showCountryDetails = showCountryDetails;
window.closeCountryModal = closeCountryModal;

// ============================================
// VISA PATHWAYS SYSTEM
// ============================================

const PATHWAY_INFO = {
    'express-entry': {
        name: 'Express Entry',
        country: 'Canada',
        description: 'Express Entry is Canada\'s main system for managing applications for permanent residence from skilled workers.',
        whoCanApply: 'Skilled workers with at least 1 year of experience, language test results, and education assessment',
        requirements: [
            'Minimum 1 year of skilled work experience',
            'Language test (IELTS/CELPIP/TEF) - CLB 7+',
            'Educational Credential Assessment (ECA)',
            'Meet minimum CRS score (varies by draw)',
            'Proof of settlement funds'
        ],
        processingTime: '6-8 months after ITA',
        cost: 'CAD $1,325 (principal applicant)',
        pros: [
            'Fast processing time',
            'No job offer required',
            'Can include spouse and dependents',
            'Direct pathway to PR'
        ],
        cons: [
            'Competitive CRS scores required',
            'Need strong language skills',
            'Education assessment required'
        ],
        prPossibility: 'Yes - Direct PR upon approval'
    },
    'fsw': {
        name: 'Federal Skilled Worker Program',
        country: 'Canada',
        description: 'Points-based program for skilled workers who want to become permanent residents of Canada.',
        whoCanApply: 'Skilled workers with foreign work experience, education, and language abilities',
        requirements: [
            'Minimum 67 points out of 100',
            'At least 1 year of continuous skilled work experience',
            'Language test - CLB 7 minimum',
            'Educational Credential Assessment',
            'Proof of funds'
        ],
        processingTime: '6-8 months',
        cost: 'CAD $1,325',
        pros: [
            'No job offer required',
            'Can live anywhere in Canada',
            'Direct PR pathway'
        ],
        cons: [
            'Must meet 67-point threshold',
            'Competitive program'
        ],
        prPossibility: 'Yes - Permanent Residency'
    },
    'cec': {
        name: 'Canadian Experience Class',
        country: 'Canada',
        description: 'For skilled workers who have Canadian work experience and want to become permanent residents.',
        whoCanApply: 'Workers with at least 1 year of skilled work experience in Canada',
        requirements: [
            'At least 1 year of skilled work experience in Canada',
            'Language test - CLB 7 for NOC 0/A, CLB 5 for NOC B',
            'Valid work permit or status',
            'Meet CRS score requirements'
        ],
        processingTime: '6-8 months',
        cost: 'CAD $1,325',
        pros: [
            'Faster processing for those already in Canada',
            'No education assessment required',
            'Lower language requirements for some occupations'
        ],
        cons: [
            'Requires Canadian work experience',
            'Must have valid status'
        ],
        prPossibility: 'Yes - Permanent Residency'
    },
    'subclass-189': {
        name: 'Skilled Independent Visa (Subclass 189)',
        country: 'Australia',
        description: 'Points-tested permanent residency visa for skilled workers without state or employer sponsorship.',
        whoCanApply: 'Skilled workers under 45, with positive skills assessment and 65+ points',
        requirements: [
            'Age under 45',
            'Minimum 65 points',
            'Positive skills assessment',
            'IELTS 6+ (or equivalent)',
            'Meet health and character requirements'
        ],
        processingTime: '8-12 months',
        cost: 'AUD $4,045',
        pros: [
            'Permanent residency from day one',
            'No state or employer sponsorship needed',
            'Can live and work anywhere in Australia'
        ],
        cons: [
            'Competitive points system',
            'Age limit of 45',
            'Skills assessment required'
        ],
        prPossibility: 'Yes - Permanent Residency'
    },
    'subclass-190': {
        name: 'Skilled Nominated Visa (Subclass 190)',
        country: 'Australia',
        description: 'Permanent residency visa requiring nomination by an Australian state or territory.',
        whoCanApply: 'Skilled workers nominated by a state/territory, with 65+ points',
        requirements: [
            'State/territory nomination',
            'Minimum 65 points (including 5 from nomination)',
            'Positive skills assessment',
            'IELTS 6+',
            'Age under 45'
        ],
        processingTime: '8-12 months',
        cost: 'AUD $4,045',
        pros: [
            'Permanent residency',
            '5 extra points from nomination',
            'May have lower points requirement'
        ],
        cons: [
            'Must commit to living in nominating state',
            'State nomination requirements vary'
        ],
        prPossibility: 'Yes - Permanent Residency'
    },
    'eu-blue-card': {
        name: 'EU Blue Card',
        country: 'Europe',
        description: 'Work permit for highly qualified non-EU professionals to work in EU member states.',
        whoCanApply: 'Highly qualified professionals with recognized degree and job offer',
        requirements: [
            'Recognized university degree',
            'Job offer with salary threshold (€58,400/year or higher)',
            'Valid work contract (minimum 1 year)',
            'Health insurance'
        ],
        processingTime: '2-4 months',
        cost: '€140',
        pros: [
            'Work and live in EU country',
            'Family can join',
            'Pathway to permanent residence',
            'Can move between EU countries after 18 months'
        ],
        cons: [
            'High salary threshold',
            'Job offer required',
            'Degree recognition needed'
        ],
        prPossibility: 'Yes - After 33 months (or 21 months with language)'
    }
};

// Show pathway details
function showPathwayDetails(pathwayKey) {
    const pathway = PATHWAY_INFO[pathwayKey];
    if (!pathway) {
        // Create basic info for pathways not in database
        const pathwayNames = {
            'pnp': { name: 'Provincial Nominee Program', country: 'Canada' },
            'rnip': { name: 'RNIPP', country: 'Canada' },
            'aipp': { name: 'AIPP / AAIP', country: 'Canada' },
            'quebec': { name: 'Quebec Skilled Worker', country: 'Canada' },
            'lmia': { name: 'LMIA Work Permits', country: 'Canada' },
            'subclass-491': { name: 'Subclass 491', country: 'Australia' },
            'subclass-407': { name: 'Subclass 407', country: 'Australia' },
            'subclass-482': { name: 'Subclass 482', country: 'Australia' },
            'subclass-186': { name: 'Subclass 186', country: 'Australia' },
            'subclass-494': { name: 'Subclass 494', country: 'Australia' },
            'germany-opportunity': { name: 'Germany Opportunity Card', country: 'Germany' },
            'national-work-permit': { name: 'National Work Permits', country: 'Europe' }
        };
        const basic = pathwayNames[pathwayKey] || { name: pathwayKey, country: 'Various' };
        pathway = {
            name: basic.name,
            country: basic.country,
            description: `Learn about ${basic.name} requirements and process.`,
            whoCanApply: 'Varies by program',
            requirements: ['Check specific program requirements'],
            processingTime: 'Varies',
            cost: 'Varies',
            pros: ['Program-specific benefits'],
            cons: ['Check program limitations'],
            prPossibility: 'Varies by program'
        };
    }
    
    const modal = document.getElementById('pathwayModal');
    const modalTitle = document.getElementById('pathwayModalTitle');
    const modalBody = document.getElementById('pathwayModalBody');
    
    modalTitle.textContent = `${pathway.name} - ${pathway.country}`;
    
    modalBody.innerHTML = `
        <div class="pathway-details">
            <div class="pathway-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${pathway.description}</p>
            </div>
            
            <div class="pathway-section">
                <h3><i class="fas fa-user-check"></i> Who Can Apply</h3>
                <p>${pathway.whoCanApply}</p>
            </div>
            
            <div class="pathway-section">
                <h3><i class="fas fa-list-check"></i> Requirements</h3>
                <ul class="pathway-list">
                    ${pathway.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
            
            <div class="pathway-section">
                <h3><i class="fas fa-clock"></i> Processing & Cost</h3>
                <div class="pathway-info-grid">
                    <div class="pathway-info-item">
                        <strong>Processing Time:</strong> ${pathway.processingTime}
                    </div>
                    <div class="pathway-info-item">
                        <strong>Application Cost:</strong> ${pathway.cost}
                    </div>
                </div>
            </div>
            
            <div class="pathway-section">
                <h3><i class="fas fa-thumbs-up"></i> Pros</h3>
                <ul class="pathway-list pros">
                    ${pathway.pros.map(pro => `<li>${pro}</li>`).join('')}
                </ul>
            </div>
            
            <div class="pathway-section">
                <h3><i class="fas fa-exclamation-circle"></i> Cons</h3>
                <ul class="pathway-list cons">
                    ${pathway.cons.map(con => `<li>${con}</li>`).join('')}
                </ul>
            </div>
            
            <div class="pathway-section">
                <h3><i class="fas fa-flag"></i> PR Possibility</h3>
                <p><strong>${pathway.prPossibility}</strong></p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePathwayModal() {
    document.getElementById('pathwayModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// STUDY ABROAD SYSTEM
// ============================================

const STUDY_INFO = {
    'canada': {
        name: 'Study in Canada',
        flag: '🇨🇦',
        overview: 'Canada offers world-class education with post-graduation work permits leading to permanent residence.',
        admissionRequirements: [
            'Acceptance letter from Designated Learning Institution (DLI)',
            'Proof of financial support (CAD $10,000+ per year)',
            'IELTS 6.0+ or equivalent',
            'Medical exam (if required)',
            'Police clearance certificate'
        ],
        financialProof: 'CAD $10,000+ per year of study + tuition fees',
        languageTests: 'IELTS, TOEFL, PTE, CAEL, or Duolingo',
        workRights: '20 hours/week during studies, full-time during breaks',
        postStudyWork: 'Post-Graduation Work Permit (PGWP) - up to 3 years',
        prConversion: 'Express Entry, Provincial Nominee Program, or Canadian Experience Class',
        popularCourses: 'Engineering, IT, Business, Healthcare, Hospitality',
        averageTuition: 'CAD $15,000-30,000/year (varies by program)',
        processingTime: '4-6 weeks'
    },
    'australia': {
        name: 'Study in Australia',
        flag: '🇦🇺',
        overview: 'Australia provides high-quality education with excellent post-study work opportunities.',
        admissionRequirements: [
            'Confirmation of Enrolment (CoE)',
            'Proof of funds (AUD $20,000+ per year)',
            'IELTS 6.0+ or equivalent',
            'Overseas Student Health Cover (OSHC)',
            'Genuine Temporary Entrant (GTE) statement'
        ],
        financialProof: 'AUD $20,000+ per year + tuition fees',
        languageTests: 'IELTS, TOEFL, PTE, or CAE',
        workRights: '40 hours/fortnight during studies, unlimited during breaks',
        postStudyWork: 'Temporary Graduate Visa (485) - 2-4 years depending on qualification',
        prConversion: 'Skilled Migration (189/190/491) or Employer Sponsored',
        popularCourses: 'Engineering, IT, Healthcare, Business, Hospitality',
        averageTuition: 'AUD $20,000-45,000/year',
        processingTime: '4-8 weeks'
    }
};

const COURSE_INFO = {
    'engineering': {
        name: 'Engineering Programs',
        description: 'Engineering degrees are highly valued globally and offer excellent career prospects.',
        specializations: ['Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Software Engineering', 'Chemical Engineering'],
        careerProspects: 'High demand in all countries, excellent salary potential',
        duration: '3-4 years (Bachelor\'s), 1-2 years (Master\'s)',
        requirements: 'Strong math and science background, IELTS 6.0-6.5+'
    },
    'it-ai': {
        name: 'IT & AI Programs',
        description: 'Computer Science, Data Science, and AI programs are in extremely high demand.',
        specializations: ['Computer Science', 'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Software Development'],
        careerProspects: 'Highest demand field, excellent salaries, global opportunities',
        duration: '3-4 years (Bachelor\'s), 1-2 years (Master\'s)',
        requirements: 'Strong analytical skills, IELTS 6.0-6.5+'
    }
};

function showStudyDetails(countryKey) {
    const study = STUDY_INFO[countryKey] || {
        name: `Study in ${countryKey.charAt(0).toUpperCase() + countryKey.slice(1)}`,
        flag: '🌍',
        overview: 'Quality education opportunities available.',
        admissionRequirements: ['University admission', 'Proof of funds', 'Language proficiency'],
        financialProof: 'Varies by country',
        languageTests: 'IELTS, TOEFL, or country-specific tests',
        workRights: 'Varies by country',
        postStudyWork: 'Check country-specific post-study work options',
        prConversion: 'Varies by country',
        popularCourses: 'Engineering, IT, Business, Healthcare',
        averageTuition: 'Varies',
        processingTime: '2-4 months'
    };
    
    const modal = document.getElementById('studyModal');
    const modalTitle = document.getElementById('studyModalTitle');
    const modalBody = document.getElementById('studyModalBody');
    
    modalTitle.innerHTML = `${study.flag} ${study.name}`;
    
    modalBody.innerHTML = `
        <div class="study-details">
            <div class="study-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${study.overview}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-file-alt"></i> Admission Requirements</h3>
                <ul class="study-list">
                    ${study.admissionRequirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-dollar-sign"></i> Financial Proof</h3>
                <p>${study.financialProof}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-language"></i> Language Tests</h3>
                <p>${study.languageTests}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-briefcase"></i> Work Rights</h3>
                <p>${study.workRights}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-graduation-cap"></i> Post-Study Work</h3>
                <p>${study.postStudyWork}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-flag"></i> PR Conversion</h3>
                <p>${study.prConversion}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-book"></i> Popular Courses</h3>
                <p>${study.popularCourses}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-money-bill"></i> Average Tuition</h3>
                <p>${study.averageTuition}</p>
            </div>
            
            <div class="study-section">
                <h3><i class="fas fa-clock"></i> Processing Time</h3>
                <p>${study.processingTime}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function showCourseDetails(courseKey) {
    const course = COURSE_INFO[courseKey] || {
        name: courseKey,
        description: 'Quality program available in multiple countries.',
        specializations: ['Various specializations available'],
        careerProspects: 'Good career opportunities',
        duration: '3-4 years',
        requirements: 'Varies by program'
    };
    
    const modal = document.getElementById('studyModal');
    const modalTitle = document.getElementById('studyModalTitle');
    const modalBody = document.getElementById('studyModalBody');
    
    modalTitle.textContent = course.name;
    
    modalBody.innerHTML = `
        <div class="course-details">
            <div class="course-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${course.description}</p>
            </div>
            
            <div class="course-section">
                <h3><i class="fas fa-list"></i> Specializations</h3>
                <ul class="course-list">
                    ${course.specializations.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="course-section">
                <h3><i class="fas fa-chart-line"></i> Career Prospects</h3>
                <p>${course.careerProspects}</p>
            </div>
            
            <div class="course-section">
                <h3><i class="fas fa-clock"></i> Duration</h3>
                <p>${course.duration}</p>
            </div>
            
            <div class="course-section">
                <h3><i class="fas fa-check-circle"></i> Requirements</h3>
                <p>${course.requirements}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeStudyModal() {
    document.getElementById('studyModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// HEALTHCARE & NURSES SYSTEM
// ============================================

const HEALTHCARE_INFO = {
    'nurses-canada': {
        title: 'Nurses to Canada',
        country: '🇨🇦 Canada',
        overview: 'Canada has a high demand for registered nurses, licensed practical nurses, and registered psychiatric nurses.',
        licensingBodies: [
            'College of Nurses of Ontario (CNO) - Ontario',
            'British Columbia College of Nursing Professionals (BCCNP) - BC',
            'College of Registered Nurses of Manitoba (CRNM) - Manitoba',
            'Nurses Association of New Brunswick (NANB) - New Brunswick'
        ],
        examsRequired: [
            'NCLEX-RN (for Registered Nurses)',
            'Canadian Practical Nurse Registration Exam (CPNRE)',
            'Canadian Registered Nurse Examination (CRNE) - being phased out'
        ],
        languageLevel: 'IELTS 7.0+ in all bands (or CELPIP equivalent)',
        salary: 'CAD $60,000-90,000/year (varies by province)',
        prChance: 'Excellent - Nurses are in high demand, fast-track options available',
        process: [
            'Educational Credential Assessment (ECA)',
            'Apply to provincial nursing regulatory body',
            'Complete bridging program (if required)',
            'Pass licensing exam',
            'Apply for work permit or Express Entry'
        ],
        visaOptions: ['Express Entry', 'Provincial Nominee Program', 'Work Permit']
    },
    'nurses-australia': {
        title: 'Nurses to Australia',
        country: '🇦🇺 Australia',
        overview: 'Australia has a strong demand for nurses, with AHPRA being the main regulatory body.',
        licensingBodies: ['AHPRA (Australian Health Practitioner Regulation Agency)'],
        examsRequired: ['NCLEX-RN or country-specific assessment'],
        languageLevel: 'IELTS 7.0+ in all bands (or OET B+)',
        salary: 'AUD $65,000-95,000/year',
        prChance: 'Excellent - Nurses on skilled occupation lists',
        process: [
            'Skills assessment through ANMAC',
            'AHPRA registration',
            'IELTS/OET language test',
            'Apply for visa (189/190/491)'
        ],
        visaOptions: ['Subclass 189', 'Subclass 190', 'Subclass 491', 'Subclass 482']
    }
};

function showHealthcareDetails(healthcareKey) {
    const healthcare = HEALTHCARE_INFO[healthcareKey] || {
        title: healthcareKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        country: 'Various',
        overview: 'Healthcare opportunities available in multiple countries.',
        licensingBodies: ['Check country-specific regulatory body'],
        examsRequired: ['Varies by country and profession'],
        languageLevel: 'IELTS 6.5-7.0+ typically required',
        salary: 'Varies by country and position',
        prChance: 'Good - Healthcare professionals are in demand',
        process: ['Check specific country requirements'],
        visaOptions: ['Varies by country']
    };
    
    const modal = document.getElementById('healthcareModal');
    const modalTitle = document.getElementById('healthcareModalTitle');
    const modalBody = document.getElementById('healthcareModalBody');
    
    modalTitle.innerHTML = `${healthcare.country} - ${healthcare.title}`;
    
    modalBody.innerHTML = `
        <div class="healthcare-details">
            <div class="healthcare-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${healthcare.overview}</p>
            </div>
            
            <div class="healthcare-section">
                <h3><i class="fas fa-certificate"></i> Licensing Bodies</h3>
                <ul class="healthcare-list">
                    ${healthcare.licensingBodies.map(body => `<li>${body}</li>`).join('')}
                </ul>
            </div>
            
            <div class="healthcare-section">
                <h3><i class="fas fa-clipboard-check"></i> Exams Required</h3>
                <ul class="healthcare-list">
                    ${healthcare.examsRequired.map(exam => `<li>${exam}</li>`).join('')}
                </ul>
            </div>
            
            <div class="healthcare-section">
                <h3><i class="fas fa-language"></i> Language Level</h3>
                <p>${healthcare.languageLevel}</p>
            </div>
            
            <div class="healthcare-section">
                <h3><i class="fas fa-dollar-sign"></i> Salary Range</h3>
                <p>${healthcare.salary}</p>
            </div>
            
            <div class="healthcare-section">
                <h3><i class="fas fa-star"></i> PR Chance</h3>
                <p>${healthcare.prChance}</p>
            </div>
            
            <div class="healthcare-section">
                <h3><i class="fas fa-list-ol"></i> Process</h3>
                <ol class="healthcare-list">
                    ${healthcare.process.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="healthcare-section">
                <h3><i class="fas fa-file-alt"></i> Visa Options</h3>
                <ul class="healthcare-list">
                    ${healthcare.visaOptions.map(visa => `<li>${visa}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeHealthcareModal() {
    document.getElementById('healthcareModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// VISITOR VISAS SYSTEM
// ============================================

const VISITOR_INFO = {
    'canada': {
        name: 'Canada Visitor Visa',
        flag: '🇨🇦',
        overview: 'Temporary resident visa for tourism, business, or family visits to Canada.',
        eligibility: [
            'Valid passport',
            'Proof of ties to home country',
            'Sufficient funds for stay',
            'No criminal record',
            'Medical exam may be required',
            'Travel history (preferred)'
        ],
        documents: [
            'Valid passport',
            'Completed application forms',
            'Proof of financial support',
            'Travel itinerary',
            'Invitation letter (if visiting family)',
            'Proof of ties to home country',
            'Police clearance certificate'
        ],
        processingTime: '2-4 weeks (online), 4-6 weeks (paper)',
        visaValidity: 'Up to 10 years (multiple entry), stay up to 6 months per visit',
        cost: 'CAD $100 (single entry), CAD $500 (multiple entry)',
        rejectionReasons: [
            'Insufficient funds',
            'Weak ties to home country',
            'Incomplete documentation',
            'Previous immigration violations',
            'Security concerns'
        ],
        tips: [
            'Show strong ties to home country',
            'Provide detailed travel itinerary',
            'Include invitation letter if visiting family',
            'Show sufficient funds (CAD $1,000+ per week)'
        ]
    },
    'australia': {
        name: 'Australia Visitor Visa',
        flag: '🇦🇺',
        overview: 'Temporary visa for tourism, business, or visiting family in Australia.',
        eligibility: [
            'Genuine temporary entrant',
            'Sufficient funds for stay',
            'Health insurance recommended',
            'No criminal record',
            'Meet health requirements'
        ],
        documents: [
            'Valid passport',
            'Completed application form',
            'Proof of funds',
            'Travel itinerary',
            'Health insurance (recommended)',
            'Invitation letter (if applicable)'
        ],
        processingTime: '2-4 weeks',
        visaValidity: '3, 6, or 12 months (single or multiple entry)',
        cost: 'AUD $145 (tourist stream)',
        rejectionReasons: [
            'Not genuine temporary entrant',
            'Insufficient funds',
            'Health concerns',
            'Character issues'
        ],
        tips: [
            'Provide detailed GTE statement',
            'Show strong travel history',
            'Include health insurance',
            'Demonstrate sufficient funds'
        ]
    }
};

function showVisitorDetails(countryKey) {
    const visitor = VISITOR_INFO[countryKey] || {
        name: `${countryKey} Visitor Visa`,
        flag: '🌍',
        overview: 'Visitor visa requirements vary by country.',
        eligibility: ['Valid passport', 'Proof of funds', 'Return ticket'],
        documents: ['Passport', 'Application form', 'Financial proof'],
        processingTime: '2-4 weeks',
        visaValidity: 'Varies',
        cost: 'Varies',
        rejectionReasons: ['Insufficient documentation', 'Weak ties to home country'],
        tips: ['Provide complete documentation', 'Show strong ties to home country']
    };
    
    const modal = document.getElementById('visitorModal');
    const modalTitle = document.getElementById('visitorModalTitle');
    const modalBody = document.getElementById('visitorModalBody');
    
    modalTitle.innerHTML = `${visitor.flag} ${visitor.name}`;
    
    modalBody.innerHTML = `
        <div class="visitor-details">
            <div class="visitor-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${visitor.overview}</p>
            </div>
            
            <div class="visitor-section">
                <h3><i class="fas fa-check-circle"></i> Eligibility</h3>
                <ul class="visitor-list">
                    ${visitor.eligibility.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="visitor-section">
                <h3><i class="fas fa-file-alt"></i> Required Documents</h3>
                <ul class="visitor-list">
                    ${visitor.documents.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
            </div>
            
            <div class="visitor-section">
                <h3><i class="fas fa-clock"></i> Processing Time</h3>
                <p>${visitor.processingTime}</p>
            </div>
            
            <div class="visitor-section">
                <h3><i class="fas fa-calendar-check"></i> Visa Validity</h3>
                <p>${visitor.visaValidity}</p>
            </div>
            
            <div class="visitor-section">
                <h3><i class="fas fa-dollar-sign"></i> Cost</h3>
                <p>${visitor.cost}</p>
            </div>
            
            <div class="visitor-section">
                <h3><i class="fas fa-exclamation-triangle"></i> Common Rejection Reasons</h3>
                <ul class="visitor-list rejection">
                    ${visitor.rejectionReasons.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
            </div>
            
            <div class="visitor-section">
                <h3><i class="fas fa-lightbulb"></i> Tips for Success</h3>
                <ul class="visitor-list tips">
                    ${visitor.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeVisitorModal() {
    document.getElementById('visitorModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modals = ['pathwayModal', 'studyModal', 'healthcareModal', 'visitorModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
});

// Expose functions globally
window.showPathwayDetails = showPathwayDetails;
window.closePathwayModal = closePathwayModal;
window.showStudyDetails = showStudyDetails;
window.showCourseDetails = showCourseDetails;
window.closeStudyModal = closeStudyModal;
window.showHealthcareDetails = showHealthcareDetails;
window.closeHealthcareModal = closeHealthcareModal;
window.showVisitorDetails = showVisitorDetails;
window.closeVisitorModal = closeVisitorModal;

// ============================================
// NEWS & UPDATES SYSTEM
// ============================================

// Sample News Data (Replace with API call in production)
let NEWS_DATA = [
    {
        id: 1,
        title: 'Express Entry Draw #285: 3,200 Invitations Issued',
        summary: 'IRCC conducted a new Express Entry draw, issuing 3,200 invitations to apply (ITAs) with a minimum CRS score of 485.',
        country: 'Canada',
        category: 'Draw',
        source_name: 'CIC News',
        source_url: 'https://www.cicnews.com/',
        published_date: '2025-01-15',
        full_content: 'The latest Express Entry draw saw 3,200 candidates receive invitations. The minimum CRS score was 485, slightly lower than the previous draw. This draw included candidates from all Express Entry programs: Federal Skilled Worker, Canadian Experience Class, and Federal Skilled Trades.'
    },
    {
        id: 2,
        title: 'Australia Subclass 189 Invitation Round - January 2025',
        summary: 'Department of Home Affairs issued 2,500 invitations in the latest SkillSelect round for Subclass 189 visa.',
        country: 'Australia',
        category: 'Draw',
        source_name: 'Department of Home Affairs',
        source_url: 'https://immi.homeaffairs.gov.au/',
        published_date: '2025-01-14',
        full_content: 'The January 2025 invitation round for the Skilled Independent visa (Subclass 189) saw 2,500 invitations issued. The minimum points score was 65 points. Healthcare, IT, and Engineering occupations received the most invitations.'
    },
    {
        id: 3,
        title: 'IRCC Announces Faster Processing for Study Permits',
        summary: 'Immigration Canada introduces new processing standards aiming to process study permits within 4 weeks.',
        country: 'Canada',
        category: 'Processing Update',
        source_name: 'IRCC',
        source_url: 'https://www.canada.ca/en/immigration-refugees-citizenship/',
        published_date: '2025-01-13',
        full_content: 'IRCC has announced new processing standards for study permit applications. The department aims to process 80% of complete applications within 4 weeks. This improvement is part of IRCC\'s commitment to faster processing times across all immigration programs.'
    },
    {
        id: 4,
        title: 'Germany Opportunity Card Now Accepting Applications',
        summary: 'The new Germany Opportunity Card (Chancenkarte) program is now open for applications from skilled workers.',
        country: 'Germany',
        category: 'New Program',
        source_name: 'Make it in Germany',
        source_url: 'https://www.make-it-in-germany.com/',
        published_date: '2025-01-12',
        full_content: 'Germany has officially launched the Opportunity Card program, allowing skilled workers to come to Germany for up to one year to search for employment. The program requires a minimum of 6 points based on qualifications, experience, language skills, and age.'
    },
    {
        id: 5,
        title: 'UK Skilled Worker Visa Salary Thresholds Updated',
        summary: 'UK Home Office announces new salary thresholds for Skilled Worker visas effective April 2025.',
        country: 'UK',
        category: 'Policy Change',
        source_name: 'UK Home Office',
        source_url: 'https://www.gov.uk/',
        published_date: '2025-01-11',
        full_content: 'The UK Home Office has updated the salary thresholds for Skilled Worker visas. The general threshold will increase to £38,700 per year, while some occupations may have lower thresholds. This change affects all new applications submitted after April 2025.'
    },
    {
        id: 6,
        title: 'High Demand for Nurses in Canada - Fast-Track Options Available',
        summary: 'Canadian provinces announce fast-track immigration pathways for registered nurses due to critical shortages.',
        country: 'Canada',
        category: 'Policy Change',
        source_name: 'CIC News',
        source_url: 'https://www.cicnews.com/',
        published_date: '2025-01-10',
        full_content: 'Multiple Canadian provinces have announced fast-track immigration programs specifically for registered nurses. Ontario, British Columbia, and Nova Scotia are offering expedited processing and additional points for nurses in their Provincial Nominee Programs.'
    },
    {
        id: 7,
        title: 'Schengen Visa Processing Times Reduced',
        summary: 'EU announces improved processing times for Schengen visas, now averaging 10-15 days.',
        country: 'Europe',
        category: 'Processing Update',
        source_name: 'Schengen Visa Info',
        source_url: 'https://www.schengenvisainfo.com/',
        published_date: '2025-01-09',
        full_content: 'The European Union has announced improvements in Schengen visa processing times. Most applications are now processed within 10-15 days, down from the previous 15-30 day average. This improvement applies to all 26 Schengen member countries.'
    },
    {
        id: 8,
        title: 'Australia Increases Student Visa Financial Requirements',
        summary: 'Department of Home Affairs increases financial proof requirements for student visa applications.',
        country: 'Australia',
        category: 'Policy Change',
        source_name: 'Department of Home Affairs',
        source_url: 'https://immi.homeaffairs.gov.au/',
        published_date: '2025-01-08',
        full_content: 'Australia has increased the financial proof requirements for student visa applications. Applicants must now show AUD $24,505 per year of study, up from AUD $21,041. This change applies to all applications submitted after January 1, 2025.'
    },
    {
        id: 9,
        title: 'New Zealand Skilled Migrant Category Reopens',
        summary: 'New Zealand reopens the Skilled Migrant Category with new simplified points system.',
        country: 'New Zealand',
        category: 'New Program',
        source_name: 'Immigration New Zealand',
        source_url: 'https://www.immigration.govt.nz/',
        published_date: '2025-01-07',
        full_content: 'Immigration New Zealand has reopened the Skilled Migrant Category with a new simplified points system. The new system requires a minimum of 6 points based on qualifications, experience, and salary. Applications are now being accepted through the new online system.'
    },
    {
        id: 10,
        title: 'Global Immigration Trends 2025 Report Released',
        summary: 'Comprehensive report on global immigration trends, policy changes, and opportunities for 2025.',
        country: 'Global',
        category: 'Policy Change',
        source_name: 'Y-Axis Immigration',
        source_url: 'https://www.y-axis.com/',
        published_date: '2025-01-06',
        full_content: 'A comprehensive report on global immigration trends for 2025 has been released, covering policy changes, new programs, and opportunities across major destination countries. The report highlights increasing demand for skilled workers, especially in healthcare and technology sectors.'
    }
];

// Current filtered news
let filteredNews = [...NEWS_DATA];

// Load news from API (when backend is ready)
async function loadNewsFromAPI() {
    try {
        const response = await fetch('/api/news');
        if (response.ok) {
            const data = await response.json();
            NEWS_DATA = data;
            filteredNews = [...NEWS_DATA];
            displayNews();
            updateNewsStats();
        }
    } catch (error) {
        console.log('Using local news data:', error);
        // Fallback to local data
        filteredNews = [...NEWS_DATA];
        displayNews();
        updateNewsStats();
    }
}

// Display news feed
function displayNews() {
    const newsFeed = document.getElementById('newsFeed');
    if (!newsFeed) return;
    
    if (filteredNews.length === 0) {
        document.getElementById('noNewsResults').style.display = 'block';
        newsFeed.innerHTML = '';
        return;
    }
    
    document.getElementById('noNewsResults').style.display = 'none';
    
    newsFeed.innerHTML = filteredNews.map(news => {
        const date = new Date(news.published_date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const countryFlag = {
            'Canada': '🇨🇦',
            'Australia': '🇦🇺',
            'UK': '🇬🇧',
            'Germany': '🇩🇪',
            'Europe': '🇪🇺',
            'New Zealand': '🇳🇿',
            'Global': '🌍'
        }[news.country] || '🌍';
        
        const categoryIcon = {
            'Draw': '🎯',
            'Policy Change': '📋',
            'New Program': '🆕',
            'Processing Update': '⚡',
            'Study Visa': '🎓',
            'Work Visa': '💼'
        }[news.category] || '📰';
        
        return `
            <div class="news-item" onclick="showNewsDetail(${news.id})">
                <div class="news-item-header">
                    <div class="news-badges">
                        <span class="news-country-badge">${countryFlag} ${news.country}</span>
                        <span class="news-category-badge">${categoryIcon} ${news.category}</span>
                    </div>
                    <span class="news-date">${formattedDate}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-summary">${news.summary}</p>
                <div class="news-footer">
                    <span class="news-source"><i class="fas fa-external-link-alt"></i> ${news.source_name}</span>
                    <button class="btn-read-more">Read More <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

// Filter news
function filterNews() {
    const countryFilter = document.getElementById('newsCountryFilter').value;
    const categoryFilter = document.getElementById('newsCategoryFilter').value;
    const searchTerm = document.getElementById('newsSearch').value.toLowerCase();
    
    filteredNews = NEWS_DATA.filter(news => {
        const matchCountry = countryFilter === 'all' || news.country === countryFilter;
        const matchCategory = categoryFilter === 'all' || news.category === categoryFilter;
        const matchSearch = searchTerm === '' || 
            news.title.toLowerCase().includes(searchTerm) ||
            news.summary.toLowerCase().includes(searchTerm) ||
            news.country.toLowerCase().includes(searchTerm);
        
        return matchCountry && matchCategory && matchSearch;
    });
    
    displayNews();
    updateNewsStats();
}

// Update news statistics
function updateNewsStats() {
    document.getElementById('totalNewsCount').textContent = NEWS_DATA.length;
    document.getElementById('filteredNewsCount').textContent = filteredNews.length;
    
    if (NEWS_DATA.length > 0) {
        const latestDate = new Date(Math.max(...NEWS_DATA.map(n => new Date(n.published_date))));
        document.getElementById('lastUpdated').textContent = latestDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Show news detail
function showNewsDetail(newsId) {
    const news = NEWS_DATA.find(n => n.id === newsId);
    if (!news) return;
    
    const modal = document.getElementById('newsModal');
    const modalTitle = document.getElementById('newsModalTitle');
    const modalBody = document.getElementById('newsModalBody');
    
    const date = new Date(news.published_date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const countryFlag = {
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'UK': '🇬🇧',
        'Germany': '🇩🇪',
        'Europe': '🇪🇺',
        'New Zealand': '🇳🇿',
        'Global': '🌍'
    }[news.country] || '🌍';
    
    modalTitle.innerHTML = `${countryFlag} ${news.title}`;
    
    modalBody.innerHTML = `
        <div class="news-detail">
            <div class="news-detail-header">
                <div class="news-detail-badges">
                    <span class="news-country-badge">${countryFlag} ${news.country}</span>
                    <span class="news-category-badge">${news.category}</span>
                </div>
                <div class="news-detail-meta">
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-newspaper"></i> ${news.source_name}</span>
                </div>
            </div>
            
            <div class="news-detail-content">
                <p class="news-detail-summary">${news.summary}</p>
                <div class="news-detail-full">
                    <p>${news.full_content || news.summary}</p>
                </div>
            </div>
            
            <div class="news-detail-footer">
                <a href="${news.source_url}" target="_blank" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Read Full Article at ${news.source_name}
                </a>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close news modal
function closeNewsModal() {
    document.getElementById('newsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Refresh news
function refreshNews() {
    const loading = document.getElementById('newsLoading');
    loading.style.display = 'flex';
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        loadNewsFromAPI();
        loading.style.display = 'none';
    }, 1000);
}

// Initialize news on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load news when news section is shown
    const newsSection = document.getElementById('news');
    if (newsSection) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (newsSection.classList.contains('active')) {
                    displayNews();
                    updateNewsStats();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(newsSection, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Also check immediately
        if (newsSection.classList.contains('active')) {
            displayNews();
            updateNewsStats();
        }
    }
    
    // Close modal when clicking outside
    const newsModal = document.getElementById('newsModal');
    if (newsModal) {
        newsModal.addEventListener('click', function(e) {
            if (e.target === newsModal) {
                closeNewsModal();
            }
        });
    }
});

// Expose functions globally
window.filterNews = filterNews;
window.refreshNews = refreshNews;
window.showNewsDetail = showNewsDetail;
window.closeNewsModal = closeNewsModal;

// ============================================
// WORK & SETTLE SYSTEM
// ============================================

const WORK_SETTLE_INFO = {
    'skilled-jobs': {
        title: 'Skilled Jobs',
        icon: '💼',
        overview: 'Professional and technical positions requiring specialized education, training, or experience.',
        jobTypes: [
            'IT & Software Development',
            'Engineering (Mechanical, Civil, Electrical)',
            'Healthcare Professionals (Doctors, Nurses)',
            'Finance & Accounting',
            'Management & Business',
            'Education & Teaching',
            'Legal Professionals',
            'Architecture & Design'
        ],
        requirements: [
            'Relevant degree or professional qualification',
            'Work experience in the field (typically 2+ years)',
            'Language proficiency (IELTS 6.0-7.0+)',
            'Professional licensing (if required)',
            'Job offer from employer (in most cases)'
        ],
        countries: [
            'Canada - Express Entry, PNP',
            'Australia - Subclass 189/190/491',
            'UK - Skilled Worker Visa',
            'Germany - EU Blue Card',
            'New Zealand - Skilled Migrant Category'
        ],
        salaryRange: 'Varies by country and profession - typically $50,000-$150,000+',
        prPathway: 'Most skilled jobs offer pathways to permanent residence',
        processingTime: '3-12 months depending on country and program'
    },
    'unskilled-jobs': {
        title: 'Unskilled / Semi-Skilled Jobs',
        icon: '👷',
        overview: 'Entry-level positions and manual labor jobs that don\'t require specialized education or extensive training.',
        jobTypes: [
            'Warehouse & Logistics',
            'Construction Labor',
            'Hospitality & Service',
            'Manufacturing',
            'Agriculture & Farming',
            'Cleaning & Maintenance',
            'Retail & Sales',
            'Food Service'
        ],
        requirements: [
            'Basic education (high school or equivalent)',
            'Physical fitness (for manual labor)',
            'Basic language skills (varies by country)',
            'Job offer from employer',
            'Work permit sponsorship'
        ],
        countries: [
            'Poland - Work permits available',
            'Slovakia - Warehouse and logistics',
            'Latvia - 5-year unskilled permits',
            'Romania - EU work opportunities',
            'Croatia - Seasonal and permanent work'
        ],
        salaryRange: '€800-1,500/month (varies by country and job)',
        prPathway: 'Some countries offer PR pathways after several years of work',
        processingTime: '2-6 months'
    },
    'blue-collar': {
        title: 'Blue-Collar Roles',
        icon: '🔧',
        overview: 'Skilled trades and manual labor positions requiring technical skills and training.',
        jobTypes: [
            'Electricians',
            'Plumbers',
            'Carpenters',
            'Welders',
            'Mechanics',
            'Construction Workers',
            'HVAC Technicians',
            'Heavy Equipment Operators'
        ],
        requirements: [
            'Trade certification or apprenticeship',
            'Relevant work experience',
            'Language proficiency (basic to intermediate)',
            'Job offer from employer',
            'Trade recognition (in some countries)'
        ],
        countries: [
            'Canada - Federal Skilled Trades Program',
            'Australia - Trades Recognition',
            'Germany - Skilled Worker Visa',
            'UK - Skilled Worker Visa',
            'Poland - Work permits for trades'
        ],
        salaryRange: '$40,000-$80,000/year (varies by trade and country)',
        prPathway: 'Many countries have fast-track options for skilled trades',
        processingTime: '3-8 months'
    },
    'shortage-occupations': {
        title: 'Shortage Occupations',
        icon: '⚡',
        overview: 'High-demand occupations with critical shortages, often offering fast-track immigration options.',
        jobTypes: [
            'Nurses & Healthcare Workers',
            'IT Professionals',
            'Engineers',
            'Teachers',
            'Truck Drivers',
            'Chefs & Cooks',
            'Construction Managers',
            'Social Workers'
        ],
        requirements: [
            'Relevant qualifications',
            'Work experience',
            'Language proficiency',
            'Job offer (often required)',
            'Fast-track processing available'
        ],
        countries: [
            'Canada - Provincial Nominee Programs',
            'Australia - Priority processing',
            'UK - Shortage Occupation List',
            'Germany - Opportunity Card',
            'New Zealand - Immediate Skill Shortage List'
        ],
        salaryRange: 'Competitive salaries with benefits',
        prPathway: 'Fast-track to permanent residence in most countries',
        processingTime: '2-6 months (faster than standard processing)'
    },
    'poland': {
        title: 'Work & Settle in Poland',
        country: '🇵🇱 Poland',
        overview: 'Poland offers excellent work opportunities for both skilled and unskilled workers, with pathways to EU permanent residence.',
        jobTypes: [
            'IT & Software Development',
            'Manufacturing & Production',
            'Construction',
            'Logistics & Warehouse',
            'Hospitality & Tourism',
            'Healthcare',
            'Engineering'
        ],
        workPermit: {
            requirements: [
                'Job offer from Polish employer',
                'Work permit application by employer',
                'Valid passport',
                'Medical certificate',
                'Criminal record check'
            ],
            processingTime: '2-4 months',
            validity: 'Up to 3 years, renewable',
            cost: 'PLN 100-200'
        },
        settlement: {
            accommodation: 'Average rent: PLN 2,000-4,000/month',
            costOfLiving: 'PLN 3,000-5,000/month',
            healthcare: 'Public healthcare available after work permit',
            prPathway: 'After 5 years of legal residence, can apply for permanent residence',
            citizenship: 'After 8 years of legal residence'
        },
        salaryRange: 'PLN 4,000-12,000/month (varies by job)',
        benefits: [
            'EU work authorization',
            'Family can join',
            'Pathway to EU permanent residence',
            'Access to EU countries',
            'Good work-life balance'
        ]
    },
    'slovakia': {
        title: 'Slovakia Warehouse Jobs',
        country: '🇸🇰 Slovakia',
        overview: 'Slovakia has a growing logistics sector with many warehouse and distribution center opportunities.',
        jobTypes: [
            'Warehouse Operative',
            'Forklift Operator',
            'Logistics Coordinator',
            'Packaging Worker',
            'Quality Control',
            'Inventory Management'
        ],
        workPermit: {
            requirements: [
                'Job offer from Slovak employer',
                'Work permit application',
                'Valid passport',
                'Medical examination',
                'Criminal record certificate'
            ],
            processingTime: '1-3 months',
            validity: '1-3 years, renewable',
            cost: '€135'
        },
        settlement: {
            accommodation: 'Average rent: €300-600/month',
            costOfLiving: '€600-1,000/month',
            healthcare: 'Public healthcare after work permit',
            prPathway: 'After 5 years, can apply for permanent residence',
            citizenship: 'After 8 years'
        },
        salaryRange: '€800-1,200/month (warehouse jobs)',
        benefits: [
            'EU member country',
            'Lower cost of living',
            'Good transportation',
            'Family reunification possible',
            'Pathway to EU residence'
        ]
    },
    'albania': {
        title: 'Albania Work Permit',
        country: '🇦🇱 Albania',
        overview: 'Albania offers work opportunities with relatively straightforward work permit processes.',
        jobTypes: [
            'Construction',
            'Tourism & Hospitality',
            'IT & Technology',
            'Manufacturing',
            'Agriculture',
            'Education'
        ],
        workPermit: {
            requirements: [
                'Job offer from Albanian employer',
                'Work permit application',
                'Valid passport',
                'Medical certificate',
                'Police clearance'
            ],
            processingTime: '1-2 months',
            validity: '1 year, renewable',
            cost: 'ALL 5,000-10,000'
        },
        settlement: {
            accommodation: 'Average rent: €200-400/month',
            costOfLiving: '€400-700/month',
            healthcare: 'Public healthcare available',
            prPathway: 'After 5 years of legal residence',
            citizenship: 'After 7 years'
        },
        salaryRange: '€400-800/month (varies by job)',
        benefits: [
            'Lower cost of living',
            'Beautiful country',
            'Growing economy',
            'EU candidate country',
            'Relatively easy process'
        ]
    },
    'romania': {
        title: 'Romania Work Permit',
        country: '🇷🇴 Romania',
        overview: 'Romania, as an EU member, offers work opportunities with access to the European market.',
        jobTypes: [
            'IT & Software',
            'Manufacturing',
            'Construction',
            'Agriculture',
            'Tourism',
            'Call Centers'
        ],
        workPermit: {
            requirements: [
                'Job offer from Romanian employer',
                'Work permit application',
                'Valid passport',
                'Medical certificate',
                'Criminal record check'
            ],
            processingTime: '2-3 months',
            validity: '1-2 years, renewable',
            cost: 'RON 200-500'
        },
        settlement: {
            accommodation: 'Average rent: €250-500/month',
            costOfLiving: '€500-900/month',
            healthcare: 'Public healthcare after work permit',
            prPathway: 'After 5 years, EU permanent residence',
            citizenship: 'After 8 years'
        },
        salaryRange: '€500-1,200/month',
        benefits: [
            'EU member country',
            'Low cost of living',
            'Growing IT sector',
            'EU work rights',
            'Family can join'
        ]
    },
    'croatia': {
        title: 'Croatia Work Permit',
        country: '🇭🇷 Croatia',
        overview: 'Croatia offers work opportunities in tourism, construction, and growing tech sectors.',
        jobTypes: [
            'Tourism & Hospitality',
            'Construction',
            'IT & Technology',
            'Maritime & Shipping',
            'Agriculture',
            'Healthcare'
        ],
        workPermit: {
            requirements: [
                'Job offer from Croatian employer',
                'Work permit application',
                'Valid passport',
                'Medical examination',
                'Criminal record certificate'
            ],
            processingTime: '1-3 months',
            validity: '1-2 years, renewable',
            cost: 'HRK 200-500'
        },
        settlement: {
            accommodation: 'Average rent: €300-600/month',
            costOfLiving: '€600-1,000/month',
            healthcare: 'Public healthcare available',
            prPathway: 'After 5 years, EU permanent residence',
            citizenship: 'After 8 years'
        },
        salaryRange: '€700-1,500/month',
        benefits: [
            'EU member country',
            'Beautiful coastline',
            'Growing economy',
            'Tourism opportunities',
            'EU work authorization'
        ]
    },
    'malta': {
        title: 'Malta Work Permits',
        country: '🇲🇹 Malta',
        overview: 'Malta offers work opportunities in tourism, gaming, finance, and healthcare sectors.',
        jobTypes: [
            'Gaming & iGaming',
            'Finance & Banking',
            'Tourism & Hospitality',
            'Healthcare',
            'IT & Technology',
            'Construction'
        ],
        workPermit: {
            requirements: [
                'Job offer from Maltese employer',
                'Work permit application',
                'Valid passport',
                'Medical certificate',
                'Police clearance'
            ],
            processingTime: '2-4 months',
            validity: '1-3 years, renewable',
            cost: '€280'
        },
        settlement: {
            accommodation: 'Average rent: €600-1,200/month',
            costOfLiving: '€1,000-1,500/month',
            healthcare: 'Public healthcare after work permit',
            prPathway: 'After 5 years, EU permanent residence',
            citizenship: 'After 7 years (investment option available)'
        },
        salaryRange: '€1,200-2,500/month',
        benefits: [
            'EU member country',
            'English-speaking',
            'Strong gaming industry',
            'Good weather',
            'EU work rights'
        ]
    },
    'latvia': {
        title: 'Latvia 5-Year Unskilled Permit',
        country: '🇱🇻 Latvia',
        overview: 'Latvia offers 5-year work permits for unskilled workers, providing long-term stability.',
        jobTypes: [
            'Construction',
            'Manufacturing',
            'Agriculture',
            'Warehouse & Logistics',
            'Hospitality',
            'Cleaning & Maintenance'
        ],
        workPermit: {
            requirements: [
                'Job offer from Latvian employer',
                'Work permit application',
                'Valid passport',
                'Medical certificate',
                'Criminal record check'
            ],
            processingTime: '1-2 months',
            validity: '5 years (unskilled permit)',
            cost: '€50-100'
        },
        settlement: {
            accommodation: 'Average rent: €300-600/month',
            costOfLiving: '€600-1,000/month',
            healthcare: 'Public healthcare after work permit',
            prPathway: 'After 5 years of legal residence',
            citizenship: 'After 10 years'
        },
        salaryRange: '€700-1,200/month',
        benefits: [
            '5-year permit (long-term stability)',
            'EU member country',
            'Low cost of living',
            'Family can join',
            'Pathway to EU residence'
        ],
        specialNote: 'The 5-year unskilled permit is unique to Latvia and provides excellent long-term work authorization.'
    },
    'netherlands': {
        title: 'Amsterdam Internship & Work',
        country: '🇳🇱 Netherlands',
        overview: 'The Netherlands, especially Amsterdam, offers internship and work opportunities in various sectors.',
        jobTypes: [
            'IT & Technology',
            'Finance & Banking',
            'Marketing & Advertising',
            'Hospitality & Tourism',
            'Engineering',
            'Healthcare',
            'Internships (various fields)'
        ],
        workPermit: {
            requirements: [
                'Job offer or internship from Dutch employer',
                'Work permit application (employer applies)',
                'Valid passport',
                'Health insurance',
                'For internships: enrollment in education or recent graduation'
            ],
            processingTime: '2-4 weeks (fast-track available)',
            validity: '1-3 years, renewable',
            cost: '€300-600'
        },
        settlement: {
            accommodation: 'Average rent: €800-1,500/month (Amsterdam higher)',
            costOfLiving: '€1,200-2,000/month',
            healthcare: 'Mandatory health insurance (€100-150/month)',
            prPathway: 'After 5 years, can apply for permanent residence',
            citizenship: 'After 5 years (with integration exam)'
        },
        salaryRange: '€1,500-3,500/month (varies by job)',
        benefits: [
            'EU member country',
            'English widely spoken',
            'Excellent work-life balance',
            'Strong economy',
            'Beautiful cities',
            'Internship opportunities for students'
        ],
        specialNote: 'Amsterdam is particularly popular for internships in tech, finance, and creative industries.'
    }
};

// Show Work & Settle details
function showWorkSettleDetails(key) {
    const info = WORK_SETTLE_INFO[key];
    if (!info) {
        console.error('Work & Settle info not found:', key);
        return;
    }
    
    const modal = document.getElementById('workSettleModal');
    const modalTitle = document.getElementById('workSettleModalTitle');
    const modalBody = document.getElementById('workSettleModalBody');
    
    modalTitle.innerHTML = `${info.icon || ''} ${info.title}${info.country ? ' - ' + info.country : ''}`;
    
    let html = `
        <div class="work-settle-details">
            <div class="work-settle-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${info.overview}</p>
            </div>
    `;
    
    if (info.jobTypes) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-briefcase"></i> Job Types</h3>
                <ul class="work-settle-list">
                    ${info.jobTypes.map(job => `<li>${job}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (info.requirements) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-list-check"></i> Requirements</h3>
                <ul class="work-settle-list">
                    ${info.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (info.countries) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-globe"></i> Available Countries</h3>
                <ul class="work-settle-list">
                    ${info.countries.map(country => `<li>${country}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (info.workPermit) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-file-alt"></i> Work Permit Details</h3>
                <div class="work-permit-info">
                    <h4>Requirements:</h4>
                    <ul class="work-settle-list">
                        ${info.workPermit.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                    <div class="work-permit-details-grid">
                        <div class="work-permit-item">
                            <strong>Processing Time:</strong> ${info.workPermit.processingTime}
                        </div>
                        <div class="work-permit-item">
                            <strong>Validity:</strong> ${info.workPermit.validity}
                        </div>
                        <div class="work-permit-item">
                            <strong>Cost:</strong> ${info.workPermit.cost}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (info.settlement) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-home"></i> Settlement Information</h3>
                <div class="settlement-details">
                    <div class="settlement-item">
                        <strong>Accommodation:</strong> ${info.settlement.accommodation}
                    </div>
                    <div class="settlement-item">
                        <strong>Cost of Living:</strong> ${info.settlement.costOfLiving}
                    </div>
                    <div class="settlement-item">
                        <strong>Healthcare:</strong> ${info.settlement.healthcare}
                    </div>
                    <div class="settlement-item">
                        <strong>PR Pathway:</strong> ${info.settlement.prPathway}
                    </div>
                    <div class="settlement-item">
                        <strong>Citizenship:</strong> ${info.settlement.citizenship}
                    </div>
                </div>
            </div>
        `;
    }
    
    if (info.salaryRange) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-dollar-sign"></i> Salary Range</h3>
                <p>${info.salaryRange}</p>
            </div>
        `;
    }
    
    if (info.benefits) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-star"></i> Benefits</h3>
                <ul class="work-settle-list benefits">
                    ${info.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (info.prPathway) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-flag"></i> PR Pathway</h3>
                <p>${info.prPathway}</p>
            </div>
        `;
    }
    
    if (info.processingTime) {
        html += `
            <div class="work-settle-section">
                <h3><i class="fas fa-clock"></i> Processing Time</h3>
                <p>${info.processingTime}</p>
            </div>
        `;
    }
    
    if (info.specialNote) {
        html += `
            <div class="work-settle-section special-note">
                <h3><i class="fas fa-lightbulb"></i> Special Note</h3>
                <p>${info.specialNote}</p>
            </div>
        `;
    }
    
    html += `</div>`;
    
    modalBody.innerHTML = html;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Work & Settle modal
function closeWorkSettleModal() {
    document.getElementById('workSettleModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('workSettleModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeWorkSettleModal();
            }
        });
    }
});

// Expose functions globally
window.showWorkSettleDetails = showWorkSettleDetails;
window.closeWorkSettleModal = closeWorkSettleModal;

// ============================================
// MISTAKES & REJECTIONS SYSTEM
// ============================================

const MISTAKES_INFO = {
    'common-rejections': {
        title: 'Common Visa Rejection Reasons',
        icon: '❌',
        overview: 'Understanding the most common reasons for visa rejections helps you avoid these mistakes and improve your chances of approval.',
        topReasons: [
            {
                reason: 'Insufficient Financial Proof',
                description: 'Not showing enough funds to support yourself during your stay',
                percentage: '35%',
                howToAvoid: 'Show 3-6 months of bank statements with sufficient balance, include all income sources, and provide clear documentation'
            },
            {
                reason: 'Weak Ties to Home Country',
                description: 'Immigration officer believes you won\'t return home after your visa expires',
                percentage: '28%',
                howToAvoid: 'Show employment letter, property ownership, family ties, business ownership, or other strong connections to home country'
            },
            {
                reason: 'Incomplete or Inaccurate Documentation',
                description: 'Missing documents, incorrect information, or poorly prepared files',
                percentage: '22%',
                howToAvoid: 'Double-check all documents, ensure translations are certified, verify all dates and information are accurate'
            },
            {
                reason: 'Insufficient Language Proficiency',
                description: 'Language test scores below minimum requirements',
                percentage: '18%',
                howToAvoid: 'Prepare thoroughly for IELTS/PTE, take practice tests, consider language courses if needed'
            },
            {
                reason: 'Previous Immigration Violations',
                description: 'History of overstaying, working illegally, or other violations',
                percentage: '15%',
                howToAvoid: 'Always comply with visa conditions, maintain valid status, and disclose any previous issues honestly'
            },
            {
                reason: 'Inconsistent Information',
                description: 'Information in application doesn\'t match supporting documents',
                percentage: '12%',
                howToAvoid: 'Ensure all dates, names, and details are consistent across all documents and forms'
            },
            {
                reason: 'Health or Character Issues',
                description: 'Medical conditions or criminal record concerns',
                percentage: '10%',
                howToAvoid: 'Complete medical exams early, disclose all health conditions, provide character certificates, and explain any criminal history'
            },
            {
                reason: 'Genuine Temporary Entrant (GTE) Concerns',
                description: 'For student visas: doubts about genuine intention to study',
                percentage: '25%',
                howToAvoid: 'Write a strong Statement of Purpose, show clear career goals, explain why you chose the specific course and country'
            }
        ],
        preventionTips: [
            'Always provide complete and accurate information',
            'Show strong financial capacity with clear documentation',
            'Demonstrate strong ties to your home country',
            'Meet all language requirements before applying',
            'Prepare a compelling Statement of Purpose (if required)',
            'Get professional help if unsure about any aspect',
            'Apply well in advance to avoid rushing'
        ]
    },
    'country-mistakes': {
        title: 'Country-Wise Rejection Mistakes',
        icon: '🌍',
        overview: 'Each country has specific requirements and common mistakes. Learn what to avoid for your target destination.',
        countries: [
            {
                country: 'Canada',
                commonMistakes: [
                    'Not meeting minimum CRS score requirements',
                    'Incomplete Express Entry profile',
                    'Missing Educational Credential Assessment (ECA)',
                    'Insufficient proof of funds (not showing 6 months history)',
                    'Job offer not supported by LMIA',
                    'Police clearance from wrong countries',
                    'Medical exam not completed by panel physician'
                ],
                specificTips: [
                    'Ensure your CRS score is competitive before creating profile',
                    'Complete ECA before entering Express Entry pool',
                    'Show proof of funds for all family members',
                    'Get police clearance from ALL countries lived 6+ months since age 18',
                    'Use only IRCC-approved panel physicians for medical exam'
                ]
            },
            {
                country: 'Australia',
                commonMistakes: [
                    'Not meeting minimum 65 points requirement',
                    'Skills assessment not completed or expired',
                    'State nomination not properly documented',
                    'IELTS scores below minimum (especially for skilled migration)',
                    'GTE statement not convincing for student visas',
                    'Insufficient work experience documentation',
                    'Age over 45 for skilled migration'
                ],
                specificTips: [
                    'Calculate your points accurately before applying',
                    'Complete skills assessment early (valid for 3 years)',
                    'For student visas, write a detailed GTE statement',
                    'Ensure IELTS scores meet minimum requirements (6.0+ for most)',
                    'Provide detailed employment reference letters with duties',
                    'Check age requirements before applying'
                ]
            },
            {
                country: 'United Kingdom',
                commonMistakes: [
                    'Job offer from non-licensed sponsor',
                    'Salary below minimum threshold',
                    'Insufficient maintenance funds',
                    'Tuberculosis (TB) test not completed (if required)',
                    'Previous UK visa refusals not disclosed',
                    'Incorrect visa category selected'
                ],
                specificTips: [
                    'Verify employer has valid sponsor license',
                    'Ensure salary meets minimum threshold for your occupation',
                    'Show maintenance funds for 28 days minimum',
                    'Complete TB test if from required countries',
                    'Always disclose previous UK visa history',
                    'Select correct visa category based on your purpose'
                ]
            },
            {
                country: 'Germany',
                commonMistakes: [
                    'Degree not recognized in Germany',
                    'Salary below Blue Card threshold (€58,400)',
                    'Insufficient German language proof',
                    'Job offer not matching qualifications',
                    'Health insurance not arranged',
                    'Incomplete application in German'
                ],
                specificTips: [
                    'Get degree recognition (Anabin) before applying',
                    'Ensure salary meets Blue Card requirements',
                    'Provide appropriate language certificates (A2-B2)',
                    'Match job description with your qualifications',
                    'Arrange health insurance before arrival',
                    'Consider professional translation of documents'
                ]
            },
            {
                country: 'United States',
                commonMistakes: [
                    'Insufficient ties to home country (for visitor visas)',
                    'Previous visa overstay not disclosed',
                    'DS-160 form errors or inconsistencies',
                    'Insufficient interview preparation',
                    'Missing required documents for interview',
                    'Not explaining purpose of visit clearly'
                ],
                specificTips: [
                    'Show strong ties to home country for B1/B2 visas',
                    'Always disclose previous US visa history',
                    'Fill DS-160 form carefully and accurately',
                    'Prepare thoroughly for visa interview',
                    'Bring all required documents to interview',
                    'Be clear and honest about your travel purpose'
                ]
            }
        ]
    },
    'ielts-mistakes': {
        title: 'IELTS Mistakes That Lead to Rejection',
        icon: '📝',
        overview: 'IELTS is crucial for most immigration programs. Common mistakes can lead to visa rejection even if you have the required score.',
        commonMistakes: [
            {
                mistake: 'Test Results Expired',
                description: 'IELTS results are only valid for 2 years. Using expired results leads to automatic rejection.',
                impact: 'High - Application will be rejected',
                solution: 'Check validity before applying. Retake test if expired. Plan your application timeline accordingly.'
            },
            {
                mistake: 'Not Meeting Individual Band Requirements',
                description: 'Some programs require minimum scores in each band (Listening, Reading, Writing, Speaking), not just overall score.',
                impact: 'High - Application will be rejected',
                solution: 'Check specific band requirements for your program. Practice all four skills equally.'
            },
            {
                mistake: 'Wrong Test Type',
                description: 'Using Academic IELTS when General Training is required, or vice versa.',
                impact: 'High - Application will be rejected',
                solution: 'Verify which test type your program requires. Most immigration programs need General Training.'
            },
            {
                mistake: 'Score Below Minimum Requirement',
                description: 'IELTS score below the minimum required for your visa category.',
                impact: 'High - Application will be rejected',
                solution: 'Retake IELTS to improve scores. Consider IELTS preparation courses. Allow time for multiple attempts.'
            },
            {
                mistake: 'Not Providing Original Test Report Form (TRF)',
                description: 'Submitting copies or screenshots instead of original TRF.',
                impact: 'Medium - May cause delays or rejection',
                solution: 'Always submit original TRF. Request additional copies from British Council/IDP if needed.'
            },
            {
                mistake: 'Test Center Not Recognized',
                description: 'Taking IELTS from a center not recognized by the immigration authority.',
                impact: 'High - Results may not be accepted',
                solution: 'Take IELTS only from authorized centers (British Council, IDP, or Cambridge).'
            },
            {
                mistake: 'Mismatched Test Dates',
                description: 'Test dates don\'t align with application timeline or work experience dates.',
                impact: 'Medium - May raise questions',
                solution: 'Ensure test dates are within validity period and align with your application timeline.'
            }
        ],
        preparationTips: [
            'Start preparing 3-6 months before your test date',
            'Take practice tests regularly to identify weak areas',
            'Focus on all four skills (Listening, Reading, Writing, Speaking)',
            'Consider professional IELTS coaching if needed',
            'Take the test well before your visa application deadline',
            'Keep original TRF safe and request additional copies',
            'Verify test center is authorized before booking'
        ],
        scoreRequirements: {
            'Canada FSW': 'CLB 7 (IELTS 6.0 in all bands)',
            'Canada CEC': 'CLB 7 for NOC 0/A, CLB 5 for NOC B',
            'Australia Skilled Migration': 'IELTS 6.0 minimum (7.0+ for more points)',
            'UK Skilled Worker': 'IELTS B1 (4.0+)',
            'New Zealand SMC': 'IELTS 6.5 overall'
        }
    },
    'document-errors': {
        title: 'Document Errors That Cause Rejections',
        icon: '📄',
        overview: 'Documentation errors are one of the most common reasons for visa rejection. Learn what to avoid.',
        commonErrors: [
            {
                error: 'Missing Required Documents',
                description: 'Not submitting all documents listed in the checklist',
                impact: 'High - Application may be rejected or returned',
                examples: [
                    'Missing police clearance certificate',
                    'No proof of funds',
                    'Missing educational certificates',
                    'No employment reference letters',
                    'Missing medical exam results'
                ],
                solution: 'Use official document checklist. Double-check before submission. Get professional review if unsure.'
            },
            {
                error: 'Incorrect Translations',
                description: 'Documents not translated by certified translators or translations not accurate',
                impact: 'High - Documents may not be accepted',
                examples: [
                    'Using Google Translate',
                    'Not getting certified translations',
                    'Missing translator credentials',
                    'Incomplete translations'
                ],
                solution: 'Use only certified translators. Include translator credentials. Get translations stamped and signed.'
            },
            {
                error: 'Expired Documents',
                description: 'Submitting documents that have expired (passports, medical exams, police clearances)',
                impact: 'High - Application will be rejected',
                examples: [
                    'Passport expiring within 6 months',
                    'Medical exam older than 12 months',
                    'Police clearance older than 6 months',
                    'IELTS results older than 2 years'
                ],
                solution: 'Check validity of all documents. Renew passports early. Get fresh medical exams and police clearances.'
            },
            {
                error: 'Inconsistent Information',
                description: 'Information in different documents doesn\'t match',
                impact: 'High - Raises suspicion and may lead to rejection',
                examples: [
                    'Different dates in different documents',
                    'Name spelling variations',
                    'Address inconsistencies',
                    'Employment dates mismatch'
                ],
                solution: 'Ensure all documents have consistent information. Use same name format everywhere. Verify all dates match.'
            },
            {
                error: 'Poor Quality Documents',
                description: 'Blurry, unclear, or incomplete document scans',
                impact: 'Medium - May cause delays or rejection',
                examples: [
                    'Low resolution scans',
                    'Cut-off text or signatures',
                    'Watermarks covering important information',
                    'Illegible text'
                ],
                solution: 'Scan documents at high resolution (300 DPI). Ensure all text is visible. Check file sizes meet requirements.'
            },
            {
                error: 'Incorrect Document Format',
                description: 'Documents not in required format (PDF, JPG, etc.) or wrong file size',
                impact: 'Medium - May cause technical issues',
                examples: [
                    'Submitting Word documents instead of PDF',
                    'File sizes too large',
                    'Wrong file naming convention',
                    'Multiple pages in single file when separate required'
                ],
                solution: 'Follow exact format requirements. Check file size limits. Use proper naming conventions.'
            },
            {
                error: 'Missing Notarization or Certification',
                description: 'Documents requiring notarization submitted without it',
                impact: 'High - Documents may not be accepted',
                examples: [
                    'Educational certificates not attested',
                    'Employment letters not on company letterhead',
                    'Bank statements not stamped',
                    'Affidavits not notarized'
                ],
                solution: 'Check which documents need notarization. Get proper attestation. Use official letterheads.'
            }
        ],
        bestPractices: [
            'Create a checklist of all required documents',
            'Start collecting documents 3-6 months before applying',
            'Get certified translations for all non-English documents',
            'Ensure all documents are recent and valid',
            'Double-check all information for consistency',
            'Scan documents at high quality',
            'Organize documents as per requirements',
            'Get professional review before submission'
        ]
    },
    'fake-consultants': {
        title: 'Fake Consultant Warnings',
        icon: '⚠️',
        overview: 'Protect yourself from fraudulent immigration consultants. Learn how to identify legitimate services.',
        redFlags: [
            {
                flag: 'Guaranteed Visa Approval',
                description: 'No legitimate consultant can guarantee visa approval. Immigration decisions are made by government authorities.',
                why: 'Immigration outcomes depend on individual circumstances and government policies, not consultant promises.'
            },
            {
                flag: 'Upfront Full Payment Required',
                description: 'Legitimate consultants typically work on a fee structure with payments at different stages.',
                why: 'Reputable consultants charge for services rendered, not all upfront. Be wary of demands for full payment before work begins.'
            },
            {
                flag: 'No Registration or License',
                description: 'Consultant cannot provide registration number or license from regulatory body.',
                why: 'All legitimate immigration consultants must be registered with regulatory bodies (RCIC in Canada, MARA in Australia, etc.).'
            },
            {
                flag: 'Pressure to Act Quickly',
                description: 'Creating false urgency or deadlines that don\'t exist.',
                why: 'Legitimate consultants provide realistic timelines. Fake ones create urgency to prevent you from researching or thinking.'
            },
            {
                flag: 'Asking for Money to be Sent to Personal Accounts',
                description: 'Requesting payments to personal bank accounts instead of business accounts.',
                why: 'Legitimate businesses have proper business accounts. Personal accounts are a major red flag.'
            },
            {
                flag: 'Promising Faster Processing for Extra Fees',
                description: 'Claiming they can speed up government processing for additional payment.',
                why: 'Government processing times cannot be influenced by consultants. This is a scam.'
            },
            {
                flag: 'No Physical Office or Contact Information',
                description: 'Only online presence, no verifiable office address or contact details.',
                why: 'Legitimate consultants have verifiable offices and contact information. Be suspicious of P.O. boxes only.'
            },
            {
                flag: 'Asking You to Lie or Provide False Information',
                description: 'Suggesting you provide false documents or information.',
                why: 'This is illegal and will result in permanent ban. Legitimate consultants never suggest fraud.'
            }
        ],
        howToVerify: [
            'Check consultant registration with regulatory body',
            'Verify business license and registration',
            'Read reviews and check credentials',
            'Ask for references from previous clients',
            'Verify physical office address',
            'Check if they have proper business accounts',
            'Ensure they provide written contracts',
            'Verify their track record and experience'
        ],
        regulatoryBodies: {
            'Canada': 'RCIC (Regulated Canadian Immigration Consultant) - Check on ICCRC website',
            'Australia': 'MARA (Migration Agents Registration Authority) - Check on MARA website',
            'UK': 'OISC (Office of the Immigration Services Commissioner) - Check on OISC website',
            'Global': 'Check with local immigration authorities or professional associations'
        },
        whatToDoIfScammed: [
            'Report to local police immediately',
            'Contact regulatory body (RCIC, MARA, etc.)',
            'Report to immigration authorities',
            'Contact your bank to stop payments if possible',
            'Document all communications and transactions',
            'Seek legal advice',
            'Warn others through reviews and forums'
        ]
    },
    'when-reapply': {
        title: 'When to Reapply After Rejection',
        icon: '🔄',
        overview: 'Understanding when and how to reapply after a visa rejection is crucial. Not all rejections are final.',
        canReapply: [
            {
                situation: 'Insufficient Documents',
                canReapply: 'Yes - Immediately',
                waitTime: 'No waiting period',
                action: 'Gather missing documents and reapply with complete application',
                successChance: 'High if all documents are now provided'
            },
            {
                situation: 'Financial Proof Issues',
                canReapply: 'Yes - After 1-3 months',
                waitTime: '1-3 months to improve financial situation',
                action: 'Build savings, get proper bank statements, show additional income sources',
                successChance: 'Good if financial situation genuinely improved'
            },
            {
                situation: 'IELTS Score Below Requirement',
                canReapply: 'Yes - After retaking test',
                waitTime: 'No waiting period after getting required score',
                action: 'Retake IELTS/PTE to meet minimum requirements, then reapply',
                successChance: 'High if you meet all requirements now'
            },
            {
                situation: 'Weak Ties to Home Country',
                canReapply: 'Yes - After 3-6 months',
                waitTime: '3-6 months to strengthen ties',
                action: 'Get employment letter, show property ownership, demonstrate family ties, start business',
                successChance: 'Moderate to good depending on improvements'
            },
            {
                situation: 'GTE Concerns (Student Visa)',
                canReapply: 'Yes - After improving application',
                waitTime: '1-3 months to strengthen application',
                action: 'Write better SOP, show clear career goals, explain course choice, show financial capacity',
                successChance: 'Good if application is significantly improved'
            }
        ],
        cannotReapply: [
            {
                situation: 'Misrepresentation or Fraud',
                canReapply: 'No - Permanent Ban',
                waitTime: 'Permanent ban (5-10 years minimum)',
                action: 'Cannot reapply. May need legal assistance for appeal.',
                note: 'Very serious - seek legal advice immediately'
            },
            {
                situation: 'Criminal Record (Serious Offenses)',
                canReapply: 'Maybe - After rehabilitation period',
                waitTime: '5-10 years depending on offense',
                action: 'Complete rehabilitation, get character references, may need legal waiver',
                note: 'Consult immigration lawyer for specific cases'
            },
            {
                situation: 'Health Issues (Contagious Diseases)',
                canReapply: 'Maybe - After treatment',
                waitTime: 'After medical clearance',
                action: 'Complete treatment, get medical clearance, may need health waiver',
                note: 'Depends on specific condition and country requirements'
            }
        ],
        reapplicationSteps: [
            'Understand the rejection reason completely',
            'Address the specific issue that caused rejection',
            'Wait appropriate time (if required)',
            'Improve your application significantly',
            'Gather stronger supporting documents',
            'Consider professional help if needed',
            'Submit new application with improvements',
            'Be prepared for interview if required'
        ],
        tipsForSuccess: [
            'Don\'t rush - take time to address rejection reasons',
            'Significantly improve your application, not just minor changes',
            'Get professional help if you were rejected before',
            'Be honest about previous rejection in new application',
            'Show how you\'ve addressed previous concerns',
            'Provide additional supporting documents',
            'Consider different visa category if applicable',
            'Maintain patience and persistence'
        ],
        appealOptions: [
            {
                country: 'Canada',
                option: 'Appeal to Immigration Appeal Division (IAD) or Federal Court',
                timeframe: '30-60 days to file appeal',
                successRate: 'Varies by case type'
            },
            {
                country: 'Australia',
                option: 'Appeal to Administrative Appeals Tribunal (AAT)',
                timeframe: '21 days to file appeal',
                successRate: 'Moderate - depends on case'
            },
            {
                country: 'UK',
                option: 'Administrative Review or Appeal to First-tier Tribunal',
                timeframe: '14-28 days depending on visa type',
                successRate: 'Varies by grounds for appeal'
            }
        ]
    }
};

// Show mistake details
function showMistakeDetails(key) {
    const info = MISTAKES_INFO[key];
    if (!info) {
        console.error('Mistake info not found:', key);
        return;
    }
    
    const modal = document.getElementById('mistakeModal');
    const modalTitle = document.getElementById('mistakeModalTitle');
    const modalBody = document.getElementById('mistakeModalBody');
    
    modalTitle.innerHTML = `${info.icon} ${info.title}`;
    
    let html = `
        <div class="mistake-details">
            <div class="mistake-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${info.overview}</p>
            </div>
    `;
    
    // Common Rejections
    if (info.topReasons) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-list-ol"></i> Top Rejection Reasons</h3>
                <div class="rejection-reasons-list">
        `;
        info.topReasons.forEach((reason, index) => {
            html += `
                <div class="rejection-reason-item">
                    <div class="reason-header">
                        <span class="reason-number">${index + 1}</span>
                        <h4>${reason.reason} <span class="reason-percentage">(${reason.percentage} of rejections)</span></h4>
                    </div>
                    <p class="reason-description">${reason.description}</p>
                    <div class="reason-solution">
                        <strong><i class="fas fa-lightbulb"></i> How to Avoid:</strong>
                        <p>${reason.howToAvoid}</p>
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
        
        if (info.preventionTips) {
            html += `
                <div class="mistake-section">
                    <h3><i class="fas fa-shield-alt"></i> Prevention Tips</h3>
                    <ul class="mistake-list tips">
                        ${info.preventionTips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Country Mistakes
    if (info.countries) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-globe"></i> Country-Specific Mistakes</h3>
        `;
        info.countries.forEach(country => {
            html += `
                <div class="country-mistake-card">
                    <h4>${country.country}</h4>
                    <div class="mistake-subsection">
                        <strong>Common Mistakes:</strong>
                        <ul class="mistake-list">
                            ${country.commonMistakes.map(mistake => `<li>${mistake}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="mistake-subsection">
                        <strong>How to Avoid:</strong>
                        <ul class="mistake-list tips">
                            ${country.specificTips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // IELTS Mistakes
    if (info.commonMistakes && key === 'ielts-mistakes') {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-exclamation-circle"></i> Common IELTS Mistakes</h3>
        `;
        info.commonMistakes.forEach(mistake => {
            html += `
                <div class="mistake-item-card">
                    <div class="mistake-item-header">
                        <h4>${mistake.mistake}</h4>
                        <span class="impact-badge ${mistake.impact.toLowerCase().includes('high') ? 'high' : 'medium'}">${mistake.impact}</span>
                    </div>
                    <p class="mistake-description">${mistake.description}</p>
                    <div class="mistake-solution">
                        <strong><i class="fas fa-check-circle"></i> Solution:</strong>
                        <p>${mistake.solution}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.preparationTips) {
            html += `
                <div class="mistake-section">
                    <h3><i class="fas fa-graduation-cap"></i> IELTS Preparation Tips</h3>
                    <ul class="mistake-list tips">
                        ${info.preparationTips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.scoreRequirements) {
            html += `
                <div class="mistake-section">
                    <h3><i class="fas fa-chart-line"></i> Score Requirements by Program</h3>
                    <div class="score-requirements-grid">
                        ${Object.entries(info.scoreRequirements).map(([program, requirement]) => `
                            <div class="score-requirement-item">
                                <strong>${program}:</strong> ${requirement}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // Document Errors
    if (info.commonErrors) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-file-exclamation"></i> Common Document Errors</h3>
        `;
        info.commonErrors.forEach(error => {
            html += `
                <div class="mistake-item-card">
                    <div class="mistake-item-header">
                        <h4>${error.error}</h4>
                        <span class="impact-badge ${error.impact.toLowerCase().includes('high') ? 'high' : 'medium'}">${error.impact}</span>
                    </div>
                    <p class="mistake-description">${error.description}</p>
                    ${error.examples ? `
                        <div class="mistake-examples">
                            <strong>Examples:</strong>
                            <ul class="mistake-list">
                                ${error.examples.map(example => `<li>${example}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    <div class="mistake-solution">
                        <strong><i class="fas fa-check-circle"></i> Solution:</strong>
                        <p>${error.solution}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.bestPractices) {
            html += `
                <div class="mistake-section">
                    <h3><i class="fas fa-star"></i> Best Practices</h3>
                    <ul class="mistake-list tips">
                        ${info.bestPractices.map(practice => `<li>${practice}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Fake Consultants
    if (info.redFlags) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-exclamation-triangle"></i> Red Flags - Warning Signs</h3>
        `;
        info.redFlags.forEach(flag => {
            html += `
                <div class="red-flag-card">
                    <div class="red-flag-header">
                        <i class="fas fa-flag"></i>
                        <h4>${flag.flag}</h4>
                    </div>
                    <p class="flag-description">${flag.description}</p>
                    <div class="flag-explanation">
                        <strong>Why this is a red flag:</strong>
                        <p>${flag.why}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.howToVerify) {
            html += `
                <div class="mistake-section">
                    <h3><i class="fas fa-shield-check"></i> How to Verify Legitimate Consultants</h3>
                    <ul class="mistake-list tips">
                        ${info.howToVerify.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.regulatoryBodies) {
            html += `
                <div class="mistake-section">
                    <h3><i class="fas fa-building"></i> Regulatory Bodies</h3>
                    <div class="regulatory-bodies-list">
                        ${Object.entries(info.regulatoryBodies).map(([country, body]) => `
                            <div class="regulatory-item">
                                <strong>${country}:</strong> ${body}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (info.whatToDoIfScammed) {
            html += `
                <div class="mistake-section warning-section">
                    <h3><i class="fas fa-phone-alt"></i> What to Do If You've Been Scammed</h3>
                    <ul class="mistake-list urgent">
                        ${info.whatToDoIfScammed.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // When to Reapply
    if (info.canReapply) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-check-circle"></i> Situations Where You CAN Reapply</h3>
        `;
        info.canReapply.forEach(situation => {
            html += `
                <div class="reapply-situation-card can-reapply">
                    <div class="situation-header">
                        <h4>${situation.situation}</h4>
                        <span class="reapply-badge yes">Can Reapply</span>
                    </div>
                    <div class="situation-details">
                        <p><strong>Wait Time:</strong> ${situation.waitTime}</p>
                        <p><strong>Action Required:</strong> ${situation.action}</p>
                        <p><strong>Success Chance:</strong> ${situation.successChance}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    if (info.cannotReapply) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-times-circle"></i> Situations Where Reapplication is Difficult</h3>
        `;
        info.cannotReapply.forEach(situation => {
            html += `
                <div class="reapply-situation-card cannot-reapply">
                    <div class="situation-header">
                        <h4>${situation.situation}</h4>
                        <span class="reapply-badge no">${situation.canReapply}</span>
                    </div>
                    <div class="situation-details">
                        <p><strong>Wait Time:</strong> ${situation.waitTime}</p>
                        <p><strong>Action Required:</strong> ${situation.action}</p>
                        <p class="situation-note"><strong>Note:</strong> ${situation.note}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    if (info.reapplicationSteps) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-list-ol"></i> Reapplication Steps</h3>
                <ol class="mistake-list numbered">
                    ${info.reapplicationSteps.map((step, index) => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        `;
    }
    
    if (info.tipsForSuccess) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-lightbulb"></i> Tips for Successful Reapplication</h3>
                <ul class="mistake-list tips">
                    ${info.tipsForSuccess.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (info.appealOptions) {
        html += `
            <div class="mistake-section">
                <h3><i class="fas fa-gavel"></i> Appeal Options</h3>
        `;
        info.appealOptions.forEach(option => {
            html += `
                <div class="appeal-option-card">
                    <h4>${option.country}</h4>
                    <p><strong>Option:</strong> ${option.option}</p>
                    <p><strong>Timeframe:</strong> ${option.timeframe}</p>
                    <p><strong>Success Rate:</strong> ${option.successRate}</p>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    html += `</div>`;
    
    modalBody.innerHTML = html;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close mistake modal
function closeMistakeModal() {
    document.getElementById('mistakeModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('mistakeModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeMistakeModal();
            }
        });
    }
});

// Expose functions globally
window.showMistakeDetails = showMistakeDetails;
window.closeMistakeModal = closeMistakeModal;

// ============================================
// ABOUT MIGRATION LAWS SYSTEM
// ============================================

const LAWS_INFO = {
    'immigration-basics': {
        title: 'Immigration Law Basics',
        icon: '📚',
        overview: 'Understanding the fundamental principles and concepts of immigration law is essential for anyone planning to migrate.',
        keyConcepts: [
            {
                concept: 'What is Immigration Law?',
                description: 'Immigration law governs who can enter, stay, and become citizens of a country. It includes rules about visas, work permits, permanent residence, and citizenship.'
            },
            {
                concept: 'Sovereignty Principle',
                description: 'Every country has the right to control who enters and stays in its territory. This is a fundamental principle of international law.'
            },
            {
                concept: 'Non-Citizen Categories',
                description: 'Countries classify non-citizens into categories: visitors, temporary residents, permanent residents, and citizens. Each category has different rights and obligations.'
            },
            {
                concept: 'Immigration vs Emigration',
                description: 'Immigration is entering a new country to live there. Emigration is leaving your home country. Both are regulated by laws.'
            },
            {
                concept: 'Legal vs Illegal Immigration',
                description: 'Legal immigration follows official processes and requirements. Illegal immigration violates laws and can result in deportation and bans.'
            }
        ],
        typesOfVisas: [
            'Temporary Visas - Short-term stays (tourist, business, student)',
            'Work Visas - Employment authorization',
            'Family Visas - Joining family members',
            'Permanent Residence - Long-term residency rights',
            'Refugee/Asylum - Protection for those fleeing persecution'
        ],
        importantPrinciples: [
            'All immigration is discretionary - no automatic right to enter',
            'Compliance with visa conditions is mandatory',
            'Misrepresentation can result in permanent bans',
            'Immigration laws change frequently',
            'Each country has its own immigration system'
        ]
    },
    'pr-vs-citizenship': {
        title: 'Permanent Residence vs Citizenship',
        icon: '🆔',
        overview: 'Understanding the difference between Permanent Residence (PR) and Citizenship is crucial for planning your migration journey.',
        prDefinition: {
            title: 'Permanent Residence (PR)',
            description: 'Permanent Residence grants you the right to live, work, and study in a country indefinitely, but you remain a citizen of your home country.',
            rights: [
                'Live and work indefinitely in the country',
                'Access to public healthcare and education',
                'Social security benefits',
                'Freedom to travel in and out of the country',
                'Sponsor family members (in most cases)',
                'Pathway to citizenship (after meeting requirements)'
            ],
            limitations: [
                'Cannot vote in national elections',
                'Cannot hold certain government positions',
                'Must maintain residency requirements',
                'Can be revoked for serious crimes or misrepresentation',
                'May need to renew PR card periodically',
                'Subject to deportation for serious violations'
            ],
            requirements: [
                'Meet eligibility criteria (points, skills, family ties)',
                'Pass medical and security checks',
                'Show proof of funds',
                'Meet language requirements',
                'Maintain valid status during application'
            ]
        },
        citizenshipDefinition: {
            title: 'Citizenship',
            description: 'Citizenship is the highest status, making you a full member of the country with all rights and responsibilities.',
            rights: [
                'All PR rights plus:',
                'Right to vote in all elections',
                'Right to hold public office',
                'Right to a passport from that country',
                'Cannot be deported (except in extreme cases)',
                'Right to live abroad and return freely',
                'Full legal protection as a citizen'
            ],
            obligations: [
                'Pledge allegiance to the country',
                'Obey all laws',
                'May be required to serve in military (some countries)',
                'Pay taxes as a citizen',
                'May lose original citizenship (depending on country)'
            ],
            requirements: [
                'Hold PR status for required period (typically 3-5 years)',
                'Meet residency requirements (physical presence)',
                'Pass citizenship test (language, history, values)',
                'Good character (no serious criminal record)',
                'Pay citizenship application fees'
            ]
        },
        comparison: {
            pr: {
                duration: 'Indefinite (with conditions)',
                voting: 'No',
                passport: 'No',
                deportation: 'Possible for serious violations',
                residency: 'Must maintain minimum residency',
                timeToObtain: '6 months - 2 years'
            },
            citizenship: {
                duration: 'Permanent (cannot be revoked easily)',
                voting: 'Yes',
                passport: 'Yes',
                deportation: 'Rarely (only extreme cases)',
                residency: 'Can live abroad and return',
                timeToObtain: '3-5 years after PR + application time'
            }
        },
        countrySpecific: {
            'Canada': {
                pr: 'Permanent Resident Card, valid for 5 years, must meet residency obligation (730 days in 5 years)',
                citizenship: 'After 3 years as PR (1,095 days), must pass citizenship test',
                dualCitizenship: 'Allowed'
            },
            'Australia': {
                pr: 'Permanent Resident Visa, can travel for 5 years, must maintain ties',
                citizenship: 'After 4 years as PR, must pass citizenship test',
                dualCitizenship: 'Allowed'
            },
            'UK': {
                pr: 'Indefinite Leave to Remain (ILR), can be lost if absent 2+ years',
                citizenship: 'After 5-6 years (depending on route), must pass Life in UK test',
                dualCitizenship: 'Allowed'
            },
            'USA': {
                pr: 'Green Card, must maintain permanent residence, can be lost if absent 1+ year',
                citizenship: 'After 5 years (3 if married to US citizen), must pass naturalization test',
                dualCitizenship: 'Allowed'
            },
            'Germany': {
                pr: 'Permanent Residence Permit, can be lost if absent 6+ months without reason',
                citizenship: 'After 8 years (can be reduced to 6-7), must pass integration test',
                dualCitizenship: 'Limited (depends on origin country)'
            }
        }
    },
    'visa-validity': {
        title: 'Visa Validity Rules',
        icon: '📅',
        overview: 'Understanding visa validity periods, entry dates, and stay durations is essential to avoid overstaying and violations.',
        validityTypes: [
            {
                type: 'Single Entry Visa',
                description: 'Allows one entry into the country. Once you leave, you cannot re-enter with the same visa.',
                example: 'Most tourist visas, some work visas'
            },
            {
                type: 'Multiple Entry Visa',
                description: 'Allows multiple entries during the validity period. You can leave and return as long as the visa is valid.',
                example: 'Canada visitor visa (10 years), USA B1/B2 visa (10 years)'
            },
            {
                type: 'Visa Validity vs Stay Duration',
                description: 'Visa validity is when you can enter. Stay duration is how long you can remain. These are different!',
                example: 'A 10-year visa may only allow 6-month stays per entry'
            }
        ],
        importantDates: [
            {
                date: 'Entry Date',
                description: 'The date by which you must enter the country. Entering after this date may invalidate your visa.',
                importance: 'Critical - Enter before or on this date'
            },
            {
                date: 'Expiry Date',
                description: 'The date your visa expires. You must leave before this date unless you have extended your stay.',
                importance: 'Critical - Leave before this date or extend legally'
            },
            {
                date: 'Stay Duration',
                description: 'How long you can remain in the country per entry. This is different from visa validity.',
                importance: 'Important - Don\'t confuse with visa validity period'
            }
        ],
        commonRules: [
            'Visa validity ≠ Stay duration',
            'You must enter before visa expiry date',
            'You must leave before stay duration expires',
            'Overstaying even one day is a violation',
            'Extensions must be applied for before expiry',
            'Working on a visitor visa is illegal',
            'Study restrictions apply to most visitor visas'
        ],
        countrySpecific: {
            'Canada': {
                visitorVisa: 'Up to 10 years validity, 6 months stay per entry (can be extended)',
                workPermit: 'Tied to job offer, typically 1-4 years',
                studyPermit: 'Valid for duration of study program + 90 days',
                extension: 'Can apply for extension before expiry'
            },
            'Australia': {
                visitorVisa: '3, 6, or 12 months validity, stay as per grant',
                workVisa: 'Tied to employer, typically 2-4 years',
                studentVisa: 'Valid for course duration + 1-2 months',
                extension: 'Can apply for extension, but not guaranteed'
            },
            'UK': {
                visitorVisa: '6 months validity, stay up to 6 months',
                workVisa: 'Tied to sponsor, typically 3-5 years',
                studentVisa: 'Valid for course duration + 4 months',
                extension: 'Can apply for extension before expiry'
            },
            'USA': {
                visitorVisa: '10 years validity (B1/B2), stay determined at entry (typically 6 months)',
                workVisa: 'H-1B: 3 years, extendable to 6 years',
                studentVisa: 'F-1: Valid for course duration + 60 days',
                extension: 'Can apply for extension, but complex'
            }
        },
        extensionRules: [
            'Apply before current visa expires',
            'Show valid reason for extension',
            'Maintain valid status during application',
            'Provide updated financial proof',
            'Extension not guaranteed - plan accordingly'
        ]
    },
    'overstay-consequences': {
        title: 'Overstay Consequences',
        icon: '⚠️',
        overview: 'Overstaying your visa is a serious violation with severe consequences. Understanding these helps you avoid costly mistakes.',
        immediateConsequences: [
            {
                consequence: 'Illegal Status',
                description: 'You become an illegal immigrant the day after your visa expires',
                severity: 'High',
                impact: 'Cannot work legally, access healthcare, or use services'
            },
            {
                consequence: 'Arrest and Detention',
                description: 'Can be arrested, detained, and deported at any time',
                severity: 'Very High',
                impact: 'Detention centers, deportation proceedings, barred from re-entry'
            },
            {
                consequence: 'Deportation',
                description: 'Forced removal from the country at your own expense',
                severity: 'Very High',
                impact: 'Permanent record, travel ban, financial costs'
            }
        ],
        longTermConsequences: [
            {
                consequence: 'Re-Entry Bans',
                description: 'Banned from re-entering the country for a period (1-10 years depending on overstay length)',
                duration: '1-10 years',
                impact: 'Cannot return even as a visitor'
            },
            {
                consequence: 'Permanent Record',
                description: 'Overstay becomes part of your immigration record permanently',
                duration: 'Permanent',
                impact: 'Affects all future visa applications worldwide'
            },
            {
                consequence: 'Future Visa Refusals',
                description: 'Very difficult to get visas for other countries after overstay',
                duration: 'Long-term',
                impact: 'Other countries see you as high-risk'
            },
            {
                consequence: 'Employment Issues',
                description: 'Cannot work legally, risk of exploitation, no legal protection',
                duration: 'While overstaying',
                impact: 'No worker rights, low wages, exploitation risk'
            }
        ],
        countrySpecific: {
            'Canada': {
                banDuration: '1 year ban for overstay less than 6 months, up to permanent ban for longer',
                consequences: 'Cannot apply for PR, work permits, or visitor visas',
                exceptions: 'Very limited - humanitarian cases only',
                advice: 'Leave before expiry or apply for extension well in advance'
            },
            'Australia': {
                banDuration: '3-year ban for overstay, can be permanent for serious cases',
                consequences: 'Cannot return, affects all visa applications',
                exceptions: 'Very rare exceptions',
                advice: 'Never overstay - apply for extension or leave before expiry'
            },
            'UK': {
                banDuration: '1-10 year ban depending on overstay length',
                consequences: 'Cannot return, affects all future UK applications',
                exceptions: 'Extremely limited',
                advice: 'Leave before visa expires or apply for extension'
            },
            'USA': {
                banDuration: '3-10 year ban, can be permanent',
                consequences: 'Cannot return, affects all US visa applications',
                exceptions: 'Very limited',
                advice: 'Never overstay - serious consequences including permanent ban'
            }
        },
        whatToDoIfOverstayed: [
            'Contact immigration lawyer immediately',
            'Do not try to leave and re-enter illegally',
            'Document your situation and reasons',
            'Apply for restoration/extension if still within grace period',
            'Consider voluntary departure if possible',
            'Prepare for potential ban period',
            'Never work illegally while overstaying'
        ],
        prevention: [
            'Set reminders for visa expiry dates',
            'Apply for extensions 2-3 months before expiry',
            'Keep track of stay duration (not just visa validity)',
            'Understand difference between visa validity and stay duration',
            'Plan travel dates carefully',
            'Get professional help if unsure about dates'
        ]
    },
    'visa-conditions': {
        title: 'Visa Conditions & Restrictions',
        icon: '📋',
        overview: 'Every visa comes with specific conditions and restrictions. Violating these can result in cancellation and deportation.',
        commonConditions: [
            {
                condition: 'No Work Restriction',
                description: 'Most visitor and student visas prohibit or limit work',
                examples: [
                    'Visitor visas: No work allowed',
                    'Student visas: Limited hours (20-40 hours/week)',
                    'Work visas: Only for specified employer/job'
                ],
                violation: 'Working illegally can result in immediate visa cancellation and deportation'
            },
            {
                condition: 'Study Restrictions',
                description: 'Visitor visas typically prohibit formal study',
                examples: [
                    'Cannot enroll in full-time courses on visitor visa',
                    'Short courses (under 3 months) may be allowed',
                    'Must have student visa for formal education'
                ],
                violation: 'Studying without proper visa is illegal'
            },
            {
                condition: 'Residency Requirements',
                description: 'Must maintain valid status and comply with entry/exit rules',
                examples: [
                    'Must enter before visa expiry',
                    'Must leave before stay duration expires',
                    'Cannot stay continuously beyond allowed period'
                ],
                violation: 'Overstaying violates visa conditions'
            },
            {
                condition: 'Health Insurance',
                description: 'Many countries require health insurance for certain visas',
                examples: [
                    'Student visas: Mandatory health insurance',
                    'Work visas: May require health coverage',
                    'Visitor visas: Recommended, sometimes mandatory'
                ],
                violation: 'Lack of insurance can affect visa renewal'
            },
            {
                condition: 'Financial Maintenance',
                description: 'Must have sufficient funds to support yourself',
                examples: [
                    'Cannot rely on public funds',
                    'Must show financial capacity',
                    'Cannot become a public charge'
                ],
                violation: 'Using public funds can result in visa cancellation'
            }
        ],
        workRestrictions: {
            'Visitor Visa': 'No work allowed - violation is serious',
            'Student Visa': 'Limited hours (varies by country), only during study period',
            'Work Visa': 'Only for specified employer and job, cannot change without permission',
            'Spouse Visa': 'Usually can work without restrictions',
            'PR': 'Can work anywhere, any job'
        },
        studyRestrictions: {
            'Visitor Visa': 'No formal study, only short courses',
            'Work Visa': 'Usually cannot study full-time',
            'Student Visa': 'Must maintain enrollment, attend classes',
            'PR': 'Can study anywhere without restrictions'
        },
        travelRestrictions: [
            'Cannot travel to certain countries (check visa conditions)',
            'Must return before visa/stay expires',
            'Multiple entry visas allow re-entry',
            'Single entry visas expire after one entry',
            'Some visas require you to maintain residence'
        ],
        violationConsequences: [
            'Immediate visa cancellation',
            'Deportation',
            'Re-entry bans',
            'Future visa refusals',
            'Criminal charges (in some cases)',
            'Permanent record of violation'
        ]
    },
    'rights-obligations': {
        title: 'Rights & Obligations of Immigrants',
        icon: '⚖️',
        overview: 'Understanding your rights and obligations as an immigrant helps you navigate your new country successfully and legally.',
        rights: [
            {
                right: 'Right to Fair Treatment',
                description: 'Immigrants have the right to fair and equal treatment under the law',
                details: 'Cannot be discriminated against based on origin, protected by anti-discrimination laws'
            },
            {
                right: 'Right to Legal Representation',
                description: 'Right to hire immigration lawyers or consultants for assistance',
                details: 'Can appeal decisions, get legal help, and understand your rights'
            },
            {
                right: 'Right to Work (if authorized)',
                description: 'If you have work authorization, you have the right to work and receive fair wages',
                details: 'Protected by labor laws, entitled to minimum wage, safe working conditions'
            },
            {
                right: 'Right to Education (if authorized)',
                description: 'Children have right to public education, adults can study if authorized',
                details: 'Public schools for children, access to education based on visa type'
            },
            {
                right: 'Right to Healthcare',
                description: 'Access to healthcare varies by visa type and country',
                details: 'Emergency care usually available, full access depends on status and insurance'
            },
            {
                right: 'Right to Privacy',
                description: 'Immigration information is confidential',
                details: 'Your application details are private, shared only with authorized officials'
            }
        ],
        obligations: [
            {
                obligation: 'Comply with Visa Conditions',
                description: 'Must follow all conditions of your visa',
                details: 'Work restrictions, study limits, residency requirements, etc.'
            },
            {
                obligation: 'Obey All Laws',
                description: 'Immigrants must follow all local, state, and federal laws',
                details: 'Criminal violations can result in deportation and bans'
            },
            {
                obligation: 'Maintain Valid Status',
                description: 'Keep your immigration status valid and up-to-date',
                details: 'Renew visas, extend stays, report changes, maintain documents'
            },
            {
                obligation: 'Pay Taxes',
                description: 'Must pay taxes on income earned in the country',
                details: 'Tax obligations vary by residency status and visa type'
            },
            {
                obligation: 'Report Changes',
                description: 'Report significant changes (address, employment, family status)',
                details: 'Many countries require updates to immigration authorities'
            },
            {
                obligation: 'Respect Cultural Norms',
                description: 'While not legally required, respecting local culture is important',
                details: 'Helps integration and avoids conflicts'
            }
        ],
        prRights: [
            'Live and work anywhere in the country',
            'Access to public healthcare and education',
            'Social security benefits',
            'Sponsor family members',
            'Travel freely (with valid PR card)',
            'Pathway to citizenship'
        ],
        prObligations: [
            'Maintain residency requirements',
            'Obey all laws',
            'Pay taxes',
            'Renew PR card when required',
            'Report significant changes',
            'Cannot vote (until citizenship)'
        ]
    },
    'family-members': {
        title: 'Family Member Rights',
        icon: '👨‍👩‍👧‍👦',
        overview: 'Understanding the rights of family members (spouse, children, dependents) in immigration processes is crucial for family migration.',
        spouseRights: [
            {
                right: 'Included in Application',
                description: 'Spouse can be included in most immigration applications',
                details: 'Can apply together, reducing processing time and costs'
            },
            {
                right: 'Work Authorization',
                description: 'Spouse usually gets work authorization when main applicant has work visa',
                details: 'Can work without restrictions in most cases'
            },
            {
                right: 'Study Rights',
                description: 'Spouse can usually study on dependent visa',
                details: 'Access to education, can change to student visa if needed'
            },
            {
                right: 'Healthcare Access',
                description: 'Spouse included in health insurance coverage',
                details: 'Same healthcare access as main applicant'
            },
            {
                right: 'Pathway to PR',
                description: 'Spouse included in PR application, gets PR together',
                details: 'No separate application needed in most cases'
            }
        ],
        childrenRights: [
            {
                right: 'Dependent Status',
                description: 'Children under certain age (usually 18-22) can be included',
                details: 'Age limits vary by country and program'
            },
            {
                right: 'Education Access',
                description: 'Children have right to public education',
                details: 'Free public schools, same as local children'
            },
            {
                right: 'Healthcare Access',
                description: 'Children included in health coverage',
                details: 'Full access to healthcare services'
            },
            {
                right: 'Work Rights (when eligible)',
                description: 'Older children can work when they reach working age',
                details: 'Subject to local labor laws and visa conditions'
            }
        ],
        ageLimits: {
            'Canada': 'Children under 22 (or under 19 if not in full-time study)',
            'Australia': 'Children under 23 (if dependent and studying)',
            'UK': 'Children under 18 (or under 19 if in full-time education)',
            'USA': 'Children under 21',
            'Germany': 'Children under 18'
        },
        documentation: [
            'Marriage certificate (for spouse)',
            'Birth certificates (for children)',
            'Proof of relationship',
            'Medical exams for all family members',
            'Police clearances for adults',
            'Financial proof for all dependents'
        ],
        importantNotes: [
            'All family members must meet health and character requirements',
            'Adding family members later can be complex and expensive',
            'Age limits are strict - children aging out cannot be added',
            'Relationship must be genuine and legally recognized',
            'Divorce or separation affects dependent status',
            'Each country has different rules for family inclusion'
        ]
    },
    'legal-disclaimers': {
        title: 'Legal Disclaimers',
        icon: '⚖️',
        overview: 'Important legal information about the use of this platform and immigration information.',
        disclaimer: {
            title: 'General Disclaimer',
            content: 'The information provided on Gubicoo Migration Navigator is for educational and informational purposes only. It does not constitute legal advice, immigration advice, or professional consultation.',
            important: [
                'This is not a substitute for professional legal advice',
                'Immigration laws change frequently and vary by country',
                'Individual circumstances affect eligibility and outcomes',
                'Always consult qualified professionals for your specific situation'
            ]
        },
        noGuarantee: {
            title: 'No Guarantee of Results',
            content: 'Gubicoo Migration Navigator does not guarantee:',
            items: [
                'Visa approval or success',
                'Accuracy of all information (laws change)',
                'Eligibility for any specific program',
                'Processing times or outcomes',
                'Points calculations or scores'
            ]
        },
        professionalAdvice: {
            title: 'When to Seek Professional Advice',
            content: 'You should consult with a qualified immigration lawyer or registered consultant if:',
            situations: [
                'You have been refused a visa before',
                'You have criminal record or health issues',
                'Your case is complex or unusual',
                'You are unsure about your eligibility',
                'You need help with documentation',
                'You want to appeal a decision',
                'You have questions about your specific situation'
            ]
        },
        informationAccuracy: {
            title: 'Information Accuracy',
            content: 'While we strive for accuracy:',
            notes: [
                'Immigration laws change frequently',
                'Information may become outdated',
                'Country-specific rules vary',
                'Always verify with official sources',
                'Check government websites for latest updates'
            ]
        },
        liability: {
            title: 'Limitation of Liability',
            content: 'Gubicoo Migration Navigator is not liable for:',
            items: [
                'Visa refusals or rejections',
                'Financial losses from migration decisions',
                'Incorrect information or calculations',
                'Changes in immigration laws',
                'Delays or errors in processing',
                'Decisions made based on platform information'
            ]
        },
        userResponsibility: {
            title: 'Your Responsibility',
            content: 'As a user, you are responsible for:',
            items: [
                'Verifying all information independently',
                'Consulting professionals when needed',
                'Making informed decisions',
                'Providing accurate information in applications',
                'Complying with all immigration laws',
                'Keeping yourself updated on law changes'
            ]
        },
        officialSources: {
            title: 'Official Sources',
            content: 'Always refer to official government sources:',
            sources: [
                'Canada: IRCC (immigration.gc.ca)',
                'Australia: Department of Home Affairs (immi.homeaffairs.gov.au)',
                'UK: UK Home Office (gov.uk)',
                'USA: USCIS (uscis.gov)',
                'Germany: Federal Foreign Office (make-it-in-germany.com)'
            ]
        }
    }
};

// Show law details
function showLawDetails(key) {
    const info = LAWS_INFO[key];
    if (!info) {
        console.error('Law info not found:', key);
        return;
    }
    
    const modal = document.getElementById('lawModal');
    const modalTitle = document.getElementById('lawModalTitle');
    const modalBody = document.getElementById('lawModalBody');
    
    modalTitle.innerHTML = `${info.icon} ${info.title}`;
    
    let html = `
        <div class="law-details">
            <div class="law-overview">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${info.overview}</p>
            </div>
    `;
    
    // Immigration Basics
    if (info.keyConcepts) {
        html += `
            <div class="law-section">
                <h3><i class="fas fa-lightbulb"></i> Key Concepts</h3>
        `;
        info.keyConcepts.forEach(concept => {
            html += `
                <div class="concept-card">
                    <h4>${concept.concept}</h4>
                    <p>${concept.description}</p>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.typesOfVisas) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-file-alt"></i> Types of Visas</h3>
                    <ul class="law-list">
                        ${info.typesOfVisas.map(type => `<li>${type}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.importantPrinciples) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-star"></i> Important Principles</h3>
                    <ul class="law-list">
                        ${info.importantPrinciples.map(principle => `<li>${principle}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // PR vs Citizenship
    if (info.prDefinition) {
        html += `
            <div class="law-section">
                <h3><i class="fas fa-id-card"></i> ${info.prDefinition.title}</h3>
                <p>${info.prDefinition.description}</p>
                <div class="rights-obligations-grid">
                    <div class="rights-box">
                        <h4><i class="fas fa-check-circle"></i> Rights</h4>
                        <ul class="law-list">
                            ${info.prDefinition.rights.map(right => `<li>${right}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="obligations-box">
                        <h4><i class="fas fa-exclamation-circle"></i> Limitations</h4>
                        <ul class="law-list">
                            ${info.prDefinition.limitations.map(limitation => `<li>${limitation}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="requirements-box">
                    <h4><i class="fas fa-list-check"></i> Requirements</h4>
                    <ul class="law-list">
                        ${info.prDefinition.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        if (info.citizenshipDefinition) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-flag"></i> ${info.citizenshipDefinition.title}</h3>
                    <p>${info.citizenshipDefinition.description}</p>
                    <div class="rights-obligations-grid">
                        <div class="rights-box">
                            <h4><i class="fas fa-check-circle"></i> Rights</h4>
                            <ul class="law-list">
                                ${info.citizenshipDefinition.rights.map(right => `<li>${right}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="obligations-box">
                            <h4><i class="fas fa-exclamation-circle"></i> Obligations</h4>
                            <ul class="law-list">
                                ${info.citizenshipDefinition.obligations.map(obligation => `<li>${obligation}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="requirements-box">
                        <h4><i class="fas fa-list-check"></i> Requirements</h4>
                        <ul class="law-list">
                            ${info.citizenshipDefinition.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        if (info.comparison) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-balance-scale"></i> PR vs Citizenship Comparison</h3>
                    <div class="comparison-table">
                        <table class="law-comparison-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Permanent Residence</th>
                                    <th>Citizenship</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Duration</strong></td>
                                    <td>${info.comparison.pr.duration}</td>
                                    <td>${info.comparison.citizenship.duration}</td>
                                </tr>
                                <tr>
                                    <td><strong>Voting Rights</strong></td>
                                    <td>${info.comparison.pr.voting}</td>
                                    <td>${info.comparison.citizenship.voting}</td>
                                </tr>
                                <tr>
                                    <td><strong>Passport</strong></td>
                                    <td>${info.comparison.pr.passport}</td>
                                    <td>${info.comparison.citizenship.passport}</td>
                                </tr>
                                <tr>
                                    <td><strong>Deportation Risk</strong></td>
                                    <td>${info.comparison.pr.deportation}</td>
                                    <td>${info.comparison.citizenship.deportation}</td>
                                </tr>
                                <tr>
                                    <td><strong>Residency</strong></td>
                                    <td>${info.comparison.pr.residency}</td>
                                    <td>${info.comparison.citizenship.residency}</td>
                                </tr>
                                <tr>
                                    <td><strong>Time to Obtain</strong></td>
                                    <td>${info.comparison.pr.timeToObtain}</td>
                                    <td>${info.comparison.citizenship.timeToObtain}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
        
        if (info.countrySpecific) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-globe"></i> Country-Specific Information</h3>
            `;
            Object.entries(info.countrySpecific).forEach(([country, data]) => {
                html += `
                    <div class="country-law-card">
                        <h4>${country}</h4>
                        <div class="country-law-details">
                            <p><strong>PR:</strong> ${data.pr}</p>
                            <p><strong>Citizenship:</strong> ${data.citizenship}</p>
                            <p><strong>Dual Citizenship:</strong> ${data.dualCitizenship}</p>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }
    }
    
    // Visa Validity
    if (info.validityTypes) {
        html += `
            <div class="law-section">
                <h3><i class="fas fa-calendar-alt"></i> Types of Visa Validity</h3>
        `;
        info.validityTypes.forEach(type => {
            html += `
                <div class="validity-type-card">
                    <h4>${type.type}</h4>
                    <p>${type.description}</p>
                    <p class="validity-example"><strong>Example:</strong> ${type.example}</p>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.importantDates) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-calendar-check"></i> Important Dates to Remember</h3>
            `;
            info.importantDates.forEach(date => {
                html += `
                    <div class="date-importance-card">
                        <div class="date-header">
                            <h4>${date.date}</h4>
                            <span class="importance-badge ${date.importance.toLowerCase().includes('critical') ? 'critical' : 'important'}">${date.importance}</span>
                        </div>
                        <p>${date.description}</p>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (info.commonRules) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-rules"></i> Common Rules</h3>
                    <ul class="law-list">
                        ${info.commonRules.map(rule => `<li>${rule}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.countrySpecific) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-globe"></i> Country-Specific Validity Rules</h3>
            `;
            Object.entries(info.countrySpecific).forEach(([country, rules]) => {
                html += `
                    <div class="country-validity-card">
                        <h4>${country}</h4>
                        <div class="validity-rules">
                            <p><strong>Visitor Visa:</strong> ${rules.visitorVisa}</p>
                            <p><strong>Work Permit:</strong> ${rules.workPermit}</p>
                            <p><strong>Study Permit:</strong> ${rules.studyPermit}</p>
                            <p><strong>Extension:</strong> ${rules.extension}</p>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (info.extensionRules) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-clock"></i> Extension Rules</h3>
                    <ul class="law-list">
                        ${info.extensionRules.map(rule => `<li>${rule}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Overstay Consequences
    if (info.immediateConsequences) {
        html += `
            <div class="law-section">
                <h3><i class="fas fa-exclamation-triangle"></i> Immediate Consequences</h3>
        `;
        info.immediateConsequences.forEach(consequence => {
            html += `
                <div class="consequence-card immediate">
                    <div class="consequence-header">
                        <h4>${consequence.consequence}</h4>
                        <span class="severity-badge ${consequence.severity.toLowerCase().includes('very') ? 'very-high' : 'high'}">${consequence.severity}</span>
                    </div>
                    <p>${consequence.description}</p>
                    <p class="consequence-impact"><strong>Impact:</strong> ${consequence.impact}</p>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.longTermConsequences) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-hourglass-half"></i> Long-Term Consequences</h3>
            `;
            info.longTermConsequences.forEach(consequence => {
                html += `
                    <div class="consequence-card long-term">
                        <div class="consequence-header">
                            <h4>${consequence.consequence}</h4>
                            <span class="duration-badge">${consequence.duration}</span>
                        </div>
                        <p>${consequence.description}</p>
                        <p class="consequence-impact"><strong>Impact:</strong> ${consequence.impact}</p>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (info.countrySpecific) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-globe"></i> Country-Specific Overstay Consequences</h3>
            `;
            Object.entries(info.countrySpecific).forEach(([country, data]) => {
                html += `
                    <div class="country-overstay-card">
                        <h4>${country}</h4>
                        <div class="overstay-details">
                            <p><strong>Ban Duration:</strong> ${data.banDuration}</p>
                            <p><strong>Consequences:</strong> ${data.consequences}</p>
                            <p><strong>Exceptions:</strong> ${data.exceptions}</p>
                            <div class="overstay-advice">
                                <strong><i class="fas fa-lightbulb"></i> Advice:</strong>
                                <p>${data.advice}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (info.whatToDoIfOverstayed) {
            html += `
                <div class="law-section warning-section">
                    <h3><i class="fas fa-phone-alt"></i> What to Do If You've Overstayed</h3>
                    <ul class="law-list urgent">
                        ${info.whatToDoIfOverstayed.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.prevention) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-shield-alt"></i> Prevention Tips</h3>
                    <ul class="law-list tips">
                        ${info.prevention.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Visa Conditions
    if (info.commonConditions) {
        html += `
            <div class="law-section">
                <h3><i class="fas fa-list-check"></i> Common Visa Conditions</h3>
        `;
        info.commonConditions.forEach(condition => {
            html += `
                <div class="condition-card">
                    <h4>${condition.condition}</h4>
                    <p>${condition.description}</p>
                    <div class="condition-examples">
                        <strong>Examples:</strong>
                        <ul class="law-list">
                            ${condition.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="condition-violation">
                        <strong><i class="fas fa-exclamation-triangle"></i> Violation Consequence:</strong>
                        <p>${condition.violation}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.workRestrictions) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-briefcase"></i> Work Restrictions by Visa Type</h3>
                    <div class="restrictions-grid">
                        ${Object.entries(info.workRestrictions).map(([visa, restriction]) => `
                            <div class="restriction-item">
                                <strong>${visa}:</strong> ${restriction}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (info.studyRestrictions) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-graduation-cap"></i> Study Restrictions by Visa Type</h3>
                    <div class="restrictions-grid">
                        ${Object.entries(info.studyRestrictions).map(([visa, restriction]) => `
                            <div class="restriction-item">
                                <strong>${visa}:</strong> ${restriction}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (info.violationConsequences) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-exclamation-circle"></i> Consequences of Violating Conditions</h3>
                    <ul class="law-list">
                        ${info.violationConsequences.map(consequence => `<li>${consequence}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Rights & Obligations
    if (info.rights) {
        html += `
            <div class="law-section">
                <h3><i class="fas fa-hand-paper"></i> Rights of Immigrants</h3>
        `;
        info.rights.forEach(right => {
            html += `
                <div class="right-card">
                    <h4>${right.right}</h4>
                    <p>${right.description}</p>
                    <p class="right-details"><strong>Details:</strong> ${right.details}</p>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.obligations) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-tasks"></i> Obligations of Immigrants</h3>
            `;
            info.obligations.forEach(obligation => {
                html += `
                    <div class="obligation-card">
                        <h4>${obligation.obligation}</h4>
                        <p>${obligation.description}</p>
                        <p class="obligation-details"><strong>Details:</strong> ${obligation.details}</p>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (info.prRights) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-id-card"></i> Permanent Resident Rights</h3>
                    <ul class="law-list">
                        ${info.prRights.map(right => `<li>${right}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.prObligations) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-exclamation-circle"></i> Permanent Resident Obligations</h3>
                    <ul class="law-list">
                        ${info.prObligations.map(obligation => `<li>${obligation}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Family Members
    if (info.spouseRights) {
        html += `
            <div class="law-section">
                <h3><i class="fas fa-heart"></i> Spouse Rights</h3>
        `;
        info.spouseRights.forEach(right => {
            html += `
                <div class="family-right-card">
                    <h4>${right.right}</h4>
                    <p>${right.description}</p>
                    <p class="family-details"><strong>Details:</strong> ${right.details}</p>
                </div>
            `;
        });
        html += `</div>`;
        
        if (info.childrenRights) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-child"></i> Children Rights</h3>
            `;
            info.childrenRights.forEach(right => {
                html += `
                    <div class="family-right-card">
                        <h4>${right.right}</h4>
                        <p>${right.description}</p>
                        <p class="family-details"><strong>Details:</strong> ${right.details}</p>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (info.ageLimits) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-birthday-cake"></i> Age Limits for Dependents</h3>
                    <div class="age-limits-grid">
                        ${Object.entries(info.ageLimits).map(([country, age]) => `
                            <div class="age-limit-item">
                                <strong>${country}:</strong> ${age}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (info.documentation) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-file-alt"></i> Required Documentation for Family Members</h3>
                    <ul class="law-list">
                        ${info.documentation.map(doc => `<li>${doc}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.importantNotes) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-info-circle"></i> Important Notes</h3>
                    <ul class="law-list">
                        ${info.importantNotes.map(note => `<li>${note}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Legal Disclaimers
    if (info.disclaimer) {
        html += `
            <div class="law-section warning-section">
                <h3><i class="fas fa-exclamation-triangle"></i> ${info.disclaimer.title}</h3>
                <p>${info.disclaimer.content}</p>
                <ul class="law-list">
                    ${info.disclaimer.important.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
        
        if (info.noGuarantee) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-shield-alt"></i> ${info.noGuarantee.title}</h3>
                    <p>${info.noGuarantee.content}</p>
                    <ul class="law-list">
                        ${info.noGuarantee.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.professionalAdvice) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-user-tie"></i> ${info.professionalAdvice.title}</h3>
                    <p>${info.professionalAdvice.content}</p>
                    <ul class="law-list">
                        ${info.professionalAdvice.situations.map(situation => `<li>${situation}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.informationAccuracy) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-check-circle"></i> ${info.informationAccuracy.title}</h3>
                    <p>${info.informationAccuracy.content}</p>
                    <ul class="law-list">
                        ${info.informationAccuracy.notes.map(note => `<li>${note}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.liability) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-gavel"></i> ${info.liability.title}</h3>
                    <p>${info.liability.content}</p>
                    <ul class="law-list">
                        ${info.liability.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.userResponsibility) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-user-shield"></i> ${info.userResponsibility.title}</h3>
                    <p>${info.userResponsibility.content}</p>
                    <ul class="law-list">
                        ${info.userResponsibility.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (info.officialSources) {
            html += `
                <div class="law-section">
                    <h3><i class="fas fa-globe"></i> ${info.officialSources.title}</h3>
                    <p>${info.officialSources.content}</p>
                    <ul class="law-list">
                        ${info.officialSources.sources.map(source => `<li>${source}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    html += `</div>`;
    
    modalBody.innerHTML = html;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close law modal
function closeLawModal() {
    document.getElementById('lawModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('lawModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLawModal();
            }
        });
    }
});

// Expose functions globally
window.showLawDetails = showLawDetails;
window.closeLawModal = closeLawModal;

// ============================================
// INTERACTIVE FAQ SYSTEM
// ============================================

// Comprehensive FAQ Data
const FAQ_DATA = [
    {
        id: 1,
        category: 'eligibility',
        question: 'Can I migrate without IELTS?',
        answer: 'Yes! Multiple alternatives exist, but requirements vary by country. Here\'s a comprehensive breakdown:',
        details: [
            '🇨🇦 CANADA - Multiple Options Available:',
            '  ✅ CELPIP (Canadian English) - Fully accepted, easier format for some',
            '  ✅ TEF (French) - For Quebec programs, can be easier than English',
            '  ✅ PTE Academic - Accepted for Express Entry, faster results',
            '  ✅ Quebec Skilled Worker - French-only pathway, no English test needed',
            '  💡 Tip: CELPIP is often considered easier than IELTS for Canadian migration',
            '',
            '🇦🇺 AUSTRALIA - Flexible Testing:',
            '  ✅ PTE Academic - Widely accepted, computer-based, results in 2-5 days',
            '  ✅ TOEFL iBT - Accepted for most visa types',
            '  ✅ OET (Occupational English) - For healthcare professionals',
            '  ✅ Cambridge English - C1 Advanced accepted',
            '  ✅ Exemptions - Citizens of UK, USA, Canada, Ireland, New Zealand',
            '  💡 Tip: PTE often provides higher scores than IELTS for same skill level',
            '',
            '🇩🇪 GERMANY - No English Test Required:',
            '  ✅ Opportunity Card (Chancenkarte) - No English test needed',
            '  ✅ German A2-B2 gives points but not mandatory initially',
            '  ✅ Can learn German after arrival',
            '  💡 Best Option: If you want to avoid English tests completely',
            '',
            '🇬🇧 UK - Multiple Test Options:',
            '  ✅ PTE Academic - Accepted for most visas',
            '  ✅ TOEFL - Accepted for student and work visas',
            '  ✅ Cambridge English - B1/B2/C1 levels accepted',
            '  ✅ Exemptions - Nationals of majority English-speaking countries',
            '  💡 Tip: UK accepts more test types than most countries',
            '',
            '📊 COMPARISON TABLE:',
            '  Test Type | Canada | Australia | UK | Germany',
            '  IELTS     | ✅ Yes | ✅ Yes    | ✅ Yes | ❌ No',
            '  PTE       | ✅ Yes | ✅ Yes    | ✅ Yes | ❌ No',
            '  CELPIP    | ✅ Yes | ❌ No     | ❌ No  | ❌ No',
            '  TOEFL     | ❌ No  | ✅ Yes    | ✅ Yes | ❌ No',
            '  French    | ✅ Yes | ❌ No     | ❌ No  | ❌ No',
            '',
            '⚠️ IMPORTANT CONSIDERATIONS:',
            '  • Higher language scores = More points in points-based systems',
            '  • IELTS is still the most widely recognized globally',
            '  • Some tests are easier for certain people (computer-based vs paper)',
            '  • Test costs vary: IELTS ($200-250), PTE ($200), CELPIP ($280 CAD)',
            '  • Validity: Most tests valid for 2 years',
            '',
            '🎯 RECOMMENDATION:',
            '  If avoiding IELTS: Consider Germany (no English test) or Canada with CELPIP/PTE',
            '  If maximizing points: Take IELTS/PTE and aim for highest scores (CLB 9+ for Canada, 8.0+ for Australia)',
            '  Best strategy: Research which test format suits you better (computer vs paper, speaking format, etc.)'
        ],
        related: [2, 6, 13],
        tags: ['ielts', 'language', 'eligibility', 'alternatives', 'pte', 'celpip']
    },
    {
        id: 2,
        category: 'age',
        question: 'Can I migrate after 35?',
        answer: 'Absolutely YES! Age 35+ is very viable. Here\'s detailed breakdown by country with strategies:',
        details: [
            '🇨🇦 CANADA - Age Points Breakdown:',
            '  📊 Age 18-35: 110 points (maximum)',
            '  📊 Age 36: 105 points (-5)',
            '  📊 Age 37: 99 points (-11)',
            '  📊 Age 38: 94 points (-16)',
            '  📊 Age 39: 88 points (-22)',
            '  📊 Age 40: 83 points (-27)',
            '  📊 Age 41: 77 points (-33)',
            '  📊 Age 42: 72 points (-38)',
            '  📊 Age 43: 66 points (-44)',
            '  📊 Age 44: 61 points (-49)',
            '  📊 Age 45+: 0 points',
            '  ✅ Compensation Strategy:',
            '     • Master\'s/PhD: +23-25 education points',
            '     • 3+ years experience: +11-15 points',
            '     • CLB 9+ language: +24 points (first language)',
            '     • French language: +50 additional points',
            '     • Canadian education: +30 points',
            '     • Job offer: +50 to +200 points',
            '  💡 Real Example: Age 40 with Master\'s, 5 years exp, CLB 9 = Still competitive!',
            '',
            '🇦🇺 AUSTRALIA - Age Points System:',
            '  📊 Age 18-24: 25 points',
            '  📊 Age 25-32: 30 points (maximum)',
            '  📊 Age 33-39: 25 points (still excellent!)',
            '  📊 Age 40-44: 15 points',
            '  📊 Age 45+: 0 points',
            '  ✅ Success Stories: Many professionals aged 40-44 successfully migrate',
            '  ✅ Compensation Options:',
            '     • Superior English (8.0+): +20 points',
            '     • 8+ years experience: +15-20 points',
            '     • State nomination (190): +5 points',
            '     • Regional nomination (491): +15 points',
            '     • Partner skills: +10 points',
            '     • Professional Year: +5 points',
            '  💡 Tip: Age 40-44 can still reach 65+ points with strong profile',
            '',
            '🇩🇪 GERMANY - No Age Discrimination:',
            '  ✅ No maximum age limit for Opportunity Card',
            '  ✅ Age under 35: +2 points (bonus, not requirement)',
            '  ✅ Focus on: Degree, experience, German language, shortage occupation',
            '  💡 Best Option: If you\'re 40+ and want fastest pathway',
            '',
            '🇬🇧 UK - Age-Friendly System:',
            '  ✅ No age restrictions for Skilled Worker visa',
            '  ✅ Points-based system doesn\'t penalize age',
            '  ✅ Focus on: Job offer, salary threshold, English proficiency',
            '  💡 Advantage: Age doesn\'t affect points calculation',
            '',
            '📈 COMPENSATION STRATEGY (For 35+ Applicants):',
            '  1. Maximize Language Scores:',
            '     • Aim for CLB 9+ (Canada) or 8.0+ (Australia)',
            '     • Consider learning French for Canada (+50 points)',
            '',
            '  2. Boost Education Points:',
            '     • Complete Master\'s or PhD if possible',
            '     • Get ECA for highest qualification',
            '',
            '  3. Accumulate Work Experience:',
            '     • 5+ years gives maximum points',
            '     • Document all experience thoroughly',
            '',
            '  4. Target Job Offers:',
            '     • LMIA job offer: +50 to +200 points (Canada)',
            '     • State nomination: +5 to +15 points (Australia)',
            '',
            '  5. Consider Alternative Pathways:',
            '     • Provincial Nominee Programs (Canada)',
            '     • Regional visas (Australia 491)',
            '     • Business/Investor visas',
            '',
            '💰 COST-BENEFIT ANALYSIS:',
            '  • Age 35-39: Still competitive, focus on maximizing other points',
            '  • Age 40-44: Requires stronger profile, but very achievable',
            '  • Age 45+: Consider business/investor visas or family sponsorship',
            '',
            '🎯 SUCCESS RATE BY AGE:',
            '  • Age 30-35: Highest success rate (maximum points)',
            '  • Age 35-40: High success rate (slight point reduction)',
            '  • Age 40-45: Moderate success (requires strong profile)',
            '  • Age 45+: Lower success for points-based, consider alternatives',
            '',
            '✅ BOTTOM LINE:',
            '  Age 35-44: Very viable with strong profile',
            '  Key: Maximize education, experience, and language scores',
            '  Strategy: Target countries/programs where age impact is minimal (Germany, UK)'
        ],
        related: [1, 5, 6, 10],
        tags: ['age', 'eligibility', 'points', 'strategy', '35+', 'compensation']
    },
    {
        id: 3,
        category: 'age',
        question: 'Can I take my family with me?',
        answer: 'YES! Most countries allow family inclusion. Here\'s comprehensive guide with costs, rights, and requirements:',
        details: [
            '👨‍👩‍👧‍👦 WHO CAN BE INCLUDED:',
            '  ✅ Spouse/Common-law Partner: Included in most applications',
            '  ✅ Dependent Children: Usually under 18-22 (varies by country)',
            '  ✅ Sometimes Parents: In specific programs (e.g., Canada Parent/Grandparent)',
            '',
            '🇨🇦 CANADA - Family Inclusion Details:',
            '  ✅ Spouse Rights:',
            '     • Can work immediately (Open Work Permit)',
            '     • Can study without separate permit',
            '     • Included in same application',
            '     • Health and character checks required',
            '  ✅ Children Rights:',
            '     • Free public education (K-12)',
            '     • Can work part-time if 16+',
            '     • Dependent until age 22 (if full-time student)',
            '  💰 Additional Costs:',
            '     • Application fee: $1,325 CAD per adult, $225 per child',
            '     • Medical exam: $200-400 per person',
            '     • Biometrics: $85 per person',
            '     • Proof of funds: +$3,000-4,000 CAD per family member',
            '  📊 Points Impact:',
            '     • Spouse language (CLB 4+): +5 adaptability points',
            '     • Spouse education: +5 adaptability points',
            '     • Canadian experience (spouse): +5 adaptability points',
            '',
            '🇦🇺 AUSTRALIA - Family Benefits:',
            '  ✅ Spouse Rights:',
            '     • Full work rights immediately',
            '     • Can be included in same application',
            '     • Health and character requirements',
            '  ✅ Children Rights:',
            '     • Free public education',
            '     • Dependent until age 23 (if full-time student)',
            '  💰 Additional Costs:',
            '     • Application fee: $4,115 AUD per adult, $1,030 per child (Subclass 189)',
            '     • Medical exam: $300-500 AUD per person',
            '     • Police clearance: $50-100 per person',
            '     • Proof of funds: +$5,000-8,000 AUD per family member',
            '  📊 Points Impact (HUGE ADVANTAGE!):',
            '     • Skilled partner: +10 points (major boost!)',
            '     • Partner with competent English: +5 points',
            '     • Single applicant: 0 points (no partner bonus)',
            '  💡 Strategy: If your partner has skills/education, include them for +10 points!',
            '',
            '🇬🇧 UK - Family Inclusion:',
            '  ✅ Spouse Rights:',
            '     • Can work immediately (no restrictions)',
            '     • Included in same application',
            '     • Health surcharge: £624 per year per person',
            '  ✅ Children Rights:',
            '     • Free public education',
            '     • Dependent until age 18 (or 19 if in full-time education)',
            '  💰 Additional Costs:',
            '     • Application fee: £625 per person (Skilled Worker)',
            '     • Health surcharge: £624/year per person',
            '     • Proof of funds: £285 per dependent (if outside UK)',
            '',
            '🇩🇪 GERMANY - Family Reunification:',
            '  ✅ Spouse Rights:',
            '     • Can work immediately',
            '     • Can apply for family reunification visa',
            '     • Basic German A1 required for spouse visa',
            '  ✅ Children Rights:',
            '     • Free public education',
            '     • Dependent until age 18',
            '  💰 Additional Costs:',
            '     • Family reunification fee: €75 per person',
            '     • Health insurance: €200-400/month per person',
            '     • Proof of funds: €934/month per adult, €500/month per child',
            '',
            '📋 DOCUMENTATION REQUIRED FOR FAMILY:',
            '  For Spouse:',
            '     • Marriage certificate (translated if needed)',
            '     • Relationship proof (photos, joint accounts, etc.)',
            '     • Passport and photos',
            '     • Medical exam results',
            '     • Police clearance certificate',
            '     • Language test (if required by country)',
            '',
            '  For Children:',
            '     • Birth certificates',
            '     • Passport and photos',
            '     • Medical exam results',
            '     • School records (if applicable)',
            '     • Custody documents (if divorced)',
            '',
            '⏱️ PROCESSING TIME IMPACT:',
            '  • Single applicant: Standard processing time',
            '  • With family: May add 1-3 months due to additional checks',
            '  • All family members processed together (same timeline)',
            '',
            '💰 TOTAL COST COMPARISON (Family of 4: 2 adults + 2 children):',
            '  Canada: ~$5,000-7,000 CAD (fees + medicals + funds)',
            '  Australia: ~$12,000-15,000 AUD (fees + medicals + funds)',
            '  UK: ~£3,500-5,000 (fees + health surcharge)',
            '  Germany: ~€2,000-3,000 (fees + insurance + funds)',
            '',
            '✅ ADVANTAGES OF INCLUDING FAMILY:',
            '  1. Points Boost: Skilled spouse adds +10 points (Australia)',
            '  2. Immediate Work Rights: Spouse can work and contribute',
            '  3. Family Unity: No separation, everyone gets PR together',
            '  4. Education Benefits: Children get free public education',
            '  5. Healthcare Access: Family included in healthcare system',
            '',
            '⚠️ IMPORTANT CONSIDERATIONS:',
            '  • All family members must pass medical and character checks',
            '  • If one member fails, entire application may be affected',
            '  • Proof of funds increases significantly with family',
            '  • Processing time may be longer',
            '  • All must maintain status together',
            '',
            '🎯 RECOMMENDATION:',
            '  Include family if: You have strong relationship proof, sufficient funds, and spouse has skills',
            '  Consider separate application if: Spouse has health issues, insufficient funds, or wants to apply later',
            '  Best Strategy: Include skilled spouse for points boost (especially Australia +10 points)'
        ],
        related: [2, 5, 7, 11],
        tags: ['family', 'dependents', 'spouse', 'children', 'costs', 'rights']
    },
    {
        id: 4,
        category: 'visa',
        question: 'Can I work on a visitor visa?',
        answer: '⚠️ STRICTLY NO for employment, but limited business activities are allowed. Here\'s detailed breakdown:',
        details: [
            '🚫 WHAT IS PROHIBITED (Employment):',
            '  ❌ Taking any paid employment',
            '  ❌ Working for a company (even remotely)',
            '  ❌ Starting a business',
            '  ❌ Freelancing or consulting for payment',
            '  ❌ Any work that displaces a local worker',
            '',
            '✅ WHAT IS ALLOWED (Business Activities):',
            '  ✅ Attending business meetings',
            '  ✅ Attending conferences and seminars',
            '  ✅ Job interviews (but cannot start work)',
            '  ✅ Negotiating contracts (but cannot execute)',
            '  ✅ Training sessions (as attendee, not trainer)',
            '  ✅ Market research and business exploration',
            '',
            '🇨🇦 CANADA - Visitor Visa Rules:',
            '  ✅ Allowed:',
            '     • Business meetings and conferences',
            '     • Job interviews',
            '     • Short-term business activities (< 6 months)',
            '  ❌ Prohibited:',
            '     • Any paid work',
            '     • Working remotely for foreign employer',
            '  ⚠️ Penalties:',
            '     • Immediate deportation',
            '     • 5-year entry ban',
            '     • Permanent record in immigration system',
            '     • Future visa applications likely rejected',
            '',
            '🇦🇺 AUSTRALIA - Visitor Visa (Subclass 600):',
            '  ✅ Allowed:',
            '     • Business visitor activities',
            '     • Job interviews',
            '     • Attending conferences',
            '  ❌ Prohibited:',
            '     • Any form of employment',
            '     • Working holiday activities (need separate visa)',
            '  ⚠️ Penalties:',
            '     • Deportation and 3-year exclusion period',
            '     • Criminal charges possible',
            '     • Future applications severely impacted',
            '',
            '🇬🇧 UK - Standard Visitor Visa:',
            '  ✅ Allowed:',
            '     • Business meetings (up to 6 months)',
            '     • Job interviews',
            '     • Attending conferences',
            '     • Short-term work (specific permitted activities)',
            '  ❌ Prohibited:',
            '     • Taking employment',
            '     • Doing work for a UK company',
            '  ⚠️ Penalties:',
            '     • Deportation',
            '     • 10-year re-entry ban possible',
            '     • Criminal record',
            '',
            '🇩🇪 GERMANY - Schengen Visa:',
            '  ✅ Allowed:',
            '     • Business meetings',
            '     • Job interviews',
            '     • Attending trade fairs',
            '  ❌ Prohibited:',
            '     • Any employment',
            '     • Freelance work',
            '  ⚠️ Penalties:',
            '     • Immediate deportation',
            '     • Schengen area ban (affects all EU countries)',
            '     • Future visa rejections',
            '',
            '💰 FINANCIAL IMPACT OF ILLEGAL WORK:',
            '  • Lost wages (if caught, wages may be confiscated)',
            '  • Legal fees: $5,000-20,000+ for defense',
            '  • Deportation costs: $1,000-3,000',
            '  • Future visa application fees: Wasted if rejected',
            '  • Lost opportunities: Cannot return for years',
            '',
            '📋 WHAT CONSTITUTES "WORK":',
            '  • Any activity for which you receive payment',
            '  • Providing services (even if unpaid, if it\'s work)',
            '  • Remote work for foreign employer (still considered work)',
            '  • Freelancing or consulting',
            '  • Starting or running a business',
            '',
            '✅ LEGAL ALTERNATIVES:',
            '  1. Business Visitor Visa:',
            '     • For meetings, conferences, negotiations',
            '     • Cannot take employment',
            '     • Valid for 6-12 months typically',
            '',
            '  2. Work Permit/Work Visa:',
            '     • Apply from home country after job offer',
            '     • Proper authorization required',
            '     • Allows legal employment',
            '',
            '  3. Working Holiday Visa (if eligible):',
            '     • Age 18-30/35 (varies by country)',
            '     • Allows work and travel',
            '     • Limited duration (1-2 years)',
            '',
            '  4. Job Seeker Visa (some countries):',
            '     • Germany: 6-month job seeker visa',
            '     • Allows job search and interviews',
            '     • Can convert to work visa if job found',
            '',
            '🔄 PROPER PROCESS IF YOU FIND A JOB:',
            '  Step 1: Attend job interview on visitor visa (allowed)',
            '  Step 2: Receive job offer',
            '  Step 3: Exit the country (return home)',
            '  Step 4: Apply for proper work visa from home country',
            '  Step 5: Wait for approval (2-8 weeks typically)',
            '  Step 6: Enter country with work visa',
            '  Step 7: Start employment legally',
            '',
            '⚠️ COMMON MISTAKES TO AVOID:',
            '  ❌ "I\'ll just work remotely for my home country employer" - Still illegal!',
            '  ❌ "It\'s just a few days of work" - Still illegal!',
            '  ❌ "I\'m not getting paid, so it\'s fine" - Still may be considered work!',
            '  ❌ "I\'ll convert my visitor visa to work visa" - Usually not possible, must exit first',
            '',
            '📊 RISK ASSESSMENT:',
            '  High Risk Activities:',
            '     • Working in restaurants, construction, retail',
            '     • Any visible employment',
            '     • Activities that require work permits',
            '',
            '  Lower Risk (but still check rules):',
            '     • Attending business meetings',
            '     • Job interviews',
            '     • Conferences and seminars',
            '',
            '✅ BOTTOM LINE:',
            '  • NEVER work on a visitor visa - consequences are severe',
            '  • Use visitor visa for: business meetings, job interviews, tourism',
            '  • If you find a job: Exit country and apply for proper work visa',
            '  • Better option: Apply for job seeker visa or work permit from start',
            '  • When in doubt: Consult immigration lawyer before any work activity'
        ],
        related: [7, 8, 10, 15],
        tags: ['visitor visa', 'work', 'illegal', 'penalties', 'business visa', 'legal']
    },
    {
        id: 5,
        category: 'pr',
        question: 'Which country is easiest for PR?',
        answer: 'Easiest depends on your profile! Here\'s comprehensive comparison with difficulty ratings, timelines, and success strategies:',
        details: [
            '🏆 RANKING BY DIFFICULTY (Easiest to Hardest):',
            '',
            '🥇 #1 GERMANY - Opportunity Card (Chancenkarte) - EASIEST',
            '  ✅ Points Required: Only 6/14 points (very achievable!)',
            '  ✅ Job Offer: NOT required initially',
            '  ✅ Language: No English test, German A2-B2 gives points',
            '  ✅ Age: No maximum age limit',
            '  ✅ Processing: 3-6 months (fastest!)',
            '  ✅ Cost: ~€1,500-2,500 (relatively low)',
            '  ✅ Success Rate: High (if you meet 6 points)',
            '  📊 Points Breakdown:',
            '     • Recognized Degree: +4 points',
            '     • 2+ years experience: +3 points',
            '     • German A2: +1 point, B1: +2, B2: +3',
            '     • Age under 35: +2 points',
            '     • Previous stay in Germany: +1 point',
            '     • Shortage occupation: +1 point',
            '  💡 Best For: Skilled workers, IT professionals, engineers',
            '  ⚠️ Considerations: Need to learn German, find job within 1 year',
            '',
            '🥈 #2 CANADA - Express Entry - MODERATE',
            '  ✅ Points Required: 67/100 (FSW) + CRS 470+ (competitive)',
            '  ✅ Job Offer: NOT mandatory (but helps with +50-200 points)',
            '  ✅ Language: CLB 7 minimum, CLB 9+ recommended',
            '  ✅ Age: 18-35 optimal, but 35-44 still viable',
            '  ✅ Processing: 6 months after ITA (12-18 months total)',
            '  ✅ Cost: ~$2,500-4,000 CAD',
            '  ✅ Success Rate: Moderate-High (if CRS 470+)',
            '  📊 CRS Score Factors:',
            '     • Age: Up to 110 points',
            '     • Education: Up to 150 points',
            '     • Language: Up to 160 points',
            '     • Experience: Up to 80 points',
            '     • Job offer: +50 to +200 points',
            '     • Provincial nomination: +600 points',
            '  💡 Best For: Young professionals, high IELTS scores, IT/healthcare',
            '  ⚠️ Considerations: Competitive, need high CRS score',
            '',
            '🥉 #3 AUSTRALIA - Skilled Migration - MODERATE-HARD',
            '  ✅ Points Required: 65 minimum, but 80-90+ competitive',
            '  ✅ Job Offer: NOT needed for Subclass 189',
            '  ✅ Language: IELTS 6.0 minimum, 8.0+ gives 20 points',
            '  ✅ Age: 25-32 optimal (30 points), 33-39 still good (25 points)',
            '  ✅ Processing: 6-12 months after invitation',
            '  ✅ Cost: ~$8,000-12,000 AUD (higher)',
            '  ✅ Success Rate: Moderate (need 80+ points for competitiveness)',
            '  📊 Points Breakdown:',
            '     • Age: Up to 30 points',
            '     • English: Up to 20 points',
            '     • Experience: Up to 20 points',
            '     • Education: Up to 20 points',
            '     • State nomination: +5 points (190)',
            '     • Regional nomination: +15 points (491)',
            '     • Skilled partner: +10 points',
            '  💡 Best For: Healthcare workers, IT, engineers, accountants',
            '  ⚠️ Considerations: Higher costs, competitive points needed',
            '',
            '4️⃣ #4 UK - Skilled Worker Visa - MODERATE',
            '  ✅ Points Required: 70 points (straightforward system)',
            '  ✅ Job Offer: REQUIRED (sponsorship needed)',
            '  ✅ Language: B1 level (IELTS 4.0-5.0) minimum',
            '  ✅ Age: No restrictions',
            '  ✅ Processing: 3-8 weeks (very fast!)',
            '  ✅ Cost: ~£3,000-5,000',
            '  ✅ Success Rate: High (if you have job offer)',
            '  📊 Points Breakdown:',
            '     • Job offer: 20 points',
            '     • Skill level: 20 points',
            '     • Salary threshold: 20 points',
            '     • English language: 10 points',
            '  💡 Best For: Those with job offers, healthcare, IT',
            '  ⚠️ Considerations: Need employer sponsorship, salary thresholds',
            '',
            '5️⃣ #5 PORTUGAL - D7/D2 Visa - EASY (Specific Conditions)',
            '  ✅ Requirements: Passive income (D7) or business investment (D2)',
            '  ✅ Job Offer: NOT required',
            '  ✅ Language: Portuguese helpful but not mandatory',
            '  ✅ Age: No restrictions',
            '  ✅ Processing: 2-4 months',
            '  ✅ Cost: ~€2,000-5,000',
            '  ✅ Success Rate: High (if you meet income requirements)',
            '  💡 Best For: Retirees, remote workers, investors',
            '  ⚠️ Considerations: Need passive income or investment capital',
            '',
            '📊 COMPREHENSIVE COMPARISON TABLE:',
            '',
            'Factor | Germany | Canada | Australia | UK | Portugal',
            '-------|---------|--------|----------|----|---------',
            'Difficulty | ⭐ Easy | ⭐⭐ Moderate | ⭐⭐⭐ Moderate-Hard | ⭐⭐ Moderate | ⭐ Easy*',
            'Points Needed | 6/14 | 67+ & CRS 470+ | 65+ (80+ competitive) | 70 | Income-based',
            'Job Offer | ❌ No | ❌ No (helps) | ❌ No (189) | ✅ Yes | ❌ No',
            'Processing Time | 3-6 months | 12-18 months | 12-24 months | 3-8 weeks | 2-4 months',
            'Cost | €1,500-2,500 | $2,500-4,000 | $8,000-12,000 | £3,000-5,000 | €2,000-5,000',
            'Language Test | German A2+ | CLB 7+ | IELTS 6.0+ | B1 | Not required',
            'Age Limit | ❌ No | ⚠️ 45+ (0 pts) | ⚠️ 45+ (0 pts) | ❌ No | ❌ No',
            'Success Rate | High | Moderate-High | Moderate | High | High*',
            '',
            '*Portugal: Easy if you have passive income/investment',
            '',
            '🎯 PROFILE-BASED RECOMMENDATIONS:',
            '',
            'If you have:',
            '  • High IELTS (8.0+): → Canada or Australia',
            '  • Job offer: → UK (fastest)',
            '  • Low points/age 40+: → Germany',
            '  • Passive income: → Portugal',
            '  • IT/Engineering skills: → Germany or Canada',
            '  • Healthcare background: → Australia or UK',
            '  • French language: → Canada (Quebec)',
            '',
            '💰 COST COMPARISON (Total including fees, medicals, funds):',
            '  1. Germany: €1,500-2,500 (Lowest)',
            '  2. Portugal: €2,000-5,000',
            '  3. Canada: $2,500-4,000 CAD (~€1,700-2,700)',
            '  4. UK: £3,000-5,000 (~€3,400-5,700)',
            '  5. Australia: $8,000-12,000 AUD (~€5,000-7,500) (Highest)',
            '',
            '⏱️ TIMELINE COMPARISON (From application to PR):',
            '  1. UK: 3-8 weeks (Fastest - but need job offer)',
            '  2. Germany: 3-6 months',
            '  3. Portugal: 2-4 months',
            '  4. Canada: 12-18 months (6 months after ITA)',
            '  5. Australia: 12-24 months (6-12 months after invitation)',
            '',
            '✅ SUCCESS STRATEGY BY COUNTRY:',
            '',
            'For Germany:',
            '  • Get degree recognized',
            '  • Learn German to A2-B2 level',
            '  • Highlight shortage occupation experience',
            '',
            'For Canada:',
            '  • Maximize IELTS to CLB 9+',
            '  • Get ECA for education',
            '  • Consider French language (+50 points)',
            '  • Target Provincial Nominee Programs',
            '',
            'For Australia:',
            '  • Aim for 80+ points',
            '  • Include skilled partner (+10 points)',
            '  • Consider regional visas (491) for +15 points',
            '  • Get superior English (8.0+) for +20 points',
            '',
            'For UK:',
            '  • Secure job offer first',
            '  • Ensure salary meets threshold',
            '  • Get employer sponsorship',
            '',
            '🎯 FINAL RECOMMENDATION:',
            '  Easiest Overall: Germany (if you can learn German)',
            '  Fastest: UK (if you have job offer)',
            '  Best for High Scorers: Canada or Australia',
            '  Best for Investors: Portugal',
            '  Best Strategy: Apply to 2-3 countries where you score highest, accept first approval'
        ],
        related: [1, 2, 6, 8, 10],
        tags: ['pr', 'easiest', 'comparison', 'strategy', 'germany', 'canada', 'australia', 'uk']
    },
    {
        id: 6,
        category: 'eligibility',
        question: 'What is the minimum IELTS score required?',
        answer: 'Minimum scores vary by country and visa type:',
        details: [
            'Canada (Express Entry): CLB 7 (IELTS 6.0 in all bands) minimum, but CLB 9+ (7.0+ bands) gives maximum points.',
            'Australia: IELTS 6.0 (Competent) minimum for most visas, but 7.0+ (Proficient) gives 10 points, 8.0+ (Superior) gives 20 points.',
            'UK: B1 level (IELTS 4.0-5.0) minimum for most visas, but higher scores improve application strength.',
            'Germany: No IELTS required for Opportunity Card, but German A2-B2 gives points.',
            'Important: Higher scores = More points = Better chances. Aim for CLB 9+ (Canada) or 7.0+ (Australia) for competitive profiles.'
        ],
        related: [1, 2, 5],
        tags: ['ielts', 'language', 'minimum', 'scores']
    },
    {
        id: 7,
        category: 'work',
        question: 'Can I change jobs after getting PR?',
        answer: 'Yes, PR holders have job flexibility:',
        details: [
            'Canada: PR holders can work for any employer, change jobs freely, start businesses, or be self-employed. No restrictions.',
            'Australia: PR holders have full work rights - can work anywhere, change employers, or start businesses.',
            'UK: Indefinite Leave to Remain (ILR) holders can work without restrictions.',
            'Germany: Permanent residence allows free job changes and self-employment.',
            'Note: This is a major advantage of PR over temporary work visas, which are usually tied to specific employers.'
        ],
        related: [3, 4, 8],
        tags: ['pr', 'work', 'job change', 'freedom']
    },
    {
        id: 8,
        category: 'process',
        question: 'How long does the PR process take?',
        answer: 'Processing times vary significantly:',
        details: [
            'Canada (Express Entry): 6 months from ITA (Invitation to Apply) to PR approval. Total timeline: 12-18 months including profile creation and waiting for ITA.',
            'Australia: 6-12 months for skilled visas (189/190/491) after invitation. Total: 12-24 months including EOI submission.',
            'Germany (Opportunity Card): 3-6 months for visa approval. Fastest among major destinations.',
            'UK (Skilled Worker): 3-8 weeks for visa decision. ILR takes 5 years of residence.',
            'Factors Affecting Time: Country, visa type, application completeness, background checks, medical exams, and current processing backlogs.'
        ],
        related: [5, 9, 10],
        tags: ['processing time', 'timeline', 'duration']
    },
    {
        id: 9,
        category: 'process',
        question: 'What documents do I need for PR application?',
        answer: 'Required documents vary by country, but common requirements include:',
        details: [
            'Identity: Passport, birth certificate, marriage certificate (if applicable), photos.',
            'Education: Degree certificates, transcripts, ECA (Educational Credential Assessment) for Canada/Australia.',
            'Work Experience: Employment letters, salary slips, tax documents, reference letters with detailed job descriptions.',
            'Language: IELTS/PTE/CELPIP test results (valid for 2 years).',
            'Financial: Bank statements (6-12 months), proof of funds, employment contracts.',
            'Medical: Immigration medical exam from approved panel physicians.',
            'Police Clearance: Character certificates from all countries lived in (6+ months) in past 10 years.',
            'Country-Specific: Some require job offers, provincial nominations, or additional forms.'
        ],
        related: [8, 10, 11],
        tags: ['documents', 'requirements', 'checklist']
    },
    {
        id: 10,
        category: 'eligibility',
        question: 'Do I need a job offer to migrate?',
        answer: 'It depends on the country and visa program:',
        details: [
            'Canada: No job offer needed for Express Entry (FSW/CEC/FST). Job offer gives +50 to +200 CRS points but not mandatory.',
            'Australia: No job offer needed for Subclass 189 (independent). Subclass 190/491 may require state nomination (not always job offer).',
            'Germany: No job offer needed for Opportunity Card. You can search for jobs after arrival.',
            'UK: Job offer and sponsorship required for Skilled Worker visa (most common route).',
            'USA: Job offer and H1B sponsorship typically required for work-based immigration.',
            'Best Option: Canada and Australia offer job-offer-free pathways, making them popular choices.'
        ],
        related: [5, 7, 8],
        tags: ['job offer', 'sponsorship', 'requirements']
    },
    {
        id: 11,
        category: 'pr',
        question: 'What is the difference between PR and Citizenship?',
        answer: 'Key differences between Permanent Residence and Citizenship:',
        details: [
            'Permanent Residence (PR):',
            '  • Can live and work indefinitely in the country',
            '  • Can access healthcare and education',
            '  • Must maintain PR status (residency requirements)',
            '  • Cannot vote in elections',
            '  • Cannot hold a passport of that country',
            '  • Can be revoked for serious crimes',
            '',
            'Citizenship:',
            '  • All PR rights PLUS:',
            '  • Right to vote and run for office',
            '  • Can hold that country\'s passport',
            '  • Cannot be deported (except in extreme cases)',
            '  • Can pass citizenship to children',
            '  • Usually requires 3-5 years of PR status first'
        ],
        related: [3, 7, 12],
        tags: ['pr', 'citizenship', 'difference', 'rights']
    },
    {
        id: 12,
        category: 'process',
        question: 'Can I apply for multiple countries at once?',
        answer: 'Yes, you can apply to multiple countries simultaneously:',
        details: [
            'Legal: There\'s no law preventing applications to multiple countries. Each country processes independently.',
            'Costs: Each application requires separate fees (application fees, medical exams, police clearances, translations).',
            'Time Management: Multiple applications require significant time for document preparation and follow-ups.',
            'Strategy: Apply to 2-3 countries where you have strong profiles. Accept the first approval.',
            'Important: You must withdraw other applications once you accept a PR and move, to avoid complications.',
            'Best Practice: Focus on 1-2 primary countries where you score highest, rather than spreading too thin.'
        ],
        related: [5, 8, 10],
        tags: ['multiple applications', 'strategy', 'simultaneous']
    },
    {
        id: 13,
        category: 'language',
        question: 'Can I improve my IELTS score after submitting application?',
        answer: 'It depends on the stage of your application:',
        details: [
            'Before Submission: Yes, you can retake IELTS and use the higher score. Most countries accept the best score.',
            'After Submission (Canada Express Entry): You can update your profile with new IELTS scores to increase CRS points, even after creating profile (before ITA).',
            'After ITA (Invitation): Generally cannot change IELTS scores, as application is locked. Must use scores from profile.',
            'Australia: Can update EOI with new IELTS scores before invitation. After invitation, scores are locked.',
            'Best Strategy: Retake IELTS if you\'re close to next band level (e.g., 6.5 to 7.0) before submitting final application.',
            'Validity: IELTS scores are valid for 2 years. Ensure they\'re valid at time of application submission.'
        ],
        related: [1, 6, 14],
        tags: ['ielts', 'improvement', 'retake', 'update']
    },
    {
        id: 14,
        category: 'eligibility',
        question: 'What if my occupation is not in the skilled list?',
        answer: 'Options if your occupation is not listed:',
        details: [
            'Alternative Pathways:',
            '  • Study visa → Post-graduation work permit → PR (Canada/Australia)',
            '  • Business/Investor visas (if you have capital)',
            '  • Family sponsorship (if you have relatives)',
            '  • Provincial/State nomination programs (may have different lists)',
            '',
            'Skill Assessment: Some occupations can be assessed under related codes. Consult with immigration consultants.',
            'Wait for Updates: Occupation lists are updated annually. Your occupation might be added in future.',
            'Change Occupation: Consider upskilling or gaining experience in an in-demand occupation.',
            'Alternative Countries: Some countries (like Germany) don\'t have strict occupation lists.'
        ],
        related: [5, 10, 15],
        tags: ['occupation', 'skilled list', 'alternatives']
    },
    {
        id: 15,
        category: 'work',
        question: 'Can I study while on a work visa?',
        answer: 'It depends on the visa type and country:',
        details: [
            'Canada: Work permit holders can study part-time without a study permit. Full-time study requires a separate study permit.',
            'Australia: Temporary work visa holders can study, but may need to notify immigration. Student visa is separate.',
            'UK: Skilled Worker visa allows part-time study. Full-time study requires switching to Student visa.',
            'Germany: Work visa holders can study part-time. Full-time requires student visa conversion.',
            'Important: Check your specific visa conditions. Some visas explicitly prohibit study or require permission.',
            'Benefit: Studying can improve your PR application by adding points for education and language skills.'
        ],
        related: [7, 11, 14],
        tags: ['study', 'work visa', 'education']
    }
];

// FAQ State Management
let faqState = {
    currentCategory: 'all',
    searchQuery: '',
    filteredFAQs: FAQ_DATA
};

// Initialize FAQ System
function initializeFAQs() {
    renderFAQs();
    setupFAQSearch();
    setupFAQCategories();
}

// Render FAQ Accordion
function renderFAQs() {
    const accordion = document.getElementById('faqAccordion');
    const noResults = document.getElementById('faqNoResults');
    
    if (!accordion) return;
    
    if (faqState.filteredFAQs.length === 0) {
        accordion.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    accordion.style.display = 'block';
    if (noResults) noResults.style.display = 'none';
    
    accordion.innerHTML = faqState.filteredFAQs.map(faq => {
        const relatedQuestions = FAQ_DATA.filter(f => faq.related.includes(f.id));
        const relatedHTML = relatedQuestions.length > 0 
            ? `<div class="faq-related">
                <strong><i class="fas fa-link"></i> Related Questions:</strong>
                ${relatedQuestions.map(r => `<a href="#" onclick="event.preventDefault(); scrollToFAQ(${r.id}); return false;">${r.question}</a>`).join(', ')}
               </div>`
            : '';
        
        // Format details with better structure
        const formattedDetails = faq.details.map(detail => {
            // Handle table-like content
            if (detail.includes('|') && detail.split('|').length > 2) {
                return `<div class="faq-table-wrapper">${formatTableContent(detail)}</div>`;
            }
            // Handle section headers (lines starting with emoji + text)
            if (/^[🇨🇦🇦🇺🇬🇧🇩🇪🇵🇹👨‍👩‍👧‍👦🚫✅⚠️💰📊💡🎯📋⏱️🔄📈🏆🥇🥈🥉1️⃣2️⃣3️⃣4️⃣5️⃣]/.test(detail.trim())) {
                return `<div class="faq-section-header">${highlightSearch(detail)}</div>`;
            }
            // Handle bullet points with emojis
            if (/^[\s]*[✅❌⚠️💡📊💰⏱️🎯📋]/.test(detail.trim())) {
                return `<li class="faq-detail-item">${highlightSearch(detail)}</li>`;
            }
            // Regular list item
            return `<li>${highlightSearch(detail)}</li>`;
        }).join('');
        
        return `
            <div class="faq-item" data-faq-id="${faq.id}">
                <div class="faq-question" onclick="toggleFAQ(${faq.id})">
                    <div class="faq-question-content">
                        <span class="faq-category-badge category-${faq.category}">
                            <i class="fas fa-${getCategoryIcon(faq.category)}"></i>
                            ${faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                        </span>
                        <h3>${highlightSearch(faq.question)}</h3>
                    </div>
                    <i class="fas fa-chevron-down faq-chevron"></i>
                </div>
                <div class="faq-answer" id="faq-answer-${faq.id}">
                    <div class="faq-answer-content">
                        <p class="faq-answer-intro">${faq.answer}</p>
                        <ul class="faq-details-list">
                            ${formattedDetails}
                        </ul>
                        ${relatedHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    updateResultsCount();
}

// Format table-like content
function formatTableContent(content) {
    const lines = content.split('\n').filter(line => line.trim());
    let tableHTML = '<div class="faq-comparison-table">';
    
    lines.forEach((line, index) => {
        if (line.includes('|')) {
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
            if (index === 0 || line.includes('---')) {
                // Header row
                if (index === 0) {
                    tableHTML += '<div class="faq-table-row faq-table-header">';
                    cells.forEach(cell => {
                        tableHTML += `<div class="faq-table-cell">${cell}</div>`;
                    });
                    tableHTML += '</div>';
                }
            } else {
                // Data row
                tableHTML += '<div class="faq-table-row">';
                cells.forEach((cell, cellIndex) => {
                    const cellClass = cellIndex === 0 ? 'faq-table-cell faq-table-label' : 'faq-table-cell';
                    tableHTML += `<div class="${cellClass}">${highlightSearch(cell)}</div>`;
                });
                tableHTML += '</div>';
            }
        } else {
            // Non-table line
            tableHTML += `<div class="faq-text-line">${highlightSearch(line)}</div>`;
        }
    });
    
    tableHTML += '</div>';
    return tableHTML;
}

// Toggle FAQ Item
function toggleFAQ(id) {
    const answer = document.getElementById(`faq-answer-${id}`);
    const question = document.querySelector(`.faq-item[data-faq-id="${id}"] .faq-question`);
    const chevron = question.querySelector('.faq-chevron');
    
    if (!answer) return;
    
    const isOpen = answer.classList.contains('active');
    
    // Close all other FAQs (optional - remove if you want multiple open)
    document.querySelectorAll('.faq-answer.active').forEach(item => {
        if (item.id !== `faq-answer-${id}`) {
            item.classList.remove('active');
            item.style.maxHeight = null;
            const otherChevron = item.previousElementSibling?.querySelector('.faq-chevron');
            if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
        }
    });
    
    if (isOpen) {
        answer.classList.remove('active');
        answer.style.maxHeight = null;
        chevron.style.transform = 'rotate(0deg)';
    } else {
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        chevron.style.transform = 'rotate(180deg)';
        
        // Smooth scroll to FAQ if it's not fully visible
        setTimeout(() => {
            question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Scroll to specific FAQ
function scrollToFAQ(id) {
    const faqItem = document.querySelector(`.faq-item[data-faq-id="${id}"]`);
    if (faqItem) {
        faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => toggleFAQ(id), 300);
    }
}

// Setup Search Functionality
function setupFAQSearch() {
    const searchInput = document.getElementById('faqSearch');
    const clearBtn = document.getElementById('faqClearSearch');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        faqState.searchQuery = e.target.value.toLowerCase().trim();
        
        if (faqState.searchQuery) {
            if (clearBtn) clearBtn.style.display = 'flex';
            filterFAQs();
        } else {
            if (clearBtn) clearBtn.style.display = 'none';
            filterFAQs();
        }
    });
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            faqState.searchQuery = '';
            clearBtn.style.display = 'none';
            filterFAQs();
        });
    }
}

// Setup Category Filters
function setupFAQCategories() {
    const categoryBtns = document.querySelectorAll('.faq-category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update category filter
            faqState.currentCategory = btn.dataset.category;
            filterFAQs();
        });
    });
}

// Filter FAQs
function filterFAQs() {
    let filtered = FAQ_DATA;
    
    // Filter by category
    if (faqState.currentCategory !== 'all') {
        filtered = filtered.filter(faq => faq.category === faqState.currentCategory);
    }
    
    // Filter by search query
    if (faqState.searchQuery) {
        const query = faqState.searchQuery;
        filtered = filtered.filter(faq => {
            const questionMatch = faq.question.toLowerCase().includes(query);
            const answerMatch = faq.answer.toLowerCase().includes(query);
            const detailsMatch = faq.details.some(d => d.toLowerCase().includes(query));
            const tagsMatch = faq.tags.some(t => t.toLowerCase().includes(query));
            return questionMatch || answerMatch || detailsMatch || tagsMatch;
        });
    }
    
    faqState.filteredFAQs = filtered;
    renderFAQs();
}

// Highlight search terms
function highlightSearch(text) {
    if (!faqState.searchQuery || !text) return text;
    
    const regex = new RegExp(`(${faqState.searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="faq-highlight">$1</mark>');
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'eligibility': 'check-circle',
        'visa': 'passport',
        'language': 'language',
        'age': 'birthday-cake',
        'pr': 'id-card',
        'work': 'briefcase',
        'process': 'cogs'
    };
    return icons[category] || 'question-circle';
}

// Update results count
function updateResultsCount() {
    const countEl = document.getElementById('faqResultsCount');
    if (countEl) {
        const count = faqState.filteredFAQs.length;
        const total = FAQ_DATA.length;
        countEl.textContent = count === total 
            ? `${total} questions available`
            : `Showing ${count} of ${total} questions`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('faqs')) {
        initializeFAQs();
    }
});

// Go back to home page
function goBack() {
    window.location.href = 'index.html';
}

// Expose functions globally
window.toggleFAQ = toggleFAQ;
window.scrollToFAQ = scrollToFAQ;
window.goBack = goBack;