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

### Database Setup
1. Create a new PostgreSQL database on Render
2. Copy the connection string
3. Add it as `MONGODB_URI` environment variable to your backend service

## Recent Fixes Applied

### Dependency Version Fixes
- **React**: Downgraded to 18.2.0 for stability
- **React Router**: Using 6.8.1 (stable version)
- **React Scripts**: Pinned to 5.0.1
- **Removed**: Conflicting Express dependency from frontend

### Build Process Improvements
- Using `npm ci` instead of `npm install` for more reliable builds
- Added cleanup commands to ensure fresh dependency installation
- Added `build:production` script for explicit production builds

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

### Environment Variables
- Make sure `REACT_APP_API_URL` points to your backend URL
- Check that database connection string is properly configured
- Ensure JWT_SECRET is set for authentication

## Notes

- The free tier on Render will spin down services after 15 minutes of inactivity
- First request after inactivity may take ~30 seconds to respond
- For production use, consider upgrading to a paid plan for better performance
- Always test builds locally before deploying to Render