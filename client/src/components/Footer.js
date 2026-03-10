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
    <footer className="footer-modern-elite">
      <div className="footer-line-top"></div>
      <div className="crimson-container">
        <div className="footer-elite-grid">
          {/* Brand Info */}
          <div className="footer-elite-brand">
            <div className="elite-logo">
              <span className="logo-icon-minimal"></span>
              <span className="logo-name">iFITNESS<span className="text-crimson">.RED</span></span>
            </div>
            <p className="elite-tagline">
              Redefining the architecture of human performance through elite-level training protocols.
            </p>
          </div>

          {/* Links Section */}
          <div className="footer-elite-links">
            <div className="elite-link-group">
              <h6>CORE</h6>
              <Link to="/workouts">Workouts</Link>
              <Link to="/analytics">Analytics</Link>
              <Link to="/dashboard">Terminal</Link>
            </div>
            <div className="elite-link-group">
              <h6>NETWORK</h6>
              <Link to="/community">Community</Link>
              <Link to="/blog">Insights</Link>
              <Link to="/careers">Careers</Link>
            </div>
            <div className="elite-link-group">
              <h6>LEGAL</h6>
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms-of-service">Terms</Link>
            </div>
          </div>

          {/* Contact/Newsletter */}
          <div className="footer-elite-subscribe">
            <h6>ELITE ACCESS</h6>
            {isSubscribed ? (
              <div className="elite-success">
                <i className="bi bi-shield-check"></i>
                <span>ACCESS GRANTED</span>
              </div>
            ) : (
              <form className="elite-form" onSubmit={handleSubmit}>
                <input 
                  type="email" 
                  placeholder="OPERATOR EMAIL" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <button type="submit">JOIN</button>
              </form>
            )}
            <div className="elite-socials">
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-elite-bottom">
          <div className="elite-copyright">
            © {new Date().getFullYear()} CRIMSON CORE
          </div>
          <div className="elite-utility">
            <span className="text-crimson fw-bold">powered by iyonicorp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}