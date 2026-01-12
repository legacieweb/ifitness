import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import './Documentation.css';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      icon: 'bi-rocket-takeoff',
      content: (
        <>
          <div className="doc-section">
            <h3>Welcome to ifitness</h3>
            <p>This guide will help you get started with ifitness in just a few minutes.</p>
          </div>

          <div className="doc-section">
            <h4>Creating an Account</h4>
            <ol>
              <li>Visit the registration page</li>
              <li>Enter your name, email, and password</li>
              <li>Provide your age, weight, and height</li>
              <li>Set your fitness goal</li>
              <li>Click "Register" to create your account</li>
            </ol>
          </div>

          <div className="doc-section">
            <h4>First Steps</h4>
            <ul className="checklist">
              <li><i className="bi bi-check-circle"></i> Complete your profile with accurate health information</li>
              <li><i className="bi bi-check-circle"></i> Log your first workout</li>
              <li><i className="bi bi-check-circle"></i> Set some fitness goals</li>
              <li><i className="bi bi-check-circle"></i> Explore the analytics dashboard</li>
            </ul>
          </div>

          <div className="doc-tip">
            <i className="bi bi-lightbulb"></i>
            <p><strong>Tip:</strong> Take the guided tour to familiarize yourself with all features!</p>
          </div>
        </>
      )
    },
    'workouts': {
      title: 'Logging Workouts',
      icon: 'bi-calendar2-event',
      content: (
        <>
          <div className="doc-section">
            <h3>How to Log a Workout</h3>
          </div>

          <div className="doc-section">
            <h4>Manual Workout Entry</h4>
            <ol>
              <li>Go to "New Workout" from the Training menu</li>
              <li>Select the workout type or create a custom workout</li>
              <li>Add exercises with details (sets, reps, weight)</li>
              <li>Enter duration and estimated calories burned</li>
              <li>Add notes if desired</li>
              <li>Click "Save Workout"</li>
            </ol>
          </div>

          <div className="doc-section">
            <h4>Using Workout Templates</h4>
            <p>We provide pre-built templates for common workout types. To use them:</p>
            <ol>
              <li>Navigate to "Workout Templates"</li>
              <li>Select a template that matches your routine</li>
              <li>Customize exercises as needed</li>
              <li>Save as a new workout</li>
            </ol>
          </div>

          <div className="doc-visual">
            <div className="visual-placeholder">
              <i className="bi bi-graph-up"></i>
              <span>Workout Progress Visualization</span>
            </div>
          </div>
        </>
      )
    },
    'analytics': {
      title: 'Understanding Analytics',
      icon: 'bi-graph-up',
      content: (
        <>
          <div className="doc-section">
            <h3>Analytics Dashboard</h3>
          </div>

          <div className="doc-section">
            <h4>Key Metrics</h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <i className="bi bi-calendar-week"></i>
                <span>Total Workouts</span>
              </div>
              <div className="metric-card">
                <i className="bi bi-clock"></i>
                <span>Total Duration</span>
              </div>
              <div className="metric-card">
                <i className="bi bi-fire"></i>
                <span>Total Calories</span>
              </div>
              <div className="metric-card">
                <i className="bi bi-speedometer"></i>
                <span>Average Intensity</span>
              </div>
            </div>
          </div>

          <div className="doc-section">
            <h4>Charts and Graphs</h4>
            <p>View trends over time with our interactive charts:</p>
            <ul className="checklist">
              <li><i className="bi bi-check-circle"></i> Weekly activity overview</li>
              <li><i className="bi bi-check-circle"></i> Monthly progress tracking</li>
              <li><i className="bi bi-check-circle"></i> Exercise frequency analysis</li>
              <li><i className="bi bi-check-circle"></i> Calories burned trends</li>
            </ul>
          </div>

          <div className="doc-tip">
            <i className="bi bi-lightbulb"></i>
            <p><strong>Tip:</strong> Use the date range filter to analyze specific time periods!</p>
          </div>
        </>
      )
    },
    'goals': {
      title: 'Setting Goals',
      icon: 'bi-target',
      content: (
        <>
          <div className="doc-section">
            <h3>How to Set Fitness Goals</h3>
          </div>

          <div className="doc-section">
            <h4>Creating a Goal</h4>
            <ol>
              <li>Navigate to "Health" → "Goals"</li>
              <li>Click "Create New Goal"</li>
              <li>Set a goal type (weight loss, muscle gain, endurance, etc.)</li>
              <li>Define your target and deadline</li>
              <li>Add motivation notes</li>
              <li>Track progress regularly</li>
            </ol>
          </div>

          <div className="doc-section">
            <h4>SMART Goals</h4>
            <p>Create effective goals that are:</p>
            <div className="smart-goals">
              <div className="smart-item">
                <span className="smart-letter">S</span>
                <span>Specific</span>
              </div>
              <div className="smart-item">
                <span className="smart-letter">M</span>
                <span>Measurable</span>
              </div>
              <div className="smart-item">
                <span className="smart-letter">A</span>
                <span>Achievable</span>
              </div>
              <div className="smart-item">
                <span className="smart-letter">R</span>
                <span>Relevant</span>
              </div>
              <div className="smart-item">
                <span className="smart-letter">T</span>
                <span>Time-bound</span>
              </div>
            </div>
          </div>

          <div className="doc-visual">
            <div className="visual-placeholder">
              <i className="bi bi-trophy"></i>
              <span>Goal Achievement Visualization</span>
            </div>
          </div>
        </>
      )
    },
    'privacy': {
      title: 'Privacy & Security',
      icon: 'bi-shield-check',
      content: (
        <>
          <div className="doc-section">
            <h3>Your Data is Safe</h3>
          </div>

          <div className="doc-section">
            <h4>Data Protection</h4>
            <p>We use industry-standard encryption and security measures to protect your personal information and workout data.</p>
            <ul className="security-features">
              <li><i className="bi bi-lock"></i> End-to-end encryption</li>
              <li><i className="bi bi-shield"></i> Regular security audits</li>
              <li><i className="bi bi-server"></i> Secure cloud storage</li>
              <li><i className="bi bi-person-check"></i> Two-factor authentication</li>
            </ul>
          </div>

          <div className="doc-section">
            <h4>Privacy Controls</h4>
            <ul className="checklist">
              <li><i className="bi bi-check-circle"></i> Control who can see your profile</li>
              <li><i className="bi bi-check-circle"></i> Manage data sharing preferences</li>
              <li><i className="bi bi-check-circle"></i> Download your data anytime</li>
              <li><i className="bi bi-check-circle"></i> Request data deletion</li>
            </ul>
          </div>

          <div className="doc-section">
            <h4>Learn More</h4>
            <p>For detailed information, please read our <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-of-service">Terms of Service</a>.</p>
          </div>

          <div className="doc-tip">
            <i className="bi bi-lightbulb"></i>
            <p><strong>Tip:</strong> Review your privacy settings regularly in the account dashboard!</p>
          </div>
        </>
      )
    },
    'advanced': {
      title: 'Advanced Features',
      icon: 'bi-stars',
      content: (
        <>
          <div className="doc-section">
            <h3>Advanced Features Guide</h3>
          </div>

          <div className="doc-section">
            <h4>Custom Workout Plans</h4>
            <p>Create personalized workout plans with our advanced planner:</p>
            <ul className="checklist">
              <li><i className="bi bi-check-circle"></i> Multi-week workout schedules</li>
              <li><i className="bi bi-check-circle"></i> Progressive overload tracking</li>
              <li><i className="bi bi-check-circle"></i> Exercise rotation suggestions</li>
              <li><i className="bi bi-check-circle"></i> Recovery period planning</li>
            </ul>
          </div>

          <div className="doc-section">
            <h4>Integration Options</h4>
            <p>Connect ifitness with your favorite apps and devices:</p>
            <div className="integrations-grid">
              <div className="integration-card">
                <i className="bi bi-apple"></i>
                <span>Apple Health</span>
              </div>
              <div className="integration-card">
                <i className="bi bi-google"></i>
                <span>Google Fit</span>
              </div>
              <div className="integration-card">
                <i className="bi bi-watch"></i>
                <span>Wearables</span>
              </div>
              <div className="integration-card">
                <i className="bi bi-calendar"></i>
                <span>Calendar</span>
              </div>
            </div>
          </div>

          <div className="doc-section">
            <h4>API Access</h4>
            <p>For developers, we offer API access to integrate ifitness data with your applications. Contact our developer support for more information.</p>
          </div>

          <div className="doc-visual">
            <div className="visual-placeholder">
              <i className="bi bi-code"></i>
              <span>API Integration Example</span>
            </div>
          </div>
        </>
      )
    }
  };

  return (
    <>
      <PageTransition>
        <div className="modern-documentation-page">
          <section className="hero-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Documentation</span>
                  </div>
                  <h1 className="hero-title">
                    Complete ifitness
                    <span className="gradient-text">Guide</span>
                  </h1>
                  <p className="hero-description">
                    Everything you need to know to get the most out of your ifitness experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="content-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 mb-4 mb-lg-0">
                  <div className="sidebar">
                    <div className="sidebar-header">
                      <h3>Guide Contents</h3>
                    </div>
                    <div className="sidebar-menu">
                      {Object.entries(sections).map(([key, section]) => (
                        <button
                          key={key}
                          className={`sidebar-item ${activeSection === key ? 'active' : ''}`}
                          onClick={() => setActiveSection(key)}
                        >
                          <i className={`bi ${section.icon}`}></i>
                          <span>{section.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="main-content">
                    <div className="content-header">
                      <h2 className="content-title">
                        <i className={`bi ${sections[activeSection].icon}`}></i>
                        {sections[activeSection].title}
                      </h2>
                    </div>
                    <div className="content-body">
                      {sections[activeSection].content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="help-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="help-card">
                    <div className="help-content">
                      <h2 className="help-title">Still need help?</h2>
                      <p className="help-description">
                        Can't find what you're looking for? Our support team is here to assist you.
                      </p>
                      <div className="help-options">
                        <a href="/help-center" className="help-option">
                          <i className="bi bi-question-circle"></i>
                          <span>Visit Help Center</span>
                          <i className="bi bi-arrow-right"></i>
                        </a>
                        <a href="/contact" className="help-option">
                          <i className="bi bi-envelope"></i>
                          <span>Contact Support</span>
                          <i className="bi bi-arrow-right"></i>
                        </a>
                        <a href="/" className="help-option">
                          <i className="bi bi-discord"></i>
                          <span>Join Community</span>
                          <i className="bi bi-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                    <div className="help-visual">
                      <div className="help-illustration">
                        <i className="bi bi-headset"></i>
                      </div>
                    </div>
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
                    <h2 className="cta-title">Ready to Master ifitness?</h2>
                    <p className="cta-description">
                      Now that you have all the knowledge, it's time to put it into practice and achieve your fitness goals!
                    </p>
                    <div className="cta-buttons">
                      <a href="/dashboard" className="btn-primary-modern large">
                        <span>Go to Dashboard</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                      <a href="/workouts" className="btn-secondary-modern large">
                        <i className="bi bi-calendar2-event"></i>
                        <span>Log Workout</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
