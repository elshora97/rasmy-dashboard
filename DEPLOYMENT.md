# Rasmy Rental - Deployment to Vercel

This document provides step-by-step instructions to deploy the Rasmy Rental application to Vercel.

## Prerequisites

- GitHub account (free tier)
- Vercel account (free tier - can sign up with GitHub)
- Git installed on your system

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the following:
   - Repository name: `rasmy-rental`
   - Description: "Property rental availability platform"
   - Public (so Vercel can access it)
   - Do NOT initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository, you'll see a URL like `https://github.com/YOUR_USERNAME/rasmy-rental.git`

In PowerShell, run the following commands in `D:\Projects\Rasmy`:

```powershell
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/rasmy-rental.git

# Verify the remote was added
git remote -v

# Push the code to GitHub
git push -u origin main
```

You may be prompted to authenticate. Use your GitHub credentials or a personal access token.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub (or create an account if needed)
3. Click "Add New" → "Project"
4. Click "Import from GitHub"
5. Select the `rasmy-rental` repository from the list
6. In the configuration screen:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** `cd frontend && npm run build`
   - **Output Directory:** `frontend/build`
   - **Install Command:** `npm install --legacy-peer-deps`
7. Click "Deploy"

Vercel will now:
- Install dependencies
- Build the frontend
- Deploy serverless functions for the API
- Assign a URL (e.g., https://rasmy-rental.vercel.app)

The deployment should complete in 2-5 minutes.

## Step 4: Verify Live Deployment

Once deployment is complete:

1. Open your Vercel URL in a browser
2. Test the home page:
   - Properties should display
   - Click a property to view its calendar
   - Check that booking dates appear

3. Test the admin page:
   - Navigate to `/admin`
   - Try adding a new property
   - Try blocking dates on a property
   - Go back to home page and verify changes appear

4. Test the API:
   - Visit `/api/health` - should see `{"status":"ok"}`
   - Visit `/api/properties` - should see your properties list

## Architecture

### Frontend
- React 18 with React Router
- Built with Vite
- Tailwind CSS for styling
- Deployed as static site to Vercel CDN

### Backend (API)
- Express.js (converted to Vercel serverless functions)
- Endpoints deployed as API routes:
  - `GET /api/health` - Health check
  - `GET /api/properties` - List all properties
  - `POST /api/properties` - Create new property
  - `GET /api/properties/[id]/bookings` - Get bookings for a property
  - `POST /api/properties/[id]/bookings` - Add booking/blocked dates

### Data Storage
- JSON file-based (api/data.json)
- Persists between deployments in Vercel's file system

## Troubleshooting

### Build fails with "Could not resolve entry module"
- Ensure `frontend/index.html` exists in the repository
- Check vite.config.js has proper build configuration

### API returns 404
- Verify rewrites are configured in vercel.json
- Check API route files exist in `/api` directory
- Ensure vercel.json has proper rewrite rules

### Calendar not showing bookings
- Open browser developer tools (F12)
- Check Network tab for API calls
- Look for CORS errors (should be handled by serverless functions)
- Check `/api/properties` endpoint returns correct data

### Changes not persisting
- Vercel stores data in api/data.json
- Data persists between deployments
- Verify API POST requests complete successfully

## Updating the Deployment

To make changes and redeploy:

1. Make code changes locally
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Vercel automatically redeploys when you push to main

## Future Improvements

- Use Vercel KV (Redis) for persistent data storage
- Add environment variables for configuration
- Implement user authentication
- Add email notifications for bookings
- Create mobile app

## Support

For deployment issues:
- Check Vercel project settings at https://vercel.com/dashboard
- View deployment logs in Vercel dashboard
- Verify GitHub integration is connected
