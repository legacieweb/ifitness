import React, { useEffect, useState } from 'react';
import './Preloader.css';

export default function Preloader({ text = 'Loading' }) {
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState([]);

  // Initialize particles
  useEffect(() => {
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      angle: Math.random() * Math.PI * 2
    }));
    setParticles(initialParticles);
  }, []);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 8 + 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + Math.cos(p.angle) * p.speed + 100) % 100,
        y: (p.y + Math.sin(p.angle) * p.speed + 100) % 100
      })));
    };
    
    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="preloader-overlay">
      {/* Animated Background */}
      <div className="background-grid"></div>
      <div className="background-gradient"></div>
      
      {/* Floating Particles */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Loading Animation */}
      <div className="preloader-main">
        {/* Outer Ring */}
        <div className="ring-container">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>

        {/* Central Logo/Icon */}
        <div className="central-icon">
          <div className="logo-shape">
            <div className="logo-inner"></div>
            <div className="logo-glow"></div>
          </div>
          
          {/* Progress Arc */}
          <svg className="progress-arc" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="50%" stopColor="#764ba2" />
                <stop offset="100%" stopColor="#f093fb" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle 
              className="progress-bg" 
              cx="50" 
              cy="50" 
              r="45"
            />
            <circle 
              className="progress-fill" 
              cx="50" 
              cy="50" 
              r="45"
              style={{ 
                strokeDasharray: 283,
                strokeDashoffset: 283 - (283 * progress) / 100 
              }}
            />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="element element-1"></div>
          <div className="element element-2"></div>
          <div className="element element-3"></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="preloader-content">
        <h1 className="preloader-title">
          <span className="title-word">i</span>
          <span className="title-word">Fitness</span>
        </h1>
        
        <div className="preloader-subtitle">
          <span className="loading-text">{text}</span>
          <div className="typing-cursor"></div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-track">
            <div 
              className="progress-fill-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="progress-shimmer"></div>
          </div>
          <div className="progress-percentage">{Math.round(progress)}%</div>
        </div>
      </div>

      {/* Ambient Effects */}
      <div className="ambient-light"></div>
      <div className="scan-line"></div>
    </div>
  );
}
