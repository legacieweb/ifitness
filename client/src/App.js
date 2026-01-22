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

import DashboardLayout from './components/DashboardLayout';
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

  // Header component - show for most public pages
  const showHeader = () => {
    const path = location.pathname;
    const noHeaderRoutes = ['/admin', '/login', '/register', '/dashboard', '/workouts', '/profile', '/journey', '/analytics', '/achievements', '/calendar', '/goals', '/routines', '/nutrition', '/templates'];
    
    // Don't show in admin, auth, home, or dashboard pages
    if (noHeaderRoutes.some(route => path === route || (route !== '/' && path.startsWith(route)))) {
      return false;
    }
    
    return true;
  };

  // Footer component - hide for dashboard and admin
  const showFooter = () => {
    const path = location.pathname;
    const noFooterRoutes = ['/dashboard', '/workouts', '/profile', '/journey', '/analytics', '/achievements', '/calendar', '/goals', '/routines', '/nutrition', '/templates', '/admin'];
    
    // Check if path starts with any of the noFooterRoutes
    return !noFooterRoutes.some(route => path.startsWith(route));
  };

  if (loading) {
    return <Preloader text="Initializing Experience..." />;
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
          
          {/* User Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/new" element={<NewWorkout />} />
            <Route path="/workouts/create" element={<CreateWorkout />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/workouts/:id/edit" element={<EditWorkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/routines" element={<MyRoutines />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/templates" element={<Templates />} />
          </Route>

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
      {showFooter() && <Footer />}
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
