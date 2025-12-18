import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const navigate = useNavigate();
  const [templates] = useState([
    {
      id: 1,
      name: 'Beginner Full Body',
      desc: 'Great for starters - Total Body workout',
      duration: 45,
      difficulty: 'Beginner',
      exercises: ['Push-ups', 'Squats', 'Plank', 'Running'],
      icon: '🌱',
    },
    {
      id: 2,
      name: 'Upper Body Strength',
      desc: 'Focus on chest, shoulders, and arms',
      duration: 60,
      difficulty: 'Intermediate',
      exercises: ['Bench Press', 'Push-ups', 'Barbell Squat'],
      icon: '💪',
    },
    {
      id: 3,
      name: 'Cardio Blast',
      desc: 'High intensity cardio for max calorie burn',
      duration: 30,
      difficulty: 'Intermediate',
      exercises: ['Running', 'Cycling', 'Swimming'],
      icon: '🔥',
    },
    {
      id: 4,
      name: 'Yoga & Flexibility',
      desc: 'Improve flexibility and reduce stress',
      duration: 40,
      difficulty: 'Beginner',
      exercises: ['Yoga', 'Stretching'],
      icon: '🧘',
    },
    {
      id: 5,
      name: 'HIIT Workout',
      desc: 'High Intensity Interval Training',
      duration: 30,
      difficulty: 'Advanced',
      exercises: ['Burpees', 'Jump Squats', 'Push-ups'],
      icon: '⚡',
    },
    {
      id: 6,
      name: 'Lower Body Power',
      desc: 'Build leg strength and endurance',
      duration: 50,
      difficulty: 'Intermediate',
      exercises: ['Squats', 'Deadlift', 'Barbell Squat'],
      icon: '🦵',
    },
  ]);

  const startTemplate = (template) => {
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/workouts/new');
  };

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">💪 Workout Templates</h1>
      <p className="lead text-muted">Choose a pre-built workout plan to get started quickly</p>

      <div className="row">
        {templates.map((template) => (
          <div key={template.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{template.icon}</div>
                <h5 className="card-title">{template.name}</h5>
                <p className="card-text text-muted small">{template.desc}</p>

                <div className="mb-3">
                  <span className="badge bg-primary me-2">{template.duration} min</span>
                  <span className={`badge ${
                    template.difficulty === 'Beginner' ? 'bg-success' :
                    template.difficulty === 'Intermediate' ? 'bg-warning' :
                    'bg-danger'
                  }`}>{template.difficulty}</span>
                </div>

                <div className="mb-3">
                  <h6 className="small text-muted">Exercises:</h6>
                  {template.exercises.map((ex, idx) => (
                    <span key={idx} className="badge bg-light text-dark me-1 mb-1">{ex}</span>
                  ))}
                </div>

                <button className="btn btn-primary w-100" onClick={() => startTemplate(template)}>
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info mt-5">
        <h5>💡 How to Use Templates</h5>
        <ol>
          <li>Choose a template that matches your fitness level</li>
          <li>Click "Use This Template" to start a workout</li>
          <li>Exercises are pre-selected for you</li>
          <li>Adjust sets, reps, and weight as needed</li>
          <li>Log the workout to track progress</li>
        </ol>
      </div>
    </div>
  );
}
