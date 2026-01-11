import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/GlobalStyles.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import SuspensionAlert from './components/SuspensionAlert';
import Preloader from './components/Preloader';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import NewWorkout from './pages/NewWorkout';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutDetail from './pages/WorkoutDetail';
import EditWorkout from './pages/EditWorkout';
import Profile from './pages/Profile';
import Journey from './pages/Journey';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import Calendar from './pages/Calendar';
import Goals from './pages/Goals';
import Nutrition from './pages/Nutrition';
import Templates from './pages/Templates';
import AdminDashboard from './pages/AdminDashboard';
import AdminBootcamp from './pages/AdminBootcamp';
import AdminOutdoorActivity from './pages/AdminOutdoorActivity';
import UserDetail from './pages/UserDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Documentation from './pages/Documentation';
import Community from './pages/Community';
import Status from './pages/Status';
import HelpCenter from './pages/HelpCenter';
import MyRoutines from './pages/MyRoutines';

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();

  // Header component - only show for home page
  const showHeader = () => {
    const path = location.pathname;
    const noHeaderRoutes = ['/admin', '/login', '/register'];
    
    // Only show the original Navigation header for home page
    if (path === '/') {
      return true;
    }
    
    // No original Navigation header for other pages
    // (they will use their own headers)
    return false;
  };

  if (loading) {
    return <Preloader text="Loading..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SuspensionAlert />
      {showHeader() && <Navigation />}
      <ScrollToTop />
      <main style={{ flex: 1 }}>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts/new"
            element={
              <ProtectedRoute>
                <NewWorkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts/create"
            element={
              <ProtectedRoute>
                <CreateWorkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts/:id"
            element={
              <ProtectedRoute>
                <WorkoutDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts/:id/edit"
            element={
              <ProtectedRoute>
                <EditWorkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journey"
            element={
              <ProtectedRoute>
                <Journey />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routines"
            element={
              <ProtectedRoute>
                <MyRoutines />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bootcamps"
            element={
              <ProtectedRoute>
                <AdminBootcamp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/outdoor-activities"
            element={
              <ProtectedRoute>
                <AdminOutdoorActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/community" element={<Community />} />
          <Route path="/status" element={<Status />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
