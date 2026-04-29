import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfilePictureUrl } from '../services/api';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/');
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const navItems = [
    { name: 'TERMINAL', path: '/dashboard', icon: 'bi-grid-fill' },
    { name: 'PROTOCOLS', path: '/workouts', icon: 'bi-shield-shaded' },
    { name: 'ROUTINES', path: '/routines', icon: 'bi-calendar-week' },
    { name: 'TIMELINE', path: '/calendar', icon: 'bi-calendar3' },
    { name: 'ANALYTICS', path: '/analytics', icon: 'bi-graph-up-arrow' },
    { name: 'OBJECTIVES', path: '/goals', icon: 'bi-bullseye' },
    { name: 'FUEL', path: '/nutrition', icon: 'bi-egg-fried' },
    { name: 'TEMPLATES', path: '/templates', icon: 'bi-layout-text-window' },
    { name: 'ACHIEVEMENTS', path: '/achievements', icon: 'bi-trophy-fill' },
    { name: 'PROFILE', path: '/profile', icon: 'bi-person-badge' },
  ];

  return (
    <div className={`fusion-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand-accent">
        <NavLink to="/" className="sidebar-logo-accent" onClick={handleLinkClick}>
          <img src="/logo.png" alt="HIIT Revolution" className="sidebar-logo-img" />
          <span>HIIT <span className="text-fusion">Revolution</span></span>
        </NavLink>
      </div>

      <div className="sidebar-op-info">
        <div className="op-avatar-sidebar">
          {user?.profilePicture ? (
            <img src={getProfilePictureUrl(user.profilePicture)} alt="Operator" />
          ) : (
            <div className="op-placeholder-sidebar">
              <i className="bi bi-person-fill"></i>
            </div>
          )}
        </div>
        <div className="op-details-sidebar">
          <span className="op-name-sidebar">{user?.name || 'GUEST_NODE'}</span>
          <span className="op-status-sidebar">COMMANDER STATUS</span>
        </div>
      </div>

      <nav className="sidebar-nav-accent">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link-accent ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer-accent">
        <button onClick={handleLogout} className="fusion-logout-btn">
          <i className="bi bi-power"></i>
          <span>DISCONNECT</span>
        </button>
      </div>
    </div>
  );
}
