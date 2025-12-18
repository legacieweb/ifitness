import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('/api/bootcamps/upcoming');
      const data = await response.json();
      if (data && data._id) {
        setBootcamp(data);
        updateCountdown(data);
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 className="mb-3">Login Required</h3>
            <p className="text-muted mb-4">You need to be logged in to join this bootcamp session.</p>
            <button className="btn btn-primary me-2" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-outline-secondary" onClick={() => setShowLoginPrompt(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
        }}
      >
        <h4 className="mb-2">🚀 New Bootcamp Available!</h4>
        <p className="mb-2"><strong>{bootcamp.title}</strong></p>
        <p className="mb-3">{bootcamp.description}</p>
        <p className="mb-3">📋 <strong>What to Expect:</strong> {bootcamp.expectations}</p>
        <p className="mb-2">⏱️ Starts in: <strong>{formatCountdown(timeUntilStart)}</strong></p>
        <p className="mb-3">
          <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>{bootcamp.difficulty}</span>
        </p>
        <button className="btn btn-light btn-sm" style={{ fontWeight: 600 }}>Login to Join</button>
      </div>
    </>
  );
}
