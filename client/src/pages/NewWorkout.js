import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { createWorkout, getExercises } from '../services/api';
import './WorkoutForm.css';

const WORKOUT_TEMPLATES = [
  {
    id: 1,
    name: 'BEGINNER_FULL_BODY',
    desc: 'Total body protocol for initial calibration',
    duration: 45,
    difficulty: 'BEGINNER',
    icon: 'bi-brightness-low',
  },
  {
    id: 2,
    name: 'FORCE_STRENGTH',
    desc: 'Focus on primary force production nodes',
    duration: 60,
    difficulty: 'INTERMEDIATE',
    icon: 'bi-hammer',
  },
  {
    id: 3,
    name: 'ENERGY_BURN_HIIT',
    desc: 'High intensity metabolic conditioning',
    duration: 30,
    difficulty: 'INTERMEDIATE',
    icon: 'bi-fire',
  },
  {
    id: 4,
    name: 'FLEX_SYNCHRONIZATION',
    desc: 'Improve range of motion and stress reduction',
    duration: 40,
    difficulty: 'BEGINNER',
    icon: 'bi-flower1',
  },
  {
    id: 5,
    name: 'ELITE_HIIT_PROTOCOL',
    desc: 'Maximum intensity interval training',
    duration: 30,
    difficulty: 'ADVANCED',
    icon: 'bi-lightning-charge',
  },
];

export default function NewWorkout() {
  const navigate = useNavigate();
  const { startWorkout } = useWorkout();

  const handleSelectTemplate = (template) => {
    startWorkout({
      name: template.name,
      description: template.desc,
      duration: template.duration,
    });
    navigate('/workouts');
  };

  const handleCustomWorkout = () => {
    startWorkout({
      name: 'CUSTOM_PROTOCOL',
      description: 'USER_DEFINED_SEQUENCE',
      duration: 30,
    });
    navigate('/workouts');
  };

  return (
    <div className="workout-form-page fusion-theme">
      <div className="container">
        <div className="form-header-modern">
          <h1>SELECT_PROTOCOL</h1>
          <p>Initialize a pre-configured template or architect a custom training sequence</p>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold mb-4 text-uppercase small tracking-wider text-muted">RECOMMENDED_SESSIONS</h5>
          <div className="template-grid-modern">
            {WORKOUT_TEMPLATES.map((template) => (
              <div key={template.id} className="template-card-small fusion-card" onClick={() => handleSelectTemplate(template)}>
                <div className="icon-box">
                  <i className={`bi ${template.icon}`}></i>
                </div>
                <h5>{template.name}</h5>
                <p>{template.desc}</p>
                <div className="template-meta-pills">
                  <span className="meta-pill-sm">
                    <i className="bi bi-clock me-1"></i> {template.duration}M
                  </span>
                  <span className="meta-pill-sm">{template.difficulty}</span>
                </div>
                <button className="btn-start-now mt-auto">
                  INITIATE_SESSION
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="custom-actions-modern">
          <button className="btn-custom-main btn-fusion" onClick={handleCustomWorkout}>
            <i className="bi bi-plus-circle-fill"></i> ARCHITECT_CUSTOM
          </button>
          <button className="btn-custom-main btn-fusion-outline" onClick={() => navigate('/templates')}>
            <i className="bi bi-grid-3x3-gap-fill"></i> ARCHIVE_TEMPLATES
          </button>
        </div>
      </div>
    </div>
  );
}
