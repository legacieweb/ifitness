import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BootcampBanner from '../components/BootcampBanner';
import OutdoorActivityBanner from '../components/OutdoorActivityBanner';
import { VIDEOS } from '../data/videoData';
import './Home.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('features');

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="crimson-home">
      {/* Hero Section */}
      <section className="crimson-hero-creative">
        <div className="ambient-particles"></div>
        <div className="hero-noise-overlay"></div>
        
        <div className="crimson-container">
          <div className="creative-layout">
            <div className="creative-content-left">
              <div className="protocol-status reveal">
                <span className="status-dot pulse"></span>
                <span className="status-label">SYSTEM STATUS: OPTIMAL</span>
              </div>
              
              <h1 className="creative-title reveal">
                CORE <span className="title-outline">STRENGTH</span><br/>
                <span className="title-bold">REMASTERED</span>
              </h1>
              
              <div className="creative-actions reveal">
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-glitch">
                  <span className="glitch-text" data-text="INITIATE">INITIATE</span>
                  <div className="glitch-line"></div>
                </Link>
                <Link to="/showreel" className="btn-circle-play">
                  <i className="bi bi-play-fill"></i>
                </Link>
              </div>
            </div>

            <div className="creative-center-media reveal">
              <div className="main-portal">
                <img src="https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=1974&auto=format&fit=crop" alt="Elite Athlete" className="portal-image" />
                <div className="portal-ring"></div>
                <div className="portal-scanner"></div>
              </div>
              
              {/* HUD Elements */}
              <div className="hud-metric metric-1 glass-morphism">
                <div className="metric-label">VOID_CAPACITY</div>
                <div className="metric-value">84.2%</div>
                <div className="metric-graph">
                  <div className="graph-bar" style={{width: '84%'}}></div>
                </div>
              </div>
              
              <div className="hud-metric metric-2 glass-morphism">
                <div className="metric-icon"><i className="bi bi-cpu"></i></div>
                <div className="metric-info">
                  <span className="info-title">NEURAL_SYNC</span>
                  <span className="info-val">ACTIVE</span>
                </div>
              </div>

              <div className="hud-metric metric-3 glass-morphism">
                <div className="metric-header">POWER_LOAD</div>
                <div className="metric-body">
                  <div className="power-segment active"></div>
                  <div className="power-segment active"></div>
                  <div className="power-segment active"></div>
                  <div className="power-segment"></div>
                </div>
              </div>
            </div>

            <div className="creative-content-right reveal">
              <div className="side-description">
                <p>Architected for peak performance. A digital sanctuary where physical evolution is tracked with surgical precision.</p>
              </div>
              
              <div className="terminal-stats">
                <div className="term-node">
                  <span className="term-label">/USERS</span>
                  <span className="term-value">12.4K</span>
                </div>
                <div className="term-node">
                  <span className="term-label">/UPTIME</span>
                  <span className="term-value">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BootcampBanner />
      <OutdoorActivityBanner />

      {/* Core Systems Redesign */}
      <section className="crimson-systems">
        <div className="crimson-container">
          <div className="systems-header reveal">
            <div className="systems-badge">
              <span className="badge-bullet"></span>
              <span>CORE ARCHITECTURE</span>
            </div>
            <h2 className="systems-title">
              INTEGRATED <span className="text-crimson">PROTOCOLS</span>
            </h2>
            <p className="systems-subtitle">
              A multi-layered ecosystem engineered for physical dominance and data-driven evolution.
            </p>
          </div>
          
          <div className="systems-grid-modern">
            <div className="system-module reveal">
              <div className="module-num">01</div>
              <div className="module-content">
                <div className="module-icon"><i className="bi bi-activity"></i></div>
                <h3>NEURAL_TRACKING</h3>
                <p>Advanced biomechanical analysis synchronized with your central nervous system performance.</p>
                <div className="module-stats">
                  <span className="m-tag">SYNC_V4</span>
                  <span className="m-tag">REALTIME</span>
                </div>
              </div>
            </div>

            <div className="system-module active reveal">
              <div className="module-num">02</div>
              <div className="module-content">
                <div className="module-icon"><i className="bi bi-shield-lock"></i></div>
                <h3>ELITE_VAULT</h3>
                <p>Proprietary training structures designed for maximum hypertrophy and metabolic conditioning.</p>
                <div className="module-stats">
                  <span className="m-tag">SECURE</span>
                  <span className="m-tag">PROPRIETARY</span>
                </div>
              </div>
              <div className="module-glow"></div>
            </div>

            <div className="system-module reveal">
              <div className="module-num">03</div>
              <div className="module-content">
                <div className="module-icon"><i className="bi bi-broadcast"></i></div>
                <h3>NODE_COMMUNITY</h3>
                <p>Decentralized network of high-performance athletes competing in global evolution cycles.</p>
                <div className="module-stats">
                  <span className="m-tag">NETWORK</span>
                  <span className="m-tag">GLOBAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
