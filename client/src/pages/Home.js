import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BootcampBanner from '../components/BootcampBanner';
import TopNewsletterFooter from '../components/TopNewsletterFooter';
import './Home.css';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="modern-homepage">
      {/* Clean Header with Signup and Login buttons */}
      <header className="clean-home-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <Link to="/" className="logo-link">
                <i className="bi bi-activity"></i>
                <span>iFitness</span>
              </Link>
            </div>
            <nav className="nav-section">
              <Link to="/about-us" className="nav-link">About</Link>
              <Link to="/blog" className="nav-link">Blog</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </nav>
            <div className="auth-section">
              <Link to="/login" className="btn btn-secondary">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="hero-modern">
        <div className="container">
          <div className="hero-content-wrapper">
            <div className="hero-content-modern">
               <div className="hero-badge">Transform Your Life</div>
               <h1 className="hero-title">
                 Ignite Your Fitness <span className="text-gradient">Adventure</span>
               </h1>
               <p className="hero-description">
                 Experience the future of fitness. Expert guidance, real-time analytics, and a supportive community to help you reach your peak performance.
               </p>
               <div className="hero-features">
                 <div className="feature-check">
                   <div className="check-icon"><i className="bi bi-check-lg"></i></div>
                   <span>Tailored workout plans</span>
                 </div>
                 <div className="feature-check">
                   <div className="check-icon"><i className="bi bi-check-lg"></i></div>
                   <span>Expert trainer guidance</span>
                 </div>
                 <div className="feature-check">
                   <div className="check-icon"><i className="bi bi-check-lg"></i></div>
                   <span>Real-time tracking</span>
                 </div>
               </div>
               <div className="cta-buttons">
                 <Link to="/register" className="btn btn-primary">Get Started Now <i className="bi bi-arrow-right"></i></Link>
                 <Link to="/about-us" className="btn btn-secondary">Learn More</Link>
               </div>
            </div>
            
            <div className="hero-visual-modern">
              <div className="hero-visual-container">
                <div className="visual-blob"></div>
                <div className="visual-blob-2"></div>
                <div className="fitness-card-glass card-1">
                  <div className="card-icon-modern"><i className="bi bi-heart-pulse-fill"></i></div>
                  <div className="card-info">
                    <span className="card-label">Heart Rate</span>
                    <span className="card-value">142 BPM</span>
                  </div>
                </div>
                <div className="fitness-card-glass card-2">
                  <div className="card-icon-modern"><i className="bi bi-fire"></i></div>
                  <div className="card-info">
                    <span className="card-label">Calories</span>
                    <span className="card-value">485 kcal</span>
                  </div>
                </div>
                <div className="fitness-card-glass card-3">
                  <div className="card-icon-modern"><i className="bi bi-trophy-fill"></i></div>
                  <div className="card-info">
                    <span className="card-label">Daily Streak</span>
                    <span className="card-value">7 Days</span>
                  </div>
                </div>
                <div className="main-visual-element">
                  <div className="visual-circle">
                    <i className="bi bi-lightning-charge-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Workouts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Goals Met</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>
      </section>

      <BootcampBanner />

      <section className="features-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Features</div>
            <h2 className="section-title-modern">Everything You Need</h2>
            <p>Our comprehensive platform provides all the tools and support you need to reach your fitness goals.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card-modern">
              <div className="feature-icon-modern"><i className="bi bi-graph-up-arrow"></i></div>
              <h3>Smart Analytics</h3>
              <p>Advanced tracking with expert insights to optimize your workout performance and track progress in real-time.</p>
              <div className="feature-highlight">Real-time tracking</div>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-modern"><i className="bi bi-lightning-charge-fill"></i></div>
              <h3>Custom Plans</h3>
              <p>Personalized workout routines created by your dedicated trainer based on your goals and fitness level.</p>
              <div className="feature-highlight">Trainer-designed</div>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-modern"><i className="bi bi-people-fill"></i></div>
              <h3>Community</h3>
              <p>Connect with like-minded enthusiasts, share progress, and get motivated by our supportive community.</p>
              <div className="feature-highlight">Community driven</div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">How it works</div>
            <h2 className="section-title-modern">Three Simple Steps</h2>
          </div>
          
          <div className="steps-container">
            <div className="step-item-modern">
              <div className="step-content-modern">
                <h3>01. Create Profile</h3>
                <p>Sign up and set your fitness goals. Our expert trainer will create a personalized workout plan just for you.</p>
                <ul className="step-features">
                  <li><i className="bi bi-check2"></i> Goal setting wizard</li>
                  <li><i className="bi bi-check2"></i> Fitness assessment</li>
                </ul>
              </div>
              <div className="step-visual">
                <div className="step-icon"><i className="bi bi-person-plus"></i></div>
                <div className="step-number-modern">01</div>
              </div>
            </div>

            <div className="step-item-modern reverse">
              <div className="step-visual">
                <div className="step-icon"><i className="bi bi-graph-up"></i></div>
                <div className="step-number-modern">02</div>
              </div>
              <div className="step-content-modern">
                <h3>02. Track Progress</h3>
                <p>Log your workouts and watch your stats grow with our comprehensive tracking system.</p>
                <ul className="step-features">
                  <li><i className="bi bi-check2"></i> Easy logging</li>
                  <li><i className="bi bi-check2"></i> Real-time analytics</li>
                </ul>
              </div>
            </div>

            <div className="step-item-modern">
              <div className="step-content-modern">
                <h3>03. Reach Goals</h3>
                <p>Celebrate your achievements and reach new milestones as you transform your lifestyle.</p>
                <ul className="step-features">
                  <li><i className="bi bi-check2"></i> Achievement badges</li>
                  <li><i className="bi bi-check2"></i> Rewards & Milestones</li>
                </ul>
              </div>
              <div className="step-visual">
                <div className="step-icon"><i className="bi bi-trophy-fill"></i></div>
                <div className="step-number-modern">03</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Testimonials</div>
            <h2 className="section-title-modern">What Our Users Say</h2>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote-icon"><i className="bi bi-quote"></i></div>
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                </div>
                <p>"The community features and achievement system make fitness fun! I've lost 30 pounds."</p>
              </div>
              <div className="testimonial-footer">
                <div className="author-avatar-modern">MC</div>
                <div className="author-info">
                  <h4>Mike Chen</h4>
                  <span>Weight Loss Success</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote-icon"><i className="bi bi-quote"></i></div>
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                </div>
                <p>"As a personal trainer, I recommend iFitness to all my clients. The analytics are top-notch."</p>
              </div>
              <div className="testimonial-footer">
                <div className="author-avatar-modern">ER</div>
                <div className="author-info">
                  <h4>Emma Rodriguez</h4>
                  <span>Personal Trainer</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote-icon"><i className="bi bi-quote"></i></div>
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                </div>
                <p>"Transformed my life! The personalized plans are exactly what I needed."</p>
              </div>
              <div className="testimonial-footer">
                <div className="author-avatar-modern">SJ</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Fitness Enthusiast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-modern">
        <div className="container">
          <div className="cta-content-modern">
            <div className="cta-bg-pattern"></div>
            <h2 className="cta-title">Ready to Start?</h2>
            <p className="cta-description">Join thousands of users who have achieved their goals with our personalized approach.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">Get Started Free</Link>
              <Link to="/about-us" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
      
      <TopNewsletterFooter />
    </div>
  );
}
