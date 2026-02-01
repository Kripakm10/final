# 🎯 Visual Deployment Guide

## Before & After Comparison

### BEFORE (Hardcoded URLs)
```javascript
// ❌ Old way - hardcoded for localhost only
import axios from 'axios';

const handleSubmit = async () => {
  const res = await axios.post('http://localhost:3000/api/grievance', data);
  // Problem: Can't deploy to production without changing code!
}
```

### AFTER (Dynamic Configuration)
```javascript
// ✅ New way - dynamic based on environment
import axios from 'axios';
import API_BASE_URL from '../config/api';

const handleSubmit = async () => {
  const res = await axios.post(`${API_BASE_URL}/api/grievance`, data);
  // Works everywhere: localhost, Vercel, any server!
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel Frontend                          │
│  (https://yourapp.vercel.app)                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ React App                                               │    │
│  │  └─ src/components/*.jsx                               │    │
│  │      ├─ import API_BASE_URL from '../config/api'       │    │
│  │      ├─ fetch(`${API_BASE_URL}/api/grievance`)        │    │
│  │      └─ axios.post(`${API_BASE_URL}/api/waste`)       │    │
│  │                                                         │    │
│  │  └─ src/config/api.js                                  │    │
│  │      └─ Returns: import.meta.env.VITE_API_BASE_URL    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  Environment Variables (set in Vercel Dashboard)                │
│  VITE_API_BASE_URL=https://your-app.onrender.com               │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           │ API Requests
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Render Backend                               │
│  (https://your-app.onrender.com)                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Node.js Express Server                                  │    │
│  │  ├─ /api/grievance                                      │    │
│  │  ├─ /api/waste                                          │    │
│  │  ├─ /api/water                                          │    │
│  │  ├─ /api/registrations                                  │    │
│  │  └─ ... (other endpoints)                               │    │
│  │                                                         │    │
│  │  Database Connection                                    │    │
│  │  └─ MongoDB (or your DB)                                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Environment Configuration Flow

```
┌──────────────────────────────────────────────────────────┐
│ Development Mode (npm run dev)                           │
├──────────────────────────────────────────────────────────┤
│ .env file                                                │
│ VITE_API_BASE_URL=http://localhost:3000                │
│           ▼                                              │
│ src/config/api.js reads → import.meta.env.VITE_API_BASE │
│           ▼                                              │
│ Returns: http://localhost:3000                         │
│           ▼                                              │
│ Components: fetch(`${API_BASE_URL}/api/grievance`)    │
│ Result: http://localhost:3000/api/grievance           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Production Build (npm run build)                         │
├──────────────────────────────────────────────────────────┤
│ .env.production file (local build)                       │
│ VITE_API_BASE_URL=https://app.onrender.com             │
│           ▼                                              │
│ Vercel Environment Variable (overrides .env.production) │
│ VITE_API_BASE_URL=https://app.onrender.com             │
│           ▼                                              │
│ Vite builds with this value embedded                     │
│           ▼                                              │
│ Components: fetch(`${API_BASE_URL}/api/grievance`)    │
│ Result: https://app.onrender.com/api/grievance        │
└──────────────────────────────────────────────────────────┘
```

## Step-by-Step Deployment

```
STEP 1: Prepare Backend
┌─────────────────────┐
│ Deploy to Render    │
│ Get Render URL      │
│ Example:            │
│ https://my-app      │
│ .onrender.com       │
└────────────┬────────┘
             │

STEP 2: Update Frontend Config
┌────────────────────────┐
│ Update .env.production │
│ VITE_API_BASE_URL=    │
│ https://my-app        │
│ .onrender.com         │
└────────────┬───────────┘
             │

STEP 3: Deploy Frontend
┌──────────────────────────┐
│ Push to GitHub           │
│ Deploy to Vercel         │
│ Set Env Var in Vercel    │
│ VITE_API_BASE_URL=       │
│ https://my-app.onrender  │
└────────────┬─────────────┘
             │

STEP 4: Configure CORS
┌──────────────────────────┐
│ Update Backend CORS      │
│ Allow: https://my-app    │
│ .vercel.app              │
│ Redeploy Backend         │
└────────────┬─────────────┘
             │

