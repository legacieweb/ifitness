import React from 'react';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import './Status.css';

export default function Status() {
  const systemStatus = [
    { service: "Web Application", status: "operational", uptime: "99.98%", icon: "bi-globe" },
    { service: "Mobile App (iOS)", status: "operational", uptime: "99.95%", icon: "bi-phone" },
    { service: "Mobile App (Android)", status: "operational", uptime: "99.96%", icon: "bi-android2" },
    { service: "API Servers", status: "operational", uptime: "99.99%", icon: "bi-server" },
    { service: "Database", status: "operational", uptime: "99.99%", icon: "bi-database" },
    { service: "Analytics", status: "operational", uptime: "99.90%", icon: "bi-graph-up" },
    { service: "Authentication", status: "operational", uptime: "99.98%", icon: "bi-shield-check" },
    { service: "Notifications", status: "operational", uptime: "99.85%", icon: "bi-bell" }
  ];

  const incidents = [
    {
      date: "December 12, 2024",
      title: "Scheduled Maintenance",
      description: "Performed routine database optimization. Service was temporarily unavailable for 15 minutes.",
      status: "resolved",
      duration: "15 minutes",
      affected: "Database, API Servers"
    },
    {
      date: "December 5, 2024",
      title: "API Response Time Optimization",
      description: "Implemented caching improvements resulting in faster load times and better performance.",
      status: "resolved",
      duration: "30 minutes",
      affected: "API Servers"
    },
    {
      date: "November 28, 2024",
      title: "Mobile App Update",
      description: "Released version 2.1.0 with new features and bug fixes for both iOS and Android platforms.",
      status: "completed",
      duration: "N/A",
      affected: "Mobile Apps"
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'operational':
        return { class: 'operational', text: 'Operational', icon: 'bi-check-circle' };
      case 'degraded':
        return { class: 'degraded', text: 'Degraded Performance', icon: 'bi-exclamation-triangle' };
      case 'outage':
        return { class: 'outage', text: 'Service Outage', icon: 'bi-exclamation-octagon' };
      case 'resolved':
        return { class: 'resolved', text: 'Resolved', icon: 'bi-check-circle' };
      case 'completed':
        return { class: 'completed', text: 'Completed', icon: 'bi-check-circle' };
      default:
        return { class: 'unknown', text: 'Unknown', icon: 'bi-question-circle' };
    }
  };

  return (
    <>
      <PageTransition>
        <div className="modern-status-page">
          <section className="hero-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>System Status</span>
                  </div>
                  <h1 className="hero-title">
                    Real-time ifitness
                    <span className="gradient-text">Status</span>
                  </h1>
                  <p className="hero-description">
                    Monitor the current status and performance of all ifitness services and systems.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="overview-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="overview-card">
                    <div className="overview-header">
                      <h2 className="overview-title">Overall System Status</h2>
                      <div className="status-indicator operational">
                        <i className="bi bi-check-circle"></i>
                        <span>All Systems Operational</span>
                      </div>
                    </div>
                    <div className="overview-stats">
                      <div className="stat-item">
                        <div className="stat-number">8</div>
                        <div className="stat-label">Services Monitored</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">99.97%</div>
                        <div className="stat-label">Average Uptime</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">0</div>
                        <div className="stat-label">Current Issues</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">3</div>
                        <div className="stat-label">Recent Updates</div>
                      </div>
                    </div>
                    <div className="overview-updated">
                      <span>Last updated: </span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="services-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Service Status</span>
                  </div>
                  <h2 className="section-title">Current Service Status</h2>
                  <p className="section-description">
                    Real-time monitoring of all ifitness services and their performance metrics.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="services-list">
                    {systemStatus.map((service, index) => (
                      <div key={index} className="service-card">
                        <div className="service-icon">
                          <i className={`bi ${service.icon}`}></i>
                        </div>
                        <div className="service-info">
                          <h3 className="service-title">{service.service}</h3>
                          <div className="service-meta">
                            <span className="service-status operational">
                              <i className="bi bi-check-circle"></i>
                              {getStatusBadge(service.status).text}
                            </span>
                            <span className="service-uptime">
                              <i className="bi bi-clock"></i>
                              {service.uptime} Uptime
                            </span>
                          </div>
                        </div>
                        <div className="service-status-indicator operational">
                          <i className="bi bi-check-circle"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="incidents-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Recent Activity</span>
                  </div>
                  <h2 className="section-title">Recent Incidents & Updates</h2>
                  <p className="section-description">
                    Stay informed about recent service incidents, maintenance, and improvements.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="incidents-list">
                    {incidents.map((incident, index) => (
                      <div key={index} className="incident-card">
                        <div className="incident-header">
                          <div className="incident-date">
                            <span className="incident-day">{new Date(incident.date).toLocaleDateString('en-US', { day: 'numeric' })}</span>
                            <span className="incident-month">{new Date(incident.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          </div>
                          <div className="incident-status">
                            <span className={`status-badge ${getStatusBadge(incident.status).class}`}>
                              <i className={`bi ${getStatusBadge(incident.status).icon}`}></i>
                              {getStatusBadge(incident.status).text}
                            </span>
                          </div>
                        </div>
                        <div className="incident-content">
                          <h3 className="incident-title">{incident.title}</h3>
                          <p className="incident-description">{incident.description}</p>
                          <div className="incident-meta">
                            <span className="incident-duration">
                              <i className="bi bi-clock"></i>
                              Duration: {incident.duration}
                            </span>
                            <span className="incident-affected">
                              <i className="bi bi-server"></i>
                              Affected: {incident.affected}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="metrics-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Performance</span>
                  </div>
                  <h2 className="section-title">System Performance Metrics</h2>
                  <p className="section-description">
                    Detailed performance metrics and historical data for our services.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="bi bi-speedometer"></i>
                      </div>
                      <h3>Response Time</h3>
                      <p>Average API response time across all services.</p>
                      <div className="metric-value">
                        <span>120ms</span>
                        <span className="metric-change success">
                          <i className="bi bi-arrow-down"></i>
                          15% faster
                        </span>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="bi bi-people"></i>
                      </div>
                      <h3>Active Users</h3>
                      <p>Number of concurrent users currently using our services.</p>
                      <div className="metric-value">
                        <span>12,487</span>
                        <span className="metric-change success">
                          <i className="bi bi-arrow-up"></i>
                          8% increase
                        </span>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="bi bi-cpu"></i>
                      </div>
                      <h3>Server Load</h3>
                      <p>Current load across all our server infrastructure.</p>
                      <div className="metric-value">
                        <span>42%</span>
                        <span className="metric-change normal">
                          <i className="bi bi-dash"></i>
                          Normal
                        </span>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <h3>Security Score</h3>
                      <p>Overall security rating of our systems and infrastructure.</p>
                      <div className="metric-value">
                        <span>98/100</span>
                        <span className="metric-change success">
                          <i className="bi bi-arrow-up"></i>
                          Excellent
                        </span>
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
                    <h2 className="cta-title">Stay Informed</h2>
                    <p className="cta-description">
                      Subscribe to receive real-time updates about service status, maintenance, and improvements.
                    </p>
                    <div className="cta-form">
                      <input type="email" placeholder="Enter your email address" />
                      <button type="submit" className="btn-subscribe">
                        <span>Subscribe to Updates</span>
                        <i className="bi bi-bell"></i>
                      </button>
                    </div>
                    <div className="cta-links">
                      <a href="/help-center" className="cta-link">
                        <i className="bi bi-question-circle"></i>
                        <span>Visit Help Center</span>
                      </a>
                      <a href="/contact" className="cta-link">
                        <i className="bi bi-envelope"></i>
                        <span>Contact Support</span>
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
