import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VIDEOS } from '../data/videoData';
import './Showreel.css';

export default function Showreel() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const scrollContainerRef = useRef(null);
  const videoRefs = useRef([]);

  const handleVideoClick = (index) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedVideoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closePlayer = () => {
    setSelectedVideoIndex(null);
    setShowSharePopup(false);
    document.body.style.overflow = 'auto';
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const toggleControls = (e) => {
    // Prevent toggling when clicking buttons
    if (e.target.closest('button') || e.target.closest('.action-node')) return;
    setShowControls(!showControls);
  };

  useEffect(() => {
    if (selectedVideoIndex !== null && videoRefs.current[selectedVideoIndex]) {
      videoRefs.current[selectedVideoIndex].play().catch(err => console.log("Auto-play blocked"));
    }
  }, [selectedVideoIndex]);

  // Handle intersection for auto-playing/pausing videos in scroll mode
  useEffect(() => {
    if (selectedVideoIndex === null) return;

    const options = {
      root: scrollContainerRef.current,
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          const index = parseInt(video.getAttribute('data-index'));
          setSelectedVideoIndex(index);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }, options);

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [selectedVideoIndex]);

  return (
    <div className="showreel-page">
      <div className="hero-mesh-background"></div>
      <div className="hero-noise-overlay"></div>
      <div className="showreel-scanner-line"></div>
      
      <div className="crimson-container">
        <header className="showreel-header reveal-active">
          <div className="header-badge">
            <span className="badge-dot"></span>
            <span>INTEL_FEED_V4.0</span>
          </div>
          <h1 className="showreel-title">TRAINING <span className="text-crimson">SHOWREEL</span></h1>
          <p className="showreel-subtitle">Elite level protocols designed for peak performance evolution.</p>
        </header>

        {!isAuthenticated && (
          <div className="auth-notice-banner reveal-active">
            <i className="bi bi-lock-fill"></i>
            <span>ENCRYPTED FEED: LOGIN REQUIRED TO INITIALIZE PLAYBACK</span>
          </div>
        )}

        <div className="video-matrix-grid">
          {VIDEOS.map((video, index) => (
            <div 
              key={video.id} 
              className={`matrix-video-card reveal-active ${!isAuthenticated ? 'locked' : ''}`}
              onClick={() => handleVideoClick(index)}
            >
              <div className="video-visuals">
                <video 
                  className="video-thumb-preview"
                  muted
                  loop
                  playsInline
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                >
                  <source src={video.url} type="video/mp4" />
                </video>
                <div className="video-vignette"></div>
                <div className="video-play-trigger">
                  {isAuthenticated ? (
                    <i className="bi bi-play-fill"></i>
                  ) : (
                    <i className="bi bi-lock-fill"></i>
                  )}
                </div>
                <div className="video-duration">{video.duration}</div>
              </div>
              <div className="video-metadata">
                <div className="video-type">{video.category}</div>
                <h3 className="video-name">{video.title}</h3>
                <p className="video-info">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TikTok Style Vertical Scroller Overlay */}
      {selectedVideoIndex !== null && (
        <div className="tiktok-overlay">
          <button className="close-protocol" onClick={closePlayer}>
            <i className="bi bi-x-lg"></i>
            <span>EXIT_FEED</span>
          </button>

          {showSharePopup && (
            <div className="share-popup-overlay" onClick={() => setShowSharePopup(false)}>
              <div className="share-popup-content" onClick={e => e.stopPropagation()}>
                <h3 className="popup-title">SHARE_PROTOCOL</h3>
                <div className="url-display">
                  <input type="text" readOnly value={window.location.href} />
                  <button onClick={copyToClipboard} className={copySuccess ? 'copied' : ''}>
                    {copySuccess ? 'COPIED!' : 'COPY_URL'}
                  </button>
                </div>
                <button className="popup-close" onClick={() => setShowSharePopup(false)}>CLOSE</button>
              </div>
            </div>
          )}

          <div className="tiktok-scroll-container" ref={scrollContainerRef}>
            {VIDEOS.map((video, index) => (
              <div key={video.id} className="tiktok-video-slide">
                <div className="video-wrapper" onClick={toggleControls}>
                  <video
                    ref={el => videoRefs.current[index] = el}
                    data-index={index}
                    src={video.url}
                    loop
                    playsInline
                    className="tiktok-video-element"
                  ></video>
                  
                  {/* Playback Controls (Visible on click) */}
                  <div className={`video-playback-controls ${showControls ? 'visible' : ''}`}>
                    <div className="playback-actions">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        const v = videoRefs.current[index];
                        if (v.paused) v.play(); else v.pause();
                      }}>
                        <i className={`bi bi-${videoRefs.current[index]?.paused ? 'play' : 'pause'}-fill`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Custom Controls Overlay */}
                  <div className="video-controls-overlay">
                    <div className="video-info-stack">
                      <div className="op-badge">OPERATOR_INTEL</div>
                      <h2 className="v-title">{video.title}</h2>
                      <p className="v-desc">{video.description}</p>
                      <div className="v-tags">
                        <span className="v-tag">#{video.category}</span>
                        <span className="v-tag">#CRIMSON</span>
                        <span className="v-tag">#ELITE</span>
                      </div>
                    </div>

                    <div className="side-actions-stack">
                      <div className="action-node" onClick={() => setShowSharePopup(true)}>
                        <div className="node-icon"><i className="bi bi-share-fill"></i></div>
                        <span>SHARE</span>
                      </div>
                      <div className="action-node">
                        <div className="node-icon"><i className="bi bi-gear-fill"></i></div>
                        <span>SETTINGS</span>
                      </div>
                    </div>

                    <div className="bottom-progress-bar">
                      <div className="progress-fill" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-indicator">
            <i className="bi bi-chevron-up"></i>
            <span>SCROLL_TO_NAVIGATE</span>
            <i className="bi bi-chevron-down"></i>
          </div>
        </div>
      )}
    </div>
  );
}
