import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Account",
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your email address."
    },
    {
      id: 2,
      category: "Account",
      question: "How can I delete my account?",
      answer: "Go to Settings > Account > Delete Account. Note that all your data will be permanently deleted and cannot be recovered."
    },
    {
      id: 3,
      category: "Workouts",
      question: "How do I log a workout?",
      answer: "Navigate to Training > New Workout, select exercises, enter duration and calories, then save."
    },
    {
      id: 4,
      category: "Workouts",
      question: "Can I edit a logged workout?",
      answer: "Yes, go to your workout history, click on the workout you want to edit, and make changes. Click 'Update' to save."
    },
    {
      id: 5,
      category: "Data & Privacy",
      question: "Is my data secure?",
      answer: "We use industry-standard encryption and security measures to protect your data. See our Privacy Policy for more details."
    },
    {
      id: 6,
      category: "Data & Privacy",
      question: "Can I export my data?",
      answer: "Yes, you can request your data export from Settings > Data & Privacy. We'll prepare a file for you to download."
    },
    {
      id: 7,
      category: "Features",
      question: "What are workout templates?",
      answer: "Templates are pre-built workout routines you can use as starting points. You can customize them for your needs."
    },
    {
      id: 8,
      category: "Features",
      question: "How do I set fitness goals?",
      answer: "Go to Health > Goals, click 'Create New Goal', set your target, deadline, and start tracking your progress."
    },
    {
      id: 9,
      category: "Technical",
      question: "What browsers do you support?",
      answer: "We support the latest versions of Chrome, Firefox, Safari, and Edge. For best performance, keep your browser updated."
    },
    {
      id: 10,
      category: "Technical",
      question: "Is there a mobile app?",
      answer: "Yes, ifitness is available on both iOS and Android. Download from your device's app store."
    }
  ];

  const categories = ["All", ...new Set(faqs.map(faq => faq.category))];

  const filteredFAQs = faqs.filter(faq => 
    searchQuery === '' ? true : faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="container py-5">
        <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="mb-3">Help Center</h1>
          <p className="lead text-muted mb-4">Find answers to your questions</p>
          
          <div className="input-group input-group-lg">
            <span className="input-group-text border-0 bg-light">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-0 bg-light" 
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category) => (
                <button key={category} className="btn btn-sm btn-outline-primary">
                  {category}
                </button>
              ))}
            </div>
          </div>

          <h3 className="h5 mb-4">Frequently Asked Questions</h3>
          <div className="accordion" id="faqAccordion">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="accordion-item border-0 shadow-sm mb-3">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    aria-expanded={expandedFAQ === faq.id}
                  >
                    <span className="badge bg-light text-dark me-2">{faq.category}</span>
                    {faq.question}
                  </button>
                </h2>
                {expandedFAQ === faq.id && (
                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-file-earmark fs-3 text-primary mb-3"></i>
                  <h5 className="card-title">Documentation</h5>
                  <p className="card-text text-muted small mb-3">
                    Learn how to use all features with our comprehensive guide.
                  </p>
                  <a href="/documentation" className="btn btn-sm btn-outline-primary">
                    Read Docs
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-envelope fs-3 text-primary mb-3"></i>
                  <h5 className="card-title">Contact Support</h5>
                  <p className="card-text text-muted small mb-3">
                    Can't find the answer? Get in touch with our support team.
                  </p>
                  <a href="/contact" className="btn btn-sm btn-outline-primary">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
