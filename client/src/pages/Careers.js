import React from 'react';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import './Careers.css';

export default function Careers() {
  const positions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build cutting-edge user interfaces and experiences for our fitness platform using React, TypeScript, and modern web technologies.",
      requirements: ["5+ years of frontend development", "Expertise in React and TypeScript", "Experience with fitness apps a plus", "Strong UI/UX design skills"]
    },
    {
      id: 2,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Develop robust API services and database solutions to power our fitness tracking platform using Node.js and modern backend technologies.",
      requirements: ["4+ years of backend development", "Expertise in Node.js and MongoDB", "Experience with fitness data processing", "Strong API design skills"]
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      description: "Lead the vision and strategy for our fitness platform, working closely with engineering, design, and marketing teams.",
      requirements: ["3+ years of product management", "Experience in fitness/health tech", "Strong leadership skills", "Agile methodology expertise"]
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive and beautiful user interfaces that make fitness tracking enjoyable and accessible for everyone.",
      requirements: ["4+ years of UX/UI design", "Strong portfolio of mobile/web apps", "Fitness app experience preferred", "Figma/Adobe XD expertise"]
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Develop and execute marketing strategies to grow our user base and increase engagement with our fitness platform.",
      requirements: ["3+ years of digital marketing", "Fitness industry experience", "Strong social media skills", "Content creation expertise"]
    },
    {
      id: 6,
      title: "Customer Support Specialist",
      department: "Support",
      location: "Remote",
      type: "Part-time",
      description: "Provide excellent customer support to our users, helping them get the most out of our fitness tracking platform.",
      requirements: ["2+ years of customer support", "Fitness knowledge a plus", "Excellent communication skills", "Problem-solving mindset"]
    }
  ];

  const benefits = [
    {
      title: "Competitive Salary",
      description: "We offer market-competitive salaries and regular performance reviews.",
      icon: "bi-currency-dollar"
    },
    {
      title: "Flexible Work",
      description: "Remote work options and flexible hours to suit your lifestyle.",
      icon: "bi-clock"
    },
    {
      title: "Health Benefits",
      description: "Comprehensive health insurance and wellness programs.",
      icon: "bi-heart-pulse"
    },
    {
      title: "Growth Opportunities",
      description: "Professional development and career advancement opportunities.",
      icon: "bi-graph-up"
    },
    {
      title: "Fitness Perks",
      description: "Free premium membership and fitness equipment stipend.",
      icon: "bi-award"
    },
    {
      title: "Team Culture",
      description: "Collaborative team environment with regular social events.",
      icon: "bi-people"
    }
  ];

  return (
    <>
      <PageTransition>
        <div className="modern-careers-page">
          <section className="hero-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="hero-content">
                    <div className="section-badge">
                      <span>Join Our Team</span>
                    </div>
                    <h1 className="hero-title">
                      Shape the Future
                      <span className="gradient-text">of Fitness</span>
                    </h1>
                    <p className="hero-description">
                      Join our passionate team and help us build innovative fitness solutions that empower millions of users worldwide.
                    </p>
                    <div className="hero-cta">
                      <a href="#positions" className="btn-primary-modern large">
                        <span>View Open Positions</span>
                        <i className="bi bi-arrow-down"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-visual">
                    <div className="team-illustration">
                      <div className="team-member-avatar avatar-1">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="team-member-avatar avatar-2">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="team-member-avatar avatar-3">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="team-member-avatar avatar-4">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="team-member-avatar avatar-5">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="join-us-badge">
                        <span>Join Us</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="why-join-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Why ifitness</span>
                  </div>
                  <h2 className="section-title">Why Join Our Team?</h2>
                  <p className="section-description">
                    We're not just building a fitness app - we're creating a movement that transforms lives through technology and community.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="benefit-card">
                        <div className="benefit-icon">
                          <i className={`bi ${benefit.icon}`}></i>
                        </div>
                        <h3>{benefit.title}</h3>
                        <p>{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="positions-section" id="positions">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Open Roles</span>
                  </div>
                  <h2 className="section-title">Current Opportunities</h2>
                  <p className="section-description">
                    Explore our open positions and find the perfect role to match your skills and passion for fitness technology.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="positions-list">
                    {positions.map((position) => (
                      <div key={position.id} className="position-card">
                        <div className="position-header">
                          <div className="position-info">
                            <h3 className="position-title">{position.title}</h3>
                            <div className="position-meta">
                              <span className="position-department">{position.department}</span>
                              <span className="position-location">📍 {position.location}</span>
                              <span className={`position-type ${position.type.toLowerCase().replace(' ', '-')}`}>{position.type}</span>
                            </div>
                          </div>
                          <div className="position-actions">
                            <a href="/" className="btn-apply">
                              <span>Apply Now</span>
                              <i className="bi bi-arrow-right"></i>
                            </a>
                          </div>
                        </div>
                        <div className="position-details">
                          <p className="position-description">{position.description}</p>
                          <div className="position-requirements">
                            <h4>Requirements:</h4>
                            <ul>
                              {position.requirements.map((req, reqIndex) => (
                                <li key={reqIndex}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="culture-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="culture-content">
                    <div className="section-badge">
                      <span>Our Culture</span>
                    </div>
                    <h2 className="section-title">A Team That Cares</h2>
                    <p className="section-description">
                      At ifitness, we foster a culture of innovation, collaboration, and personal growth. We believe that great products come from great teams.
                    </p>
                    <div className="culture-values">
                      <div className="value-item">
                        <div className="value-icon">
                          <i className="bi bi-lightning-charge"></i>
                        </div>
                        <div className="value-content">
                          <h4>Innovation</h4>
                          <p>We encourage creative thinking and bold ideas</p>
                        </div>
                      </div>
                      <div className="value-item">
                        <div className="value-icon">
                          <i className="bi bi-people"></i>
                        </div>
                        <div className="value-content">
                          <h4>Collaboration</h4>
                          <p>Teamwork is at the heart of everything we do</p>
                        </div>
                      </div>
                      <div className="value-item">
                        <div className="value-icon">
                          <i className="bi bi-graph-up"></i>
                        </div>
                        <div className="value-content">
                          <h4>Growth</h4>
                          <p>We invest in your professional development</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="culture-visual">
                    <div className="culture-illustration">
                      <div className="culture-bg-shape"></div>
                      <div className="culture-team-avatars">
                        <div className="culture-avatar avatar-1">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="culture-avatar avatar-2">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="culture-avatar avatar-3">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="culture-avatar avatar-4">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="culture-avatar avatar-5">
                          <i className="bi bi-person-circle"></i>
                        </div>
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
                    <h2 className="cta-title">Ready to Make an Impact?</h2>
                    <p className="cta-description">
                      Join our team and help us transform the fitness industry through innovative technology and passionate community building.
                    </p>
                    <div className="cta-buttons">
                      <a href="#positions" className="btn-primary-modern large">
                        <span>View All Positions</span>
                        <i className="bi bi-arrow-down"></i>
                      </a>
                      <a href="/contact" className="btn-secondary-modern large">
                        <i className="bi bi-envelope"></i>
                        <span>Contact HR</span>
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
