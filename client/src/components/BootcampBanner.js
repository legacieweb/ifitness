import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BootcampBanner.css';
import { getUpcomingBootcamp } from '../../services/api';

export default function BootcampBanner() {
  const navigate = useNavigate();
  const [bootcamp, setBootcamp] = useState(null);
  const [timeUntilStart, setTimeUntilStart] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchBootcamp();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchBootcamp = async () => {
    try {
      const response = await getUpcomingBootcamp();
      if (response.data && response.data._id) {
        setBootcamp(response.data);
        updateCountdown(response.data);
      }
    } catch (err) {
      console.error('Error fetching bootcamp:', err);
    }
  };

  const updateCountdown = (bootcampData = bootcamp) => {
    if (bootcampData) {
      const now = new Date();
      const start = new Date(bootcampData.startTime);
      const diff = Math.max(0, start - now);
      setTimeUntilStart(diff);
    }
  };

  const formatCountdown = (ms) => {
    if (!ms) return 'Starting now!';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleClick = () => {
    setShowLoginPrompt(true);
  };

  if (!bootcamp) return null;

  return (
    <>
      {showLoginPrompt && (
        <div className="bootcamp-login-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="bootcamp-login-modal" onClick={e => e.stopPropagation()}>
            <div className="bootcamp-login-icon">
              <i className="bi bi-person-lock"></i>
            </div>
            <h3>Login Required</h3>
            <p>You need to be logged in to join this high-energy bootcamp session and track your progress.</p>
            <div className="bootcamp-login-actions">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Go to Login
              </button>
              <button className="btn btn-outline-secondary" onClick={() => setShowLoginPrompt(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bootcamp-banner-container" onClick={handleClick}>
        <div className="bootcamp-banner-decoration"></div>
        
        <div className="bootcamp-banner-header">
          <i className="bi bi-rocket-takeoff"></i>
          <h4>Upcoming Bootcamp</h4>
        </div>

        <h3 className="bootcamp-banner-title">{bootcamp.title}</h3>
        <p className="bootcamp-banner-description">{bootcamp.description}</p>
        
        <div className="bootcamp-banner-features">
          <div className="bootcamp-banner-feature">
            <i className="bi bi-star-fill text-warning"></i>
            {bootcamp.difficulty}
          </div>
          <div className="bootcamp-banner-feature">
            <i className="bi bi-calendar-check"></i>
            Live Session
          </div>
          <div className="bootcamp-banner-feature">
            <i className="bi bi-lightning-fill text-info"></i>
            High Intensity
          </div>
        </div>

        <div className="bootcamp-banner-footer">
          <div className="bootcamp-banner-countdown">
            <span className="bootcamp-banner-countdown-label">Starting in:</span>
            <span className="bootcamp-banner-countdown-value">{formatCountdown(timeUntilStart)}</span>
          </div>
          <button className="btn btn-bootcamp-join">
            Join the Challenge
          </button>
        </div>
      </div>
    </>
  );
}
