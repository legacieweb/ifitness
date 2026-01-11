import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardHeader.css';

export default function DashboardHeader() {
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-decor"></div>
      <div className="container">
        <div className="header-content">
          <div className="header-logo">
            <Link to="/" className="logo-link">
              <i className="bi bi-activity"></i>
              <span>iFitness</span>
            </Link>
          </div>
          <div className="header-auth">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-elegant btn-secondary-elegant">
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-elegant btn-primary-elegant">
                  <i className="bi bi-person-plus"></i>
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <>
                <button onClick={logout} className="btn-elegant btn-secondary-elegant">
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}