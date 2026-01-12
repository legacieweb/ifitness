import React from 'react';
import PageTransition from '../components/PageTransition';
import TopNewsletterFooter from '../components/TopNewsletterFooter';
import './Blog.css';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "10 Tips for Effective Workout Tracking",
      date: "December 15, 2024",
      author: "Sarah Johnson",
      excerpt: "Learn how to get the most out of tracking your workouts and stay motivated on your fitness journey.",
      category: "Tips",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "The Importance of Setting Fitness Goals",
      date: "December 10, 2024",
      author: "Mike Chen",
      excerpt: "Discover why having clear fitness goals is crucial for long-term success and how to set them effectively.",
      category: "Goals",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Nutrition and Exercise: The Perfect Balance",
      date: "December 5, 2024",
      author: "Emma Davis",
      excerpt: "Explore the relationship between proper nutrition and exercise performance for optimal results.",
      category: "Nutrition",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "New Features in ifitness v2.0",
      date: "November 28, 2024",
      author: "Tech Team",
      excerpt: "Check out the latest features and improvements we've added to make your fitness tracking experience better.",
      category: "Updates",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Success Stories: Real Users, Real Results",
      date: "November 20, 2024",
      author: "Community Manager",
      excerpt: "Read inspiring stories from our community members who have achieved their fitness goals using ifitness.",
      category: "Community",
      image: "https://images.unsplash.com/photo-1506629905607-d405b7a22a6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Beginner's Guide to Home Workouts",
      date: "November 15, 2024",
      author: "Alex Thompson",
      excerpt: "Start your fitness journey without leaving home. Here's a complete guide for beginners.",
      category: "Workouts",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <>
      <PageTransition>
        <div className="modern-blog-page">
          <section className="hero-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Our Blog</span>
                  </div>
                  <h1 className="hero-title">
                    Fitness Insights & Inspiration
                    <span className="gradient-text">for Your Journey</span>
                  </h1>
                  <p className="hero-description">
                    Discover expert tips, success stories, and the latest fitness trends to help you achieve your health goals.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="featured-post-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="featured-post-card">
                    <div className="featured-post-image">
                      <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Featured post" />
                    </div>
                    <div className="featured-post-content">
                      <div className="post-meta">
                        <span className="post-category">Featured</span>
                        <span className="post-date">December 15, 2024</span>
                        <span className="post-author">By Sarah Johnson</span>
                      </div>
                      <h2 className="featured-post-title">10 Tips for Effective Workout Tracking</h2>
                      <p className="featured-post-excerpt">
                        Learn how to get the most out of tracking your workouts and stay motivated on your fitness journey with these expert tips.
                      </p>
                      <a href="/" className="btn-read-more">
                        <span>Read Article</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="posts-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <h2 className="section-title">Latest Articles</h2>
                  <p className="section-description">
                    Stay up-to-date with our newest fitness insights, tips, and community stories.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="posts-grid">
                    {posts.map((post) => (
                      <div key={post.id} className="post-card">
                        <div className="post-image">
                          <img src={post.image} alt={post.title} />
                          <div className="post-category-badge">
                            <span>{post.category}</span>
                          </div>
                        </div>
                        <div className="post-content">
                          <div className="post-meta">
                            <span className="post-date">{post.date}</span>
                            <span className="post-author">By {post.author}</span>
                          </div>
                          <h3 className="post-title">{post.title}</h3>
                          <p className="post-excerpt">{post.excerpt}</p>
                          <a href="/" className="btn-read-more">
                            <span>Read More</span>
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

          <section className="categories-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <h2 className="section-title">Explore Categories</h2>
                  <div className="categories-grid">
                    <div className="category-card">
                      <div className="category-icon">
                        <i className="bi bi-lightning-charge"></i>
                      </div>
                      <h3>Workout Tips</h3>
                      <p>Expert advice to maximize your training sessions</p>
                    </div>
                    <div className="category-card">
                      <div className="category-icon">
                        <i className="bi bi-target"></i>
                      </div>
                      <h3>Goal Setting</h3>
                      <p>Strategies for achieving your fitness objectives</p>
                    </div>
                    <div className="category-card">
                      <div className="category-icon">
                        <i className="bi bi-nutrition"></i>
                      </div>
                      <h3>Nutrition</h3>
                      <p>Fuel your body with the right foods</p>
                    </div>
                    <div className="category-card">
                      <div className="category-icon">
                        <i className="bi bi-people"></i>
                      </div>
                      <h3>Community</h3>
                      <p>Inspiring stories from our members</p>
                    </div>
                    <div className="category-card">
                      <div className="category-icon">
                        <i className="bi bi-graph-up"></i>
                      </div>
                      <h3>Progress</h3>
                      <p>Track and celebrate your achievements</p>
                    </div>
                    <div className="category-card">
                      <div className="category-icon">
                        <i className="bi bi-gear"></i>
                      </div>
                      <h3>Tech Updates</h3>
                      <p>Latest features and improvements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="newsletter-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="newsletter-card">
                    <div className="newsletter-content">
                      <h2 className="newsletter-title">Stay Updated</h2>
                      <p className="newsletter-description">
                        Subscribe to our newsletter for the latest fitness tips, articles, and exclusive content delivered straight to your inbox.
                      </p>
                      <div className="newsletter-form">
                        <input type="email" placeholder="Enter your email address" />
                        <button type="submit" className="btn-subscribe">
                          <span>Subscribe</span>
                          <i className="bi bi-send"></i>
                        </button>
                      </div>
                      <p className="newsletter-disclaimer">
                        We respect your privacy. No spam, ever.
                      </p>
                    </div>
                    <div className="newsletter-visual">
                      <div className="newsletter-illustration">
                        <i className="bi bi-envelope-paper"></i>
                      </div>
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
