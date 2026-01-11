import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CleanFooter.css';

export default function CleanFooter() {
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
    <footer className="clean-footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="logo-icon">
                <i className="bi bi-activity"></i>
              </div>
              <div className="logo-text">
                <span className="logo-main">iFitness</span>
                <span className="logo-subtitle">Elevate Your Game</span>
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

          {/* Links Section */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>Explore</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="/#features">Features</a></li>
                <li><a href="/#how-it-works">How It Works</a></li>
                <li><Link to="/templates">Templates</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/nutrition">Nutrition Guide</Link></li>
                <li><Link to="/workouts">Workout Library</Link></li>
                <li><Link to="/templates">Workout Templates</Link></li>
                <li><Link to="/journey">Fitness Journey</Link></li>
                <li><Link to="/goals">Goal Tracking</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/help-center">Support</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/documentation">Documentation</Link></li>
                <li><Link to="/community">Community</Link></li>
                <li><Link to="/status">Status</Link></li>
                <li><Link to="/help-center">Help Center</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-newsletter">
            <h4>Stay Fit, Stay Informed</h4>
            <p>Subscribe to our newsletter for exclusive fitness tips, workout plans, and special offers.</p>
            
            {isSubscribed ? (
              <div className="subscription-success">
                <i className="bi bi-check-circle-fill"></i>
                <span>Subscription successful! Check your email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="input-group">
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

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-meta">
            <div className="copyright">
              © {new Date().getFullYear()} iFitness. All rights reserved.
            </div>
            <div className="legal-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
            <div className="credits">
              Crafted with <i className="bi bi-heart-fill"></i> by iFitness Team
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}