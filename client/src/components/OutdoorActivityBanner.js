import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OutdoorActivityBanner.css';
import { getActiveOutdoorActivity } from '../services/api';

export default function OutdoorActivityBanner() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [timeUntilStart, setTimeUntilStart] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await getActiveOutdoorActivity();
      if (response.data && response.data._id) {
        setActivity(response.data);
        updateCountdown(response.data);
      }
    } catch (err) {
      console.error('Error fetching outdoor activity:', err);
    }
  };

  const updateCountdown = (activityData = activity) => {
    if (activityData) {
      const now = new Date();
      const start = new Date(activityData.startTime);
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

  if (!activity) return null;

  return (
    <>
      {showLoginPrompt && (
        <div className="activity-login-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="activity-login-modal" onClick={e => e.stopPropagation()}>
            <div className="activity-login-icon">
              <i className="bi bi-person-lock"></i>
            </div>
            <h3>Login Required</h3>
            <p>You need to be logged in to join this outdoor activity and connect with the community.</p>
            <div className="activity-login-actions">
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

      <div className="activity-banner-container" onClick={handleClick}>
        <div className="activity-banner-decoration"></div>
        
        <div className="activity-banner-header">
          <i className="bi bi-tree-fill"></i>
          <h4>Upcoming Outdoor Activity</h4>
        </div>

        <h3 className="activity-banner-title">{activity.title}</h3>
        <p className="activity-banner-description">{activity.description}</p>
        
        <div className="activity-banner-features">
          <div className="activity-banner-feature">
            <i className="bi bi-geo-alt-fill text-danger"></i>
            {activity.location}
          </div>
          <div className="activity-banner-feature">
            <i className="bi bi-people-fill text-primary"></i>
            Community Event
          </div>
          <div className="activity-banner-feature">
            <i className="bi bi-sun-fill text-warning"></i>
            Outdoor
          </div>
        </div>

        <div className="activity-banner-footer">
          <div className="activity-banner-countdown">
            <span className="activity-banner-countdown-label">Starting in:</span>
            <span className="activity-banner-countdown-value">{formatCountdown(timeUntilStart)}</span>
          </div>
          <button className="btn btn-activity-join">
            Join Activity
          </button>
        </div>
      </div>
    </>
  );
}
