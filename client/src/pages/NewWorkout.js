import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorkout, getExercises } from '../services/api';
import './WorkoutForm.css';

const WORKOUT_TEMPLATES = [
  {
    id: 1,
    name: 'Beginner Full Body',
    desc: 'Total body workout perfect for starters',
    duration: 45,
    difficulty: 'Beginner',
    icon: 'bi-brightness-low',
  },
  {
    id: 2,
    name: 'Upper Body Strength',
    desc: 'Focus on chest, shoulders, and arms',
    duration: 60,
    difficulty: 'Intermediate',
    icon: 'bi-hammer',
  },
  {
    id: 3,
    name: 'Cardio Blast',
    desc: 'High intensity cardio for max calorie burn',
    duration: 30,
    difficulty: 'Intermediate',
    icon: 'bi-fire',
  },
  {
    id: 4,
    name: 'Yoga & Flexibility',
    desc: 'Improve flexibility and reduce stress',
    duration: 40,
    difficulty: 'Beginner',
    icon: 'bi-flower1',
  },
  {
    id: 5,
    name: 'HIIT Workout',
    desc: 'High Intensity Interval Training',
    duration: 30,
    difficulty: 'Advanced',
    icon: 'bi-lightning-charge',
  },
  {
    id: 6,
    name: 'Lower Body Power',
    desc: 'Build leg strength and endurance',
    duration: 50,
    difficulty: 'Intermediate',
    icon: 'bi-person-walking',
  },
  {
    id: 7,
    name: 'Core & Abs',
    desc: 'Strengthen your core with targeted moves',
    duration: 35,
    difficulty: 'Beginner',
    icon: 'bi-bullseye',
  },
  {
    id: 8,
    name: 'Full Body HIIT',
    desc: 'Total body high intensity training',
    duration: 40,
    difficulty: 'Advanced',
    icon: 'bi-rocket-takeoff',
  },
];

export default function NewWorkout() {
  const navigate = useNavigate();

  const handleSelectTemplate = (template) => {
    const selectedWorkout = {
      name: template.name,
      description: template.desc,
      duration: template.duration,
      startTime: new Date().toISOString(),
      status: 'active',
    };
    localStorage.setItem('activeWorkout', JSON.stringify(selectedWorkout));
    navigate('/dashboard');
  };

  const handleCustomWorkout = () => {
    const customWorkout = {
      name: 'Custom Workout',
      description: '',
      duration: 0,
      startTime: new Date().toISOString(),
      status: 'custom',
    };
    localStorage.setItem('activeWorkout', JSON.stringify(customWorkout));
    navigate('/dashboard');
  };

  return (
    <div className="workout-form-page">
      <div className="container">
        <div className="form-header-modern">
          <h1>Choose Your Workout</h1>
          <p>Pick a template or design your own custom training session</p>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold mb-4 text-uppercase small tracking-wider text-muted">Recommended Sessions</h5>
          <div className="template-grid-modern">
            {WORKOUT_TEMPLATES.map((template) => (
              <div key={template.id} className="template-card-small" onClick={() => handleSelectTemplate(template)}>
                <div className="icon-box">
                  <i className={`bi ${template.icon}`}></i>
                </div>
                <h5>{template.name}</h5>
                <p>{template.desc}</p>
                <div className="template-meta-pills">
                  <span className="meta-pill-sm">
                    <i className="bi bi-clock me-1"></i> {template.duration}m
                  </span>
                  <span className="meta-pill-sm">{template.difficulty}</span>
                </div>
                <button className="btn-start-now mt-auto">
                  Start Workout
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="custom-actions-modern">
          <button className="btn-custom-main btn-custom-primary" onClick={handleCustomWorkout}>
            <i className="bi bi-plus-circle-fill"></i> Create Custom Workout
          </button>
          <button className="btn-custom-main btn-custom-outline" onClick={() => navigate('/templates')}>
            <i className="bi bi-grid-3x3-gap-fill"></i> Explore All Templates
          </button>
        </div>
      </div>
    </div>
  );
}
