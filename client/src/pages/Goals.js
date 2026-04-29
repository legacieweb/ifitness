import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/api';
import './Goals.css';

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', unit: '', deadline: '' });
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await getWorkouts();
        setWorkouts(res.data);
        loadGoals();
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };
    fetchWorkouts();
  }, []);

  const loadGoals = () => {
    const saved = localStorage.getItem(`goals_${user?.id}`);
    if (saved) setGoals(JSON.parse(saved));
  };

  const saveGoals = (updatedGoals) => {
    localStorage.setItem(`goals_${user?.id}`, JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseInt(newGoal.target),
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', unit: '', deadline: '' });
  };

  const deleteGoal = (id) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  const getProgress = (goal) => {
    let current = 0;
    switch (goal.unit) {
      case 'workouts':
        current = workouts.length;
        break;
      case 'calories':
        current = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
        break;
      case 'minutes':
        current = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        break;
      default:
        current = 0;
    }
    return { current, percent: Math.min((current / goal.target) * 100, 100) };
  };

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>FUSION OBJECTIVES</h1>
        <p>Architect your evolution, monitor progression, and synchronize achievements</p>
      </div>

      <div className="goals-grid">
        <div className="goals-card">
          <h5><i className="bi bi-plus-circle-fill"></i> INITIATE OBJECTIVE</h5>
          <div className="goal-form">
            <div className="form-group">
              <label>PROTOCOL NAME</label>
              <input
                type="text"
                placeholder="e.g., HYPERTROPHY_CYCLE"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>TARGET VALUE</label>
              <input
                type="number"
                placeholder="0"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>METRIC NODE</label>
              <select
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              >
                <option value="">SELECT PARAMETER</option>
                <option value="workouts">SESSIONS</option>
                <option value="calories">CALORIES_BURNED</option>
                <option value="minutes">DURATION_MIN</option>
              </select>
            </div>
            <div className="form-group">
              <label>TERMINATION DATE (OPTIONAL)</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <button className="btn-add-goal" onClick={addGoal}>
              ESTABLISH PROTOCOL
            </button>
          </div>
        </div>

        <div className="goals-card">
          <h5><i className="bi bi-lightbulb-fill"></i> SYSTEM ADVISORY</h5>
          <ul className="tips-list">
            <li><strong>PRECISION:</strong> Define exact parameters for optimal tracking.</li>
            <li><strong>FEASIBILITY:</strong> Calibrate targets to maintain system stability.</li>
            <li><strong>TEMPORAL:</strong> Set deadlines to ensure operational momentum.</li>
            <li><strong>MONITORING:</strong> Regularly sync data to prevent drift.</li>
            <li><strong>SYNCHRONIZATION:</strong> Rewards await upon successful completion. 💾</li>
          </ul>
        </div>
      </div>

      <div className="your-goals-section">
        <h3>ACTIVE PROTOCOLS</h3>
        {goals.length === 0 ? (
          <div className="goals-empty">
            <i className="bi bi-trophy"></i>
            <p>NO ACTIVE OBJECTIVES. INITIATE PROTOCOL TO START TRACKING.</p>
          </div>
        ) : (
          <div className="goals-list">
            {goals.map((goal) => {
              const { current, percent } = getProgress(goal);
              const isComplete = percent >= 100;
              return (
                <div key={goal.id} className={`goal-item ${isComplete ? 'completed' : ''}`}>
                  <div className="goal-item-header">
                    <h5>{goal.name}</h5>
                    {isComplete && <i className="bi bi-patch-check-fill text-success fs-4"></i>}
                  </div>
                  
                  <div className="goal-stats">
                    <i className="bi bi-calendar-event"></i>
                    <span>
                      {goal.deadline ? `TERMINATION: ${new Date(goal.deadline).toLocaleDateString()}` : 'INDEFINITE LIFECYCLE'}
                    </span>
                  </div>

                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="progress-info">
                    <span>{current} / {goal.target} {goal.unit.toUpperCase()}</span>
                    <span>{Math.round(percent)}%</span>
                  </div>

                  <button className="btn-delete-goal" onClick={() => deleteGoal(goal.id)}>
                    <i className="bi bi-trash3-fill me-2"></i>
                    TERMINATE
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
