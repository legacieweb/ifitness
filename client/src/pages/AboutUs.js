import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import './AboutUs.css';

export default function AboutUs() {
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
    <PageTransition>
      <div className="crimson-about">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Hero Section */}
        <section className="about-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">OUR ARCHITECTURE</span>
              </div>
              
              <h1 className="hero-title">
                THE <span className="text-crimson">MISSION</span>
                <br />
                <span className="hero-subtitle">REDEFINING LIMITS</span>
              </h1>
              
              <p className="hero-description">
                Engineered in 2024, Crimson Protocol was built to bridge the gap between elite athletic performance and data-driven precision.
              </p>

              <div className="hero-stats-row">
                <div className="stat-node">
                  <span className="stat-num">2.4M</span>
                  <span className="stat-tag">LOGGED_PROTOCOLS</span>
                </div>
                <div className="stat-node">
                  <span className="stat-num">4.9/5</span>
                  <span className="stat-tag">SYSTEM_RATING</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="about-vision">
          <div className="crimson-container">
            <div className="systems-header reveal">
              <div className="systems-badge">
                <span className="badge-bullet"></span>
                <span>CORE VISION</span>
              </div>
              <h2 className="systems-title">SYSTEM <span className="text-crimson">INTEGRITY</span></h2>
            </div>

            <div className="vision-matrix">
              <div className="vision-module reveal">
                <div className="module-num">01</div>
                <div className="module-content">
                  <div className="module-icon"><i className="bi bi-lightning-charge"></i></div>
                  <h3>VELOCITY</h3>
                  <p>Rapid execution and real-time synchronization of training data for immediate feedback.</p>
                </div>
              </div>

              <div className="vision-module active reveal">
                <div className="module-num">02</div>
                <div className="module-content">
                  <div className="module-icon"><i className="bi bi-shield-check"></i></div>
                  <h3>SECURITY</h3>
                  <p>Absolute privacy of biometric data and training protocols through encrypted nodes.</p>
                </div>
                <div className="module-glow"></div>
              </div>

              <div className="vision-module reveal">
                <div className="module-num">03</div>
                <div className="module-content">
                  <div className="module-icon"><i className="bi bi-people"></i></div>
                  <h3>SYNERGY</h3>
                  <p>Harmonizing individual efforts with a global network of elite performance operators.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Intel */}
        <section className="about-intel">
          <div className="crimson-container">
            <div className="systems-header reveal">
              <div className="systems-badge">
                <span className="badge-bullet"></span>
                <span>COMMAND UNIT</span>
              </div>
              <h2 className="systems-title">THE <span className="text-crimson">ARCHITECTS</span></h2>
            </div>

            <div className="team-matrix">
              {[
                { name: "SARAH_J", role: "FITNESS_LEAD", id: "U1" },
                { name: "MIKE_C", role: "TECH_ARCHITECT", id: "U2" },
                { name: "EMMA_D", role: "UX_STRATEGIST", id: "U3" },
                { name: "ALEX_T", role: "NETWORK_LEAD", id: "U4" }
              ].map((member, index) => (
                <div key={index} className="member-card reveal">
                  <div className="member-id-box">{member.id}</div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role text-crimson">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta reveal">
          <div className="crimson-container">
            <div className="cta-modern-box">
              <div className="cta-content">
                <h2>READY TO <span className="text-crimson">EVOLVE?</span></h2>
                <p>Initialize your training protocol and join the elite network.</p>
                <div className="cta-actions">
                  <Link to="/register" className="btn-modern-primary">INITIALIZE_SYSTEM</Link>
                  <Link to="/contact" className="btn-modern-secondary">CONTACT_CMD</Link>
                </div>
              </div>
              <div className="cta-glow"></div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
