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
    <header className={`crimson-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="crimson-nav-container">
        <Link to="/" className="crimson-brand" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-icon-crimson">
            <i className="bi bi-shield-shaded"></i>
          </div>
          <span className="brand-text">iFITNESS<span className="text-crimson">.RED</span></span>
        </Link>

        <div className={`crimson-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="crimson-nav-links">
            {publicLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`crimson-nav-item ${isActive(link.path) ? 'active' : ''}`}
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
                  className={`crimson-nav-item dashboard-red-accent ${isActive('/dashboard') ? 'active' : ''}`}
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

        <div className="crimson-nav-actions">
          {!isAuthenticated ? (
            <div className="auth-row-crimson">
              <Link to="/login" className="login-link-crimson">LOGIN</Link>
              <Link to="/register" className="btn-crimson">JOIN</Link>
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
                <button onClick={handleLogout} className="op-drop-link logout-red">
                  <i className="bi bi-power"></i> OFFLINE
                </button>
              </div>
            </div>
          )}
        </div>

        <button className={`crimson-toggler ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}
