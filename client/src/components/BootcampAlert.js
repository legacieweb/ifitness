import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BootcampAlert() {
  const navigate = useNavigate();
  const [upcomingBootcamp, setUpcomingBootcamp] = useState(null);
  const [activeBootcamp, setActiveBootcamp] = useState(null);
  const [bootcampCountdown, setBootcampCountdown] = useState(null);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    fetchBootcampInfo();
    const interval = setInterval(fetchBootcampInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchBootcampInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const upcomingRes = await fetch('https://ifitness.onrender.com/api/bootcamps/upcoming');
      const activeRes = await fetch('https://ifitness.onrender.com/api/bootcamps/active');

      const upcoming = await upcomingRes.json();
      const active = await activeRes.json();

      if (upcoming && upcoming._id) {
        setUpcomingBootcamp(upcoming);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        const hasAccepted = upcoming.participants?.some(p => p.userId === userId || p.userId?._id === userId);
        setHasAccepted(hasAccepted);
        const now = new Date();
        const start = new Date(upcoming.startTime);
        setBootcampCountdown(Math.max(0, start - now));
      }

      if (active && active._id) {
        setActiveBootcamp(active);
        const now = new Date();
        const end = new Date(active.endTime);
        setBootcampCountdown(Math.max(0, end - now));
      }
    } catch (err) {
      console.error('Error fetching bootcamp info:', err);
    }
  };

  const handleAcceptBootcamp = async (bootcampId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ifitness.onrender.com/api/bootcamps/${bootcampId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setHasAccepted(true);
        alert('🎉 ' + (data.message || 'Bootcamp accepted! Achievement saved to your workouts!'));
        setTimeout(() => {
          navigate('/workouts');
        }, 500);
      } else {
        console.error('Error accepting bootcamp:', data);
        alert('❌ ' + (data.message || 'Failed to accept bootcamp'));
      }
    } catch (err) {
      console.error('Error accepting bootcamp:', err);
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

  if (!upcomingBootcamp && !activeBootcamp) return null;

  return (
    <>
      {upcomingBootcamp && !activeBootcamp && (
        <div
          style={{
            background: hasAccepted ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: hasAccepted ? '0 8px 24px rgba(16, 185, 129, 0.25)' : '0 8px 24px rgba(245, 87, 108, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', transform: 'translate(100px, -100px)' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {hasAccepted ? (
              <>
                <h5 style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>✅ Invite Accepted!</h5>
                <p style={{ margin: 0, marginBottom: '4px', fontWeight: 600 }}>{upcomingBootcamp.title}</p>
                <p style={{ margin: 0, marginBottom: '12px', fontSize: '14px', opacity: 0.95 }}>🎉 Invite accepted. Now let's wait for the session to start!</p>
                <p style={{ margin: '8px 0 12px 0', fontSize: '14px' }}>
                  ⏱️ Session starts in: <strong style={{ fontFamily: 'monospace', fontSize: '16px' }}>{formatCountdown(bootcampCountdown)}</strong>
                </p>
              </>
            ) : (
              <>
                <h5 style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>🚀 Bootcamp Coming Soon!</h5>
                <p style={{ margin: 0, marginBottom: '4px', fontWeight: 600 }}>{upcomingBootcamp.title}</p>
                <p style={{ margin: 0, marginBottom: '8px', fontSize: '14px', opacity: 0.95 }}>{upcomingBootcamp.description}</p>
                <p style={{ margin: '8px 0', fontSize: '14px', opacity: 0.9 }}>
                  📋 <strong>What to Expect:</strong> {upcomingBootcamp.expectations}
                </p>
                <p style={{ margin: '8px 0 12px 0', fontSize: '14px' }}>
                  ⏱️ Starts in: <strong style={{ fontFamily: 'monospace', fontSize: '16px' }}>{formatCountdown(bootcampCountdown)}</strong>
                </p>
              </>
            )}
            {!hasAccepted && (
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: 'white',
                  color: '#f5576c',
                  border: 'none',
                  fontWeight: 600,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onClick={() => handleAcceptBootcamp(upcomingBootcamp._id)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ✓ Accept Invite
              </button>
            )}
          </div>
        </div>
      )}

      {activeBootcamp && (
        <div
          style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', transform: 'translate(100px, -100px)' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h5 style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>✅ Bootcamp is LIVE!</h5>
            <p style={{ margin: 0, marginBottom: '8px', fontWeight: 600 }}>{activeBootcamp.title}</p>
            <p style={{ margin: 0, fontSize: '14px' }}>
              ⏱️ Time remaining: <strong style={{ fontFamily: 'monospace', fontSize: '16px' }}>{formatCountdown(bootcampCountdown)}</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
