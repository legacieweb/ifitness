import React, { useEffect, useState } from 'react';
import './Preloader.css';

export default function Preloader({ text = 'Loading' }) {
  const [progress, setProgress] = useState(0);
  const [activeParticle, setActiveParticle] = useState(0);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + Math.random() * 15));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Rotate active particle indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveParticle(prev => (prev + 1) % 12);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="preloader-overlay">
      {/* Animated Background Grid */}
      <div className="grid-bg"></div>
      
      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      
      {/* Particle System */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`particle-dot ${activeParticle === i % 12 ? 'active' : ''}`}
            style={{
              '--delay': `${i * 0.15}s`,
              '--duration': `${2 + Math.random() * 2}s`,
              '--angle': `${i * 18}deg`,
              '--distance': `${150 + Math.random() * 150}px`,
              '--size': `${3 + Math.random() * 5}px`
            }}
          ></div>
        ))}
      </div>
      
      {/* Energy Rings */}
      <div className="energy-ring ring-1"></div>
      <div className="energy-ring ring-2"></div>
      <div className="energy-ring ring-3"></div>
      
      {/* Main Preloader Container */}
      <div className="preloader-main">
        {/* Outer Rotating Dashed Ring */}
        <div className="dashed-ring">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="dash"
              style={{ '--index': i, '--rotation': `${i * 30}deg` }}
            ></div>
          ))}
        </div>
        
        {/* Progress Ring SVG */}
        <svg className="progress-ring" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle 
            className="progress-ring-bg" 
            cx="60" 
            cy="60" 
            r="54"
          />
          <circle 
            className="progress-ring-fill" 
            cx="60" 
            cy="60" 
            r="54"
            style={{ '--progress': progress }}
          />
        </svg>
        
        {/* Center Dumbbell */}
        <div className="dumbbell-container">
          <div className="dumbbell">
            <div className="db-bar"></div>
            <div className="db-weight db-weight-left">
              <div className="weight-detail"></div>
              <div className="weight-detail"></div>
            </div>
            <div className="db-weight db-weight-right">
              <div className="weight-detail"></div>
              <div className="weight-detail"></div>
            </div>
            <div className="db-glow"></div>
          </div>
        </div>
        
        {/* Percentage Indicator */}
        <div className="percentage-indicator">
          <span className="percentage-value">{Math.round(progress)}</span>
          <span className="percentage-symbol">%</span>
        </div>
      </div>
      
      {/* Text Content */}
      <div className="preloader-content">
        <h2 className="preloader-text">
          {text}
          <span className="animated-dots">
            <span className="dot" style={{ '--i': 1 }}></span>
            <span className="dot" style={{ '--i': 2 }}></span>
            <span className="dot" style={{ '--i': 3 }}></span>
          </span>
        </h2>
        <p className="preloader-subtitle">
          <span className="subtitle-icon">⚡</span>
          Getting things ready for you
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="progress-shine"></div>
        </div>
        <div className="progress-labels">
          <span className="progress-label">Start</span>
          <span className="progress-label">Complete</span>
        </div>
      </div>
      
      {/* Corner Accents */}
      <div className="corner-accent top-left"></div>
      <div className="corner-accent top-right"></div>
      <div className="corner-accent bottom-left"></div>
      <div className="corner-accent bottom-right"></div>
    </div>
  );
}
