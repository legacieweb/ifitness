import React from 'react';

export default function Status() {
  const systemStatus = [
    { service: "Web Application", status: "operational", uptime: "99.98%" },
    { service: "Mobile App", status: "operational", uptime: "99.95%" },
    { service: "API Servers", status: "operational", uptime: "99.99%" },
    { service: "Database", status: "operational", uptime: "99.99%" },
    { service: "Analytics", status: "operational", uptime: "99.90%" },
  ];

  const incidents = [
    {
      date: "December 12, 2024",
      title: "Scheduled Maintenance",
      description: "Performed routine database optimization. Service was temporarily unavailable for 15 minutes.",
      status: "resolved"
    },
    {
      date: "December 5, 2024",
      title: "API Response Time Optimization",
      description: "Implemented caching improvements resulting in faster load times.",
      status: "resolved"
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'operational':
        return 'bg-success';
      case 'degraded':
        return 'bg-warning';
      case 'outage':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'outage':
        return 'Outage';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h1 className="mb-2">System Status</h1>
          <p className="text-muted mb-4">Real-time status of ifitness services</p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title mb-2">Overall Status</h5>
              <div className="d-flex align-items-center justify-content-center">
                <div 
                  className="rounded-circle bg-success"
                  style={{ width: '20px', height: '20px' }}
                ></div>
                <p className="ms-2 mb-0 fs-5 fw-bold text-success">All Systems Operational</p>
              </div>
            </div>
          </div>

          <h3 className="h5 mb-3">Service Status</h3>
          {systemStatus.map((service, index) => (
            <div key={index} className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{service.service}</h6>
                    <small className="text-muted">Uptime: {service.uptime}</small>
                  </div>
                  <span className={`badge ${getStatusBadge(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h3 className="h5 mb-3">Recent Incidents</h3>
          {incidents.map((incident, index) => (
            <div key={index} className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1">{incident.title}</h6>
                    <small className="text-muted">{incident.date}</small>
                  </div>
                  <span className="badge bg-success">Resolved</span>
                </div>
                <p className="text-muted small mb-0">{incident.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Get Status Updates</h5>
              <p className="card-text text-muted mb-4">
                Subscribe to get notified of any service interruptions or maintenance.
              </p>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email"
                />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
