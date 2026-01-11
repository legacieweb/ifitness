import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'bi-grid' },
    { name: 'Workouts', path: '/workouts', icon: 'bi-lightning-charge' },
    { name: 'My Routines', path: '/routines', icon: 'bi-calendar-week' },
    { name: 'Calendar', path: '/calendar', icon: 'bi-calendar3' },
    { name: 'Analytics', path: '/analytics', icon: 'bi-graph-up' },
    { name: 'Goals', path: '/goals', icon: 'bi-flag' },
    { name: 'Nutrition', path: '/nutrition', icon: 'bi-egg-fried' },
    { name: 'Templates', path: '/templates', icon: 'bi-layout-text-window' },
    { name: 'Achievements', path: '/achievements', icon: 'bi-trophy' },
    { name: 'Profile', path: '/profile', icon: 'bi-person' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo">
          <i className="bi bi-activity"></i>
          <span>iFitness</span>
        </NavLink>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" />
          ) : (
            <div className="sidebar-avatar-placeholder">
              <i className="bi bi-person"></i>
            </div>
          )}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{user?.name || 'User'}</span>
          <span className="sidebar-user-status">Pro Member</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
