import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import TopNewsletterFooter from '../components/TopNewsletterFooter';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: 'How quickly will I receive a response?',
      answer: 'We strive to respond to all inquiries within 24-48 hours. Support tickets typically receive responses within 12-24 hours, while sales inquiries are usually addressed within 2-4 hours during business hours.'
    },
    {
      question: 'What information should I include in my message?',
      answer: 'Please include your name, contact information, and a detailed description of your question or issue. The more information you provide, the better we can assist you.'
    },
    {
      question: 'Can I contact you by phone?',
      answer: 'Yes, you can reach us by phone at +1 (555) 123-4567 during our business hours (Monday-Friday, 9AM-5PM EST). For urgent matters outside these hours, please use our contact form.'
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Absolutely! Our technical support team is available to help with any issues related to our platform, account setup, or troubleshooting. Please provide as much detail as possible about the problem you\'re experiencing.'
    },
    {
      question: 'How can I provide feedback about your services?',
      answer: 'We welcome all feedback! You can use this contact form to share your thoughts, suggestions, or concerns. Your feedback helps us improve our services and better serve our community.'
    },
    {
      question: 'What are your business hours?',
      answer: 'Our main business hours are Monday-Friday, 9AM-5PM EST. However, our online contact form is available 24/7, and we monitor urgent inquiries outside of regular business hours.'
    }
  ];

  const officeLocations = [
    {
      city: 'New York',
      address: '123 Fitness Ave, Suite 200, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'ny@ifitness.com'
    },
    {
      city: 'San Francisco',
      address: '456 Health Blvd, Floor 3, San Francisco, CA 94105',
      phone: '+1 (555) 234-5678',
      email: 'sf@ifitness.com'
    },
    {
      city: 'Chicago',
      address: '789 Wellness St, Suite 150, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
      email: 'chicago@ifitness.com'
    }
  ];

  return (
    <>
      <PageTransition>
        <div className="modern-contact-page">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Get in Touch</span>
                  </div>
                  <h1 className="hero-title">
                    Connect With Our Fitness Experts
                    <span className="gradient-text"> Today!</span>
                  </h1>
                  <p className="hero-description">
                    Have questions or need assistance? Our dedicated team is here to help you achieve your fitness goals. Reach out and let's start your journey together!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Methods Section */}
          <section className="contact-methods-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Contact Options</span>
                  </div>
                  <h2 className="section-title">Multiple Ways to Reach Us</h2>
                  <p className="section-description">
                    Choose the contact method that works best for you. We're available through various channels to ensure you get the support you need.
                  </p>
                </div>
              </div>
              <div className="contact-methods-grid">
                <div className="contact-method-card">
                  <div className="contact-method-icon">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <h3>Email Support</h3>
                  <p>Get detailed assistance through our email support channel.</p>
                  <a href="mailto:support@ifitness.com" className="contact-method-link">
                    <i className="bi bi-send"></i>
                    <span>Email Us</span>
                  </a>
                </div>
                <div className="contact-method-card">
                  <div className="contact-method-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <h3>Phone Support</h3>
                  <p>Speak directly with our support team during business hours.</p>
                  <a href="tel:+15551234567" className="contact-method-link">
                    <i className="bi bi-phone"></i>
                    <span>Call Now</span>
                  </a>
                </div>
                <div className="contact-method-card">
                  <div className="contact-method-icon">
                    <i className="bi bi-chat-dots"></i>
                  </div>
                  <h3>Live Chat</h3>
                  <p>Get instant answers through our live chat feature.</p>
                  <a href="/dashboard" className="contact-method-link">
                    <i className="bi bi-message-square"></i>
                    <span>Chat Now</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="contact-form-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="contact-form-card">
                    <div className="contact-form-header">
                      <div className="section-badge">
                        <span>Contact Form</span>
                      </div>
                      <h2 className="section-title">Send Us a Message</h2>
                      <p className="section-description">
                        Fill out the form below and our team will get back to you as soon as possible. We're here to help!
                      </p>
                    </div>

                    {submitted && (
                      <div className="form-success-message">
                        <div className="success-icon">
                          <i className="bi bi-check-circle"></i>
                        </div>
                        <h3>Thank You!</h3>
                        <p>We've received your message and will get back to you soon.</p>
                      </div>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="btn-submit">
                        <i className="bi bi-send"></i>
                        <span>Send Message</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>FAQ</span>
                  </div>
                  <h2 className="section-title">Frequently Asked Questions</h2>
                  <p className="section-description">
                    Find answers to common questions about our services, support, and contact process.
                  </p>
                </div>
              </div>
              <div className="faq-grid">
                {faqItems.map((item, index) => (
                  <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                    <div className="faq-question" onClick={() => toggleFaq(index)}>
                      <h3>{item.question}</h3>
                      <i className="bi bi-chevron-down"></i>
                    </div>
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Office Locations Section */}
          <section className="office-locations-section">
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center">
                  <div className="section-badge">
                    <span>Our Locations</span>
                  </div>
                  <h2 className="section-title">Visit Our Offices</h2>
                  <p className="section-description">
                    We have offices in major cities across the country. Feel free to visit us during business hours.
                  </p>
                </div>
              </div>
              <div className="locations-grid">
                {officeLocations.map((location, index) => (
                  <div key={index} className="location-card">
                    <div className="location-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <h3>{location.city}</h3>
                    <p><strong>Address:</strong> {location.address}</p>
                    <p><strong>Phone:</strong> {location.phone}</p>
                    <p><strong>Email:</strong> {location.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <div className="cta-bg-pattern"></div>
                <div className="row">
                  <div className="col-lg-8 mx-auto text-center">
                    <h2 className="cta-title">Ready to Transform Your Fitness Journey?</h2>
                    <p className="cta-description">
                      Join thousands of satisfied users who have achieved their fitness goals with our comprehensive platform and expert support.
                    </p>
                    <div className="cta-buttons">
                      <a href="/register" className="btn-primary-modern large">
                        <span>Get Started</span>
                        <i className="bi bi-person-plus"></i>
                      </a>
                      <a href="/dashboard" className="btn-secondary-modern large">
                        <i className="bi bi-arrow-right"></i>
                        <span>Explore Dashboard</span>
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
