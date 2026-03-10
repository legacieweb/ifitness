import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './HelpCenter.css';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

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

  const faqs = [
    {
      id: 1,
      category: "ACCOUNT_INTEL",
      question: "HOW DO I RESET MY ACCESS KEY?",
      answer: "Navigate to the terminal login, select 'FORGOT_KEY', and input your registered communication node (email)."
    },
    {
      id: 2,
      category: "PROTOCOL_DATA",
      question: "HOW DO I LOG A TRAINING CYCLE?",
      answer: "Go to TRAINING > NEW_PROTOCOL, select your architecture, and input the telemetry data."
    },
    {
      id: 3,
      category: "SECURITY",
      question: "IS MY BIOMETRIC DATA ENCRYPTED?",
      answer: "All operator data is stored using high-level encryption protocols and distributed across secure nodes."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    searchQuery === '' ? true : faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="crimson-help">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Help Hero */}
        <section className="help-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">SUPPORT_CENTER</span>
              </div>
              
              <h1 className="hero-title">
                COMMAND <span className="text-crimson">SUPPORT</span>
                <br />
                <span className="hero-subtitle">DIRECT_INTEL_ACCESS</span>
              </h1>
              
              <div className="search-terminal">
                <i className="bi bi-search"></i>
                <input 
                  type="text" 
                  placeholder="QUERY_PROTOCOL_DATABASE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="terminal-cursor"></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Matrix */}
        <section className="faq-section">
          <div className="crimson-container">
            <div className="systems-header reveal">
              <div className="systems-badge">
                <span className="badge-bullet"></span>
                <span>COMMON_QUERIES</span>
              </div>
              <h2 className="systems-title">DECRYPTED <span className="text-crimson">FAQS</span></h2>
            </div>

            <div className="faq-list">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className={`faq-node reveal ${expandedFAQ === faq.id ? 'active' : ''}`}>
                  <div className="faq-header" onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}>
                    <div className="faq-cat">{faq.category}</div>
                    <h3>{faq.question}</h3>
                    <div className="faq-toggle">
                      {expandedFAQ === faq.id ? <i className="bi bi-dash"></i> : <i className="bi bi-plus"></i>}
                    </div>
                  </div>
                  <div className="faq-body">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Link Nodes */}
        <section className="support-links-section reveal">
          <div className="crimson-container">
            <div className="support-grid">
              <div className="support-link-card">
                <div className="card-icon"><i className="bi bi-file-earmark-code"></i></div>
                <h4>TECHNICAL_DOCS</h4>
                <p>Access the full operator manual and system protocols.</p>
                <button className="btn-modern-secondary">ACCESS_MANUAL</button>
              </div>
              <div className="support-link-card">
                <div className="card-icon"><i className="bi bi-shield-lock"></i></div>
                <h4>SECURE_CONTACT</h4>
                <p>Establish a priority link with our support engineers.</p>
                <button className="btn-modern-secondary">OPEN_LINK</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
