import React from 'react';
import PageTransition from '../components/PageTransition';
import TopNewsletterFooter from '../components/TopNewsletterFooter';
import './AboutUs.css';

export default function AboutUs() {
  return (
    <>
      <PageTransition>
        <div className="modern-about-page">
          <section className="hero-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="hero-content">
                    <div className="section-badge">
                      <span>Our Story</span>
                    </div>
                    <h1 className="hero-title">
                      Transforming Fitness Journeys
                      <span className="gradient-text">Since 2024</span>
                    </h1>
                    <p className="hero-description">
                      At ifitness, we're on a mission to empower individuals to take control of their health through intuitive, elegant fitness tracking solutions.
                    </p>
                    <div className="hero-stats">
                      <div className="stat-item">
                        <div className="stat-number counter" data-target="50000">50000</div>
                        <div className="stat-label">Active Users</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number counter" data-target="2000000">2000000</div>
                        <div className="stat-label">Workouts Logged</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">4.9</div>
                        <div className="stat-label">User Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-visual">
                    <div className="floating-element element-1">
                      <i className="bi bi-heart-pulse"></i>
                    </div>
                    <div className="floating-element element-2">
                      <i className="bi bi-graph-up"></i>
                    </div>
                    <div className="floating-element element-3">
                      <i className="bi bi-trophy"></i>
                    </div>
                    <div className="central-illustration">
                      <div className="illustration-inner">
                        <i className="bi bi-activity"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mission-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Our Mission</span>
                  </div>
                  <h2 className="section-title">Empowering Your Fitness Journey</h2>
                  <p className="section-description">
                    We believe that fitness tracking should be simple, intuitive, and empowering. Our mission is to provide tools that help you monitor progress, achieve goals, and transform your lifestyle.
                  </p>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-4 mb-4">
                  <div className="mission-card">
                    <div className="mission-icon">
                      <i className="bi bi-lightning-charge"></i>
                    </div>
                    <h3>Simplicity</h3>
                    <p>Clean, intuitive interfaces that make fitness tracking effortless and enjoyable.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="mission-card">
                    <div className="mission-icon">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <h3>Privacy</h3>
                    <p>Your data is yours. We prioritize security and give you full control over your information.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="mission-card">
                    <div className="mission-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <h3>Community</h3>
                    <p>Connect with like-minded individuals and share your journey in a supportive environment.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="features-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>What We Offer</span>
                  </div>
                  <h2 className="section-title">Comprehensive Fitness Solutions</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-calendar2-event"></i>
                    </div>
                    <h3>Smart Workout Tracking</h3>
                    <p>Log exercises with detailed analytics, track progress over time, and get personalized insights to optimize your training.</p>
                    <div className="feature-highlight">
                      <span>Real-time analytics</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-target"></i>
                    </div>
                    <h3>Goal Setting & Tracking</h3>
                    <p>Set SMART fitness goals, monitor your progress, and celebrate achievements with our comprehensive goal tracking system.</p>
                    <div className="feature-highlight">
                      <span>Personalized recommendations</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-graph-up"></i>
                    </div>
                    <h3>Advanced Analytics</h3>
                    <p>Gain deep insights into your fitness journey with comprehensive charts, trends, and performance metrics.</p>
                    <div className="feature-highlight">
                      <span>Data-driven insights</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <h3>Community Support</h3>
                    <p>Connect with fitness enthusiasts, share progress, participate in challenges, and get motivated by our supportive community.</p>
                    <div className="feature-highlight">
                      <span>Engagement & motivation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="team-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Our Team</span>
                  </div>
                  <h2 className="section-title">Passionate Professionals</h2>
                  <p className="section-description">
                    Our dedicated team combines fitness expertise with technical innovation to create the best possible experience for our users.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="team-member">
                    <div className="team-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <h4>Sarah Johnson</h4>
                    <p className="team-role">Fitness Expert</p>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="team-member">
                    <div className="team-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <h4>Mike Chen</h4>
                    <p className="team-role">Lead Developer</p>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="team-member">
                    <div className="team-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <h4>Emma Davis</h4>
                    <p className="team-role">UX Designer</p>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="team-member">
                    <div className="team-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <h4>Alex Thompson</h4>
                    <p className="team-role">Community Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <div className="cta-bg-pattern"></div>
                <div className="row">
                  <div className="col-lg-8 mx-auto text-center">
                    <h2 className="cta-title">Join Our Fitness Revolution</h2>
                    <p className="cta-description">
                      Ready to transform your fitness journey? Join thousands of satisfied users who have achieved their goals with ifitness.
                    </p>
                    <div className="cta-buttons">
                      <a href="/register" className="btn-primary-modern large">
                        <span>Get Started</span>
                        <i className="bi bi-person-plus"></i>
                      </a>
                      <a href="/contact" className="btn-secondary-modern large">
                        <i className="bi bi-envelope"></i>
                        <span>Contact Us</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageTransition>
      <TopNewsletterFooter />
    </>
  );
}
