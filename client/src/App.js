import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
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

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <Preloader text="Loading..." />;
  }

  return (
    <>
      <SuspensionAlert />
      <Navigation />
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
      <footer>
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-3 mb-4 mb-md-0">
              <h5><i className="bi bi-activity"></i> ifitness</h5>
              <p style={{ color: '#d1d5db', fontSize: '14px' }}>Your personal fitness companion for tracking workouts, monitoring progress, and achieving your fitness goals.</p>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <h5>Product</h5>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="/#features">Features</a></li>
                <li><a href="/#how-it-works">How It Works</a></li>
                <li><a href="/#pricing">Pricing</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <h5>Company</h5>
              <ul>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Support</h5>
              <ul>
                <li><Link to="/documentation">Documentation</Link></li>
                <li><Link to="/community">Community</Link></li>
                <li><Link to="/status">Status</Link></li>
                <li><Link to="/help-center">Help Center</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-divider">
            <p>&copy; 2026 ifitness. All rights reserved. | <Link to="/privacy-policy" style={{ color: '#d1d5db' }}>Privacy Policy</Link> | <Link to="/terms-of-service" style={{ color: '#d1d5db' }}>Terms of Service</Link></p>
          </div>
        </div>
      </footer>
    </>
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
