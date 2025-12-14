import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Preloader from './Preloader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  const getLoadingText = () => {
    if (location.pathname === '/admin') return 'Loading admin dashboard...';
    if (location.pathname.startsWith('/dashboard')) return 'Loading your dashboard...';
    if (location.pathname.startsWith('/workouts')) return 'Loading workouts...';
    if (location.pathname.startsWith('/analytics')) return 'Loading analytics...';
    if (location.pathname.startsWith('/journey')) return 'Loading your journey...';
    if (location.pathname.startsWith('/goals')) return 'Loading your goals...';
    if (location.pathname.startsWith('/achievements')) return 'Loading achievements...';
    return 'Loading...';
  };

  if (loading) {
    return <Preloader text={getLoadingText()} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (location.pathname === '/admin' && !user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const regularUserRoutes = ['/workouts', '/dashboard', '/journey', '/analytics', '/achievements', '/calendar', '/goals', '/nutrition', '/templates'];
  if (regularUserRoutes.some(route => location.pathname.startsWith(route)) && user?.isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
}
