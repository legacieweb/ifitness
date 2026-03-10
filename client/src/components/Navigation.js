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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
  const isHome = location.pathname === '/';

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about-us' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''} ${isHome ? 'header-light' : ''}`}>
      <nav className="nav-container">
        <Link to="/" className="navbar-brand-modern" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-logo">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
          <span className="brand-name">iFitness</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''} ${isAuthenticated ? 'authenticated' : ''}`}>
          <ul className="nav-links">
            {publicLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
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
                  className={`nav-item dashboard-link ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          
          {/* Mobile User Section */}
          {isAuthenticated ? (
            <div className="mobile-user-section">
              <div className="mobile-user-card">
                <div className="user-avatar">
                  {user?.profilePicture ? (
                    <img src={getProfilePictureUrl(user.profilePicture)} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-status">Member</span>
                </div>
              </div>
              <div className="mobile-actions">
                <Link to="/profile" className="action-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-person-circle"></i>
                  <span>Profile</span>
                </Link>
                <button className="action-link logout" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-actions d-lg-none">
              <Link to="/login" className="auth-btn login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="auth-btn signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>

        <div className="nav-actions-desktop">
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <Link to="/login" className="link-login">Login</Link>
              <Link to="/register" className="btn-get-started">Get Started</Link>
            </div>
          ) : (
            <div className="user-profile-dropdown">
              <div className="user-trigger">
                <span className="user-name-text">{user?.name}</span>
                <div className="user-avatar-mini">
                  {user?.profilePicture ? (
                    <img src={getProfilePictureUrl(user.profilePicture)} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder-mini">{user?.name?.charAt(0)}</div>
                  )}
                </div>
              </div>
              <div className="dropdown-content">
                <Link to="/profile" className="dropdown-item">
                  <i className="bi bi-person"></i>
                  Profile
                </Link>
                <Link to="/dashboard" className="dropdown-item">
                  <i className="bi bi-grid"></i>
                  Dashboard
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <i className="bi bi-box-arrow-right"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </nav>
    </header>
  );
}
