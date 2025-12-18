import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Nutrition() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', time: new Date().toISOString().slice(0, 16) });

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`meals_${user?.id}_${today}`);
    if (saved) setMeals(JSON.parse(saved));
  };

  const saveMeals = (updatedMeals) => {
    const today = new Date().toDateString();
    localStorage.setItem(`meals_${user?.id}_${today}`, JSON.stringify(updatedMeals));
    setMeals(updatedMeals);
  };

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;
    const meal = { id: Date.now(), ...newMeal, calories: parseInt(newMeal.calories) };
    saveMeals([...meals, meal]);
    setNewMeal({ name: '', calories: '', time: new Date().toISOString().slice(0, 16) });
  };

  const deleteMeal = (id) => {
    saveMeals(meals.filter(m => m.id !== id));
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const goal = 2000;
  const remaining = Math.max(0, goal - totalCalories);

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">🍽️ Nutrition Tracker</h1>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center bg-light">
            <div className="card-body">
              <h5>Daily Goal</h5>
              <h2 className="text-primary">{goal}</h2>
              <p className="text-muted">calories</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-light">
            <div className="card-body">
              <h5>Consumed</h5>
              <h2 className="text-success">{totalCalories}</h2>
              <p className="text-muted">calories</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-light">
            <div className="card-body">
              <h5>Remaining</h5>
              <h2 className={remaining > 0 ? 'text-warning' : 'text-danger'}>{remaining}</h2>
              <p className="text-muted">calories</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-light">
            <div className="card-body">
              <h5>Percentage</h5>
              <h2 className="text-info">{((totalCalories / goal) * 100).toFixed(0)}%</h2>
              <p className="text-muted">of goal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="progress mb-4" style={{ height: '30px' }}>
        <div className="progress-bar" style={{ width: `${Math.min((totalCalories / goal) * 100, 100)}%` }}>
          {totalCalories} / {goal} cal
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Add Meal</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Meal Name</label>
                <input type="text" className="form-control" placeholder="Breakfast, Lunch, Snack..." value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Calories</label>
                <input type="number" className="form-control" placeholder="350" value={newMeal.calories} onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Time</label>
                <input type="datetime-local" className="form-control" value={newMeal.time} onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })} />
              </div>
              <button className="btn btn-primary w-100" onClick={addMeal}>Add Meal</button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Today's Meals</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {meals.length === 0 ? (
                <p className="text-muted">No meals logged yet</p>
              ) : (
                meals.map((meal) => (
                  <div key={meal.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <strong>{meal.name}</strong>
                      <p className="text-muted small">{new Date(meal.time).toLocaleTimeString()}</p>
                    </div>
                    <div className="text-end">
                      <p className="text-danger fw-bold">{meal.calories} cal</p>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteMeal(meal.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <h5>💡 Nutrition Tips</h5>
        <ul>
          <li>Log meals consistently for better tracking</li>
          <li>Combine with workouts for best results</li>
          <li>Adjust daily goal based on your fitness target</li>
          <li>Focus on whole, nutrient-dense foods</li>
          <li>Stay hydrated throughout the day</li>
        </ul>
      </div>
    </div>
  );
}
