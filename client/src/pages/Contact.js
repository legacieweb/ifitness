import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './Contact.css';

export default function Contact() {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <PageTransition>
      <div className="crimson-contact">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Hero Section */}
        <section className="contact-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">COMMS_CHANNEL_ACTIVE</span>
              </div>
              
              <h1 className="hero-title">
                CONTACT <span className="text-crimson">CORE</span>
                <br />
                <span className="hero-subtitle">DIRECT COMMAND LINK</span>
              </h1>
              
              <p className="hero-description">
                Establish a direct connection with the Crimson architecture. Our support units are on standby for protocol optimization.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="contact-grid-section">
          <div className="crimson-container">
            <div className="contact-main-layout">
              {/* Form Side */}
              <div className="contact-form-node reveal">
                <div className="node-header">
                  <span className="node-label">INITIALIZE_MESSAGE</span>
                </div>
                
                {submitted ? (
                  <div className="success-overlay">
                    <i className="bi bi-shield-check"></i>
                    <h3>MESSAGE_TRANSMITTED</h3>
                    <p>Connection established. Standby for response.</p>
                  </div>
                ) : (
                  <form className="elite-contact-form" onSubmit={handleSubmit}>
                    <div className="elite-input-group">
                      <label>OPERATOR_NAME</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="elite-input-group">
                      <label>OPERATOR_EMAIL</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="elite-input-group">
                      <label>SUBJECT_PROTOCOL</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>
                    <div className="elite-input-group">
                      <label>TRANSMISSION_DATA</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required></textarea>
                    </div>
                    <button type="submit" className="btn-modern-primary">TRANSMIT_DATA</button>
                  </form>
                )}
              </div>

              {/* Info Side */}
              <div className="contact-info-stack">
                <div className="info-node reveal">
                  <div className="info-icon"><i className="bi bi-terminal"></i></div>
                  <div className="info-content">
                    <h4>SYSTEM_SUPPORT</h4>
                    <p>support@ifitness.red</p>
                  </div>
                </div>
                <div className="info-node reveal">
                  <div className="info-icon"><i className="bi bi-broadcast"></i></div>
                  <div className="info-content">
                    <h4>GLOBAL_SYNC</h4>
                    <p>+1 (555) 010-9988</p>
                  </div>
                </div>
                <div className="info-node reveal">
                  <div className="info-icon"><i className="bi bi-geo-alt"></i></div>
                  <div className="info-content">
                    <h4>CORE_STATION</h4>
                    <p>Sector 7G, Silicon Valley, CA</p>
                  </div>
                </div>

                <div className="terminal-log reveal">
                  <div className="log-header">SYSTEM_LOG</div>
                  <div className="log-line">>{' '}STATUS: LISTENING</div>
                  <div className="log-line">>{' '}LATENCY: 12MS</div>
                  <div className="log-line">>{' '}ENCRYPTION: AES-256</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
