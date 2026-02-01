# 🚀 Quick Deployment Checklist

## Pre-Deployment

- [ ] Ensure backend is fully functional locally
- [ ] Test all API endpoints
- [ ] Update `.env.production` with correct Render URL format

## Deploy Backend (Render)

1. [ ] Push backend code to GitHub
2. [ ] Go to Render.com and create Web Service
3. [ ] Connect GitHub repository
4. [ ] Set environment variables (DB_URL, JWT_SECRET, etc.)
5. [ ] Deploy
6. [ ] Copy Render deployment URL (e.g., `https://app-name.onrender.com`)
7. [ ] Wait for backend to be running

## Update Frontend

1. [ ] Update `.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-render-url.onrender.com
   ```

2. [ ] Test locally:
   ```bash
   npm run dev
   # Check DevTools → Network tab
   # Verify API calls use http://localhost:3000
   ```

## Deploy Frontend (Vercel)

1. [ ] Push frontend code to GitHub
2. [ ] Go to Vercel.com
3. [ ] Create new project and import repository
4. [ ] Set Root Directory to `final/FRONTEND`
5. [ ] Add Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your Render URL (same as `.env.production`)
   - **Environments**: Production
6. [ ] Deploy
7. [ ] Wait for deployment to complete
8. [ ] Copy Vercel deployment URL

## Post-Deployment Configuration

1. [ ] Update backend CORS to include Vercel domain:
   ```javascript
   const corsOptions = {
     origin: ['https://your-vercel-url.vercel.app', 'https://your-render-url.onrender.com'],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   };
   app.use(cors(corsOptions));
   ```

2. [ ] Redeploy backend after CORS update

## Testing

1. [ ] Open deployed Vercel app
2. [ ] Open DevTools (F12)
3. [ ] Go to Network tab
4. [ ] Try login/signup
5. [ ] Verify API calls go to Render URL (not localhost)
6. [ ] Check Console for any errors
7. [ ] Test all major features:
   - [ ] Login/Signup
   - [ ] Create grievance/waste/water report
   - [ ] View dashboard
   - [ ] Admin dashboard (if applicable)

## URLs to Remember

- **Local Backend**: `http://localhost:3000`
- **Local Frontend**: `http://localhost:5173`
- **Production Backend**: `https://your-render-url.onrender.com`
- **Production Frontend**: `https://your-app.vercel.app`

## Environment Variable Format

### `.env` (Local)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### `.env.production` (Build time)
```env
VITE_API_BASE_URL=https://your-render-url.onrender.com
```

### Vercel Settings (Runtime override)
```
VITE_API_BASE_URL=https://your-render-url.onrender.com
```

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| CORS Error | Update backend CORS settings |
| 404 API Not Found | Verify API_BASE_URL is correct |
| Env var not updated | Redeploy Vercel project |
| Stuck on loading | Check DevTools Console & Network |
| Backend not responding | Check Render dashboard status |

## Important Files

- `src/config/api.js` - API configuration (reads environment variables)
- `.env` - Local development variables
- `.env.production` - Production build variables
- `DEPLOYMENT_GUIDE.md` - Full deployment documentation
- `UPDATE_SUMMARY.md` - Detailed summary of all changes

---

**Keep this checklist handy during deployment!**
