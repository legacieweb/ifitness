import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="mb-3">Get in Touch</h1>
          <p className="lead text-muted">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mx-auto mb-5">
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-envelope fs-3 text-primary mb-3"></i>
                  <h5 className="card-title">Email</h5>
                  <p className="card-text">
                    <a href="mailto:support@ifitness.com">support@ifitness.com</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-telephone fs-3 text-primary mb-3"></i>
                  <h5 className="card-title">Phone</h5>
                  <p className="card-text">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {submitted && (
            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
              <strong>Thank you!</strong> We've received your message and will get back to you soon.
            </div>
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Send us a Message</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
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
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
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
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
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
                <div className="mb-4">
                  <label htmlFor="message" className="form-label">Message</label>
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
                <button type="submit" className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="mt-5 p-4 bg-light rounded">
            <h6 className="mb-3">Response Times</h6>
            <ul className="mb-0 small">
              <li>General inquiries: 24-48 hours</li>
              <li>Support tickets: 12-24 hours</li>
              <li>Sales inquiries: 2-4 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
