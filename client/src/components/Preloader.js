import React from 'react';
import './Preloader.css';

export default function Preloader({ text = 'Loading' }) {
  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <div className="preloader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h2 className="preloader-text">{text}</h2>
        <div className="preloader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
