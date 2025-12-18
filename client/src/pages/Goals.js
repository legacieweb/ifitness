import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/api';

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
    <div className="container-fluid container-md mt-4 mt-md-5 mb-5 px-3 px-md-0">
      <h1 className="mb-4">🎯 Fitness Goals</h1>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Set New Goal</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Goal Name</label>
                <input type="text" className="form-control" placeholder="e.g., Complete 30 Workouts" value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Target</label>
                <input type="number" className="form-control" placeholder="50" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Unit</label>
                <select className="form-select" value={newGoal.unit} onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}>
                  <option value="">Select unit</option>
                  <option value="workouts">Workouts</option>
                  <option value="calories">Calories</option>
                  <option value="minutes">Minutes</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Deadline</label>
                <input type="date" className="form-control" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} />
              </div>
              <button className="btn btn-primary w-100" onClick={addGoal}>Add Goal</button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Goal Tips</h5>
            </div>
            <div className="card-body">
              <ul>
                <li>Set realistic goals based on your schedule</li>
                <li>Mix quantity (workouts) with intensity (calories)</li>
                <li>Review progress weekly</li>
                <li>Adjust goals as you progress</li>
                <li>Celebrate milestones! 🎉</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-3">Your Goals</h3>
      {goals.length === 0 ? (
        <div className="alert alert-info">No goals yet. Create one to get started!</div>
      ) : (
        <div className="row">
          {goals.map((goal) => {
            const { current, percent } = getProgress(goal);
            const isComplete = percent >= 100;
            return (
              <div key={goal.id} className="col-md-6 mb-3">
                <div className={`card ${isComplete ? 'border-success' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <h5 className="card-title">{goal.name}</h5>
                      {isComplete && <span className="badge bg-success">✓ Done!</span>}
                    </div>
                    <p className="text-muted small">
                      {current} / {goal.target} {goal.unit} {goal.deadline && `(by ${goal.deadline})`}
                    </p>
                    <div className="progress mb-2">
                      <div className={`progress-bar ${isComplete ? 'bg-success' : 'bg-primary'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                    <p className="text-muted small">{Math.round(percent)}% Complete</p>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteGoal(goal.id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
