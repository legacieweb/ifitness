# Render Deployment Guide

## Deployment Configuration

### Backend Service
- **Service Name**: fitness-api
- **Environment**: Node.js
- **Plan**: Free

**Build Command:**
```bash
cd backend && npm ci
```

**Start Command:**
```bash
cd backend && npm start
```

**Environment Variables:**
- `NODE_ENV`: production
- `PORT`: 10000
- `MONGODB_URI`: (auto-configured from Render database)
- `JWT_SECRET`: (auto-generated)
- `REACT_APP_API_URL`: https://fitness-api.onrender.com

### Frontend Service
- **Service Name**: fitness-frontend
- **Type**: Static Site
- **Build Command:**
```bash
cd frontend && npm ci && npm run build
```

**Environment Variables:**
- `REACT_APP_API_URL`https://ifitness.onrender.com


### Database
- **Name**: fitnessdb
- **Type**: PostgreSQL (Render will provide connection string)

## Deployment Steps

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Connect to Render**: 
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Select your repository
3. **Automatic Deployment**: Render will detect the `render.yaml` file and deploy both services automatically
4. **Database Setup**: Render will create the PostgreSQL database and configure the connection

## Alternative Manual Setup

If you prefer to set up services manually:

### Backend Setup
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm ci`
4. Set start command: `cd backend && npm start`
5. Add environment variables as listed above

### Frontend Setup  
1. Create a new Static Site on Render
2. Connect the same repository
3. Set build command: `cd frontend && npm ci && npm run build`
4. Set publish directory: `frontend/build`
5. Add environment variable: `REACT_APP_API_URL` = your backend URL

**Important for SPA Routing**: Add a `render.yaml` file in the `frontend` directory to configure routes or use a static server that handles SPA fallback. See "SPA Routing Configuration" section below.

### Database Setup
1. Create a new PostgreSQL database on Render
2. Copy the connection string
3. Add it as `MONGODB_URI` environment variable to your backend service

## Recent Fixes Applied

### SPA Refresh Error Fix
- **Issue**: Users refreshing on protected routes (e.g., `/dashboard`, `/admin`) saw "404 Not Found" errors
- **Fix**: Updated frontend to show preloader during initial auth check while server fallback serves `index.html` for all routes
- **Backend**: Changed invalid `app.get('*', ...)` to `app.use(...)` middleware for proper SPA routing fallback
- **Frontend**: Created `AppContent` component that displays `Preloader` during auth loading phase

### Dependency Version Fixes
- **React**: Downgraded to 18.2.0 for stability
- **React Router**: Using 6.8.1 (stable version)
- **React Scripts**: Pinned to 5.0.1
- **Removed**: Conflicting Express dependency from frontend

### Build Process Improvements
- Using `npm ci` instead of `npm install` for more reliable builds
- Added cleanup commands to ensure fresh dependency installation
- Added `build:production` script for explicit production builds
- Frontend now builds to `build/` folder served by backend as SPA fallback

## SPA Routing Configuration

### ✅ RECOMMENDED: Unified Service (Backend serves Frontend)

Deploy frontend and backend as a single service:

1. **Backend**: Serves both API routes and frontend
2. **Build**: Frontend builds to `build/` → Backend serves it with SPA fallback
3. **Single Deploy**: One service on Render

**Render Configuration:**
- **Service Type**: Web Service
- **Build Command**: 
  ```bash
  cd frontend && npm ci && npm run build && cd ../backend && npm ci
  ```
- **Start Command**: 
  ```bash
  cd backend && npm start
  ```
- Backend (`server.js`) automatically serves `frontend/build` with SPA fallback

### Alternative: Separated Services (Current setup)

If deploying frontend and backend as separate Render services:

**Frontend Static Site:**
- **Build Command**: `cd frontend && npm ci && npm run build`
- **Publish Directory**: `frontend/build`
- **Problem**: Static Sites don't handle SPA routing by default
- **Solution**: Use a `server.js` with Node Web Service instead (see `frontend/server.js`)

**Better Alternative for Separated Services:**
1. Create a **Web Service** (not Static Site) for frontend
2. **Build Command**: `cd frontend && npm ci && npm run build`
3. **Start Command**: `cd frontend && node server.js`
4. This uses the included `server.js` which handles SPA routing properly

**Backend Web Service:**
- **Build Command**: `cd backend && npm ci`
- **Start Command**: `cd backend && npm start`
- Serves only `/api/*` routes
- Has CORS enabled for frontend requests

## Local Development

To run locally:

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend  
npm install
npm start
```

## Troubleshooting

### Common Build Issues
1. **Missing build script**: Ensure frontend package.json has the build script
2. **Dependency conflicts**: Run `npm ci` to install exact versions
3. **React version mismatches**: Use React 18.2.0 for compatibility

### SPA Routing Issues
**Problem**: Users get "404 Not Found" when refreshing on protected routes
- **Solution**: Ensure backend serves `index.html` as fallback for all non-API routes
- **Backend**: Uses middleware `app.use()` to catch unmatched routes (NOT `app.get('*', ...)` which is invalid Express syntax)
- **Frontend**: Shows `Preloader` while checking authentication before rendering routes
- **Key**: Static files are served first, then `/api/*` routes are matched, then SPA fallback serves `index.html`

### Environment Variables
- Make sure `REACT_APP_API_URL` points to your backend URL
- Check that database connection string is properly configured
- Ensure JWT_SECRET is set for authentication

## Notes

- The free tier on Render will spin down services after 15 minutes of inactivity
- First request after inactivity may take ~30 seconds to respond
- For production use, consider upgrading to a paid plan for better performance
- Always test builds locally before deploying to Render