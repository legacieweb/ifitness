import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNotificationBanner.css';

export default function TopNotificationBanner() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const [type, setType] = useState(null); // 'bootcamp' or 'activity'

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      // Import API functions
      const { getUpcomingBootcamp, getActiveOutdoorActivity } = await import('../services/api');
      
      // Check for upcoming bootcamp first
      const bData = await getUpcomingBootcamp();
       
      if (bData && bData._id) {
        setActiveItem(bData);
        setType('bootcamp');
        return;
      }
 
      // If no bootcamp, check for active outdoor activity
      const aData = await getActiveOutdoorActivity();
       
      if (aData && aData._id) {
        setActiveItem(aData);
        setType('activity');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  if (!activeItem) return null;

  return (
    <div className={`top-notification-banner ${type}`} onClick={() => navigate('/dashboard')}>
      <div className="banner-content">
        <span className="banner-badge">
          {type === 'bootcamp' ? '🔥 NEW BOOTCAMP' : '🌲 OUTDOOR ACTIVITY'}
        </span>
        <span className="banner-text">
          <strong>{activeItem.title}</strong> is happening soon! Click here to join the challenge and accept your invite!
        </span>
        <span className="banner-action">
          Accept Invite <i className="bi bi-arrow-right-short"></i>
        </span>
      </div>
      <div className="banner-close" onClick={(e) => { e.stopPropagation(); setActiveItem(null); }}>
        <i className="bi bi-x"></i>
      </div>
    </div>
  );
}
