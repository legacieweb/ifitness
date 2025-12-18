import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorkout, getExercises } from '../services/api';

const WORKOUT_TEMPLATES = [
  {
    id: 1,
    name: 'Beginner Full Body',
    desc: 'Total body workout perfect for starters',
    duration: 45,
    difficulty: 'Beginner',
    icon: '🌱',
  },
  {
    id: 2,
    name: 'Upper Body Strength',
    desc: 'Focus on chest, shoulders, and arms',
    duration: 60,
    difficulty: 'Intermediate',
    icon: '💪',
  },
  {
    id: 3,
    name: 'Cardio Blast',
    desc: 'High intensity cardio for max calorie burn',
    duration: 30,
    difficulty: 'Intermediate',
    icon: '🔥',
  },
  {
    id: 4,
    name: 'Yoga & Flexibility',
    desc: 'Improve flexibility and reduce stress',
    duration: 40,
    difficulty: 'Beginner',
    icon: '🧘',
  },
  {
    id: 5,
    name: 'HIIT Workout',
    desc: 'High Intensity Interval Training',
    duration: 30,
    difficulty: 'Advanced',
    icon: '⚡',
  },
  {
    id: 6,
    name: 'Lower Body Power',
    desc: 'Build leg strength and endurance',
    duration: 50,
    difficulty: 'Intermediate',
    icon: '🦵',
  },
  {
    id: 7,
    name: 'Core & Abs',
    desc: 'Strengthen your core with targeted exercises',
    duration: 35,
    difficulty: 'Beginner',
    icon: '🎯',
  },
  {
    id: 8,
    name: 'Full Body HIIT',
    desc: 'Total body high intensity training',
    duration: 40,
    difficulty: 'Advanced',
    icon: '🚀',
  },
  {
    id: 9,
    name: 'Pilates & Core',
    desc: 'Low impact core strengthening routine',
    duration: 45,
    difficulty: 'Intermediate',
    icon: '🏋️',
  },
  {
    id: 10,
    name: 'Swimming Session',
    desc: 'Full body workout in the water',
    duration: 60,
    difficulty: 'Intermediate',
    icon: '🏊',
  },
  {
    id: 11,
    name: 'Stretching & Recovery',
    desc: 'Reduce soreness and improve flexibility',
    duration: 25,
    difficulty: 'Beginner',
    icon: '🕐',
  },
  {
    id: 12,
    name: 'Boxing Training',
    desc: 'High energy boxing workout',
    duration: 45,
    difficulty: 'Intermediate',
    icon: '🥊',
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
    <div className="container-fluid container-md mt-4 mt-md-5 mb-5 px-3 px-md-0">
      <div className="mb-5">
        <h1 className="mb-2 fs-4 fs-md-1">Choose Your Workout</h1>
        <p className="text-muted">Pick a template or create a custom workout</p>
      </div>

      <div className="mb-5">
        <h5 className="mb-4 fw-bold">Popular Templates</h5>
        <div className="row g-3">
          {WORKOUT_TEMPLATES.map((template) => (
            <div key={template.id} className="col-12 col-sm-6 col-lg-3">
              <div
                className="card h-100 shadow-sm"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(99, 102, 241, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="card-body d-flex flex-column">
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{template.icon}</div>
                  <h5 className="card-title" style={{ fontSize: '16px', fontWeight: 700 }}>
                    {template.name}
                  </h5>
                  <p className="card-text text-muted small" style={{ fontSize: '13px' }}>
                    {template.desc}
                  </p>
                  <div className="my-3">
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#f0f0f0',
                        color: '#666',
                        marginRight: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <i className="bi bi-clock"></i> {template.duration} min
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          template.difficulty === 'Beginner'
                            ? '#d1fae5'
                            : template.difficulty === 'Intermediate'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          template.difficulty === 'Beginner'
                            ? '#065f46'
                            : template.difficulty === 'Intermediate'
                            ? '#92400e'
                            : '#7f1d1d',
                        fontSize: '12px',
                      }}
                    >
                      {template.difficulty}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm mt-auto"
                    style={{
                      backgroundColor: '#6366f1',
                      color: 'white',
                      border: 'none',
                      fontWeight: 600,
                    }}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <i className="bi bi-play-fill"></i> Start Workout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-sm-6">
          <button
            className="btn w-100"
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '12px',
              fontWeight: 600,
              fontSize: '16px',
              border: 'none',
            }}
            onClick={handleCustomWorkout}
          >
            <i className="bi bi-plus-circle"></i> Create Custom Workout
          </button>
        </div>
        <div className="col-12 col-sm-6">
          <button
            className="btn w-100"
            style={{
              backgroundColor: 'transparent',
              color: '#6366f1',
              padding: '12px',
              fontWeight: 600,
              fontSize: '16px',
              border: '2px solid #6366f1',
            }}
            onClick={() => navigate('/templates')}
          >
            <i className="bi bi-layout-text-window"></i> View More Templates
          </button>
        </div>
      </div>
    </div>
  );
}
