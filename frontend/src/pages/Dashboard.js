import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';
import BootcampAlert from '../components/BootcampAlert';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
    averageCaloriesPerWorkout: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const response = await getUserStats(user.id);
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user, refreshTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const workout = localStorage.getItem('activeWorkout');
    if (workout) {
      setActiveWorkout(JSON.parse(workout));
    }
  }, []);

  const handleStartWorkout = () => {
    navigate('/workouts');
  };

  const handleDismissWorkout = () => {
    localStorage.removeItem('activeWorkout');
    setActiveWorkout(null);
  };

  const getWeekday = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 18) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <div className="dashboard-container">
      <BootcampAlert />

      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <div className="greeting">{getGreeting()}</div>
            <h1 className="header-title">{user?.name}!</h1>
            <p className="header-date">{getWeekday()}, {new Date().toLocaleDateString()}</p>
          </div>
          <button 
            className="btn-refresh" 
            onClick={fetchStats}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>

      {activeWorkout && (
        <div className="active-workout-alert">
          <div className="alert-content">
            <div>
              <h5><i className="bi bi-lightning-charge"></i> Workout Ready to Start!</h5>
              <p><strong>{activeWorkout.name}</strong> • {activeWorkout.duration} minutes</p>
            </div>
            <div className="alert-actions">
              <button className="btn-start" onClick={handleStartWorkout}>
                <i className="bi bi-play-fill"></i> Start Now
              </button>
              <button className="btn-dismiss" onClick={handleDismissWorkout}>
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card stat-card-1">
          <div className="stat-icon"><i className="bi bi-activity"></i></div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>
        <div className="stat-card stat-card-2">
          <div className="stat-icon"><i className="bi bi-fire"></i></div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalCalories.toFixed(0)}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
        </div>
        <div className="stat-card stat-card-3">
          <div className="stat-icon"><i className="bi bi-hourglass-split"></i></div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalDuration}</div>
            <div className="stat-label">Total Minutes</div>
          </div>
        </div>
        <div className="stat-card stat-card-4">
          <div className="stat-icon"><i className="bi bi-graph-up"></i></div>
          <div className="stat-content">
            <div className="stat-number">{Math.round(stats.averageCaloriesPerWorkout)}</div>
            <div className="stat-label">Avg Cal/Workout</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/workouts/new" className="action-card action-card-1">
            <div className="action-icon"><i className="bi bi-plus-circle-fill"></i></div>
            <h6>Start Workout</h6>
            <p>Log a new session</p>
          </Link>
          <Link to="/workouts" className="action-card action-card-2">
            <div className="action-icon"><i className="bi bi-book-fill"></i></div>
            <h6>View History</h6>
            <p>Your workouts</p>
          </Link>
          <Link to="/calendar" className="action-card action-card-3">
            <div className="action-icon"><i className="bi bi-calendar-week-fill"></i></div>
            <h6>Calendar</h6>
            <p>Track by date</p>
          </Link>
          <Link to="/analytics" className="action-card action-card-4">
            <div className="action-icon"><i className="bi bi-bar-chart-fill"></i></div>
            <h6>Analytics</h6>
            <p>Detailed stats</p>
          </Link>
          <Link to="/goals" className="action-card action-card-5">
            <div className="action-icon"><i className="bi bi-target"></i></div>
            <h6>Goals</h6>
            <p>Set targets</p>
          </Link>
          <Link to="/profile" className="action-card action-card-6">
            <div className="action-icon"><i className="bi bi-person-circle"></i></div>
            <h6>Profile</h6>
            <p>Your info</p>
          </Link>
        </div>
      </div>

      <div className="additional-sections">
        <div className="achievements-preview">
          <h3><i className="bi bi-trophy-fill"></i> Achievements</h3>
          <div className="achievement-items">
            <div className="achievement-badge">
              <i className="bi bi-fire"></i>
              <span>3-Day Streak</span>
            </div>
            <div className="achievement-badge">
              <i className="bi bi-star-fill"></i>
              <span>500 Calories</span>
            </div>
            <div className="achievement-badge">
              <i className="bi bi-lightning-fill"></i>
              <span>5 Workouts</span>
            </div>
          </div>
          <Link to="/achievements" className="view-all-link">View All Achievements →</Link>
        </div>

        <div className="nutrition-preview">
          <h3><i className="bi bi-cup-straw"></i> Nutrition</h3>
          <p className="preview-description">Track your daily meals and nutrition goals</p>
          <Link to="/nutrition" className="btn btn-light-primary">Open Nutrition Tracker</Link>
        </div>
      </div>
    </div>
  );
}
