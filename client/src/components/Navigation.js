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

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about-us' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <nav className="nav-container">
        <Link to="/" className="navbar-brand-clean" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-icon">
            <i className="bi bi-activity"></i>
          </div>
          <span>iFitness</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
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

          <div className="nav-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary-gradient" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <div className="user-menu">
                <button className="user-dropdown-trigger" onClick={handleLogout} title="Logout">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <i className="bi bi-person-fill"></i>
                    </div>
                  )}
                  <span className="user-name">{user?.name || 'User'}</span>
                  <i className="bi bi-box-arrow-right ms-1"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        <button className="navbar-toggler-clean" onClick={toggleMenu}>
          <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
        </button>
      </nav>
    </header>
  );
}
