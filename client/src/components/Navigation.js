import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
        <Link to="/" className="navbar-brand-clean" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-icon">
            <i className="bi bi-activity"></i>
          </div>
          <span className="brand-text">iFitness</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''} ${isAuthenticated ? 'authenticated' : ''}`}>
          <ul className="nav-list">
            {publicLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <>
                <li className="nav-divider"></li>
                <li>
                  <Link
                    to="/dashboard"
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          {/* Mobile User Actions */}
          {isAuthenticated ? (
            <div className="mobile-user-actions">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <i className="bi bi-person-fill"></i>
                    </div>
                  )}
                </div>
                <div className="mobile-user-details">
                  <span className="mobile-user-name">{user?.name || 'User'}</span>
                </div>
              </div>
              <div className="mobile-user-buttons">
                <Link to="/profile" className="mobile-btn" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-person"></i>
                  <span>Profile</span>
                </Link>
                <button className="mobile-btn logout-btn" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-user-actions nav-actions-mobile d-lg-none">
              <Link to="/login" className="mobile-btn" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </Link>
              <Link to="/register" className="mobile-btn primary" style={{ background: 'var(--neon-primary)', color: '#000' }} onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-person-plus"></i>
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        <div className="nav-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn-primary-clean" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-person-plus"></i>
                <span>Sign Up</span>
              </Link>
            </>
          ) : (
            <div className="user-actions">
              <span className="user-name-display">{user?.name || 'User'}</span>
              <button className="btn-logout" onClick={handleLogout} title="Logout">
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        <button className="navbar-toggler-clean" onClick={toggleMenu}>
          <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
        </button>
      </nav>
    </header>
  );
}
