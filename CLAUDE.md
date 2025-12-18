# Fitness Tracker - Development Notes

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB running locally or connection string ready

### Integrated Setup (Recommended - Server + Client as One)
```bash
cd server
npm install
npm run build-and-start
```
- Runs on http://localhost:5000
- Client and server served from same port
- Page refresh will work correctly (no 404 errors)

### From Root Directory (All-in-One)
```bash
npm install
npm run build-and-start
```

### Separate Development Setup (Server & Client Development)
**Terminal 1 - Server:**
```bash
cd server
npm install
npm start
```
- Runs on http://localhost:5000

**Terminal 2 - Client:**
```bash
cd client
npm install
npm start
```
- Runs on http://localhost:3000

## Architecture

### Server (Node.js + Express)
- REST API with JWT authentication
- MongoDB database with Mongoose ODM
- Routes: auth, workouts, exercises, users, admin, bootcamps
- Protected endpoints with middleware
- Password hashing with bcryptjs
- Serves static client files from `/client/build`
- Handles client-side routing fallback for SPA

### Client (React + Bootstrap)
- Single Page Application (SPA)
- React Router for navigation
- Context API for authentication state
- Axios for API calls with JWT tokens (baseURL: `/api`)
- Bootstrap 5 for responsive UI
- Built to `/client/build` directory for server to serve

### Integrated Deployment
- Client builds to `/client/build`
- Server serves static files from build directory
- All requests to non-API routes redirected to `index.html`
- React Router handles client-side routing
- Page refreshes work correctly (no 404 errors)

## Features Implemented

✓ User registration & login with JWT
✓ Workout logging with exercise tracking
✓ Exercise library with filters
✓ User profiles with fitness goals
✓ Statistics dashboard
✓ Protected routes with auth middleware
✓ Responsive Bootstrap design
✓ BMI calculator
✓ Workout history with edit/delete

## Database

### Models
- **User**: name, email, password, age, weight, height, goal
- **Workout**: userId, name, exercises[], duration, caloriesBurned, date
- **Exercise**: name, category, muscleGroup, difficulty, instructions

### Seed Data
Run `node seed.js` in backend to populate exercises:
- Push-ups, Squats, Running
- Bench Press, Deadlift
- Yoga, Swimming, Cycling
- And more...

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Workouts
- GET /api/workouts (protected)
- POST /api/workouts (protected)
- PUT /api/workouts/:id (protected)
- DELETE /api/workouts/:id (protected)

### Exercises
- GET /api/exercises
- POST /api/exercises (protected)

### Users
- GET /api/users/profile/:id (protected)
- PUT /api/users/profile/:id (protected)
- GET /api/users/stats/:id (protected)

## User Flow

1. Register at `/register`
2. Login at `/login`
3. View dashboard at `/dashboard`
4. Log workouts at `/workouts/new`
5. View history at `/workouts`
6. Manage profile at `/profile`

## Key Files

### Server (Backend)
- `server/server.js` - Main server entry
- `server/routes/auth.js` - Authentication endpoints
- `server/routes/workouts.js` - Workout CRUD
- `server/routes/exercises.js` - Exercise library
- `server/routes/users.js` - User management
- `server/models/` - MongoDB schemas
- `server/config/db.js` - Database connection

### Client (Frontend)
- `client/src/App.js` - Main app with routing
- `client/src/context/AuthContext.js` - Auth state management
- `client/src/pages/` - Page components
- `client/src/components/` - Reusable components
- `client/src/services/api.js` - API calls

## Deployment Steps

### Build for Production
**Option 1: From root directory**
```bash
npm install
npm run build-and-start
```

**Option 2: From server directory**
```bash
cd server
npm install
npm run build-and-start
```

This will:
1. Install client dependencies
2. Build React app to `/client/build`
3. Start server on port 5000
4. Server serves client + API from same port

### Environment Variables
Create `.env` in server directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@trainerhub.com
ADMIN_PASSWORD=admin123
RESEND_API_KEY=your_resend_api_key_here
FRONTEND_URL=https://your-frontend-url.com
```

**Email Setup (Resend)**:
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Get API key from the dashboard
4. Add to `.env` as `RESEND_API_KEY=your_key`
5. Email functions will work automatically (signup, suspension, bootcamp invites)

## Important Configuration Changes

### API Base URL
- **Development (separate)**: `http://localhost:3000` calls `http://localhost:5000/api`
- **Production (integrated)**: `/api` (relative path - same domain/port)
- Located in: `client/src/services/api.js`

### Server Configuration
- **File**: `server/server.js`
- Serves static files from `/client/build`
- Redirects all non-API routes to `index.html` for React Router
- Properly handles SPA routing on page refresh

## Project Structure

```
fitness2.0/
├── server/                    # Node.js + Express backend
│   ├── server.js             # Main entry point
│   ├── package.json
│   ├── config/               # Database config
│   ├── routes/               # API routes
│   ├── models/               # MongoDB schemas
│   ├── controllers/          # Middleware
│   └── services/             # External services
│
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js            # Main app
│   │   ├── index.js
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth context
│   │   └── services/         # API client
│   └── package.json
│
├── package.json              # Root package.json with scripts
└── CLAUDE.md                 # This file
```

## Notes

- Passwords hashed with bcryptjs
- JWT tokens valid for 30 days
- All API calls include Authorization header
- Bootstrap Icons for UI
- Environment variables in .env files
- Server and client now serve from same port (5000)
