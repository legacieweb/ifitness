# Fitness Tracker - Development Notes

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB running locally or connection string ready

### Backend Setup
```bash
cd backend
npm install
# Update .env with your MongoDB URI if not using localhost
node seed.js  # (Optional) Populate exercise database
npm start
```
- Runs on http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
- Runs on http://localhost:3000

## Architecture

### Backend (Node.js + Express)
- REST API with JWT authentication
- MongoDB database with Mongoose ODM
- Routes: auth, workouts, exercises, users
- Protected endpoints with middleware
- Password hashing with bcryptjs

### Frontend (React + Bootstrap)
- Single Page Application (SPA)
- React Router for navigation
- Context API for authentication state
- Axios for API calls with JWT tokens
- Bootstrap 5 for responsive UI

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

### Backend
- `server.js` - Main server entry
- `routes/auth.js` - Authentication endpoints
- `routes/workouts.js` - Workout CRUD
- `routes/exercises.js` - Exercise library
- `routes/users.js` - User management
- `models/` - MongoDB schemas
- `config/db.js` - Database connection

### Frontend
- `App.js` - Main app with routing
- `context/AuthContext.js` - Auth state management
- `pages/` - Page components
- `components/` - Reusable components
- `services/api.js` - API calls

## Notes

- Passwords hashed with bcryptjs
- JWT tokens valid for 30 days
- All API calls include Authorization header
- Frontend CORS enabled on backend
- Bootstrap Icons for UI
- Environment variables in .env files
