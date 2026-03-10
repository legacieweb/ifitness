import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './Status.css';

export default function Status() {
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const systemStatus = [
    { service: "CORE_WEB_ENGINE", status: "operational", uptime: "99.98%", icon: "bi-globe" },
    { service: "MOBILE_LINK_IOS", status: "operational", uptime: "99.95%", icon: "bi-phone" },
    { service: "MOBILE_LINK_ANDROID", status: "operational", uptime: "99.96%", icon: "bi-android2" },
    { service: "API_NODES", status: "operational", uptime: "99.99%", icon: "bi-server" },
    { service: "DATABASE_CLUSTER", status: "operational", uptime: "99.99%", icon: "bi-database" },
    { service: "ANALYTICS_PROCESSOR", status: "operational", uptime: "99.90%", icon: "bi-graph-up" },
    { service: "AUTH_PROTOCOL", status: "operational", uptime: "99.98%", icon: "bi-shield-check" },
    { service: "NOTIFICATION_RELAY", status: "operational", uptime: "99.85%", icon: "bi-bell" }
  ];

  return (
    <PageTransition>
      <div className="crimson-status">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Status Hero */}
        <section className="status-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">SYSTEM_DIAGNOSTICS</span>
              </div>
              
              <h1 className="hero-title">
                PROTOCOL <span className="text-crimson">HEALTH</span>
                <br />
                <span className="hero-subtitle">REAL_TIME_MONITORING</span>
              </h1>
              
              <div className="overall-status-node crimson-glow">
                <div className="status-pulse"></div>
                <span>ALL_SYSTEMS_OPERATIONAL</span>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostics Matrix */}
        <section className="diagnostics-section">
          <div className="crimson-container">
            <div className="systems-header reveal">
              <div className="systems-badge">
                <span className="badge-bullet"></span>
                <span>CORE_SERVICES</span>
              </div>
              <h2 className="systems-title">SERVICE <span className="text-crimson">UPTIME</span></h2>
            </div>

            <div className="status-matrix">
              {systemStatus.map((service, index) => (
                <div key={index} className="status-module reveal">
                  <div className="module-top">
                    <div className="service-icon"><i className={`bi ${service.icon}`}></i></div>
                    <div className="service-name">{service.service}</div>
                  </div>
                  <div className="module-bottom">
                    <div className="uptime-data">
                      <span className="u-label">UPTIME</span>
                      <span className="u-value">{service.uptime}</span>
                    </div>
                    <div className="status-tag operational">ONLINE</div>
                  </div>
                  <div className="scan-line"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Logs */}
        <section className="performance-logs reveal">
          <div className="crimson-container">
            <div className="log-terminal">
              <div className="terminal-header">
                <span className="t-title">SYSTEM_PERFORMANCE_LOGS</span>
                <span className="t-time">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="terminal-content">
                <div className="log-row">
                  <span className="log-time">[14:22:01]</span>
                  <span className="log-msg text-crimson">CORE_ENGINE_OPTIMIZED</span>
                  <span className="log-val">SUCCESS</span>
                </div>
                <div className="log-row">
                  <span className="log-time">[12:45:12]</span>
                  <span className="log-msg">DATABASE_MAINTENANCE_COMPLETED</span>
                  <span className="log-val">99.9%_HEALTH</span>
                </div>
                <div className="log-row">
                  <span className="log-time">[09:15:44]</span>
                  <span className="log-msg">API_RESPONSE_CALIBRATED</span>
                  <span className="log-val">112ms</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Maintenance CTA */}
        <section className="maintenance-cta reveal">
          <div className="crimson-container">
            <div className="maintenance-box">
              <div className="box-content">
                <h2>STAY <span className="text-crimson">SYNCED</span></h2>
                <p>Receive immediate alerts for protocol deviations or maintenance cycles.</p>
                <div className="subscribe-form">
                  <input type="email" placeholder="ENTER_EMAIL_ADDRESS" />
                  <button className="btn-modern-primary">ESTABLISH_ALERT_LINK</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
