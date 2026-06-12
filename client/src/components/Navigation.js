import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfilePictureUrl } from '../services/api';
import './Navigation.css';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const publicLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COMMUNITY', path: '/community' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className={`fusion-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="fusion-nav-container">
        <Link to="/" className="fusion-brand" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-icon-fusion">
            <img src="https://i.imgur.com/2vryV0j.png" alt="Hit Republic" className="nav-logo-img" />
          </div>
          <span className="brand-text">Hit <span className="text-fusion">Republic</span></span>
        </Link>

        <div className={`fusion-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="fusion-nav-links">
            {publicLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`fusion-nav-item ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <Link
                  to="/dashboard"
                  className={`fusion-nav-item dashboard-accent ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  TERMINAL
                </Link>
              </li>
            )}
          </ul>
          
          {/* Mobile Operator Controls */}
          {isAuthenticated && (
            <div className="mobile-operator-group">
              <button className="op-logout-btn" onClick={handleLogout}>
                OFFLINE <i className="bi bi-power"></i>
              </button>
            </div>
          )}
        </div>

        <div className="fusion-nav-actions">
          {!isAuthenticated ? (
            <div className="auth-row-fusion">
              <Link to="/login" className="login-link-fusion">LOGIN</Link>
              <Link to="/register" className="btn-fusion">JOIN</Link>
            </div>
          ) : (
            <div className="operator-dropdown">
              <div className="op-trigger">
                <div className="op-avatar">
                  {user?.profilePicture ? (
                    <img src={getProfilePictureUrl(user.profilePicture)} alt="Op" />
                  ) : (
                    <i className="bi bi-person-fill"></i>
                  )}
                </div>
              </div>
              <div className="op-drop-menu glass-morphism">
                <Link to="/profile" className="op-drop-link">
                  <i className="bi bi-person-badge"></i> PROFILE
                </Link>
                <Link to="/dashboard" className="op-drop-link">
                  <i className="bi bi-terminal-fill"></i> TERMINAL
                </Link>
                <div className="op-drop-divider"></div>
                <button onClick={handleLogout} className="op-drop-link logout-accent">
                  <i className="bi bi-power"></i> OFFLINE
                </button>
              </div>
            </div>
          )}
        </div>

        <button className={`fusion-toggler ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}