STEP 5: Test
┌──────────────────────────┐
│ Open Vercel App          │
│ Test all Features        │
│ Check DevTools Network   │
│ Verify API Calls         │
└──────────────────────────┘
```

## File Structure

```
FRONTEND/
├── src/
│   ├── config/
│   │   └── api.js ← 🆕 NEW
│   │       └─ export default API_BASE_URL
│   │
│   └── components/
│       ├── GrievanceModal.jsx ← ✏️ UPDATED
│       ├── Grievance.jsx ← ✏️ UPDATED
│       ├── AdminDashboard.jsx ← ✏️ UPDATED
│       ├── AdminLocations.jsx ← ✏️ UPDATED
│       ├── Login.jsx ← ✏️ UPDATED
│       ├── Registration.jsx ← ✏️ UPDATED
│       ├── RegistrationModal.jsx ← ✏️ UPDATED
│       ├── Reset.jsx ← ✏️ UPDATED
│       ├── Signup.jsx ← ✏️ UPDATED
│       ├── UserDashboard.jsx ← ✏️ UPDATED
│       ├── UserRegistrations.jsx ← ✏️ UPDATED
│       ├── WasteManagement.jsx ← ✏️ UPDATED
│       ├── WasteModal.jsx ← ✏️ UPDATED
│       ├── WaterManagement.jsx ← ✏️ UPDATED
│       ├── WaterModal.jsx ← ✏️ UPDATED
│       ├── ReportNotCollectedModal.jsx ← ✏️ UPDATED
│       ├── ReportNotResolvedModal.jsx ← ✏️ UPDATED
│       └── ScheduleModal.jsx ← ✏️ UPDATED
│
├── .env ← 🆕 NEW (Local dev)
├── .env.production ← 🆕 NEW (Production build)
│
└── DEPLOYMENT_GUIDE.md ← 📖 Guide
```

## API Call Examples

### Axios POST (Example: Grievance)
```javascript
import API_BASE_URL from '../config/api';

// Becomes: http://localhost:3000 (dev) or https://app.onrender.com (prod)
const res = await axios.post(
  `${API_BASE_URL}/api/grievance`,
  { ...data },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Fetch GET (Example: User Dashboard)
```javascript
import API_BASE_URL from '../config/api';

// Becomes: http://localhost:3000 (dev) or https://app.onrender.com (prod)
const response = await fetch(
  `${API_BASE_URL}/api/waste/mine`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Fetch POST with Dynamic ID (Example: Schedule)
```javascript
import API_BASE_URL from '../config/api';

// Becomes: http://localhost:3000 (dev) or https://app.onrender.com (prod)
const response = await fetch(
  `${API_BASE_URL}/api/${endpoint}/${item._id}/schedule`,
  { method: 'POST', body: JSON.stringify({ scheduledTime }) }
);
```

## Troubleshooting Decision Tree

```
API calls returning 404 or CORS error?
│
├─ ✓ Check DevTools Network tab
│   └─ Is URL correct? (render-url or localhost?)
│
├─ ✓ Check Environment Variables
│   ├─ Local: Is .env set to localhost:3000?
│   └─ Production: Is VITE_API_BASE_URL set in Vercel?
│
├─ ✓ Check Backend CORS
│   └─ Is your Vercel domain allowed?
│
├─ ✓ Check Backend Status
│   └─ Is Render service running?
│
└─ ✓ Check API Endpoints
    └─ Are they spelled correctly?
```

## URLs Reference Table

| Environment | Frontend URL | Backend URL | API Calls To |
|---|---|---|---|
| **Local Dev** | http://localhost:5173 | http://localhost:3000 | http://localhost:3000 |
| **Production** | https://yourapp.vercel.app | https://app.onrender.com | https://app.onrender.com |
| **Staging** | https://staging.vercel.app | https://staging.onrender.com | https://staging.onrender.com |

## Configuration Values Needed

Before deployment, gather:

```
Backend (Render):
  └─ Deployment URL: ________________________
     Example: https://my-app.onrender.com

Frontend (Vercel):
  └─ Deployment URL: ________________________
     Example: https://my-app.vercel.app

Environment Variables:
  └─ VITE_API_BASE_URL: https://my-app.onrender.com
```

---

**Happy Deploying! 🚀**
