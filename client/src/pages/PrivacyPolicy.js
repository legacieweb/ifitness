import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './Legal.css';

export default function PrivacyPolicy() {
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
                <span className="badge-text">DATA_PROTECTION_PROTOCOL</span>
              </div>
              <h1 className="hero-title">PRIVACY <span className="text-crimson">POLICY</span></h1>
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
                  <a href="#intro">01_INTRODUCTION</a>
                  <a href="#collection">02_DATA_COLLECTION</a>
                  <a href="#usage">03_SYSTEM_USAGE</a>
                  <a href="#security">04_SECURITY_ENCRYPTION</a>
                  <a href="#rights">05_OPERATOR_RIGHTS</a>
                </nav>
              </aside>

              <main className="legal-main">
                <div id="intro" className="legal-block reveal">
                  <h3>01_INTRODUCTION</h3>
                  <p>Welcome to the Crimson Protocol ("ifitness"). We are committed to protecting the biometric and tactical data of our operators. This document outlines the encryption and collection parameters used across our global network.</p>
                </div>

                <div id="collection" className="legal-block reveal">
                  <h3>02_DATA_COLLECTION</h3>
                  <p>The system captures several telemetry points for protocol optimization:</p>
                  <ul className="legal-list">
                    <li><span>BIOMETRIC_DATA:</span> Age, weight, height, and physiological goals.</li>
                    <li><span>TRAINING_TELEMETRY:</span> Exercise cycles, duration, and metabolic output.</li>
                    <li><span>SYSTEM_LOGS:</span> Device type, OS architecture, and node access points (IP).</li>
                  </ul>
                </div>

                <div id="usage" className="legal-block reveal">
                  <h3>03_SYSTEM_USAGE</h3>
                  <p>Captured data is utilized exclusively for:</p>
                  <ul className="legal-list">
                    <li>Synchronizing operator profiles across the network.</li>
                    <li>Calibrating personalized training architectures.</li>
                    <li>Analyzing global performance trends (Anonymized).</li>
                  </ul>
                </div>

                <div id="security" className="legal-block reveal">
                  <h3>04_SECURITY_ENCRYPTION</h3>
                  <p>All data is encrypted via end-to-end protocols. Our infrastructure undergoes regular security audits to ensure zero-day vulnerabilities are mitigated. Biometric data is stored in isolated vaults with restricted access.</p>
                </div>

                <div id="rights" className="legal-block reveal">
                  <h3>05_OPERATOR_RIGHTS</h3>
                  <p>Operators retain full ownership of their data. You may request a complete data purge or extraction at any time via your command dashboard.</p>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
