import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (err) {
      setError('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="ultra-modern-footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content-grid">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <div className="brand-logo-ultra">
              <div className="logo-icon">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <div className="logo-text">
                <span className="logo-main">iFitness</span>
                <span className="logo-subtitle">Peak Performance</span>
              </div>
            </div>
            <p className="brand-tagline">
              Unleash your potential with the world's most advanced fitness ecosystem. Engineered for those who demand excellence.
            </p>
            <div className="social-media-grid">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
                <i className="bi bi-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-links-section">
            <div className="footer-column">
              <h4 className="footer-column-title">Training</h4>
              <ul className="footer-links-list">
                <li><Link to="/workouts" className="footer-link-item">Workouts</Link></li>
                <li><Link to="/templates" className="footer-link-item">Templates</Link></li>
                <li><Link to="/nutrition" className="footer-link-item">Nutrition</Link></li>
                <li><Link to="/journey" className="footer-link-item">Journey</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Platform</h4>
              <ul className="footer-links-list">
                <li><Link to="/pricing" className="footer-link-item">Premium</Link></li>
                <li><Link to="/community" className="footer-link-item">Community</Link></li>
                <li><Link to="/blog" className="footer-link-item">Insights</Link></li>
                <li><Link to="/help-center" className="footer-link-item">Support</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Legal</h4>
              <ul className="footer-links-list">
                <li><Link to="/privacy-policy" className="footer-link-item">Privacy</Link></li>
                <li><Link to="/terms-of-service" className="footer-link-item">Terms</Link></li>
                <li><Link to="/cookies" className="footer-link-item">Cookies</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-newsletter-section">
            <div className="newsletter-header">
              <h3 className="newsletter-title">Join the Elite</h3>
              <p className="newsletter-subtitle">
                Get high-performance strategies and exclusive updates.
              </p>
            </div>
            {isSubscribed ? (
              <div className="newsletter-success-message">
                <div className="success-icon">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <div className="success-content">
                  <h4>You're in.</h4>
                  <p>Welcome to the iFitness elite community.</p>
                </div>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    className="newsletter-email-input"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <button type="submit" className="newsletter-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="spinner-border" role="status"></span>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
                {error && <p className="newsletter-error">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Footer Stats Section */}
        <div className="footer-stats-section">
          <div className="footer-stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Athletes</div>
          </div>
          <div className="footer-stat-item">
            <div className="stat-number">2M+</div>
            <div className="stat-label">Sessions</div>
          </div>
          <div className="footer-stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">Performance</div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-section">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>© {new Date().getFullYear()} iFitness. Engineered for Excellence.</p>
            </div>
            <div className="footer-credits">
              <p>Powered by <i className="bi bi-lightning-fill"></i> iFitness Core</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}