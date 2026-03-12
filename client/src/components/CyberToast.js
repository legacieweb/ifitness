import React, { useEffect } from 'react';
import './CyberToast.css';

export default function CyberToast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`cyber-toast ${type}`}>
      <div className="toast-glitch-line"></div>
      <div className="toast-content">
        <i className={`bi bi-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}`}></i>
        <span>{message.toUpperCase()}</span>
      </div>
    </div>
  );
}
