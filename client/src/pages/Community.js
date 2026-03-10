import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import './Community.css';

export default function Community() {
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

  const resources = [
    {
      title: "GLOBAL_FORUM",
      description: "High-level strategy exchange and protocol optimization discussions.",
      icon: "bi-chat-square-text",
      tag: "NET_ALPHA"
    },
    {
      title: "DISCORD_SYNC",
      description: "Real-time tactical communication with the elite operator network.",
      icon: "bi-discord",
      tag: "LIVE_FEED"
    },
    {
      title: "ELITE_GROUPS",
      description: "Specialized units focused on specific training disciplines.",
      icon: "bi-shield-shaded",
      tag: "UNIT_SYNC"
    }
  ];

  const testimonials = [
    {
      name: "OPERATOR_01",
      role: "Elite Tier",
      text: "The infrastructure here is unmatched. The data precision has completely redefined my limits.",
      avatar: "01"
    },
    {
      name: "OPERATOR_02",
      role: "Tactical Lead",
      text: "Switching to Crimson protocols was the turning point. The community sync is flawless.",
      avatar: "02"
    },
    {
      name: "OPERATOR_03",
      role: "Core Member",
      text: "Physical dominance is no longer a goal, it's a standard maintained by the network.",
      avatar: "03"
    }
  ];

  return (
    <PageTransition>
      <div className="crimson-community">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Hero Section */}
        <section className="community-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">GLOBAL OPERATOR NETWORK</span>
              </div>
              
              <h1 className="hero-title">
                THE <span className="text-crimson">COMMUNITY</span>
                <br />
                <span className="hero-subtitle">SYNCHRONIZED EVOLUTION</span>
              </h1>
              
              <p className="hero-description">
                Join a decentralized network of high-performance athletes. Exchange protocols, track global cycles, and achieve physical dominance.
              </p>

              <div className="hero-stats-row">
                <div className="stat-node">
                  <span className="stat-num">50K+</span>
                  <span className="stat-tag">ACTIVE_OPERATORS</span>
                </div>
                <div className="stat-node">
                  <span className="stat-num">12.4K</span>
                  <span className="stat-tag">DAILY_SYNCS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="community-resources">
          <div className="crimson-container">
            <div className="systems-header reveal">
              <div className="systems-badge">
                <span className="badge-bullet"></span>
                <span>NETWORK ACCESS</span>
              </div>
              <h2 className="systems-title">OPERATIONAL <span className="text-crimson">NODES</span></h2>
            </div>

            <div className="resources-matrix">
              {resources.map((resource, index) => (
                <div key={index} className="resource-module reveal">
                  <div className="module-num">0{index + 1}</div>
                  <div className="module-content">
                    <div className="module-icon"><i className={`bi ${resource.icon}`}></i></div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="module-stats">
                      <span className="m-tag">{resource.tag}</span>
                      <span className="m-tag">SECURE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="community-intel">
          <div className="crimson-container">
            <div className="intel-grid">
              {testimonials.map((t, index) => (
                <div key={index} className="intel-card reveal">
                  <div className="intel-quote">"{t.text}"</div>
                  <div className="intel-author">
                    <div className="author-id">{t.avatar}</div>
                    <div className="author-meta">
                      <div className="author-name">{t.name}</div>
                      <div className="author-rank text-crimson">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="community-cta reveal">
          <div className="crimson-container">
            <div className="cta-modern-box">
              <div className="cta-content">
                <h2>READY TO <span className="text-crimson">INITIALIZE?</span></h2>
                <p>Synchronize your performance with the global network today.</p>
                <div className="cta-actions">
                  <Link to="/register" className="btn-modern-primary">START_PROTOCOL</Link>
                  <a href="#" className="btn-modern-secondary">JOIN_DISCORD</a>
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
