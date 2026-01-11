import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NewsletterFooter.css';

export default function NewsletterFooter() {
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
    <footer className="newsletter-footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand & Description */}
            <div className="footer-brand">
              <div className="brand-header">
                <div className="brand-logo">
                  <div className="logo-symbol">
                    <i className="bi bi-activity"></i>
                  </div>
                  <div className="logo-text">
                    <span className="logo-name">iFitness</span>
                    <span className="logo-tagline">Elevate Your Game</span>
                  </div>
                </div>
              </div>
              <p className="brand-description">
                Transform your fitness journey with personalized workouts, expert guidance, and real-time progress tracking.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="footer-navigation">
              <div className="nav-section">
                <h4>Explore</h4>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><a href="/#features">Features</a></li>
                  <li><a href="/#how-it-works">How It Works</a></li>
                  <li><Link to="/templates">Templates</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                </ul>
              </div>
              
              <div className="nav-section">
                <h4>Resources</h4>
                <ul>
                  <li><Link to="/documentation">Documentation</Link></li>
                  <li><Link to="/community">Community</Link></li>
                  <li><Link to="/status">Status</Link></li>
                  <li><Link to="/help-center">Help Center</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                </ul>
              </div>
              
              <div className="nav-section">
                <h4>Company</h4>
                <ul>
                  <li><Link to="/about-us">About Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/terms-of-service">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-divider"></div>
          </div>
        </div>
      </div>

      {/* Newsletter Section Below Footer */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Fit, Stay Informed</h3>
              <p>Subscribe to our newsletter for exclusive fitness tips, workout plans, and special offers delivered straight to your inbox.</p>
            </div>
            
            {isSubscribed ? (
              <div className="subscription-success">
                <div className="success-icon">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <div className="success-content">
                  <span>Subscription successful!</span>
                  <small>Check your email for confirmation.</small>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Final Footer Copyright */}
      <div className="final-footer">
        <div className="container">
          <div className="final-footer-content">
            <div className="copyright">
              © 2026 iFitness. All rights reserved.
            </div>
            <div className="footer-credits">
              Crafted with <i className="bi bi-heart-fill"></i> by iFitness Team
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}