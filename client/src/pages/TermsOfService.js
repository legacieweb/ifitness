import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './Legal.css';

export default function TermsOfService() {
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
      <div className="crimson-legal">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        <section className="legal-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">SYSTEM_OPERATING_AGREEMENT</span>
              </div>
              <h1 className="hero-title">TERMS OF <span className="text-crimson">SERVICE</span></h1>
              <p className="legal-meta">LAST_MODIFIED: DEC_2024 // VERSION_2.1</p>
            </div>
          </div>
        </section>

        <section className="legal-content-section">
          <div className="crimson-container">
            <div className="legal-grid">
              <aside className="legal-sidebar">
                <div className="sidebar-id">SEC_00_INDEX</div>
                <nav className="legal-nav">
                  <a href="#acceptance">01_ACCEPTANCE</a>
                  <a href="#usage">02_SYSTEM_USAGE</a>
                  <a href="#account">03_ACCOUNT_SECURITY</a>
                  <a href="#liability">04_LIABILITY_WAIVER</a>
                  <a href="#termination">05_TERMINATION</a>
                </nav>
              </aside>

              <main className="legal-main">
                <div id="acceptance" className="legal-block reveal">
                  <h3>01_ACCEPTANCE</h3>
                  <p>By accessing the Crimson Protocol ("My FITNESS"), you agree to be bound by these operating terms. If you do not agree with any part of these protocols, you are prohibited from accessing the system.</p>
                </div>

                <div id="usage" className="legal-block reveal">
                  <h3>02_SYSTEM_USAGE</h3>
                  <p>Operators are granted a limited, non-exclusive license to use the system for personal fitness tracking. Prohibited actions include:</p>
                  <ul className="legal-list">
                    <li><span>REVERSE_ENGINEERING:</span> Attempting to decompile system architecture.</li>
                    <li><span>DATA_MINING:</span> Unauthorized extraction of network telemetry.</li>
                    <li><span>MALICIOUS_INPUT:</span> Injecting code into the protocol stream.</li>
                  </ul>
                </div>

                <div id="account" className="legal-block reveal">
                  <h3>03_ACCOUNT_SECURITY</h3>
                  <p>You are responsible for maintaining the encryption keys (passwords) to your node. Any breach resulting from compromised credentials is the sole responsibility of the operator.</p>
                </div>

                <div id="liability" className="legal-block reveal">
                  <h3>04_LIABILITY_WAIVER</h3>
                  <p>Physical training involves inherent risks. The system provides tactical data only. Always consult with a medical professional before engaging in high-intensity metabolic cycles. Crimson Protocol is not liable for physiological failures.</p>
                </div>

                <div id="termination" className="legal-block reveal">
                  <h3>05_TERMINATION</h3>
                  <p>We reserve the right to suspend any operator node that violates these protocols without prior warning. All data associated with the node may be purged upon termination.</p>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
