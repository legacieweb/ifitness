import React from 'react';
import PageTransition from '../components/PageTransition';

export default function AboutUs() {
  return (
    <PageTransition>
      <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="mb-4">About Us</h1>

          <section className="mb-5">
            <h2 className="h4 mb-3">Our Mission</h2>
            <p>
              At ifitness, our mission is to empower individuals to take control of their fitness journey by providing intuitive tools for tracking workouts, monitoring progress, and achieving their health goals.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h4 mb-3">Who We Are</h2>
            <p>
              ifitness is a dedicated team of fitness enthusiasts, software engineers, and health professionals committed to making fitness tracking accessible and engaging for everyone. We believe that everyone deserves the tools to monitor their progress and achieve their fitness goals.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h4 mb-3">Our Story</h2>
            <p>
              Founded in 2024, ifitness was created out of frustration with complex, cluttered fitness apps. We wanted to build something simple, clean, and effective—a platform where tracking workouts feels effortless, not burdensome.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h4 mb-3">What We Offer</h2>
            <ul className="mb-3">
              <li><strong>Workout Tracking:</strong> Log exercises with details like duration, intensity, and calories burned</li>
              <li><strong>Progress Analytics:</strong> Visualize your fitness journey with comprehensive analytics and charts</li>
              <li><strong>Workout Templates:</strong> Get started quickly with pre-built workout templates</li>
              <li><strong>Goal Setting:</strong> Define and track personal fitness goals</li>
              <li><strong>User Profiles:</strong> Maintain personalized health information and fitness metrics</li>
              <li><strong>Community:</strong> Connect with other fitness enthusiasts and share your journey</li>
            </ul>
          </section>

          <section className="mb-5">
            <h2 className="h4 mb-3">Our Values</h2>
            <ul className="mb-3">
              <li><strong>Simplicity:</strong> We believe fitness tracking should be simple and intuitive</li>
              <li><strong>Privacy:</strong> Your data is yours. We prioritize your privacy and security</li>
              <li><strong>Transparency:</strong> We're honest about what we do and how we do it</li>
              <li><strong>Innovation:</strong> We continuously improve to serve you better</li>
              <li><strong>Community:</strong> We build for and with our users</li>
            </ul>
          </section>

          <section className="mb-5">
            <h2 className="h4 mb-3">Get in Touch</h2>
            <p>
              Have questions or feedback? We'd love to hear from you. Reach out to our team at <a href="mailto:hello@ifitness.com">hello@ifitness.com</a>.
            </p>
          </section>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
