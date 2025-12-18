import React from 'react';
import PageTransition from '../components/PageTransition';

export default function Community() {
  const resources = [
    {
      title: "Forum",
      description: "Join discussions, ask questions, and share tips with the ifitness community.",
      icon: "bi-chat-dots",
      link: "#"
    },
    {
      title: "Discord Server",
      description: "Connect in real-time with other fitness enthusiasts and get instant support.",
      icon: "bi-discord",
      link: "#"
    },
    {
      title: "Social Media",
      description: "Follow us for fitness tips, success stories, and community updates.",
      icon: "bi-share",
      link: "#"
    },
    {
      title: "Challenges",
      description: "Participate in monthly fitness challenges and compete with the community.",
      icon: "bi-trophy",
      link: "#"
    },
    {
      title: "User Groups",
      description: "Join local or interest-based groups to connect with like-minded individuals.",
      icon: "bi-people",
      link: "#"
    },
    {
      title: "Meetups",
      description: "Attend virtual and in-person meetups organized by our community.",
      icon: "bi-geo-alt",
      link: "#"
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Community Member",
      text: "The ifitness community has been incredibly supportive on my fitness journey. Everyone is encouraging and helpful!",
      avatar: "AJ"
    },
    {
      name: "Sarah Chen",
      role: "Community Moderator",
      text: "Being part of this community has helped me stay motivated and learn from others' experiences. It's like having a personal support group!",
      avatar: "SC"
    },
    {
      name: "Mike Davis",
      role: "Community Member",
      text: "I love how active and welcoming the community is. It makes fitness feel less like a chore and more like a shared adventure.",
      avatar: "MD"
    }
  ];

  return (
    <PageTransition>
      <div className="container py-5">
        <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="mb-3">Our Community</h1>
          <p className="lead text-muted">
            Join thousands of fitness enthusiasts supporting each other on their journey to health and wellness.
          </p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h2 className="h4 mb-4">Connect With Us</h2>
          <div className="row">
            {resources.map((resource, index) => (
              <div key={index} className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <i className={`bi ${resource.icon} fs-3 text-primary mb-3`}></i>
                    <h5 className="card-title">{resource.title}</h5>
                    <p className="card-text text-muted small mb-3">{resource.description}</p>
                    <a href={resource.link} className="btn btn-sm btn-outline-primary">
                      Visit →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h2 className="h4 mb-4">What Our Community Says</h2>
          <div className="row">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="card-text mb-4 fst-italic">"{testimonial.text}"</p>
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: '40px', height: '40px' }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="mb-0 fw-bold">{testimonial.name}</p>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Start Your Community Journey</h5>
              <p className="card-text text-muted mb-4">
                Whether you're just starting or already crushing your goals, there's a place for you in the ifitness community.
              </p>
              <a href="/" className="btn btn-primary">
                Join Now
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
