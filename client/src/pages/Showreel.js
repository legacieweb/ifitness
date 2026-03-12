import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VIDEOS } from '../data/videoData';
import CyberToast from '../components/CyberToast';
import './Showreel.css';

export default function Showreel() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id: videoParamId } = useParams();
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [toast, setToast] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(!isAuthenticated); // Auto-mute for guests to allow autoplay
  const [guestPreviewEnded, setGuestPreviewEnded] = useState(false);
  const scrollContainerRef = useRef(null);
  const videoRefs = useRef([]);

  // Deep linking effect
  useEffect(() => {
    if (videoParamId) {
      const index = VIDEOS.findIndex(v => v.id.toString() === videoParamId);
      if (index !== -1) {
        setSelectedVideoIndex(index);
        document.body.style.overflow = 'hidden';
      }
    }
  }, [videoParamId]);

  const handleVideoClick = (index) => {
    const video = VIDEOS[index];
    navigate(`/showreel/${video.id}`);
  };

  const closePlayer = () => {
    setSelectedVideoIndex(null);
    setShowSettingsPopup(false);
    setGuestPreviewEnded(false);
    navigate('/showreel');
    document.body.style.overflow = 'auto';
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setGuestPreviewEnded(true);
      return;
    }
    const video = VIDEOS[selectedVideoIndex];
    const url = `${window.location.origin}${window.location.pathname}#/showreel/${video.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setToast({ message: 'URL_COPIED_TO_CLIPBOARD', type: 'success' });
    });
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    
    // Guest preview logic: 4 seconds limit
    if (!isAuthenticated && video.currentTime >= 4) {
      video.pause();
      setGuestPreviewEnded(true);
      return;
    }

    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
  };

  const handleVideoEnded = (index) => {
    if (index < VIDEOS.length - 1) {
      // Auto scroll to next video
      const nextIndex = index + 1;
      const nextVideoId = VIDEOS[nextIndex].id;
      navigate(`/showreel/${nextVideoId}`);
    }
  };

  const downloadVideo = (e, url, title) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setGuestPreviewEnded(true);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_PROTOCOL.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ message: 'INITIALIZING_DOWNLOAD_PROTOCOL', type: 'info' });
  };

  const reportVideo = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setGuestPreviewEnded(true);
      return;
    }
    setToast({ message: 'REPORT_FILED: PROTOCOL_VIOLATION_UNDER_REVIEW', type: 'error' });
  };

  const updatePlaybackSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (selectedVideoIndex !== null && videoRefs.current[selectedVideoIndex]) {
      videoRefs.current[selectedVideoIndex].playbackRate = speed;
    }
    setShowSettingsPopup(false);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (selectedVideoIndex !== null && videoRefs.current[selectedVideoIndex]) {
      videoRefs.current[selectedVideoIndex].muted = !isMuted;
    }
  };

  const toggleControls = (e) => {
    if (e.target.closest('button') || e.target.closest('.action-node') || e.target.closest('.settings-popup-content')) return;
    setShowControls(!showControls);
  };

  const handleProgressSeek = (e, index) => {
    e.stopPropagation();
    if (!isAuthenticated) return; // Guests can't seek
    const video = videoRefs.current[index];
    const rect = e.target.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
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

          {toast && <CyberToast {...toast} onClose={() => setToast(null)} />}

          {showSettingsPopup && (
            <div className="settings-popup-overlay" onClick={() => setShowSettingsPopup(false)}>
              <div className="settings-popup-content" onClick={e => e.stopPropagation()}>
                <h3 className="popup-title">VIDEO_SETTINGS</h3>
                <div className="settings-group">
                  <label>PLAYBACK_SPEED</label>
                  <div className="speed-options">
                    {[0.5, 1, 1.5, 2].map(speed => (
                      <button 
                        key={speed} 
                        className={playbackSpeed === speed ? 'active' : ''}
                        onClick={() => updatePlaybackSpeed(speed)}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
                <button className="popup-close mt-4" onClick={() => setShowSettingsPopup(false)}>CLOSE</button>
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
                    autoPlay
                    loop={isAuthenticated}
                    onEnded={() => handleVideoEnded(index)}
                    playsInline
                    className="tiktok-video-element"
                    onTimeUpdate={handleTimeUpdate}
                    muted={isMuted}
                  ></video>

                  {guestPreviewEnded && !isAuthenticated && (
                    <div className="guest-limit-overlay">
                      <div className="limit-content">
                        <div className="limit-badge">PREVIEW_LIMIT_REACHED</div>
                        <h3 className="limit-title">PROTOCOL_ENCRYPTED</h3>
                        <p className="limit-text">Guest access is limited to 4 seconds. Initialize full operator sync to view complete intel.</p>
                        <div className="limit-actions">
                          <Link to="/register" className="cyber-btn-v2 small-btn">INITIALIZE_SYNC</Link>
                          <Link to="/login" className="footer-link-v2">LOG_IN</Link>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Playback Controls (Visible on click) */}
                  <div className={`video-playback-controls ${showControls ? 'visible' : ''}`}>
                    <div className="playback-actions">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated && guestPreviewEnded) return;
                        const v = videoRefs.current[index];
                        if (v.paused) v.play(); else v.pause();
                      }}>
                        <i className={`bi bi-${videoRefs.current[index]?.paused ? 'play' : 'pause'}-fill`}></i>
                      </button>
                      <button onClick={toggleMute} className="ms-3">
                        <i className={`bi bi-volume-${isMuted ? 'mute' : 'up'}-fill`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Custom Controls Overlay */}
                  <div className="video-controls-overlay">
                    <div className="video-info-stack">
                      <div className="op-badge">{isAuthenticated ? "OPERATOR_INTEL" : "GUEST_PREVIEW"}</div>
                      <h2 className="v-title">{video.title}</h2>
                      <p className="v-desc">{video.description}</p>
                      <div className="v-tags">
                        <span className="v-tag">#{video.category}</span>
                        <span className="v-tag">#CRIMSON</span>
                        <span className="v-tag">#ELITE</span>
                      </div>
                    </div>

                    <div className="side-actions-stack">
                      <div className="action-node" onClick={handleShareClick}>
                        <div className="node-icon"><i className="bi bi-share-fill"></i></div>
                        <span>SHARE</span>
                      </div>
                      <div className="action-node" onClick={() => setShowSettingsPopup(true)}>
                        <div className="node-icon"><i className="bi bi-gear-fill"></i></div>
                        <span>SETTINGS</span>
                      </div>
                      <div className="action-node" onClick={(e) => downloadVideo(e, video.url, video.title)}>
                        <div className="node-icon"><i className="bi bi-download"></i></div>
                        <span>SAVE</span>
                      </div>
                      <div className="action-node" onClick={reportVideo}>
                        <div className="node-icon"><i className="bi bi-exclamation-octagon"></i></div>
                        <span>REPORT</span>
                      </div>
                    </div>

                    <div className="bottom-progress-bar" onClick={(e) => handleProgressSeek(e, index)}>
                      <div className="progress-fill" style={{ width: `${videoProgress}%` }}></div>
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
