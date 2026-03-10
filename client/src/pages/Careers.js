import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './Careers.css';

export default function Careers() {
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

  const positions = [
    {
      id: 1,
      title: "SR_FRONTEND_ENGINEER",
      department: "CORE_SYSTEMS",
      location: "REMOTE_NODE",
      type: "FULL_CYCLE",
      description: "Architect high-fidelity user interfaces for the Crimson Protocol using React and advanced CSS frameworks.",
      requirements: ["5+ YEARS ARCHITECTURAL EXPERIENCE", "EXPERT_LEVEL_REACT", "HIGH_PERFORMANCE_UI_FOCUS"]
    },
    {
      id: 2,
      title: "BACKEND_SYSTEMS_OPERATOR",
      department: "INFRASTRUCTURE",
      location: "REMOTE_NODE",
      type: "FULL_CYCLE",
      description: "Develop robust data pipelines and secure API nodes to power our global operator network.",
      requirements: ["NODE.JS_MASTERY", "DATABASE_OPTIMIZATION", "SECURITY_PROTOCOL_EXPERIENCE"]
    },
    {
      id: 3,
      title: "PROTOCOL_DESIGNER",
      department: "USER_EXPERIENCE",
      location: "HYBRID_NODE",
      type: "FULL_CYCLE",
      description: "Design the visual language and interaction protocols that define the elite fitness experience.",
      requirements: ["FIGMA_COMMAND", "VISUAL_STORYTELLING", "DESIGN_SYSTEM_MASTERY"]
    }
  ];

  const benefits = [
    {
      title: "EQUITY_STAKE",
      description: "Ownership in the most advanced fitness infrastructure on the planet.",
      icon: "bi-graph-up-arrow"
    },
    {
      title: "REMOTE_SYNC",
      description: "Operate from any node globally with flexible deployment cycles.",
      icon: "bi-globe"
    },
    {
      title: "ELITE_HARDWARE",
      description: "High-spec gear stipend for your personal command center.",
      icon: "bi-laptop"
    }
  ];

  return (
    <PageTransition>
      <div className="crimson-careers">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Careers Hero */}
        <section className="careers-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">OPERATOR_RECRUITMENT</span>
              </div>
              
              <h1 className="hero-title">
                BUILD THE <span className="text-crimson">FUTURE</span>
                <br />
                <span className="hero-subtitle">ELITE_TALENT_REQUIRED</span>
              </h1>
              
              <p className="hero-description">
                We are seeking high-caliber engineers, designers, and strategists to build the next generation of human performance technology.
              </p>
              
              <div className="hero-cta-group">
                <a href="#open-slots" className="btn-modern-primary">VIEW_OPEN_SLOTS</a>
                <span className="recruit-status crimson-glow">RECRUITMENT_ACTIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Culture Node */}
        <section className="culture-grid-section">
          <div className="crimson-container">
            <div className="culture-matrix reveal">
              {benefits.map((benefit, index) => (
                <div key={index} className="culture-module">
                  <div className="module-icon"><i className={`bi ${benefit.icon}`}></i></div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                  <div className="module-corner-detail"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Slots */}
        <section className="slots-section" id="open-slots">
          <div className="crimson-container">
            <div className="systems-header reveal">
              <div className="systems-badge">
                <span className="badge-bullet"></span>
                <span>AVAILABLE_DEPLOYMENTS</span>
              </div>
              <h2 className="systems-title">OPEN <span className="text-crimson">SLOTS</span></h2>
            </div>

            <div className="slots-list">
              {positions.map((pos) => (
                <div key={pos.id} className="slot-card reveal">
                  <div className="slot-main">
                    <div className="slot-id">SLOT_0{pos.id}</div>
                    <div className="slot-info">
                      <h3>{pos.title}</h3>
                      <div className="slot-meta">
                        <span className="m-tag">{pos.department}</span>
                        <span className="m-tag">{pos.location}</span>
                        <span className="m-tag text-crimson">{pos.type}</span>
                      </div>
                    </div>
                    <div className="slot-action">
                      <button className="btn-modern-secondary">INITIATE_APPLICATION</button>
                    </div>
                  </div>
                  <div className="slot-details">
                    <p>{pos.description}</p>
                    <div className="slot-requirements">
                      {pos.requirements.map((req, i) => (
                        <span key={i} className="req-item"><i className="bi bi-check2"></i> {req}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Recruitment CTA */}
        <section className="recruit-cta reveal">
          <div className="crimson-container">
            <div className="cta-terminal">
              <div className="terminal-header">
                <div className="t-dot red"></div>
                <div className="t-dot"></div>
                <div className="t-dot"></div>
                <span className="terminal-title">HR_LINK_ESTABLISHED</span>
              </div>
              <div className="terminal-body">
                <h2>DON'T SEE YOUR <span className="text-crimson">SLOT?</span></h2>
                <p>We are always looking for exceptional talent. Send your encryption key (CV) to our core recruitment node.</p>
                <button className="btn-modern-primary">TRANSMIT_CREDENTIALS</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
