import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CleanHeader.css';

export default function CleanHeader({ title = 'iFitness', showLogo = true }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getWeekday = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Morning';
    if (hours < 18) return 'Afternoon';
    return 'Evening';
  };

  const userName = user?.name || 'Fitness Enthusiast';

  return (
    <header className={`clean-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="clean-header-decor"></div>
      <div className="container">
        <div className="clean-header-content">
          {showLogo && (
            <div className="clean-logo">
              <Link to="/dashboard" className="clean-logo-link">
                <i className="bi bi-activity"></i>
                <span>{title}</span>
              </Link>
            </div>
          )}
          <div className="clean-user-section">
            <div className="clean-user-info">
              <span className="clean-user-greeting">Good {getWeekday()}</span>
              <span className="clean-user-name">{userName}</span>
            </div>
            <div className="clean-user-avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <i className="bi bi-person-fill"></i>
              )}
            </div>
            <div className="clean-quick-actions">
              <button className="clean-quick-action" onClick={() => navigate('/profile')} title="Profile">
                <i className="bi bi-person"></i>
              </button>
              <button className="clean-quick-action" onClick={() => navigate('/notifications')} title="Notifications">
                <i className="bi bi-bell"></i>
              </button>
              <button className="clean-quick-action" onClick={() => navigate('/settings')} title="Settings">
                <i className="bi bi-gear"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}