import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Templates.css';

export default function Templates() {
  const navigate = useNavigate();
  const [templates] = useState([
    {
      id: 1,
      name: 'Beginner Full Body',
      desc: 'Great for starters - Total Body workout targeting all major muscle groups.',
      duration: 45,
      difficulty: 'Beginner',
      exercises: ['Push-ups', 'Squats', 'Plank', 'Running'],
      icon: 'bi-brightness-low',
    },
    {
      id: 2,
      name: 'Upper Body Strength',
      desc: 'Focus on chest, shoulders, and arms to build definition and power.',
      duration: 60,
      difficulty: 'Intermediate',
      exercises: ['Bench Press', 'Push-ups', 'Barbell Squat'],
      icon: 'bi-hammer',
    },
    {
      id: 3,
      name: 'Cardio Blast',
      desc: 'High intensity cardio sessions designed for maximum calorie burn.',
      duration: 30,
      difficulty: 'Intermediate',
      exercises: ['Running', 'Cycling', 'Swimming'],
      icon: 'bi-fire',
    },
    {
      id: 4,
      name: 'Yoga & Flexibility',
      desc: 'Improve your range of motion and reduce stress with these flowing moves.',
      duration: 40,
      difficulty: 'Beginner',
      exercises: ['Yoga', 'Stretching'],
      icon: 'bi-flower1',
    },
    {
      id: 5,
      name: 'HIIT Workout',
      desc: 'Short bursts of intense exercise followed by quick recovery periods.',
      duration: 30,
      difficulty: 'Advanced',
      exercises: ['Burpees', 'Jump Squats', 'Push-ups'],
      icon: 'bi-lightning-charge',
    },
    {
      id: 6,
      name: 'Lower Body Power',
      desc: 'Build explosive leg strength and lower body endurance.',
      duration: 50,
      difficulty: 'Intermediate',
      exercises: ['Squats', 'Deadlift', 'Barbell Squat'],
      icon: 'bi-person-walking',
    },
  ]);

  const startTemplate = (template) => {
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/workouts/new');
  };

  return (
    <div className="templates-page">
      <div className="container">
        <div className="template-header">
          <h1>Workout Templates</h1>
          <p>Choose a pre-built workout plan to get started on your goals today</p>
        </div>

        <div className="row g-4">
          {templates.map((template) => (
            <div key={template.id} className="col-md-6 col-lg-4">
              <div className="template-card-modern">
                <div className="template-icon-wrapper">
                  <i className={`bi ${template.icon}`}></i>
                </div>
                <h3 className="template-title">{template.name}</h3>
                <p className="template-desc">{template.desc}</p>

                <div className="template-pills">
                  <span className="template-pill pill-duration">
                    <i className="bi bi-clock me-2"></i>
                    {template.duration} min
                  </span>
                  <span className={`template-pill pill-${template.difficulty.toLowerCase()}`}>
                    {template.difficulty}
                  </span>
                </div>

                <div className="flex-grow-1">
                  <span className="template-exercises-title">Included Exercises</span>
                  <div className="template-exercise-tags">
                    {template.exercises.map((ex, idx) => (
                      <span key={idx} className="exercise-tag">{ex}</span>
                    ))}
                  </div>
                </div>

                <button className="btn-use-template" onClick={() => startTemplate(template)}>
                  Use This Template <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="how-to-card">
          <h3><i className="bi bi-lightbulb-fill"></i> How to Use Templates</h3>
          <div className="how-to-list">
            <div className="how-to-item">
              <div className="how-to-number">1</div>
              <div className="how-to-text">Choose a template that matches your current fitness level and goals.</div>
            </div>
            <div className="how-to-item">
              <div className="how-to-number">2</div>
              <div className="how-to-text">Click "Use This Template" to automatically load the exercises.</div>
            </div>
            <div className="how-to-item">
              <div className="how-to-number">3</div>
              <div className="how-to-text">Adjust sets, reps, and weights to customize the challenge for yourself.</div>
            </div>
            <div className="how-to-item">
              <div className="how-to-number">4</div>
              <div className="how-to-text">Complete and log your workout to track your progress over time.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
