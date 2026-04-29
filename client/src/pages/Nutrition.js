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
        <h1>FUEL_MANAGEMENT</h1>
        <p>Monitor daily metabolic intake and stay synchronized with dietary parameters.</p>
      </div>

      <div className="nutrition-stats-grid">
        <div className="nutrition-stat-card fusion-card">
          <h5>SYSTEM_TARGET</h5>
          <div className="value text-primary">{goal}</div>
          <div className="unit">KCAL</div>
        </div>
        <div className="nutrition-stat-card fusion-card">
          <h5>CONSUMED_ENERGY</h5>
          <div className="value text-success">{totalCalories}</div>
          <div className="unit">KCAL</div>
        </div>
        <div className="nutrition-stat-card fusion-card">
          <h5>REMAINING_CAPACITY</h5>
          <div className={`value ${remaining > 0 ? 'text-warning' : 'text-danger'}`}>{remaining}</div>
          <div className="unit">KCAL</div>
        </div>
        <div className="nutrition-stat-card fusion-card">
          <h5>TARGET_ACHIEVEMENT</h5>
          <div className="value text-info">{Math.round((totalCalories / goal) * 100)}%</div>
          <div className="unit">SYNCHRONIZATION</div>
        </div>
      </div>

      <div className="nutrition-progress-wrapper">
        <div className="nutrition-progress-header">
          <span>DAILY_INTAKE_PROGRESS</span>
          <span>{totalCalories} / {goal} KCAL</span>
        </div>
        <div className="nutrition-progress-bar">
          <div className="nutrition-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="nutrition-main-grid">
        <div className="nutrition-card fusion-card">
          <div className="nutrition-card-header">
            <h3><i className="bi bi-plus-circle-fill me-2"></i> REGISTER_FUEL_ENTRY</h3>
          </div>
          <div className="nutrition-card-body">
            <div className="nutrition-form">
              <div className="form-group">
                <label>MEAL_IDENTIFIER</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="BREAKFAST, LUNCH, SNACK..." 
                  value={newMeal.name} 
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>ENERGY_VALUE (KCAL)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="350" 
                  value={newMeal.calories} 
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>TIMESTAMP</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={newMeal.time} 
                  onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })} 
                />
              </div>
              <button className="btn-fusion" onClick={addMeal}>
                COMMIT_ENTRY
              </button>
            </div>
          </div>
        </div>

        <div className="nutrition-card fusion-card">
          <div className="nutrition-card-header">
            <h3><i className="bi bi-list-task me-2"></i> DIURNAL_ENTRIES</h3>
          </div>
          <div className="nutrition-card-body">
            <div className="meals-list">
              {meals.length === 0 ? (
                <div className="empty-meals">
                  <i className="bi bi-egg-fried fs-1 d-block mb-3 opacity-50"></i>
                  <p>NO METABOLIC DATA ARCHIVED TODAY.</p>
                </div>
              ) : (
                meals.map((meal) => (
                  <div key={meal.id} className="meal-item">
                    <div className="meal-info">
                      <h4>{meal.name.toUpperCase()}</h4>
                      <span><i className="bi bi-clock me-1"></i> {new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="meal-stats">
                      <span className="meal-calories">{meal.calories} KCAL</span>
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

      <div className="nutrition-tips fusion-card">
        <h3><i className="bi bi-lightbulb-fill"></i> NUTRITIONAL_INTELLIGENCE</h3>
        <ul className="tips-list-modern">
          <li><strong>CONSISTENCY:</strong> Log entries systematically for accurate analysis.</li>
          <li><strong>DENSITY:</strong> Prioritize high-nutrient density fuel sources.</li>
          <li><strong>INTEGRATION:</strong> Align fuel intake with operational workout loads.</li>
          <li><strong>HYDRATION:</strong> Maintain optimal water levels for system stability.</li>
          <li><strong>CALIBRATION:</strong> Adjust target parameters as biometrics evolve.</li>
          <li><strong>PROTEIN:</strong> Focus on amino acid repair nodes for muscle recovery.</li>
        </ul>
      </div>
    </div>
  );
}
