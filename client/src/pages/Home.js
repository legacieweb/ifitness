import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BootcampBanner from '../components/BootcampBanner';
import OutdoorActivityBanner from '../components/OutdoorActivityBanner';
import './Home.css';

const VIDEOS = [
  {
    id: 1,
    title: 'Training Session 1',
    description: 'A powerful full-body workout to build strength and endurance.',
    url: '/videos/VID-20260228-WA0005.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '15:20',
    category: 'Strength'
  },
  {
    id: 2,
    title: 'HIIT Cardio Blast',
    description: 'High-intensity interval training to burn fat and improve cardiovascular health.',
    url: '/videos/VID-20260228-WA0008.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '25:45',
    category: 'HIIT'
  },
  {
    id: 3,
    title: 'Elite Training Session',
    description: 'Advanced techniques for maximum results and peak performance.',
    url: '/videos/VID-20260228-WA0010.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '45:00',
    category: 'Elite'
  }
];

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [showGallery, setShowGallery] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for scroll reveal
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="modern-homepage">
      {/* Modern Hero Section */}
      <section className="modern-hero">
        <div className="hero-bg-gradient"></div>
        
        <div className="container">
          <div className="modern-hero-wrapper">
            <div className="modern-hero-content">
              <div className="hero-badge-modern reveal">
                <span className="badge-icon"><i className="bi bi-lightning-charge-fill"></i></span>
                <span>Next-Gen Fitness Platform</span>
              </div>
              
              <h1 className="modern-hero-title">
                Transform Your Body,<br/>
                <span className="highlight-gradient">Elevate Your Life</span>
              </h1>
              
              <p className="modern-hero-subtitle">
                AI-powered fitness coaching with real-time analytics and personalized training plans designed for elite results.
              </p>
              
              <div className="modern-cta-group reveal">
                <Link to="/register" className="btn-modern-primary">
                  Start Your Journey <i className="bi bi-arrow-right"></i>
                </Link>
                <button 
                  onClick={() => setShowGallery(true)} 
                  className="btn-modern-secondary"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  <i className="bi bi-play-circle"></i> View Videos
                </button>
              </div>
              
              <div className="hero-trusted-by reveal">
                <div className="trusted-text">TRUSTED BY INDUSTRY LEADERS</div>
                <div className="trusted-logos">
                  <i className="bi bi-nvidia"></i>
                  <i className="bi bi-apple"></i>
                  <i className="bi bi-google"></i>
                  <i className="bi bi-microsoft"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats */}


      <BootcampBanner />
      <OutdoorActivityBanner />

      {/* Features Section */}
      <section className="features-modern reveal">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Features</div>
            <h2 className="section-title-modern">Everything You Need</h2>
            <p>Our comprehensive platform provides all the tools and support you need to reach your fitness goals.</p>
          </div>
          
          {/* Interactive Feature Tabs */}
          <div className="feature-tabs">
            <div className="tabs-container">
              <button
                className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                <i className="bi bi-star-fill"></i> All Features
              </button>
              <button
                className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="bi bi-graph-up"></i> Smart Analytics
              </button>
              <button
                className={`tab-button ${activeTab === 'plans' ? 'active' : ''}`}
                onClick={() => setActiveTab('plans')}
              >
                <i className="bi bi-lightning-charge"></i> Custom Plans
              </button>
              <button
                className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
                onClick={() => setActiveTab('community')}
              >
                <i className="bi bi-people"></i> Community
              </button>
            </div>
          </div>
          
          <div className="features-grid">
            {activeTab === 'features' || activeTab === 'analytics' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-graph-up-arrow"></i></div>
                <div className="feature-tag">Smart Tech</div>
                <h3>Smart Analytics</h3>
                <p>Advanced tracking with expert insights to optimize your workout performance and track progress in real-time.</p>
                <div className="feature-highlight">Real-time tracking</div>
              </div>
            ) : null}
            
            {activeTab === 'features' || activeTab === 'plans' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-lightning-charge-fill"></i></div>
                <div className="feature-tag">Personalized</div>
                <h3>Custom Plans</h3>
                <p>Personalized workout routines created by your dedicated trainer based on your goals and fitness level.</p>
                <div className="feature-highlight">Trainer-designed</div>
              </div>
            ) : null}
            
            {activeTab === 'features' || activeTab === 'community' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-people-fill"></i></div>
                <div className="feature-tag">Social</div>
                <h3>Community</h3>
                <p>Connect with like-minded enthusiasts, share progress, and get motivated by our supportive community.</p>
                <div className="feature-highlight">Community driven</div>
              </div>
            ) : null}
            
            {activeTab === 'analytics' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-bar-chart-line"></i></div>
                <div className="feature-tag">Performance</div>
                <h3>Progress Tracking</h3>
                <p>Detailed analytics and visualizations to monitor your fitness journey and celebrate milestones.</p>
                <div className="feature-highlight">Data visualization</div>
              </div>
            ) : null}
            
            {activeTab === 'plans' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-calendar-check"></i></div>
                <div className="feature-tag">Efficiency</div>
                <h3>Workout Scheduling</h3>
                <p>Intelligent scheduling that adapts to your availability and optimizes your training routine.</p>
                <div className="feature-highlight">Smart scheduling</div>
              </div>
            ) : null}
            
            {activeTab === 'community' ? (
              <div className="feature-card-modern">
                <div className="feature-card-glass"></div>
                <div className="feature-icon-modern"><i className="bi bi-chat-dots"></i></div>
                <div className="feature-tag">Engagement</div>
                <h3>Social Features</h3>
                <p>Share achievements, join challenges, and connect with friends to stay motivated together.</p>
                <div className="feature-highlight">Social integration</div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Minimalist How It Works */}
      <section className="minimal-how-it-works reveal">
        <div className="container">
          <div className="minimal-section-header">
            <h2 className="minimal-section-title">How It Works</h2>
            <p className="minimal-section-subtitle">Three Simple Steps to Success</p>
          </div>
          
          <div className="minimal-steps-grid">
            <div className="minimal-step-item reveal">
              <div className="minimal-step-number">01</div>
              <div className="minimal-step-content">
                <h3 className="minimal-step-title">Create Profile</h3>
                <p className="minimal-step-description">Sign up and set your fitness goals. Our expert trainer will create a personalized workout plan just for you.</p>
              </div>
            </div>

            <div className="minimal-step-item reveal">
              <div className="minimal-step-number">02</div>
              <div className="minimal-step-content">
                <h3 className="minimal-step-title">Track Progress</h3>
                <p className="minimal-step-description">Log your workouts and monitor your progress with our advanced analytics tools and expert feedback.</p>
              </div>
            </div>

            <div className="minimal-step-item reveal">
              <div className="minimal-step-number">03</div>
              <div className="minimal-step-content">
                <h3 className="minimal-step-title">Achieve Goals</h3>
                <p className="minimal-step-description">Stay motivated, hit your milestones, and celebrate your success with our supportive community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Testimonials Section */}
      <section className="minimal-testimonials reveal">
        <div className="container">
          <div className="minimal-testimonials-header">
            <h2 className="minimal-testimonials-title">Real Stories</h2>
            <p className="minimal-testimonials-subtitle">Transformations That Inspire</p>
          </div>
          
          <div className="minimal-testimonials-grid">
            <div className="minimal-testimonial-card reveal">
              <p className="minimal-testimonial-text">
                "The community features and achievement system make fitness fun! I've lost 30 pounds and gained confidence I never thought possible."
              </p>
              <div className="minimal-testimonial-author">
                <h4 className="minimal-author-name">Mike Chen</h4>
                <span className="minimal-author-role">Weight Loss Success</span>
              </div>
            </div>

            <div className="minimal-testimonial-card reveal">
              <p className="minimal-testimonial-text">
                "As a personal trainer, I recommend iFitness to all my clients. The analytics are top-notch and help me track their progress effectively."
              </p>
              <div className="minimal-testimonial-author">
                <h4 className="minimal-author-name">Emma Rodriguez</h4>
                <span className="minimal-author-role">Personal Trainer</span>
              </div>
            </div>

            <div className="minimal-testimonial-card reveal">
              <p className="minimal-testimonial-text">
                "The personalized workout plans and real-time feedback have completely transformed my fitness journey. I've never felt stronger!"
              </p>
              <div className="minimal-testimonial-author">
                <h4 className="minimal-author-name">Sarah Johnson</h4>
                <span className="minimal-author-role">Fitness Enthusiast</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery Modal Overlay */}
      {showGallery && (
        <div className="home-gallery-overlay" onClick={() => setShowGallery(false)}>
          <div className="home-gallery-modal" onClick={e => e.stopPropagation()}>
            <div className="gallery-modal-header">
              <h2>Expert Workout Videos</h2>
              <button className="close-gallery" onClick={() => setShowGallery(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="gallery-modal-body">
              <div className="home-video-grid">
                {VIDEOS.map(video => (
                  <div key={video.id} className="home-video-card" onClick={() => setSelectedVideo(video)}>
                    <div className="home-video-thumb">
                      <img src={video.thumbnail} alt={video.title} />
                      <div className="home-video-play">
                        <i className="bi bi-play-fill"></i>
                      </div>
                      <span className="home-video-time">{video.duration}</span>
                    </div>
                    <div className="home-video-details">
                      <span className="home-video-cat">{video.category}</span>
                      <h4>{video.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="video-player-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-player-modal" onClick={e => e.stopPropagation()}>
            <button className="close-player" onClick={() => setSelectedVideo(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="player-wrapper">
              <video controls autoPlay className="main-video-player">
                <source src={selectedVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="player-details">
              <h3>{selectedVideo.title}</h3>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}