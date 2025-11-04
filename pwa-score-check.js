// PWA Score Checker - Automated validation
// Run with: node pwa-score-check.js

const fs = require('fs');
const path = require('path');

let score = 0;
let totalChecks = 0;
let issues = [];
let passed = [];

function check(name, condition, message) {
    totalChecks++;
    if (condition) {
        score += 100 / totalChecks;
        passed.push(`✅ ${name}: ${message}`);
        return true;
    } else {
        issues.push(`❌ ${name}: ${message}`);
        return false;
    }
}

function checkFile(filePath, name) {
    const fullPath = path.join(__dirname, filePath);
    return fs.existsSync(fullPath);
}

function checkJSON(filePath, name) {
    try {
        const fullPath = path.join(__dirname, filePath);
        const content = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

console.log('🔍 PWA Score Checker - Starting validation...\n');

// 1. Check Manifest File
console.log('📋 Checking Manifest File...');
const manifest = checkJSON('manifest.json', 'manifest.json');
if (manifest) {
    check('Manifest file exists', true, 'manifest.json found');
    
    check('Manifest name', manifest.name && manifest.name.length > 0, manifest.name || 'Missing');
    check('Manifest short_name', manifest.short_name && manifest.short_name.length > 0, manifest.short_name || 'Missing');
    check('Manifest start_url', manifest.start_url, manifest.start_url || 'Missing');
    check('Manifest display', manifest.display, manifest.display || 'Missing');
    check('Manifest theme_color', manifest.theme_color, manifest.theme_color || 'Missing');
    check('Manifest background_color', manifest.background_color, manifest.background_color || 'Missing');
    
    // Check icons
    if (manifest.icons && Array.isArray(manifest.icons)) {
        const has192 = manifest.icons.some(icon => icon.sizes === '192x192');
        const has512 = manifest.icons.some(icon => icon.sizes === '512x512');
        check('Icon 192x192 in manifest', has192, has192 ? 'Found' : 'Missing');
        check('Icon 512x512 in manifest', has512, has512 ? 'Found' : 'Missing');
    } else {
        check('Manifest icons array', false, 'Icons array missing');
    }
} else {
    check('Manifest file exists', false, 'manifest.json not found or invalid');
}

// 2. Check Service Worker
console.log('\n⚙️ Checking Service Worker...');
check('Service Worker file exists', checkFile('sw.js', 'sw.js'), 'sw.js found');
if (checkFile('sw.js', 'sw.js')) {
    const swContent = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
    check('Service Worker has install event', swContent.includes('install'), 'Install event handler found');
    check('Service Worker has activate event', swContent.includes('activate'), 'Activate event handler found');
    check('Service Worker has fetch event', swContent.includes('fetch'), 'Fetch event handler found');
    check('Service Worker has cache name', swContent.includes('CACHE_NAME'), 'Cache configuration found');
}

// 3. Check Icons
console.log('\n🖼️ Checking Icons...');
check('Icon 192x192 exists', checkFile('icons/icon-192x192.png', 'icon-192x192.png'), 'icon-192x192.png found');
check('Icon 512x512 exists', checkFile('icons/icon-512x512.png', 'icon-512x512.png'), 'icon-512x512.png found');

// 4. Check HTML Files
console.log('\n📄 Checking HTML Files...');

function checkHTMLFile(filePath) {
    if (!checkFile(filePath, filePath)) {
        return false;
    }
    
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    const hasManifest = content.includes('rel="manifest"');
    const hasThemeColor = content.includes('theme-color');
    const hasViewport = content.includes('viewport');
    const hasAppleMeta = content.includes('apple-mobile-web-app-capable');
    
    return { hasManifest, hasThemeColor, hasViewport, hasAppleMeta, content };
}

const htmlFiles = ['index.html', 'client-dashboard.html', 'admin-dashboard.html'];
htmlFiles.forEach(file => {
    const result = checkHTMLFile(file);
    if (result) {
        check(`${file} has manifest link`, result.hasManifest, 'Manifest link found');
        check(`${file} has theme-color`, result.hasThemeColor, 'Theme color meta tag found');
        check(`${file} has viewport`, result.hasViewport, 'Viewport meta tag found');
        check(`${file} has Apple meta tags`, result.hasAppleMeta, 'Apple meta tags found');
    } else {
        check(`${file} exists`, false, 'File not found');
    }
});

// 5. Check JavaScript Registration
console.log('\n📜 Checking JavaScript Registration...');

function checkJSFile(filePath) {
    if (!checkFile(filePath, filePath)) {
        return false;
    }
    
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    return {
        hasRegister: content.includes('registerServiceWorker') || content.includes('serviceWorker.register'),
        hasSWRegister: content.includes('serviceWorker.register'),
        content
    };
}

const jsFiles = ['script.js', 'client-dashboard.js', 'admin-dashboard.js'];
jsFiles.forEach(file => {
    const result = checkJSFile(file);
    if (result) {
        check(`${file} has service worker registration`, result.hasSWRegister, 'Service Worker registration found');
    } else {
        check(`${file} exists`, false, 'File not found');
    }
});

// Calculate final score
const finalScore = Math.round((score / totalChecks) * 100);
const percentage = ((passed.length / totalChecks) * 100).toFixed(1);

console.log('\n' + '='.repeat(60));
console.log('📊 PWA SCORE RESULTS');
console.log('='.repeat(60));
console.log(`\n🎯 Overall Score: ${finalScore}/100`);
console.log(`✅ Passed: ${passed.length}/${totalChecks} (${percentage}%)`);
console.log(`❌ Failed: ${issues.length}/${totalChecks}`);

if (passed.length > 0) {
    console.log('\n✅ PASSED CHECKS:');
    passed.forEach(item => console.log(`   ${item}`));
}

if (issues.length > 0) {
    console.log('\n❌ FAILED CHECKS:');
    issues.forEach(item => console.log(`   ${item}`));
}

console.log('\n' + '='.repeat(60));

// Score interpretation
let status = '';
let recommendation = '';

if (finalScore >= 90) {
    status = '🟢 EXCELLENT - Ready for Production';
    recommendation = 'Your PWA is production-ready! Deploy to Vercel for full functionality.';
} else if (finalScore >= 70) {
    status = '🟡 GOOD - Needs Minor Improvements';
    recommendation = 'Fix the issues above and you\'ll have a production-ready PWA.';
} else if (finalScore >= 50) {
    status = '🟠 FAIR - Needs Significant Work';
    recommendation = 'Address the critical issues to improve your PWA score.';
} else {
    status = '🔴 POOR - Not Ready';
    recommendation = 'Fix critical issues before deploying as a PWA.';
}

console.log(`\n📈 Status: ${status}`);
console.log(`💡 Recommendation: ${recommendation}`);

// Lighthouse score estimate
console.log('\n' + '='.repeat(60));
console.log('📱 ESTIMATED LIGHTHOUSE SCORES:');
console.log('='.repeat(60));
console.log(`   Installability: ${finalScore >= 90 ? '100/100' : finalScore >= 70 ? '85/100' : '60/100'}`);
console.log(`   PWA Best Practices: ${finalScore >= 90 ? '90-95/100' : finalScore >= 70 ? '75-85/100' : '50-70/100'}`);
console.log(`   Performance: ${finalScore >= 90 ? '85-95/100' : finalScore >= 70 ? '70-85/100' : '50-70/100'}`);

console.log('\n✨ Note: Actual Lighthouse scores may vary based on:');
console.log('   - Network conditions');
console.log('   - Device performance');
console.log('   - HTTPS deployment (required for Service Worker)');
console.log('   - Image optimization');
console.log('   - Code splitting and minification');

console.log('\n');

