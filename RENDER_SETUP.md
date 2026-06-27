# Render Deployment Setup

## Critical: Set Environment Variable on Render

After deploying to Render, you MUST set the environment variable in the Render Dashboard.

### Steps:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com

2. **Select your frontend service** (luxeliving-frontend)

3. **Go to Environment**
   - Click "Environment" tab

4. **Add/Update Variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://luxeliving-backend-w9oj.onrender.com/api`

5. **Save Changes:**
   - Click "Save Changes"

6. **Manual Deploy:**
   - Click "Manual Deploy"
   - Select "Clear build cache & deploy"
   - Wait for deployment to complete

## Environment Files in Frontend:

- `.env` - Used in development (local)
- `.env.local` - Local development override
- `.env.production` - Used in Render production builds

All contain:
```
VITE_API_URL=https://luxeliving-backend-w9oj.onrender.com/api
```

## Verification:

After deployment, open your browser console and check network requests:
- ✓ CORRECT: `GET https://luxeliving-backend-w9oj.onrender.com/api/properties`
- ✗ WRONG: `GET https://luxeliving-backend-w9oj.onrender.com/properties`

If you still see requests without `/api`, the Render environment variable is not set correctly.

## Backend URL:

- **Backend Service URL:** https://luxeliving-backend-w9oj.onrender.com
- **API Prefix:** `/api`
- **Full Base URL:** `https://luxeliving-backend-w9oj.onrender.com/api`
