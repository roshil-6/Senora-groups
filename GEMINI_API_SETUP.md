# Google Gemini API Setup Guide

## Quick Fix for "API key not valid" Error

### Step 1: Enable Gemini API in Google Cloud Console

**This is the most common issue!** The API key won't work until the Gemini API is enabled.

1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Sign in with your Google account
3. Click **"Enable"** button
4. Wait for it to enable (usually takes 1-2 minutes)

### Step 2: Verify Your API Key

1. Open your browser console (F12)
2. Run: `testGeminiAPIKey()`
3. This will test if your API key is working

### Step 3: Set Your API Key

If you haven't set it yet, run this in the browser console:
```javascript
setGeminiAPIKey("AIzaSyBkwqfsKjas46mkm--EiYLLH1J528f11II");
```

Or use the setup page: `ai-setup.html`

### Step 4: Check API Key Restrictions

If it still doesn't work:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key
3. Under "API restrictions", make sure "Don't restrict key" is selected OR "Generative Language API" is enabled
4. Under "Application restrictions", select "None" for testing

### Common Issues:

- ❌ **"API key not valid"** → Enable Gemini API in Google Cloud Console
- ❌ **"403 Forbidden"** → Check API key restrictions
- ❌ **CORS errors** → Need to run from a web server (not file://)

### Test Command:

```javascript
// In browser console
testGeminiAPIKey()
```

This will show you exactly what's wrong with your API key.

