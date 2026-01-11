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
      <div className="footer-wave-top"></div>
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content-grid">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <div className="brand-logo-ultra">
              <div className="logo-icon">
                <i className="bi bi-activity"></i>
              </div>
              <div className="logo-text">
                <span className="logo-main">iFitness</span>
                <span className="logo-subtitle">Elevate Your Game</span>
              </div>
            </div>
            <p className="brand-tagline">
              Transform your fitness journey with personalized workouts, expert guidance, and real-time progress tracking.
            </p>
            <div className="social-media-grid">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
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
              <h4 className="footer-column-title">Explore</h4>
              <ul className="footer-links-list">
                <li><Link to="/" className="footer-link-item">Home</Link></li>
                <li><a href="/#features" className="footer-link-item">Features</a></li>
                <li><a href="/#how-it-works" className="footer-link-item">How It Works</a></li>
                <li><Link to="/templates" className="footer-link-item">Templates</Link></li>
                <li><Link to="/pricing" className="footer-link-item">Pricing</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Resources</h4>
              <ul className="footer-links-list">
                <li><Link to="/nutrition" className="footer-link-item">Nutrition Guide</Link></li>
                <li><Link to="/workouts" className="footer-link-item">Workout Library</Link></li>
                <li><Link to="/templates" className="footer-link-item">Workout Templates</Link></li>
                <li><Link to="/journey" className="footer-link-item">Fitness Journey</Link></li>
                <li><Link to="/goals" className="footer-link-item">Goal Tracking</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-links-list">
                <li><Link to="/about-us" className="footer-link-item">About Us</Link></li>
                <li><Link to="/blog" className="footer-link-item">Blog</Link></li>
                <li><Link to="/careers" className="footer-link-item">Careers</Link></li>
                <li><Link to="/contact" className="footer-link-item">Contact</Link></li>
                <li><Link to="/help-center" className="footer-link-item">Support</Link></li>
                <li><Link to="/documentation" className="footer-link-item">Documentation</Link></li>
                <li><Link to="/community" className="footer-link-item">Community</Link></li>
                <li><Link to="/status" className="footer-link-item">Status</Link></li>
                <li><Link to="/help-center" className="footer-link-item">Help Center</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-newsletter-section">
            <div className="newsletter-header">
              <h3 className="newsletter-title">Stay Fit, Stay Informed</h3>
              <p className="newsletter-subtitle">
                Subscribe to our newsletter for exclusive fitness tips, workout plans, and special offers delivered straight to your inbox.
              </p>
            </div>
            {isSubscribed ? (
              <div className="newsletter-success-message">
                <div className="success-icon">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <div className="success-content">
                  <h4>Subscription Successful!</h4>
                  <p>Check your email for confirmation and get ready for amazing fitness content.</p>
                </div>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    className="newsletter-email-input"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <button type="submit" className="newsletter-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill"></i>
                        <span>Subscribe</span>
                      </>
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
            <div className="stat-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          <div className="footer-stat-item">
            <div className="stat-icon">
              <i className="bi bi-activity"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Workouts Completed</div>
            </div>
          </div>
          <div className="footer-stat-item">
            <div className="stat-icon">
              <i className="bi bi-star-fill"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-section">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>© {new Date().getFullYear()} iFitness. All rights reserved.</p>
            </div>
            <div className="footer-legal-links">
              <Link to="/privacy-policy" className="legal-link">Privacy Policy</Link>
              <Link to="/terms-of-service" className="legal-link">Terms of Service</Link>
              <Link to="/cookies" className="legal-link">Cookie Policy</Link>
            </div>
            <div className="footer-credits">
              <p>Crafted with <i className="bi bi-heart-fill"></i> by iFitness Team</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}