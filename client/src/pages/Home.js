import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BootcampBanner from '../components/BootcampBanner';
import OutdoorActivityBanner from '../components/OutdoorActivityBanner';
import TopNewsletterFooter from '../components/TopNewsletterFooter';
import './Home.css';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for scroll reveal
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`modern-homepage ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      {/* Clean Header with Signup and Login buttons */}
      <header className={`clean-home-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <Link to="/" className="logo-link">
                <i className="bi bi-activity"></i>
                <span>iFitness</span>
              </Link>
            </div>
            
            <nav className={`nav-section ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
              <Link to="/about-us" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link to="/community" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
              <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              
              <div className="mobile-auth-links d-lg-none">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="mobile-auth-btn secondary" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                    <Link to="/register" className="mobile-auth-btn primary" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="mobile-auth-btn secondary" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                    <button className="mobile-auth-btn primary" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Log Out</button>
                  </>
                )}
              </div>
            </nav>

            <div className="header-actions">
              <div className="auth-section d-none d-lg-flex">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="btn btn-secondary">Log In</Link>
                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
                    <button className="btn btn-primary" onClick={logout}>Log Out</button>
                  </>
                )}
              </div>
              
              <button 
                className={`mobile-menu-toggle d-lg-none ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Hero Section */}
      <section className="modern-hero">
        <div className="hero-bg-gradient"></div>
        
        <div className="container">
          <div className="modern-hero-wrapper">
            <div className="modern-hero-content">
              <div className="hero-badge-modern reveal">
                <span className="badge-icon"><i className="bi bi-lightning-charge-fill"></i></span>
                <span>Next-Gen Fitness Platform</span>
              </div>
              
              <h1 className="modern-hero-title">
                Transform Your Body,<br/>
                <span className="highlight-gradient">Elevate Your Life</span>
              </h1>
              
              <p className="modern-hero-subtitle">
                AI-powered fitness coaching with real-time analytics and personalized training plans designed for elite results.
              </p>
              
              <div className="modern-cta-group reveal">
                <Link to="/register" className="btn-modern-primary">
                  Start Your Journey <i className="bi bi-arrow-right"></i>
                </Link>
                <Link to="/about-us" className="btn-modern-secondary">
                  <i className="bi bi-play-circle"></i> Watch Demo
                </Link>
              </div>
              
              <div className="hero-trusted-by reveal">
                <div className="trusted-text">TRUSTED BY INDUSTRY LEADERS</div>
                <div className="trusted-logos">
                  <i className="bi bi-nvidia"></i>
                  <i className="bi bi-apple"></i>
                  <i className="bi bi-google"></i>
                  <i className="bi bi-microsoft"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section className="quick-stats-bento">
        <div className="container">
          <div className="bento-grid">
            <div className="bento-item stat-large main-stat reveal">
              <div className="bento-content">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Users</div>
                <p className="stat-desc">Joining us from all over the world to transform their lives.</p>
                <div className="stat-icon-bg"><i className="bi bi-people-fill"></i></div>
              </div>
            </div>
            
            <div className="bento-item stat-medium reveal">
              <div className="bento-content">
                <div className="stat-number">2M+</div>
                <div className="stat-label">Workouts</div>
                <div className="stat-icon-bg"><i className="bi bi-lightning-fill"></i></div>
              </div>
            </div>
            
            <div className="bento-item stat-small reveal">
              <div className="bento-content">
                <div className="stat-number">4.9</div>
                <div className="stat-icon-inline"><i className="bi bi-star-fill"></i></div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
            
            <div className="bento-item stat-medium accent-bg reveal">
              <div className="bento-content">
                <div className="stat-number">500K</div>
                <div className="stat-label">Goals Hit</div>
                <div className="stat-icon-bg"><i className="bi bi-trophy-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BootcampBanner />
      <OutdoorActivityBanner />

      {/* Features Section */}
      <section className="features-modern reveal">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Features</div>
            <h2 className="section-title-modern">Everything You Need</h2>
            <p>Our comprehensive platform provides all the tools and support you need to reach your fitness goals.</p>
          </div>
          
          {/* Interactive Feature Tabs */}
          <div className="feature-tabs">
            <div className="tabs-container">
              <button
                className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                <i className="bi bi-star-fill"></i> All Features
              </button>
              <button
                className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="bi bi-graph-up"></i> Smart Analytics
              </button>
              <button
                className={`tab-button ${activeTab === 'plans' ? 'active' : ''}`}
                onClick={() => setActiveTab('plans')}
              >
                <i className="bi bi-lightning-charge"></i> Custom Plans
              </button>
              <button
                className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
                onClick={() => setActiveTab('community')}
              >
                <i className="bi bi-people"></i> Community
              </button>
            </div>
          </div>
          
          <div className="features-grid">
            {activeTab === 'features' || activeTab === 'analytics' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-graph-up-arrow"></i></div>
                <div className="feature-tag">Smart Tech</div>
                <h3>Smart Analytics</h3>
                <p>Advanced tracking with expert insights to optimize your workout performance and track progress in real-time.</p>
                <div className="feature-highlight">Real-time tracking</div>
              </div>
            ) : null}
            
            {activeTab === 'features' || activeTab === 'plans' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-lightning-charge-fill"></i></div>
                <div className="feature-tag">Personalized</div>
                <h3>Custom Plans</h3>
                <p>Personalized workout routines created by your dedicated trainer based on your goals and fitness level.</p>
                <div className="feature-highlight">Trainer-designed</div>
              </div>
            ) : null}
            
            {activeTab === 'features' || activeTab === 'community' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-people-fill"></i></div>
                <div className="feature-tag">Social</div>
                <h3>Community</h3>
                <p>Connect with like-minded enthusiasts, share progress, and get motivated by our supportive community.</p>
                <div className="feature-highlight">Community driven</div>
              </div>
            ) : null}
            
            {activeTab === 'analytics' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-bar-chart-line"></i></div>
                <div className="feature-tag">Performance</div>
                <h3>Progress Tracking</h3>
                <p>Detailed analytics and visualizations to monitor your fitness journey and celebrate milestones.</p>
                <div className="feature-highlight">Data visualization</div>
              </div>
            ) : null}
            
            {activeTab === 'plans' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-calendar-check"></i></div>
                <div className="feature-tag">Efficiency</div>
                <h3>Workout Scheduling</h3>
                <p>Intelligent scheduling that adapts to your availability and optimizes your training routine.</p>
                <div className="feature-highlight">Smart scheduling</div>
              </div>
            ) : null}
            
            {activeTab === 'community' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-chat-dots"></i></div>
                <div className="feature-tag">Engagement</div>
                <h3>Social Features</h3>
                <p>Share achievements, join challenges, and connect with friends to stay motivated together.</p>
                <div className="feature-highlight">Social integration</div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-modern reveal">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">How it works</div>
            <h2 className="section-title-modern">Three Simple Steps</h2>
          </div>
          
          <div className="steps-wrapper">
            <div className="steps-connector-line"></div>
            
            <div className="step-item-modern reveal">
              <div className="step-number-container">
                <div className="step-number-pill">01</div>
              </div>
              <div className="step-content-modern">
                <div className="step-icon-wrapper"><i className="bi bi-person-plus-fill"></i></div>
                <h3>Create Profile</h3>
                <p>Sign up and set your fitness goals. Our expert trainer will create a personalized workout plan just for you.</p>
                <div className="step-tags">
                  <span className="step-tag"><i className="bi bi-check2"></i> Goal setting</span>
                  <span className="step-tag"><i className="bi bi-check2"></i> Assessment</span>
                </div>
              </div>
              <div className="step-visual-modern">
                <div className="visual-circle-bg"></div>
                <div className="visual-content"><i className="bi bi-person-bounding-box"></i></div>
              </div>
            </div>

            <div className="step-item-modern reverse reveal">
              <div className="step-number-container">
                <div className="step-number-pill">02</div>
              </div>
              <div className="step-content-modern">
                <div className="step-icon-wrapper"><i className="bi bi-graph-up"></i></div>
                <h3>Track Progress</h3>
                <p>Log your workouts and monitor your progress with our advanced analytics tools and expert feedback.</p>
                <div className="step-tags">
                  <span className="step-tag"><i className="bi bi-check2"></i> Real-time logs</span>
                  <span className="step-tag"><i className="bi bi-check2"></i> Analytics</span>
                </div>
              </div>
              <div className="step-visual-modern">
                <div className="visual-circle-bg accent"></div>
                <div className="visual-content"><i className="bi bi-activity"></i></div>
              </div>
            </div>

            <div className="step-item-modern reveal">
              <div className="step-number-container">
                <div className="step-number-pill">03</div>
              </div>
              <div className="step-content-modern">
                <div className="step-icon-wrapper"><i className="bi bi-trophy-fill"></i></div>
                <h3>Achieve Goals</h3>
                <p>Stay motivated, hit your milestones, and celebrate your success with our supportive community.</p>
                <div className="step-tags">
                  <span className="step-tag"><i className="bi bi-check2"></i> Milestones</span>
                  <span className="step-tag"><i className="bi bi-check2"></i> Community</span>
                </div>
              </div>
              <div className="step-visual-modern">
                <div className="visual-circle-bg"></div>
                <div className="visual-content"><i className="bi bi-award-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Testimonials Section */}
      <section className="modern-testimonials reveal">
        <div className="container">
          <div className="modern-testimonials-header">
            <div className="testimonials-badge">
              <i className="bi bi-chat-quote-fill"></i>
              <span>Real Stories</span>
            </div>
            <h2 className="testimonials-title">
              Transformations That <span className="highlight-gradient">Inspire</span>
            </h2>
          </div>
          
          <div className="modern-testimonials-carousel">
            <div className="testimonial-track">
              <div className="modern-testimonial-card reveal">
                <div className="testimonial-card-header">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  </div>
                  <i className="bi bi-quote quote-icon"></i>
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-text">
                    "The community features and achievement system make fitness fun! I've lost 30 pounds and gained confidence I never thought possible."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4 className="author-name">Mike Chen</h4>
                    <span className="author-role">Weight Loss Success</span>
                  </div>
                </div>
              </div>

              <div className="modern-testimonial-card reveal">
                <div className="testimonial-card-header">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  </div>
                  <i className="bi bi-quote quote-icon"></i>
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-text">
                    "As a personal trainer, I recommend iFitness to all my clients. The analytics are top-notch and help me track their progress effectively."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4 className="author-name">Emma Rodriguez</h4>
                    <span className="author-role">Personal Trainer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-modern reveal">
        <div className="container">
          <div className="cta-content-modern">
            <h2 className="cta-title">Ready to Start?</h2>
            <p className="cta-description">Join thousands of users who have achieved their goals with our personalized approach.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-modern-primary">Get Started Free</Link>
              <Link to="/about-us" className="btn-modern-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
      
      <TopNewsletterFooter />
    </div>
  );
}