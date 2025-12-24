# Deploy Hook Setup Instructions

## Option 1: Create Deploy Hook in Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/marvinnl046s-projects/begraafplaatsindebuurt-nl/settings/git
2. Scroll down to "Deploy Hooks"
3. Create a new hook:
   - Name: `GitHub Backup` 
   - Branch: `main`
4. Copy the URL it gives you

## Option 2: Use GitHub Action for Manual Deploy

1. Create a Vercel Token:
   - Go to: https://vercel.com/account/tokens
   - Click "Create"
   - Name: `GitHub Actions`
   - Scope: Full Account
   - Copy the token

2. Add token to GitHub:
   - Go to: https://github.com/MarvinNL046/begraafplaatsindebuurt.nl/settings/secrets/actions
   - Click "New repository secret"
   - Name: `VERCEL_TOKEN`
   - Value: [paste your token]

3. The workflow is already created at `.github/workflows/manual-deploy.yml`
   - You can trigger it manually from Actions tab
   - Or uncomment lines to auto-deploy on push

## Option 3: Quick Deploy Script

Add to package.json:
```json
"scripts": {
  "deploy": "vercel --prod"
}
```

Then run: `npm run deploy`

## Testing Auto-Deploy Fix

1. First try disconnecting and reconnecting GitHub:
   - https://vercel.com/marvinnl046s-projects/begraafplaatsindebuurt-nl/settings/git
   - Click "Disconnect"
   - Then "Connect Git Repository"
   - Select your repo

2. Check GitHub App permissions:
   - https://github.com/settings/installations
   - Find Vercel
   - Make sure your repo is selected

3. Check for webhooks:
   - https://github.com/MarvinNL046/begraafplaatsindebuurt.nl/settings/hooks
   - Should see a Vercel webhook