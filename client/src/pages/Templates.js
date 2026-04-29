import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Templates.css';

export default function Templates() {
  const navigate = useNavigate();
  const [templates] = useState([
    {
      id: 1,
      name: 'FULL_SYSTEM_BOOT',
      desc: 'Initial system initialization - Targets all primary biometric nodes for baseline calibration.',
      duration: 45,
      difficulty: 'Beginner',
      exercises: ['Push-ups', 'Squats', 'Plank', 'Running'],
      icon: 'bi-cpu-fill',
    },
    {
      id: 2,
      name: 'UPPER_CHASSIS_OVERLOAD',
      desc: 'High-intensity calibration for chest, shoulders, and anterior kinetic chains.',
      duration: 60,
      difficulty: 'Intermediate',
      exercises: ['Bench Press', 'Push-ups', 'Barbell Squat'],
      icon: 'bi-shield-shaded',
    },
    {
      id: 3,
      name: 'KINETIC_FLUX',
      desc: 'Rapid energy expenditure protocol designed for maximum metabolic throughput.',
      duration: 30,
      difficulty: 'Intermediate',
      exercises: ['Running', 'Cycling', 'Swimming'],
      icon: 'bi-activity',
    },
    {
      id: 4,
      name: 'NEURAL_EQUILIBRIUM',
      desc: 'Structural integrity enhancement and stress-vector mitigation via controlled movement.',
      duration: 40,
      difficulty: 'Beginner',
      exercises: ['Yoga', 'Stretching'],
      icon: 'bi-infinity',
    },
    {
      id: 5,
      name: 'BURST_SYNCHRONIZATION',
      desc: 'Short-duration, high-frequency output bursts for rapid system adaptation.',
      duration: 30,
      difficulty: 'Advanced',
      exercises: ['Burpees', 'Jump Squats', 'Push-ups'],
      icon: 'bi-lightning-charge-fill',
    },
    {
      id: 6,
      name: 'LOWER_STRUT_STABILITY',
      desc: 'Power generation focus for posterior chain and locomotive support structures.',
      duration: 50,
      difficulty: 'Intermediate',
      exercises: ['Squats', 'Deadlift', 'Barbell Squat'],
      icon: 'bi-gear-wide-connected',
    },
  ]);

  const startTemplate = (template) => {
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/workouts/new');
  };

  return (
    <div className="templates-page fusion-theme">
      <div className="container">
        <div className="template-header">
          <h1>PROTOCOL_TEMPLATES</h1>
          <p>Select a pre-configured architecture to initiate your training sequence</p>
        </div>

        <div className="row g-4">
          {templates.map((template) => (
            <div key={template.id} className="col-md-6 col-lg-4">
              <div className="template-card-modern fusion-card">
                <div className="template-icon-wrapper">
                  <i className={`bi ${template.icon}`}></i>
                </div>
                <h3 className="template-title">{template.name.toUpperCase()}</h3>
                <p className="template-desc">{template.desc}</p>

                <div className="template-pills">
                  <span className="template-pill pill-duration">
                    <i className="bi bi-clock me-2"></i>
                    {template.duration} MIN
                  </span>
                  <span className={`template-pill pill-${template.difficulty.toLowerCase()}`}>
                    {template.difficulty.toUpperCase()}
                  </span>
                </div>

                <div className="flex-grow-1">
                  <span className="template-exercises-title">ACTIVE_COMPONENTS</span>
                  <div className="template-exercise-tags">
                    {template.exercises.map((ex, idx) => (
                      <span key={idx} className="exercise-tag">{ex.toUpperCase()}</span>
                    ))}
                  </div>
                </div>

                <button className="btn-use-template" onClick={() => startTemplate(template)}>
                  USE_PROTOCOL <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="how-to-card fusion-card">
          <h3><i className="bi bi-lightbulb-fill"></i> SYSTEM_OPERATIONS</h3>
          <div className="how-to-list">
            <div className="how-to-item">
              <div className="how-to-number">01</div>
              <div className="how-to-text">SELECT: Choose a protocol that aligns with current system capacity and objectives.</div>
            </div>
            <div className="how-to-item">
              <div className="how-to-number">02</div>
              <div className="how-to-text">INITIALIZE: Execute "USE_PROTOCOL" to load the component sequence.</div>
            </div>
            <div className="how-to-item">
              <div className="how-to-number">03</div>
              <div className="how-to-text">CALIBRATE: Adjust intensity parameters to ensure optimal performance yield.</div>
            </div>
            <div className="how-to-item">
              <div className="how-to-number">04</div>
              <div className="how-to-text">SYNC: Commit session data to the central archive for longitudinal analysis.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
