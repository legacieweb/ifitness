import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import './Blog.css';

export default function Blog() {
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

  const posts = [
    {
      id: 1,
      title: "PROTOCOL_ALPHA: EFFECTIVE TRACKING",
      date: "DEC_15_2024",
      author: "OPERATOR_SARAH",
      excerpt: "Technical analysis on optimizing data collection for peak performance output.",
      category: "STRATEGY",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "OBJECTIVE_SYNC: SETTING TARGETS",
      date: "DEC_10_2024",
      author: "OPERATOR_MIKE",
      excerpt: "Defining critical mission parameters for long-term physiological dominance.",
      category: "OBJECTIVES",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "BIO_FUEL: NUTRITIONAL BALANCE",
      date: "DEC_05_2024",
      author: "OPERATOR_EMMA",
      excerpt: "Calibrating metabolic intake to sustain high-intensity operational cycles.",
      category: "BIO_SYNC",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "SYSTEM_UPGRADE: IFITNESS_V2.0",
      date: "NOV_28_2024",
      author: "CORE_TECH",
      excerpt: "Deep dive into the latest architectural improvements and protocol enhancements.",
      category: "UPGRADES",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <PageTransition>
      <div className="crimson-blog">
        <div className="hero-mesh-background"></div>
        <div className="hero-noise-overlay"></div>
        <div className="footer-scanner-line"></div>

        {/* Blog Hero */}
        <section className="blog-hero">
          <div className="crimson-container">
            <div className="hero-content-modern reveal">
              <div className="hero-badge">
                <span className="badge-line"></span>
                <span className="badge-text">INTEL_FEED_ACTIVE</span>
              </div>
              
              <h1 className="hero-title">
                STRATEGIC <span className="text-crimson">INTEL</span>
                <br />
                <span className="hero-subtitle">KNOWLEDGE_IS_POWER</span>
              </h1>
              
              <p className="hero-description">
                Access encrypted reports, technical analysis, and elite protocols to optimize your training architecture.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Intel */}
        <section className="featured-intel-section">
          <div className="crimson-container">
            <div className="featured-intel-card reveal">
              <div className="intel-image-node">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Featured Intel" />
                <div className="image-overlay-tech"></div>
              </div>
              <div className="intel-content-node">
                <div className="intel-meta">
                  <span className="meta-tag crimson-glow">PRIORITY_ALPHA</span>
                  <span className="meta-info">DEC_15_2024</span>
                  <span className="meta-info">CORE_COMMAND</span>
                </div>
                <h2 className="intel-title">10 TIPS FOR EFFECTIVE PROTOCOL TRACKING</h2>
                <p className="intel-excerpt">
                  Our latest analysis reveals that inconsistent data collection is the primary bottleneck in physiological evolution. Learn the high-fidelity tracking methods used by elite operators.
                </p>
                <div className="intel-action">
                  <button className="btn-modern-primary">ACCESS_FULL_REPORT</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intel Grid */}
        <section className="intel-grid-section">
          <div className="crimson-container">
            <div className="systems-header reveal">
              <div className="systems-badge">
                <span className="badge-bullet"></span>
                <span>RECENT_TRANSMISSIONS</span>
              </div>
              <h2 className="systems-title">DECRYPTED <span className="text-crimson">LOGS</span></h2>
            </div>

            <div className="intel-matrix">
              {posts.map((post, index) => (
                <div key={post.id} className="intel-module reveal">
                  <div className="module-image">
                    <img src={post.image} alt={post.title} />
                    <div className="category-tab">{post.category}</div>
                  </div>
                  <div className="module-data">
                    <div className="data-header">
                      <span className="data-date">{post.date}</span>
                      <span className="data-author">{post.author}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <button className="btn-intel-link">
                      READ_TRANSMISSION <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intel Sync (Newsletter) */}
        <section className="intel-sync-section reveal">
          <div className="crimson-container">
            <div className="sync-node">
              <div className="sync-content">
                <h2>INTEL_SYNC <span className="text-crimson">ACTIVE</span></h2>
                <p>Subscribe to receive encrypted training protocols directly to your terminal.</p>
                <div className="sync-form">
                  <input type="email" placeholder="ENTER_EMAIL_ADDRESS" />
                  <button className="btn-modern-primary">ESTABLISH_LINK</button>
                </div>
              </div>
              <div className="sync-visual">
                <div className="scanner-circle"></div>
                <i className="bi bi-broadcast"></i>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
