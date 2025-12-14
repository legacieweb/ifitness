import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BootcampBanner from '../components/BootcampBanner';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="modern-homepage">
      {/* Hero Section with Enhanced Design */}
      <section className="hero-modern">
        <div className="hero-bg-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6 hero-content-modern">
              <div className="hero-badge">
                <span className="badge-text">🏃‍♂️ Transform Your Life</span>
              </div>
              <h1 className="hero-title">
                Your Fitness Journey
                <span className="gradient-text"> Starts Here</span>
              </h1>
              <p className="hero-description">
                Join thousands of fitness enthusiasts who are achieving their goals with our AI-powered workout tracker, personalized nutrition plans, and comprehensive progress analytics.
              </p>
              <div className="hero-features">
                <div className="feature-check">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Smart Workout Tracking</span>
                </div>
                <div className="feature-check">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>AI-Powered Recommendations</span>
                </div>
                <div className="feature-check">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Real-time Progress Analytics</span>
                </div>
              </div>
              <div className="hero-buttons-modern">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register" className="btn-primary-modern">
                      <span>Start Free Trial</span>
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                    <Link to="/login" className="btn-secondary-modern">
                      <i className="bi bi-play-circle"></i>
                      <span>Watch Demo</span>
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard" className="btn-primary-modern">
                    <span>Go to Dashboard</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
              </div>
              <div className="hero-trust">
                <p>Trusted by 50,000+ fitness enthusiasts</p>
                <div className="trust-indicators">
                  <div className="trust-item">
                    <i className="bi bi-star-fill"></i>
                    <span>4.9/5</span>
                  </div>
                  <div className="trust-item">
                    <i className="bi bi-shield-check"></i>
                    <span>Secure</span>
                  </div>
                  <div className="trust-item">
                    <i className="bi bi-lightning-charge"></i>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 hero-visual-modern">
              <div className="hero-illustration">
                <div className="fitness-card card-1">
                  <div className="card-icon">
                    <i className="bi bi-heart-pulse"></i>
                  </div>
                  <div className="card-content">
                    <h4>Heart Rate</h4>
                    <p>142 BPM</p>
                  </div>
                </div>
                <div className="fitness-card card-2">
                  <div className="card-icon">
                    <i className="bi bi-fire"></i>
                  </div>
                  <div className="card-content">
                    <h4>Calories</h4>
                    <p>485 burned</p>
                  </div>
                </div>
                <div className="fitness-card card-3">
                  <div className="card-icon">
                    <i className="bi bi-trophy"></i>
                  </div>
                  <div className="card-content">
                    <h4>Achievement</h4>
                    <p>7 Day Streak!</p>
                  </div>
                </div>
                <div className="central-avatar">
                  <div className="avatar-inner">
                    <i className="bi bi-person-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="quick-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number counter" data-target="50000">0</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-icon">
                <i className="bi bi-activity"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number counter" data-target="2000000">0</div>
                <div className="stat-label">Workouts Logged</div>
              </div>
            </div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-icon">
                <i className="bi bi-target"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number counter" data-target="500000">0</div>
                <div className="stat-label">Goals Achieved</div>
              </div>
            </div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="400">
              <div className="stat-icon">
                <i className="bi bi-star"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">4.9</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BootcampBanner />

      {/* Features Section with Modern Cards */}
      <section className="features-modern">
        <div className="container">
          <div className="section-header-modern text-center">
            <div className="section-badge">
              <span>Powerful Features</span>
            </div>
            <h2 className="section-title-modern">Everything You Need to Succeed</h2>
            <p className="section-subtitle-modern">Our comprehensive platform provides all the tools you need to transform your fitness journey</p>
          </div>
          <div className="features-grid">
            <div className="feature-card-modern" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-card-inner">
                <div className="feature-icon-modern">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h3>Smart Analytics</h3>
                <p>Advanced tracking with AI-powered insights to optimize your workout performance and track progress in real-time.</p>
                <div className="feature-highlight">
                  <span>Real-time tracking</span>
                </div>
              </div>
            </div>
            <div className="feature-card-modern" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-card-inner">
                <div className="feature-icon-modern">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <h3>AI Workouts</h3>
                <p>Personalized workout routines generated by AI based on your goals, fitness level, and available equipment.</p>
                <div className="feature-highlight">
                  <span>Personalized plans</span>
                </div>
              </div>
            </div>
            <div className="feature-card-modern" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-card-inner">
                <div className="feature-icon-modern">
                  <i className="bi bi-calendar2-event"></i>
                </div>
                <h3>Smart Scheduling</h3>
                <p>Intelligent workout scheduling that adapts to your lifestyle and ensures consistent training progress.</p>
                <div className="feature-highlight">
                  <span>Adaptive scheduling</span>
                </div>
              </div>
            </div>
            <div className="feature-card-modern" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-card-inner">
                <div className="feature-icon-modern">
                  <i className="bi bi-award"></i>
                </div>
                <h3>Achievement System</h3>
                <p>Gamified experience with badges, milestones, and rewards to keep you motivated throughout your journey.</p>
                <div className="feature-highlight">
                  <span>Gamified experience</span>
                </div>
              </div>
            </div>
            <div className="feature-card-modern" data-aos="fade-up" data-aos-delay="500">
              <div className="feature-card-inner">
                <div className="feature-icon-modern">
                  <i className="bi bi-heart-pulse-fill"></i>
                </div>
                <h3>Health Monitoring</h3>
                <p>Comprehensive health tracking including heart rate, calories, sleep patterns, and recovery metrics.</p>
                <div className="feature-highlight">
                  <span>Health insights</span>
                </div>
              </div>
            </div>
            <div className="feature-card-modern" data-aos="fade-up" data-aos-delay="600">
              <div className="feature-card-inner">
                <div className="feature-icon-modern">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h3>Community Support</h3>
                <p>Connect with like-minded fitness enthusiasts, share progress, and get motivated by our supportive community.</p>
                <div className="feature-highlight">
                  <span>Community driven</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-modern">
        <div className="container">
          <div className="section-header-modern text-center">
            <div className="section-badge">
              <span>Simple Process</span>
            </div>
            <h2 className="section-title-modern">Start Your Journey in 3 Steps</h2>
            <p className="section-subtitle-modern">Getting started has never been easier. Follow these simple steps to begin your fitness transformation.</p>
          </div>
          <div className="steps-container">
            <div className="step-item-modern" data-aos="fade-right" data-aos-delay="100">
              <div className="step-visual">
                <div className="step-icon">
                  <i className="bi bi-person-plus"></i>
                </div>
                <div className="step-number-modern">01</div>
              </div>
              <div className="step-content-modern">
                <h3>Create Your Profile</h3>
                <p>Sign up and set your fitness goals, current fitness level, and preferences. Our AI will create a personalized plan just for you.</p>
                <ul className="step-features">
                  <li><i className="bi bi-check2"></i> Goal setting wizard</li>
                  <li><i className="bi bi-check2"></i> Fitness level assessment</li>
                  <li><i className="bi bi-check2"></i> Personalized recommendations</li>
                </ul>
              </div>
            </div>

            <div className="step-item-modern reverse" data-aos="fade-left" data-aos-delay="200">
              <div className="step-content-modern">
                <h3>Track Your Progress</h3>
                <p>Log your workouts, monitor your stats, and watch your progress grow with our comprehensive tracking system.</p>
                <ul className="step-features">
                  <li><i className="bi bi-check2"></i> Easy workout logging</li>
                  <li><i className="bi bi-check2"></i> Real-time analytics</li>
                  <li><i className="bi bi-check2"></i> Progress visualization</li>
                </ul>
              </div>
              <div className="step-visual">
                <div className="step-icon">
                  <i className="bi bi-graph-up"></i>
                </div>
                <div className="step-number-modern">02</div>
              </div>
            </div>

            <div className="step-item-modern" data-aos="fade-right" data-aos-delay="300">
              <div className="step-visual">
                <div className="step-icon">
                  <i className="bi bi-trophy-fill"></i>
                </div>
                <div className="step-number-modern">03</div>
              </div>
              <div className="step-content-modern">
                <h3>Achieve Your Goals</h3>
                <p>Celebrate your achievements, unlock rewards, and reach new milestones as you transform your lifestyle.</p>
                <ul className="step-features">
                  <li><i className="bi bi-check2"></i> Achievement badges</li>
                  <li><i className="bi bi-check2"></i> Milestone celebrations</li>
                  <li><i className="bi bi-check2"></i> Continuous motivation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-modern">
        <div className="container">
          <div className="section-header-modern text-center">
            <div className="section-badge">
              <span>Success Stories</span>
            </div>
            <h2 className="section-title-modern">What Our Users Say</h2>
            <p className="section-subtitle-modern">Join thousands of satisfied users who have transformed their fitness journey with FitTracker</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="100">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p>"FitTracker completely transformed my approach to fitness. The AI recommendations are spot-on and the progress tracking keeps me motivated every day!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Fitness Enthusiast</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p>"The community features and achievement system make fitness fun! I've lost 30 pounds and gained so much confidence. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="author-info">
                  <h4>Mike Chen</h4>
                  <span>Weight Loss Success</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="300">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p>"As a personal trainer, I recommend FitTracker to all my clients. The analytics are comprehensive and the user interface is intuitive."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="author-info">
                  <h4>Emma Rodriguez</h4>
                  <span>Certified Personal Trainer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-modern">
        <div className="container">
          <div className="cta-content-modern">
            <div className="cta-bg-pattern"></div>
            <div className="cta-content">
              <h2 className="cta-title">Ready to Transform Your Life?</h2>
              <p className="cta-description">Join over 50,000 users who have already started their fitness journey. Get personalized workouts, track your progress, and achieve your goals with our AI-powered platform.</p>
              <div className="cta-features">
                <div className="cta-feature">
                  <i className="bi bi-check-circle"></i>
                  <span>Free 30-day trial</span>
                </div>
                <div className="cta-feature">
                  <i className="bi bi-check-circle"></i>
                  <span>No credit card required</span>
                </div>
                <div className="cta-feature">
                  <i className="bi bi-check-circle"></i>
                  <span>Cancel anytime</span>
                </div>
              </div>
              <div className="cta-buttons">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register" className="btn-primary-modern large">
                      <span>Start Free Trial</span>
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                    <Link to="/login" className="btn-secondary-modern large">
                      <i className="bi bi-play-circle"></i>
                      <span>Watch Demo</span>
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard" className="btn-primary-modern large">
                    <span>Go to Dashboard</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}