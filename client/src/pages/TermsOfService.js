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
                <span className="badge-text">OPERATIONAL_GUIDELINES</span>
              </div>
              <h1 className="hero-title">TERMS OF <span className="text-crimson">SERVICE</span></h1>
              <p className="legal-meta">LAST_MODIFIED: DEC_2024 // VERSION_1.8</p>
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
                  <a href="#license">02_USAGE_LICENSE</a>
                  <a href="#disclaimer">03_SYSTEM_DISCLAIMER</a>
                  <a href="#limitations">04_LIABILITY_LIMITS</a>
                  <a href="#conduct">05_OPERATOR_CONDUCT</a>
                </nav>
              </aside>

              <main className="legal-main">
                <div id="acceptance" className="legal-block reveal">
                  <h3>01_ACCEPTANCE_OF_TERMS</h3>
                  <p>By initializing a connection with the Crimson Protocol ("ifitness"), you agree to be bound by these operational guidelines. Unauthorized access or deviation from these protocols is strictly prohibited.</p>
                </div>

                <div id="license" className="legal-block reveal">
                  <h3>02_USAGE_LICENSE</h3>
                  <p>Permission is granted to use the Crimson Protocol for personal physiological optimization only. This is a license to operate, not a transfer of intellectual property. Operators may not:</p>
                  <ul className="legal-list">
                    <li><span>DECOMPILE:</span> Attempt to reverse-engineer core system logic.</li>
                    <li><span>MIRROR:</span> Replicate the protocol architecture on external nodes.</li>
                    <li><span>EXPLOIT:</span> Use the system for unauthorized commercial operations.</li>
                  </ul>
                </div>

                <div id="disclaimer" className="legal-block reveal">
                  <h3>03_SYSTEM_DISCLAIMER</h3>
                  <p>The Crimson Protocol is provided "AS_IS" without explicit warranties. While we strive for 100% operational uptime, we do not guarantee constant synchronization under all network conditions.</p>
                </div>

                <div id="limitations" className="legal-block reveal">
                  <h3>04_LIABILITY_LIMITATIONS</h3>
                  <p>The Core Command ("ifitness") shall not be held liable for any data loss, system interruptions, or metabolic discrepancies arising from the use or inability to synchronize with our network.</p>
                </div>

                <div id="conduct" className="legal-block reveal">
                  <h3>05_OPERATOR_CONDUCT</h3>
                  <p>All network participants must adhere to the following directives:</p>
                  <ul className="legal-list">
                    <li>Maintain secure access keys.</li>
                    <li>Ensure biometric data integrity.</li>
                    <li>Do not transmit malicious code into the network.</li>
                    <li>Respect the hierarchy of the global operator network.</li>
                  </ul>
                </div>

                <div className="legal-block reveal">
                  <h3 className="text-crimson">HEALTH_WARNING_LEVEL_1</h3>
                  <p>The Crimson Protocol is a high-intensity optimization system. Consult with medical technicians before initializing advanced training cycles. Proceeding with high-load protocols is done at the operator's own risk.</p>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
