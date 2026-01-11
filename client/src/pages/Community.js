import React from 'react';
import PageTransition from '../components/PageTransition';
import DashboardHeader from '../components/DashboardHeader';
import TopNewsletterFooter from '../components/TopNewsletterFooter';
import './Community.css';

export default function Community() {
  const resources = [
    {
      title: "Forum",
      description: "Join discussions, ask questions, and share tips with the ifitness community.",
      icon: "bi-chat-dots",
      link: "#",
      color: "#4361ee"
    },
    {
      title: "Discord Server",
      description: "Connect in real-time with other fitness enthusiasts and get instant support.",
      icon: "bi-discord",
      link: "#",
      color: "#7289da"
    },
    {
      title: "Social Media",
      description: "Follow us for fitness tips, success stories, and community updates.",
      icon: "bi-share",
      link: "#",
      color: "#f72585"
    },
    {
      title: "Challenges",
      description: "Participate in monthly fitness challenges and compete with the community.",
      icon: "bi-trophy",
      link: "#",
      color: "#ffd700"
    },
    {
      title: "User Groups",
      description: "Join local or interest-based groups to connect with like-minded individuals.",
      icon: "bi-people",
      link: "#",
      color: "#10b981"
    },
    {
      title: "Meetups",
      description: "Attend virtual and in-person meetups organized by our community.",
      icon: "bi-geo-alt",
      link: "#",
      color: "#ef4444"
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Community Member",
      text: "The ifitness community has been incredibly supportive on my fitness journey. Everyone is encouraging and helpful!",
      avatar: "AJ",
      avatarColor: "#4361ee"
    },
    {
      name: "Sarah Chen",
      role: "Community Moderator",
      text: "Being part of this community has helped me stay motivated and learn from others' experiences. It's like having a personal support group!",
      avatar: "SC",
      avatarColor: "#f72585"
    },
    {
      name: "Mike Davis",
      role: "Community Member",
      text: "I love how active and welcoming the community is. It makes fitness feel less like a chore and more like a shared adventure.",
      avatar: "MD",
      avatarColor: "#10b981"
    },
    {
      name: "Emma Wilson",
      role: "Fitness Coach",
      text: "The community challenges have transformed my approach to fitness. The support and camaraderie are unmatched!",
      avatar: "EW",
      avatarColor: "#7c3aed"
    },
    {
      name: "David Brown",
      role: "Community Member",
      text: "From beginner to advanced, everyone finds their place here. The diversity of experiences is truly inspiring.",
      avatar: "DB",
      avatarColor: "#ef4444"
    },
    {
      name: "Lisa Taylor",
      role: "Nutrition Expert",
      text: "Sharing knowledge and learning from others has been the highlight of my ifitness community experience.",
      avatar: "LT",
      avatarColor: "#ffd700"
    }
  ];

  const events = [
    {
      title: "Summer Fitness Challenge",
      date: "June 15-30, 2025",
      description: "Join our 2-week summer fitness challenge with daily workouts and nutrition tips.",
      location: "Virtual",
      participants: "500+"
    },
    {
      title: "Community Meetup - NYC",
      date: "July 10, 2025",
      description: "Meet fellow ifitness members in New York City for a day of workouts and networking.",
      location: "New York, NY",
      participants: "200+"
    },
    {
      title: "Mindfulness & Fitness",
      date: "August 5, 2025",
      description: "Learn how to combine mindfulness practices with your fitness routine for better results.",
      location: "Virtual",
      participants: "300+"
    }
  ];

  return (
    <>
      <DashboardHeader />
      <PageTransition>
        <div className="modern-community-page">
          <section className="hero-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="hero-content">
                    <div className="section-badge">
                      <span>Our Community</span>
                    </div>
                    <h1 className="hero-title">
                      Join the Fitness
                      <span className="gradient-text">Revolution</span>
                    </h1>
                    <p className="hero-description">
                      Connect with thousands of fitness enthusiasts who are transforming their lives through shared motivation, support, and inspiration.
                    </p>
                    <div className="hero-stats">
                      <div className="stat-item">
                        <div className="stat-number counter" data-target="50000">50000</div>
                        <div className="stat-label">Active Members</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number counter" data-target="2000">2000</div>
                        <div className="stat-label">Weekly Posts</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number counter" data-target="500">500</div>
                        <div className="stat-label">Monthly Events</div>
                      </div>
                    </div>
                    <div className="hero-cta">
                      <a href="#join" className="btn-primary-modern large">
                        <span>Join Now</span>
                        <i className="bi bi-person-plus"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-visual">
                    <div className="community-illustration">
                      <div className="community-member member-1">
                        <div className="member-avatar" style={{ backgroundColor: '#4361ee' }}>
                          <i className="bi bi-person-circle"></i>
                        </div>
                      </div>
                      <div className="community-member member-2">
                        <div className="member-avatar" style={{ backgroundColor: '#f72585' }}>
                          <i className="bi bi-person-circle"></i>
                        </div>
                      </div>
                      <div className="community-member member-3">
                        <div className="member-avatar" style={{ backgroundColor: '#10b981' }}>
                          <i className="bi bi-person-circle"></i>
                        </div>
                      </div>
                      <div className="community-member member-4">
                        <div className="member-avatar" style={{ backgroundColor: '#7c3aed' }}>
                          <i className="bi bi-person-circle"></i>
                        </div>
                      </div>
                      <div className="community-member member-5">
                        <div className="member-avatar" style={{ backgroundColor: '#ef4444' }}>
                          <i className="bi bi-person-circle"></i>
                        </div>
                      </div>
                      <div className="community-center">
                        <div className="community-center-icon">
                          <i className="bi bi-people-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="resources-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Connect With Us</span>
                  </div>
                  <h2 className="section-title">Explore Our Community Resources</h2>
                  <p className="section-description">
                    Discover the many ways you can connect, learn, and grow with the ifitness community.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-10 mx-auto">
                  <div className="resources-grid">
                    {resources.map((resource, index) => (
                      <div key={index} className="resource-card">
                        <div className="resource-icon" style={{ backgroundColor: resource.color }}>
                          <i className={`bi ${resource.icon}`}></i>
                        </div>
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <a href={resource.link} className="resource-link">
                          <span>Visit</span>
                          <i className="bi bi-arrow-right"></i>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="testimonials-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Success Stories</span>
                  </div>
                  <h2 className="section-title">What Our Community Says</h2>
                  <p className="section-description">
                    Hear from real members who have transformed their fitness journeys with our community support.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-10 mx-auto">
                  <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="testimonial-card">
                        <div className="testimonial-content">
                          <p className="testimonial-text">"{testimonial.text}"</p>
                        </div>
                        <div className="testimonial-author">
                          <div className="author-avatar" style={{ backgroundColor: testimonial.avatarColor }}>
                            {testimonial.avatar}
                          </div>
                          <div className="author-info">
                            <h4>{testimonial.name}</h4>
                            <p className="author-role">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="events-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Upcoming Events</span>
                  </div>
                  <h2 className="section-title">Join Our Community Events</h2>
                  <p className="section-description">
                    Participate in exciting events designed to motivate, educate, and connect fitness enthusiasts.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-10 mx-auto">
                  <div className="events-list">
                    {events.map((event, index) => (
                      <div key={index} className="event-card">
                        <div className="event-date">
                          <div className="event-day">
                            {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
                          </div>
                          <div className="event-month">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        <div className="event-content">
                          <h3 className="event-title">{event.title}</h3>
                          <div className="event-meta">
                            <span className="event-location"><i className="bi bi-geo-alt"></i> {event.location}</span>
                            <span className="event-participants"><i className="bi bi-people"></i> {event.participants} Participants</span>
                          </div>
                          <p className="event-description">{event.description}</p>
                          <a href="/" className="event-link">
                            <span>Learn More</span>
                            <i className="bi bi-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="join-section" id="join">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="join-card">
                    <div className="join-content">
                      <div className="section-badge">
                        <span>Get Started</span>
                      </div>
                      <h2 className="section-title">Start Your Community Journey</h2>
                      <p className="section-description">
                        Whether you're just starting or already crushing your goals, there's a place for you in the ifitness community.
                      </p>
                      <div className="join-features">
                        <div className="feature-item">
                          <div className="feature-icon">
                            <i className="bi bi-check-circle"></i>
                          </div>
                          <span>Connect with like-minded individuals</span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">
                            <i className="bi bi-check-circle"></i>
                          </div>
                          <span>Access exclusive fitness resources</span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">
                            <i className="bi bi-check-circle"></i>
                          </div>
                          <span>Participate in challenges and events</span>
                        </div>
                      </div>
                      <div className="join-buttons">
                        <a href="/register" className="btn-primary-modern large">
                          <span>Create Account</span>
                          <i className="bi bi-person-plus"></i>
                        </a>
                        <a href="/" className="btn-secondary-modern large">
                          <i className="bi bi-discord"></i>
                          <span>Join Discord</span>
                        </a>
                      </div>
                    </div>
                    <div className="join-visual">
                      <div className="join-illustration">
                        <div className="join-avatar avatar-1">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="join-avatar avatar-2">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="join-avatar avatar-3">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="join-plus">
                          <i className="bi bi-plus-lg"></i>
                        </div>
                        <div className="join-avatar avatar-4">
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
                    <h2 className="cta-title">Become Part of Something Big</h2>
                    <p className="cta-description">
                      Join thousands of fitness enthusiasts who are transforming their lives through shared motivation and support.
                    </p>
                    <div className="cta-buttons">
                      <a href="/register" className="btn-primary-modern large">
                        <span>Join Community Now</span>
                        <i className="bi bi-arrow-right"></i>
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
