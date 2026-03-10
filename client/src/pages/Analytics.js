import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/api';
import Preloader from '../components/Preloader';
import './Analytics.css';

export default function Analytics() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWorkouts();
        setWorkouts(res.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getFiltered = () => {
    const now = new Date();
    return workouts.filter(w => {
      const d = new Date(w.date);
      if (timeRange === 'week') return (now - d) < 7 * 24 * 60 * 60 * 1000;
      if (timeRange === 'month') return (now - d) < 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  };

  const filtered = getFiltered();
  const totalCal = filtered.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalMin = filtered.reduce((sum, w) => sum + (w.duration || 0), 0);

  if (loading) return <Preloader text="Analyzing your performance..." />;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics & Progress</h1>
        <div className="filter-group">
          <button
            className={`filter-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`filter-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`filter-btn ${timeRange === 'all' ? 'active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytic-card primary">
          <span className="analytic-label">Workouts</span>
          <h3 className="analytic-value">{filtered.length}</h3>
        </div>
        
        <div className="analytic-card success">
          <span className="analytic-label">Duration</span>
          <h3 className="analytic-value">{totalMin}m</h3>
        </div>
        
        <div className="analytic-card danger">
          <span className="analytic-label">Calories</span>
          <h3 className="analytic-value">{Math.round(totalCal)}</h3>
        </div>
        
        <div className="analytic-card warning">
          <span className="analytic-label">Avg/Workout</span>
          <h3 className="analytic-value">
            {filtered.length > 0 ? Math.round(totalCal / filtered.length) : 0}
          </h3>
        </div>
      </div>
    </div>
  );
}
