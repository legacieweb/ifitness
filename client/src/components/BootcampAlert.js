import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BootcampAlert.css';

export default function BootcampAlert() {
  const navigate = useNavigate();
  const [upcomingBootcamp, setUpcomingBootcamp] = useState(null);
  const [activeBootcamp, setActiveBootcamp] = useState(null);
  const [upcomingActivity, setUpcomingActivity] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const [bootcampCountdown, setBootcampCountdown] = useState(null);
  const [activityCountdown, setActivityCountdown] = useState(null);
  const [hasAcceptedBootcamp, setHasAcceptedBootcamp] = useState(false);
  const [hasAcceptedActivity, setHasAcceptedActivity] = useState(false);

  useEffect(() => {
    fetchInfo();
    const interval = setInterval(fetchInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchInfo = async () => {
    try {
      const userData = localStorage.getItem('user');
      const user = (userData && userData !== 'undefined') ? JSON.parse(userData) : {};
      const userId = user.id || user._id;

      // Bootcamps
      const upcomingBRes = await fetch('/api/bootcamps/upcoming');
      const activeBRes = await fetch('/api/bootcamps/active');
      const upcomingB = await upcomingBRes.json();
      const activeB = await activeBRes.json();

      if (upcomingB && upcomingB._id) {
        setUpcomingBootcamp(upcomingB);
        setHasAcceptedBootcamp(upcomingB.participants?.some(p => (p.userId === userId || p.userId?._id === userId)));
        const now = new Date();
        const start = new Date(upcomingB.startTime);
        setBootcampCountdown(Math.max(0, start - now));
      }

      if (activeB && activeB._id) {
        setActiveBootcamp(activeB);
        const now = new Date();
        const end = new Date(activeB.endTime);
        setBootcampCountdown(Math.max(0, end - now));
      }

      // Outdoor Activities
      const activeARes = await fetch('/api/outdoor-activities/active');
      const activeA = await activeARes.json();

      if (activeA && activeA._id) {
        setUpcomingActivity(activeA); // Treating active/upcoming outdoor activity similarly for alert
        setHasAcceptedActivity(activeA.participants?.some(p => (p.userId === userId || p.userId?._id === userId)));
        const now = new Date();
        const start = new Date(activeA.startTime);
        const end = new Date(activeA.endTime);
        
        if (now < start) {
          setActivityCountdown(Math.max(0, start - now));
          setActiveActivity(null);
        } else if (now < end) {
          setActivityCountdown(Math.max(0, end - now));
          setActiveActivity(activeA);
        }
      }
    } catch (err) {
      console.error('Error fetching info:', err);
    }
  };

  const handleAcceptBootcamp = async (bootcampId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bootcamps/${bootcampId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setHasAcceptedBootcamp(true);
        alert('🎉 ' + (data.message || 'Bootcamp accepted!'));
        navigate('/workouts');
      } else {
        alert('❌ ' + (data.message || 'Failed to accept bootcamp'));
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const handleAcceptActivity = async (activityId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/outdoor-activities/${activityId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setHasAcceptedActivity(true);
        alert('🎉 ' + (data.message || 'Activity joined!'));
        navigate('/workouts');
      } else {
        alert('❌ ' + (data.message || 'Failed to join activity'));
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const formatCountdown = (ms) => {
    if (!ms || ms <= 0) return '00:00:00';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!upcomingBootcamp && !activeBootcamp && !upcomingActivity) return null;

  return (
    <div className="alerts-wrapper">
      {upcomingBootcamp && !activeBootcamp && (
        <div className={`bootcamp-alert-container ${hasAcceptedBootcamp ? 'bootcamp-alert-accepted' : 'bootcamp-alert-upcoming'}`}>
          <div className="bootcamp-alert-decoration"></div>
          <div className="bootcamp-alert-content">
            <div className="bootcamp-alert-icon">
              <i className={`bi ${hasAcceptedBootcamp ? 'bi-patch-check-fill' : 'bi-rocket-takeoff-fill'}`}></i>
            </div>
            <div className="bootcamp-alert-info">
              {hasAcceptedBootcamp ? (
                <>
                  <h5 className="bootcamp-alert-title">Bootcamp Joined!</h5>
                  <p className="bootcamp-alert-subtitle">{upcomingBootcamp.title}</p>
                  <div className="bootcamp-alert-meta">
                    <i className="bi bi-stopwatch me-2"></i>
                    Starts in: <span className="bootcamp-alert-timer">{formatCountdown(bootcampCountdown)}</span>
                  </div>
                </>
              ) : (
                <>
                  <h5 className="bootcamp-alert-title">New Bootcamp Invitation!</h5>
                  <p className="bootcamp-alert-subtitle">{upcomingBootcamp.title}</p>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="bootcamp-alert-timer-wrapper">
                      <i className="bi bi-stopwatch me-2"></i>
                      Starts in: <span className="bootcamp-alert-timer">{formatCountdown(bootcampCountdown)}</span>
                    </div>
                    <button className="btn btn-bootcamp-accept" onClick={() => handleAcceptBootcamp(upcomingBootcamp._id)}>
                      Accept Invite
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeBootcamp && (
        <div className="bootcamp-alert-container bootcamp-alert-live">
          <div className="bootcamp-alert-decoration"></div>
          <div className="bootcamp-alert-content">
            <div className="bootcamp-alert-icon"><i className="bi bi-broadcast"></i></div>
            <div className="bootcamp-alert-info">
              <h5 className="bootcamp-alert-title"><span className="badge bg-danger me-2 pulse-badge">LIVE</span> Bootcamp is LIVE!</h5>
              <p className="bootcamp-alert-subtitle">{activeBootcamp.title}</p>
              <div className="bootcamp-alert-meta">
                <i className="bi bi-hourglass-split me-2"></i>
                Remaining: <span className="bootcamp-alert-timer">{formatCountdown(bootcampCountdown)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {upcomingActivity && !activeActivity && (
        <div className={`bootcamp-alert-container activity-alert ${hasAcceptedActivity ? 'bootcamp-alert-accepted' : 'bootcamp-alert-upcoming'}`} style={{ borderLeftColor: '#00b09b' }}>
          <div className="bootcamp-alert-decoration" style={{ background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' }}></div>
          <div className="bootcamp-alert-content">
            <div className="bootcamp-alert-icon" style={{ color: '#00b09b' }}>
              <i className={`bi ${hasAcceptedActivity ? 'bi-tree-fill' : 'bi-geo-alt-fill'}`}></i>
            </div>
            <div className="bootcamp-alert-info">
              {hasAcceptedActivity ? (
                <>
                  <h5 className="bootcamp-alert-title">Activity Joined!</h5>
                  <p className="bootcamp-alert-subtitle">{upcomingActivity.title}</p>
                  <div className="bootcamp-alert-meta">
                    <i className="bi bi-stopwatch me-2"></i>
                    Starts in: <span className="bootcamp-alert-timer">{formatCountdown(activityCountdown)}</span>
                  </div>
                </>
              ) : (
                <>
                  <h5 className="bootcamp-alert-title">Outdoor Activity Invite!</h5>
                  <p className="bootcamp-alert-subtitle">{upcomingActivity.title} ({upcomingActivity.location})</p>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="bootcamp-alert-timer-wrapper">
                      <i className="bi bi-stopwatch me-2"></i>
                      Starts in: <span className="bootcamp-alert-timer">{formatCountdown(activityCountdown)}</span>
                    </div>
                    <button className="btn btn-bootcamp-accept" style={{ background: '#00b09b' }} onClick={() => handleAcceptActivity(upcomingActivity._id)}>
                      Join Activity
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
