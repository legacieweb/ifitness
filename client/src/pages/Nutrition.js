import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Nutrition.css';

export default function Nutrition() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', time: new Date().toISOString().slice(0, 16) });

  useEffect(() => {
    loadMeals();
  }, [user?.id]);

  const loadMeals = () => {
    const today = new Date().toDateString();
    const userId = user?.id || user?._id;
    if (!userId) return;
    const saved = localStorage.getItem(`meals_${userId}_${today}`);
    if (saved) setMeals(JSON.parse(saved));
    else setMeals([]);
  };

  const saveMeals = (updatedMeals) => {
    const today = new Date().toDateString();
    const userId = user?.id || user?._id;
    if (!userId) return;
    localStorage.setItem(`meals_${userId}_${today}`, JSON.stringify(updatedMeals));
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
  const progressPercent = Math.min((totalCalories / goal) * 100, 100);

  return (
    <div className="nutrition-container">
      <div className="nutrition-header">
        <h1>🍽️ Nutrition Tracker</h1>
        <p>Monitor your daily caloric intake and stay on track with your diet goals.</p>
      </div>

      <div className="nutrition-stats-grid">
        <div className="nutrition-stat-card">
          <h5>Daily Goal</h5>
          <div className="value text-primary">{goal}</div>
          <div className="unit">calories</div>
        </div>
        <div className="nutrition-stat-card">
          <h5>Consumed</h5>
          <div className="value text-success">{totalCalories}</div>
          <div className="unit">calories</div>
        </div>
        <div className="nutrition-stat-card">
          <h5>Remaining</h5>
          <div className={`value ${remaining > 0 ? 'text-warning' : 'text-danger'}`}>{remaining}</div>
          <div className="unit">calories</div>
        </div>
        <div className="nutrition-stat-card">
          <h5>Goal Reach</h5>
          <div className="value text-info">{Math.round((totalCalories / goal) * 100)}%</div>
          <div className="unit">of target</div>
        </div>
      </div>

      <div className="nutrition-progress-wrapper">
        <div className="nutrition-progress-header">
          <span>Daily Progress</span>
          <span>{totalCalories} / {goal} cal</span>
        </div>
        <div className="nutrition-progress-bar">
          <div className="nutrition-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="nutrition-main-grid">
        <div className="nutrition-card">
          <div className="nutrition-card-header">
            <h3><i className="bi bi-plus-circle-fill me-2"></i> Add Meal</h3>
          </div>
          <div className="nutrition-card-body">
            <div className="nutrition-form">
              <div className="form-group">
                <label>Meal Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Breakfast, Lunch, Snack..." 
                  value={newMeal.name} 
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Calories</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="350" 
                  value={newMeal.calories} 
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={newMeal.time} 
                  onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })} 
                />
              </div>
              <button className="btn-primary" onClick={addMeal}>
                Add Meal to Diary
              </button>
            </div>
          </div>
        </div>

        <div className="nutrition-card">
          <div className="nutrition-card-header">
            <h3><i className="bi bi-list-task me-2"></i> Today's Meals</h3>
          </div>
          <div className="nutrition-card-body">
            <div className="meals-list">
              {meals.length === 0 ? (
                <div className="empty-meals">
                  <i className="bi bi-egg-fried fs-1 d-block mb-3 opacity-50"></i>
                  <p>No meals logged yet today.</p>
                </div>
              ) : (
                meals.map((meal) => (
                  <div key={meal.id} className="meal-item">
                    <div className="meal-info">
                      <h4>{meal.name}</h4>
                      <span><i className="bi bi-clock me-1"></i> {new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="meal-stats">
                      <span className="meal-calories">{meal.calories} cal</span>
                      <button className="btn-delete" onClick={() => deleteMeal(meal.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="nutrition-tips">
        <h3><i className="bi bi-lightbulb-fill"></i> Nutrition Tips</h3>
        <ul>
          <li>Log meals consistently</li>
          <li>Focus on nutrient-dense foods</li>
          <li>Combine with workouts</li>
          <li>Stay hydrated all day</li>
          <li>Adjust goals as needed</li>
          <li>Prioritize protein intake</li>
        </ul>
      </div>
    </div>
  );
}
