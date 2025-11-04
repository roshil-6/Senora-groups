# 🚀 Deployment Instructions for Vercel

## Step 1: Push to GitHub

### First Time Setup:
```bash
# Make sure you're in the project directory
cd "C:\Users\user\OneDrive\Desktop\senora groups"

# Check git status
git status

# Push to GitHub (first time)
git push -u origin main

# If you get authentication errors, you may need to:
# 1. Use GitHub Personal Access Token instead of password
# 2. Or set up SSH keys
```

### For Future Updates:
```bash
# After making changes
git add .
git commit -m "Your commit message"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**: Select `roshil-6/Senora-groups`
5. **Configure Project**:
   - Framework Preset: **Other** (or leave as default)
   - Root Directory: `./` (default)
   - Build Command: Leave empty (static site)
   - Output Directory: Leave empty (root is output)
6. **Click "Deploy"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Verify Deployment

After deployment, Vercel will provide you with:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each commit/pull request

### Check PWA Features:
1. Visit your deployed site
2. Open DevTools → Application tab
3. Check:
   - ✅ Service Worker registered
   - ✅ Manifest.json loaded
   - ✅ Icons available
   - ✅ Can install as PWA

## Important Notes:

### Environment Variables (if needed):
If you need any environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add any required variables

### Custom Domain (Optional):
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions

### Build Settings:
- **Framework**: Other (Static HTML)
- **Build Command**: (empty)
- **Output Directory**: (empty - root directory)
- **Install Command**: (empty)

## Troubleshooting:

### If Service Worker doesn't work:
- Make sure `sw.js` is in the root directory
- Check browser console for errors
- Verify HTTPS is enabled (Vercel provides HTTPS by default)

### If PWA doesn't install:
- Check `manifest.json` is accessible
- Verify icons are in correct paths
- Check browser console for manifest errors

### If site doesn't load:
- Check Vercel build logs
- Verify all file paths are correct
- Make sure `index.html` is in root

## Auto-Deploy:

Once connected to GitHub:
- **Every push to `main` branch** → Auto-deploys to production
- **Pull requests** → Creates preview deployments
- **No manual deployment needed!**

## Support:

For issues:
1. Check Vercel deployment logs
2. Check browser console
3. Verify all files are committed to GitHub

