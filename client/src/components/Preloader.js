import React, { useEffect, useState } from 'react';
import './Preloader.css';

export default function Preloader({ text = 'INITIALIZING' }) {
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 8 + 2;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="crimson-preloader">
      <div className="preloader-mesh"></div>
      <div className="preloader-scan"></div>
      
      <div className="preloader-core">
        <div className="core-ring">
          <div className="ring-inner"></div>
          <div className="ring-pulse"></div>
        </div>
        
        <div className="core-content">
          <div className="protocol-id">PROTOCOL_CRIMSON_v2.0</div>
          <h1 className="system-title">iFITNESS</h1>
          
          <div className="progress-container">
            <div className="progress-label">
              <span className="p-text">{text}</span>
              <span className="p-val">{Math.round(progress)}%</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
              <div className="progress-glow" style={{ left: `${progress}%` }}></div>
            </div>
          </div>

          <div className="terminal-log">
            <div className="log-line">> ESTABLISHING_SECURE_LINK...</div>
            <div className="log-line">> CALIBRATING_BIOMETRICS...</div>
            <div className="log-line">> LOADING_OPERATOR_INTEL...</div>
          </div>
        </div>
      </div>

      <div className="corner-decor top-left"></div>
      <div className="corner-decor top-right"></div>
      <div className="corner-decor bottom-left"></div>
      <div className="corner-decor bottom-right"></div>
    </div>
  );
}
