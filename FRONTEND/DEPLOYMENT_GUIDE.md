# Deployment Guide: Vercel Frontend + Render Backend

This guide will help you deploy your Smart City Management application with the frontend on Vercel and backend on Render.

## Overview of Changes

All hardcoded API URLs (`http://localhost:3000`) have been replaced with a dynamic `API_BASE_URL` that reads from environment variables. This allows seamless switching between local development and production environments.

## Files Created/Modified

### New Files:
1. **`src/config/api.js`** - API configuration file that exports the base URL
2. **`.env`** - Local development environment variables
3. **`.env.production`** - Production environment variables for deployment

### Modified Components (18 total):
- GrievanceModal.jsx
- Grievance.jsx
- AdminLocations.jsx
- AdminDashboard.jsx
- Login.jsx
- RegistrationModal.jsx
- Registration.jsx
- ReportNotCollectedModal.jsx
- ReportNotResolvedModal.jsx
- ScheduleModal.jsx
- Reset.jsx
- Signup.jsx
- UserDashboard.jsx
- UserRegistrations.jsx
- WasteModal.jsx
- WasteManagement.jsx
- WaterManagement.jsx
- WaterModal.jsx

## Step-by-Step Deployment

### Step 1: Deploy Backend to Render

1. Go to [Render.com](https://render.com)
2. Sign in or create an account
3. Create a new **Web Service**
4. Connect your GitHub repository (or upload your code)
5. Configure the following:
   - **Build Command**: `npm install`
   - **Start Command**: `node App.js` (or your backend entry point)
   - **Environment Variables**: Add all required variables (DATABASE_URL, JWT_SECRET, etc.)
6. Deploy and wait for completion
7. Copy the deployment URL (e.g., `https://your-app.onrender.com`)

### Step 2: Update Frontend Environment Files

#### For Local Development:
Update `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
```

#### For Production (Vercel):
Update `.env.production` file:
```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

Replace `your-render-backend-url` with your actual Render deployment URL.

### Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in or create an account
3. Click **Add New Project**
4. Import your GitHub repository
5. Configure the following:
   - **Root Directory**: `final/FRONTEND`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: Vite

6. **Add Environment Variables**:
   - Click on **Environment Variables**
   - Add the following variables:
     - **Name**: `VITE_API_BASE_URL`
     - **Value**: `https://your-render-backend-url.onrender.com`
     - **Environments**: Select `Production`

7. Click **Deploy**
8. Wait for deployment to complete

### Step 4: Enable CORS on Backend (Important!)

Update your backend to accept requests from your Vercel domain:

In your `App.js` or wherever you setup CORS:
```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-vercel-frontend-url.vercel.app' // Add your Vercel domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Step 5: Configure Vercel for Environment Variables

If you need to use different environment files:

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add all environment variables for production
3. The `.env.production` file will be used during build time

## Local Development

To run locally with the updated configuration:

```bash
cd final/FRONTEND
npm install
npm run dev
```

The app will use `http://localhost:3000` as configured in `.env`.

## Testing the Deployment

1. **Test API Calls**: 
   - Open browser DevTools (F12)
   - Check the Network tab
   - Verify API calls are going to your Render backend URL

2. **Check Environment Variables**:
   - In Vercel deployment logs, you can verify environment variables are correctly set

3. **Troubleshooting**:
   - If API calls fail, check CORS configuration on backend
   - Verify Render backend is running and accessible
   - Check Vercel deployment logs for errors
   - Ensure the API_BASE_URL is correct in environment variables

## Environment Variable Precedence

The `src/config/api.js` file reads from `import.meta.env.VITE_API_BASE_URL`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

- During development: Uses `.env` → `http://localhost:3000`
- During production build: Uses `.env.production` → Your Render URL
- Fallback: `http://localhost:3000` (if no env variable found)

## Monitoring and Debugging

### Vercel Analytics
- Monitor performance and errors in Vercel dashboard
- Check build logs for any issues

### Render Backend
- Monitor backend health in Render dashboard
- Check application logs for API errors

### Browser Console
- Open DevTools → Console for frontend errors
- Check Network tab to verify API endpoint URLs

## Common Issues and Solutions

### Issue: CORS Error
**Solution**: Update backend CORS configuration to include your Vercel domain

### Issue: 404 API Not Found
**Solution**: Verify the API_BASE_URL environment variable matches your Render backend URL

### Issue: Environment Variable Not Updating
**Solution**: Redeploy the application after updating environment variables in Vercel

### Issue: Stuck on Loading
**Solution**: 
- Check browser console for errors
- Verify backend is running on Render
- Check network requests in DevTools

## Rollback Procedure

If you need to rollback:

1. **Vercel**: Go to Deployments tab and select a previous version to redeploy
2. **Render**: Similar process in Render dashboard

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)

---

**Last Updated**: February 1, 2026
**Status**: ✅ All components updated and ready for deployment
