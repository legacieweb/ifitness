import React from 'react';
import TopNewsletterFooter from '../components/TopNewsletterFooter';

export default function About() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="hero-badge">
                <span>About FitTracker</span>
              </div>
              <h1 className="page-title">
                Transforming Lives Through
                <span className="gradient-text"> Fitness Technology</span>
              </h1>
              <p className="page-subtitle">
                We're on a mission to make fitness accessible, personalized, and enjoyable for everyone.
                Our AI-powered platform combines cutting-edge technology with proven fitness science.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="content-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="section-content">
                <div className="section-badge">
                  <span>Our Mission</span>
                </div>
                <h2 className="section-title">Empowering Your Fitness Journey</h2>
                <p className="section-description">
                  At FitTracker, we believe that everyone deserves access to personalized fitness guidance.
                  Our platform uses advanced AI algorithms to create customized workout plans, track your progress,
                  and provide real-time motivation to help you achieve your goals.
                </p>
                <div className="mission-stats">
                  <div className="stat-item">
                    <div className="stat-number">50K+</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">2M+</div>
                    <div className="stat-label">Workouts Completed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">95%</div>
                    <div className="stat-label">Goal Achievement Rate</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="mission-visual">
                <div className="fitness-illustration">
                  <div className="illustration-card card-1">
                    <i className="bi bi-graph-up-arrow"></i>
                    <h4>Progress Tracking</h4>
                    <p>Real-time analytics</p>
                  </div>
                  <div className="illustration-card card-2">
                    <i className="bi bi-lightning-charge"></i>
                    <h4>AI Insights</h4>
                    <p>Smart recommendations</p>
                  </div>
                  <div className="illustration-card card-3">
                    <i className="bi bi-trophy"></i>
                    <h4>Achievements</h4>
                    <p>Celebrate success</p>
                  </div>
                  <div className="central-icon">
                    <i className="bi bi-activity"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="content-section alt-bg">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge">
              <span>Our Values</span>
            </div>
            <h2 className="section-title">What Drives Us Every Day</h2>
            <p className="section-subtitle">Core principles that guide our mission to transform fitness for everyone</p>
          </div>
          
          <div className="values-grid">
            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
              <div className="value-icon">
                <i className="bi bi-heart-fill"></i>
              </div>
              <h3>User-Centric</h3>
              <p>Every feature we build is designed with our users' needs and goals at the forefront. Your success is our success.</p>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon">
                <i className="bi bi-lightbulb-fill"></i>
              </div>
              <h3>Innovation</h3>
              <p>We continuously push the boundaries of what's possible in fitness technology to deliver cutting-edge solutions.</p>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="300">
              <div className="value-icon">
                <i className="bi bi-shield-check-fill"></i>
              </div>
              <h3>Trust & Privacy</h3>
              <p>Your data security and privacy are paramount. We maintain the highest standards of protection and transparency.</p>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="400">
              <div className="value-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3>Community</h3>
              <p>We foster a supportive community where everyone can share their journey, celebrate victories, and inspire others.</p>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="500">
              <div className="value-icon">
                <i className="bi bi-award-fill"></i>
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we do, from user experience to customer support and beyond.</p>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="600">
              <div className="value-icon">
                <i className="bi bi-arrow-up-circle-fill"></i>
              </div>
              <h3>Growth Mindset</h3>
              <p>We believe in continuous learning and improvement, both for our users and for ourselves as a company.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="content-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge">
              <span>Our Team</span>
            </div>
            <h2 className="section-title">Meet the People Behind FitTracker</h2>
            <p className="section-subtitle">A diverse team of fitness enthusiasts, developers, and designers working together</p>
          </div>
          
          <div className="team-grid">
            <div className="team-member" data-aos="fade-up" data-aos-delay="100">
              <div className="member-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h4>Sarah Johnson</h4>
              <p className="member-role">CEO & Co-Founder</p>
              <p className="member-bio">Former fitness trainer with 10+ years experience. Passionate about making fitness accessible to all.</p>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="200">
              <div className="member-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h4>Michael Chen</h4>
              <p className="member-role">CTO & Co-Founder</p>
              <p className="member-bio">AI researcher and former Google engineer. Expert in machine learning and fitness analytics.</p>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="300">
              <div className="member-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h4>Emily Rodriguez</h4>
              <p className="member-role">Head of Product</p>
              <p className="member-bio">Product strategist with background in UX design. Focused on creating intuitive user experiences.</p>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="400">
              <div className="member-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h4>David Kim</h4>
              <p className="member-role">Lead Developer</p>
              <p className="member-bio">Full-stack developer with expertise in React and Node.js. Builds scalable fitness applications.</p>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="500">
              <div className="member-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h4>Lisa Thompson</h4>
              <p className="member-role">Head of Marketing</p>
              <p className="member-bio">Digital marketing specialist with focus on fitness and wellness brands. Drives user acquisition.</p>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="600">
              <div className="member-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h4>Alex Foster</h4>
              <p className="member-role">Customer Success</p>
              <p className="member-bio">Customer advocate ensuring every user has an amazing experience with FitTracker.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="content-section alt-bg">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge">
              <span>Our Journey</span>
            </div>
            <h2 className="section-title">The FitTracker Story</h2>
            <p className="section-subtitle">From idea to the leading fitness platform</p>
          </div>
          
          <div className="timeline">
            <div className="timeline-item" data-aos="fade-right" data-aos-delay="100">
              <div className="timeline-marker">
                <div className="marker-number">2020</div>
              </div>
              <div className="timeline-content">
                <h3>The Beginning</h3>
                <p>FitTracker was born from a simple idea: make personalized fitness accessible to everyone through technology.</p>
              </div>
            </div>
            
            <div className="timeline-item" data-aos="fade-left" data-aos-delay="200">
              <div className="timeline-marker">
                <div className="marker-number">2021</div>
              </div>
              <div className="timeline-content">
                <h3>First Release</h3>
                <p>Launched our beta version with basic workout tracking and goal setting features to a small group of early adopters.</p>
              </div>
            </div>
            
            <div className="timeline-item" data-aos="fade-right" data-aos-delay="300">
              <div className="timeline-marker">
                <div className="marker-number">2022</div>
              </div>
              <div className="timeline-content">
                <h3>AI Integration</h3>
                <p>Introduced AI-powered workout recommendations and progress analytics, revolutionizing personalized fitness.</p>
              </div>
            </div>
            
            <div className="timeline-item" data-aos="fade-left" data-aos-delay="400">
              <div className="timeline-marker">
                <div className="marker-number">2023</div>
              </div>
              <div className="timeline-content">
                <h3>Community Features</h3>
                <p>Added social features, challenges, and community support to help users stay motivated and connected.</p>
              </div>
            </div>
            
            <div className="timeline-item" data-aos="fade-right" data-aos-delay="500">
              <div className="timeline-marker">
                <div className="marker-number">2024</div>
              </div>
              <div className="timeline-content">
                <h3>Growth & Recognition</h3>
                <p>Reached 50,000+ active users and received industry recognition for innovation in fitness technology.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section">
        <div className="container">
          <div className="cta-section">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Join Our Community?</h2>
              <p className="cta-description">
                Start your fitness journey with FitTracker today and experience the power of personalized fitness technology.
              </p>
              <div className="cta-buttons">
                <a href="/register" className="btn-primary-modern">
                  <span>Get Started Free</span>
                  <i className="bi bi-arrow-right"></i>
                </a>
                <a href="/contact" className="btn-secondary-modern">
                  <span>Contact Us</span>
                  <i className="bi bi-envelope"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TopNewsletterFooter />
    </div>
  );
}