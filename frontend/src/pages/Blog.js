import React from 'react';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "10 Tips for Effective Workout Tracking",
      date: "December 15, 2024",
      author: "Sarah Johnson",
      excerpt: "Learn how to get the most out of tracking your workouts and stay motivated on your fitness journey.",
      category: "Tips"
    },
    {
      id: 2,
      title: "The Importance of Setting Fitness Goals",
      date: "December 10, 2024",
      author: "Mike Chen",
      excerpt: "Discover why having clear fitness goals is crucial for long-term success and how to set them effectively.",
      category: "Goals"
    },
    {
      id: 3,
      title: "Nutrition and Exercise: The Perfect Balance",
      date: "December 5, 2024",
      author: "Emma Davis",
      excerpt: "Explore the relationship between proper nutrition and exercise performance for optimal results.",
      category: "Nutrition"
    },
    {
      id: 4,
      title: "New Features in ifitness v2.0",
      date: "November 28, 2024",
      author: "Tech Team",
      excerpt: "Check out the latest features and improvements we've added to make your fitness tracking experience better.",
      category: "Updates"
    },
    {
      id: 5,
      title: "Success Stories: Real Users, Real Results",
      date: "November 20, 2024",
      author: "Community Manager",
      excerpt: "Read inspiring stories from our community members who have achieved their fitness goals using ifitness.",
      category: "Community"
    },
    {
      id: 6,
      title: "Beginner's Guide to Home Workouts",
      date: "November 15, 2024",
      author: "Alex Thompson",
      excerpt: "Start your fitness journey without leaving home. Here's a complete guide for beginners.",
      category: "Workouts"
    }
  ];

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h1 className="mb-2">ifitness Blog</h1>
          <p className="text-muted mb-4">Tips, tricks, and insights from our fitness community</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          {posts.map((post) => (
            <div key={post.id} className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <div className="mb-2">
                  <span className="badge bg-primary">{post.category}</span>
                </div>
                <h3 className="card-title h5 mb-2">{post.title}</h3>
                <p className="card-text text-muted small mb-3">
                  By {post.author} • {post.date}
                </p>
                <p className="card-text">{post.excerpt}</p>
                <a href="/" className="btn btn-sm btn-outline-primary">
                  Read More →
                </a>
              </div>
            </div>
          ))}

          <div className="text-center mt-5">
            <button className="btn btn-primary">Load More Articles</button>
          </div>
        </div>
      </div>
    </div>
  );
}
