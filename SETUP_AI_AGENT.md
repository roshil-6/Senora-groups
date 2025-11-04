# AI Agent Setup Instructions

## Quick Setup (3 Steps)

### Step 1: Get Your API Key
1. Visit: https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with "sk-" or "sk-proj-")

### Step 2: Configure the Key
**Option A - Using Setup Page (Recommended):**
1. Open `ai-setup.html` in your browser
2. Paste your API key
3. Click "Save API Key"
4. You'll be redirected to the dashboard

**Option B - Using Browser Console:**
1. Open your browser's Developer Console (F12)
2. Go to Console tab
3. Run this command:
   ```javascript
   setOpenAIAPIKey('YOUR_API_KEY_HERE');
   ```
4. You should see: "✅ OpenAI API key saved"

### Step 3: Test It
1. Go to Messages section in the client dashboard
2. Type a question like "What documents do I need for Australia GSM visa?"
3. The AI Assistant should respond within a few seconds!

## Your Current API Key
```
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
```

**To use this key:**
1. Open `ai-setup.html` in your browser
2. Paste the key above
3. Click "Save"

OR run in browser console:
```javascript
setOpenAIAPIKey('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');
```

## Security Notes
- ✅ API key is stored locally in browser (safe)
- ✅ Never commit API keys to Git
- ✅ Keep your API key private
- ✅ If key is exposed, regenerate it in OpenAI dashboard

## How It Works
1. **Client sends message** → System checks default Q&A database first
2. **If no match** → AI Agent (GPT-3.5) is called with client's context
3. **AI responds** → Client sees helpful answer instantly
4. **Admin can review** → All AI responses are saved for admin review

## Troubleshooting
- **AI not responding?** Check browser console for errors
- **Invalid key error?** Make sure key starts with "sk-" or "sk-proj-"
- **Rate limit errors?** Check your OpenAI account billing/limits

## Cost Estimate
- GPT-3.5 Turbo: ~$0.001-0.002 per query
- Very affordable for typical usage
- Check OpenAI dashboard for detailed usage




