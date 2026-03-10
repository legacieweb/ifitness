import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './Documentation.css';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

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
  }, [activeSection]);

  const sections = {
    'getting-started': {
      title: 'INITIALIZATION',
      icon: 'bi-terminal',
      content: (
        <div className="protocol-body">
          <div className="doc-section reveal">
            <h3>SYSTEM_INITIALIZATION</h3>
            <p>Welcome to the Crimson Protocol. This manual outlines the necessary steps to synchronize your physical architecture with our core network.</p>
          </div>

          <div className="doc-section reveal">
            <h4>OPERATOR_ONBOARDING</h4>
            <div className="terminal-code">
              <div className="code-line"><span className="c-dim">01</span> EXECUTE register_node.sh</div>
              <div className="code-line"><span className="c-dim">02</span> INPUT biometric_data --age --weight --height</div>
              <div className="code-line"><span className="c-dim">03</span> SET primary_objective [LOSS | GAIN | ENDURANCE]</div>
              <div className="code-line"><span className="c-dim">04</span> ESTABLISH encrypted_link</div>
            </div>
          </div>

          <div className="doc-section reveal">
            <h4>CORE_CHECKLIST</h4>
            <ul className="elite-checklist">
              <li><i className="bi bi-shield-check"></i> CALIBRATE_BIOMETRICS</li>
              <li><i className="bi bi-shield-check"></i> INITIALIZE_FIRST_CYCLE</li>
              <li><i className="bi bi-shield-check"></i> DEFINE_TARGET_PARAMETERS</li>
            </ul>
          </div>
        </div>
      )
    },
    'workouts': {
      title: 'TRAINING_LOGS',
      icon: 'bi-activity',
      content: (
        <div className="protocol-body">
          <div className="doc-section reveal">
            <h3>PROTOCOL_EXECUTION</h3>
            <p>Precise data collection is mandatory for protocol optimization.</p>
          </div>

          <div className="doc-section reveal">
            <h4>MANUAL_DATA_ENTRY</h4>
            <ol className="protocol-steps">
              <li>ACCESS "TRAINING_NODE" FROM COMMAND_CENTER</li>
              <li>SELECT PRE-DEFINED ARCHITECTURE OR CUSTOM_PROTOCOL</li>
              <li>INPUT EXERCISE_DATA [SETS | REPS | LOAD]</li>
              <li>RECORD DURATION & METABOLIC_OUTPUT</li>
              <li>COMMIT_TRANSMISSION</li>
            </ol>
          </div>

          <div className="doc-visual reveal">
            <div className="tech-placeholder">
              <div className="pulse-dot"></div>
              <span>DATA_VISUALIZATION_ACTIVE</span>
            </div>
          </div>
        </div>
      )
    },
    'analytics': {
      title: 'INTEL_ANALYSIS',
      icon: 'bi-graph-up-arrow',
      content: (
        <div className="protocol-body">
          <div className="doc-section reveal">
            <h3>METRIC_DECRYPTION</h3>
            <p>The system automatically processes all training telemetry to provide tactical insights.</p>
          </div>

          <div className="doc-section reveal">
            <h4>TACTICAL_KPIs</h4>
            <div className="protocol-grid">
              <div className="p-card">
                <i className="bi bi-cpu"></i>
                <span>CYCLE_COUNT</span>
              </div>
              <div className="p-card">
                <i className="bi bi-clock-history"></i>
                <span>UPTIME</span>
              </div>
              <div className="p-card">
                <i className="bi bi-fire"></i>
                <span>THERMAL_OUTPUT</span>
              </div>
              <div className="p-card">
                <i className="bi bi-lightning"></i>
                <span>INTENSITY_LEVEL</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <PageTransition>
      <div className="crimson-doc">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Doc Hero */}
        <section className="doc-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">SYSTEM_PROTOCOLS</span>
              </div>
              
              <h1 className="hero-title">
                OPERATOR <span className="text-crimson">MANUAL</span>
                <br />
                <span className="hero-subtitle">CRIMSON_CORE_V2.0</span>
              </h1>
              
              <p className="hero-description">
                Technical documentation for the synchronization and optimization of physical assets within the network.
              </p>
            </div>
          </div>
        </section>

        {/* Doc Main */}
        <section className="doc-main-section">
          <div className="crimson-container">
            <div className="doc-layout">
              <aside className="doc-sidebar">
                <div className="sidebar-label">PROTOCOL_TREE</div>
                <div className="sidebar-nav">
                  {Object.entries(sections).map(([key, section]) => (
                    <button
                      key={key}
                      className={`nav-node ${activeSection === key ? 'active' : ''}`}
                      onClick={() => setActiveSection(key)}
                    >
                      <i className={`bi ${section.icon}`}></i>
                      <span>{section.title}</span>
                      {activeSection === key && <div className="nav-active-line"></div>}
                    </button>
                  ))}
                </div>
              </aside>

              <main className="doc-content-node">
                <div className="content-header">
                  <div className="header-id">SEC_0{Object.keys(sections).indexOf(activeSection) + 1}</div>
                  <h2>{sections[activeSection].title}</h2>
                </div>
                <div className="content-body">
                  {sections[activeSection].content}
                </div>
              </main>
            </div>
          </div>
        </section>

        {/* Support Node */}
        <section className="support-section reveal">
          <div className="crimson-container">
            <div className="support-card">
              <div className="card-content">
                <h2>NEED_ASSISTANCE?</h2>
                <p>Establish a direct link with our core command if protocols are unclear.</p>
                <div className="support-actions">
                  <button className="btn-modern-primary">CONTACT_COMMAND</button>
                  <button className="btn-modern-secondary">COMMUNITY_INTEL</button>
                </div>
              </div>
              <div className="card-visual">
                <i className="bi bi-headset"></i>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
