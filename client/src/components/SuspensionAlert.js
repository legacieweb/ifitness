import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './SuspensionAlert.css';

export default function SuspensionAlert() {
  const { suspensionAlert, forceLogout } = useAuth();
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    if (!suspensionAlert) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          forceLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [suspensionAlert, forceLogout]);

  if (!suspensionAlert) return null;

  return (
    <div className="suspension-alert-overlay">
      <div className="suspension-alert-container">
        <div className="suspension-alert-icon">
          <i className="bi bi-shield-exclamation text-danger"></i>
        </div>
        <h2>Account Suspended</h2>
        <p className="suspension-reason">{suspensionAlert.reason}</p>
        <div className="suspension-countdown">
          <p>You will be logged out in:</p>
          <div className="countdown-timer">{countdown}s</div>
        </div>
        <p className="suspension-message">Redirecting to login page...</p>
      </div>
    </div>
  );
}
