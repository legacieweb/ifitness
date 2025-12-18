import React from 'react';

export default function Careers() {
  const positions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      id: 2,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time"
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "San Francisco, CA",
      type: "Full-time"
    },
    {
      id: 6,
      title: "Customer Support Specialist",
      department: "Support",
      location: "Remote",
      type: "Part-time"
    }
  ];

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="mb-3">We're Hiring!</h1>
          <p className="lead text-muted">
            Join our team and help us build the future of fitness tracking.
          </p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-body">
              <h3 className="card-title h5 mb-3">Why Join ifitness?</h3>
              <ul className="mb-0">
                <li className="mb-2">Work on a product used by thousands of fitness enthusiasts</li>
                <li className="mb-2">Collaborate with talented, passionate team members</li>
                <li className="mb-2">Competitive salary and comprehensive benefits</li>
                <li className="mb-2">Flexible remote work options</li>
                <li className="mb-2">Professional development and growth opportunities</li>
                <li className="mb-2">Health and wellness benefits</li>
              </ul>
            </div>
          </div>

          <h3 className="mb-4">Open Positions</h3>
          {positions.map((position) => (
            <div key={position.id} className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="card-title mb-1">{position.title}</h5>
                    <p className="text-muted small mb-0">{position.department}</p>
                  </div>
                  <span className="badge bg-secondary">{position.type}</span>
                </div>
                <p className="text-muted small mb-3">
                  📍 {position.location}
                </p>
                <a href="/" className="btn btn-sm btn-primary">
                  Apply Now
                </a>
              </div>
            </div>
          ))}

          <div className="card border-0 bg-light mt-5">
            <div className="card-body text-center">
              <h5 className="card-title mb-2">Don't see a position for you?</h5>
              <p className="card-text text-muted mb-0">
                Send us your resume at <a href="mailto:careers@ifitness.com">careers@ifitness.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
