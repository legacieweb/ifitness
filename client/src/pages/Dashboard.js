import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkouts, getUserRoutine, getUserGoals } from '../services/api';
import BootcampAlert from '../components/BootcampAlert';
import Preloader from '../components/Preloader';
import './Dashboard.css';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workouts and routine
  useEffect(() => {
    let timeoutId;
    
    const fetchData = async () => {
      if (authLoading) return;
      
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      // Wait for user object to be ready
      const userId = user?.id || user?._id;
      if (!userId) {
        // Retry after a short delay to allow user object to load
        timeoutId = setTimeout(fetchData, 100);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch workouts, routine, and goals in parallel
        const [workoutsRes, routineRes, goalsRes] = await Promise.all([
          getWorkouts(),
          getUserRoutine(userId).catch(() => ({ data: [] })),
          getUserGoals(userId).catch(() => ({ data: [] }))
        ]);
        
        setWorkouts(workoutsRes.data || []);
        setRoutine(routineRes.data || []);
        setGoals(goalsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        setWorkouts([]);
        setRoutine([]);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user?.id, user?._id, isAuthenticated, authLoading]);

  // Calculate streak
  const calculateStreak = useCallback((workouts) => {
    if (workouts.length === 0) return 0;
    
    const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let lastDate = new Date(sorted[0].date);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) return 0;
    
    let streak = 1;
    let checkDate = new Date(lastDate);
    
    for (let i = 1; i < sorted.length; i++) {
      const workoutDate = new Date(sorted[i].date);
      workoutDate.setHours(0, 0, 0, 0);
      checkDate.setDate(checkDate.getDate() - 1);
      if (workoutDate.getTime() === checkDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [workouts]);

  // Calculate stats from workouts
  const calculateStats = useCallback(() => {
    return {
      totalWorkouts: workouts.length,
      totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      streak: calculateStreak(workouts)
    };
  }, [workouts, calculateStreak]);

  const stats = calculateStats();

  // Get recent workouts (last 5)
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const calculateWeeklyProgress = useCallback((workouts) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const progress = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= date && workoutDate < nextDate;
      });
      
      const dayCalories = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      
      progress.push({
        day: days[date.getDay()],
        calories: dayCalories
      });
    }
    
    return progress;
  }, [workouts]);

  const weeklyProgress = calculateWeeklyProgress(workouts);

  const calculateAchievements = useCallback((stats) => {
    const achievements = [];
    if (stats.totalWorkouts >= 1) achievements.push({ icon: 'bi-star-fill' });
    if (stats.totalWorkouts >= 5) achievements.push({ icon: 'bi-heart-fill' });
    if (stats.totalWorkouts >= 10) achievements.push({ icon: 'bi-lightning-fill' });
    return achievements;
  }, [stats]);

  const achievements = calculateAchievements(stats);
  
  const getWeekday = useCallback(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Morning';
    if (hours < 18) return 'Afternoon';
    return 'Evening';
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const getGoalProgress = useCallback((goal) => {
    if (!goal?.target || goal.target === 0) return 0;
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  }, []);

  const getTodayName = useCallback(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  }, []);

  if (authLoading || loading) {
    return <Preloader text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <i className="bi bi-person-lock" style={{ fontSize: '48px', color: 'var(--gray-light)' }}></i>
          <p>Please log in to view your dashboard</p>
          <Link to="/login" className="btn-primary">Log In</Link>
        </div>
      </div>
    );
  }

  const userName = user?.name || 'Enthusiast';
  const maxCalories = Math.max(...weeklyProgress.map(d => d.calories), 100);
  const activeGoals = goals.filter(g => !g.completed);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <BootcampAlert />

        {error && (
          <div className="error-banner">
            <i className="bi bi-exclamation-triangle"></i>
            <span>{error}</span>
            <button onClick={() => setError(null)}><i className="bi bi-x"></i></button>
          </div>
        )}

        <div className="dash-welcome-section">
          <div className="dash-profile-picture">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="welcome-profile-pic"
              />
            ) : (
              <div className="welcome-profile-placeholder">
                <i className="bi bi-person-circle"></i>
              </div>
            )}
          </div>
          <div className="dash-welcome-content">
            <p className="welcome-label">Good {getWeekday()}</p>
            <h1 className="welcome-name">{userName}</h1>
          </div>
          <div className="dash-quick-actions">
            <Link to="/workouts/new" className="quick-action-btn primary">
              <i className="bi bi-plus-lg"></i>
              <span>New Workout</span>
            </Link>
          </div>
        </div>

        <div className="dash-stats-grid">
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="bi bi-activity"></i></div>
            <div className="dash-stat-data">
              <span className="dash-stat-value">{stats.totalWorkouts}</span>
              <span className="dash-stat-label">Workouts</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="bi bi-fire"></i></div>
            <div className="dash-stat-data">
              <span className="dash-stat-value">{stats.totalCalories}</span>
              <span className="dash-stat-label">Calories</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="bi bi-clock"></i></div>
            <div className="dash-stat-data">
              <span className="dash-stat-value">{stats.totalDuration}m</span>
              <span className="dash-stat-label">Time</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="bi bi-lightning-charge"></i></div>
            <div className="dash-stat-data">
              <span className="dash-stat-value">{stats.streak}d</span>
              <span className="dash-stat-label">Streak</span>
            </div>
          </div>
        </div>

        <div className="dash-main-grid">
          <div className="dash-left-col">
            <div className="dash-card">
              <div className="dash-card-header">
                <h3>Weekly Activity</h3>
                <Link to="/analytics" className="dash-card-link">Details</Link>
              </div>
              <div className="dash-chart-container">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="dash-chart-bar-wrapper">
                    <div 
                      className="dash-chart-bar" 
                      style={{ 
                        height: day.calories > 0 ? `${(day.calories / maxCalories) * 80 + 20}%` : '10%'
                      }}
                    ></div>
                    <span className="dash-bar-day">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <h3>Recent Workouts</h3>
                <Link to="/workouts" className="dash-card-link">View All</Link>
              </div>
              <div className="dash-workout-list">
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.map((workout) => (
                    <div key={workout._id} className="dash-workout-item" onClick={() => navigate(`/workouts/${workout._id}`)}>
                      <div className="workout-type-icon"><i className="bi bi-lightning-fill"></i></div>
                      <div className="workout-item-info">
                        <span className="workout-item-name">{workout.name}</span>
                        <span className="workout-item-date">{formatDate(workout.date)}</span>
                      </div>
                      <div className="workout-item-meta">
                        <span className="workout-item-duration">{workout.duration}m</span>
                        <i className="bi bi-chevron-right"></i>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dash-empty-state">
                    <p>No workouts recorded.</p>
                    <Link to="/workouts/new" className="dash-empty-btn">Log One</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dash-right-col">
            <div className="dash-card">
              <div className="dash-card-header">
                <h3>Active Goals</h3>
              </div>
              <div className="dash-goals-list">
                {activeGoals.length > 0 ? (
                  activeGoals.slice(0, 3).map((goal, index) => (
                    <div key={index} className="dash-goal-item">
                      <div className="dash-goal-info">
                        <span className="dash-goal-title">{goal.title}</span>
                        <span className="dash-goal-progress">{getGoalProgress(goal)}%</span>
                      </div>
                      <div className="dash-goal-bar-bg">
                        <div className="dash-goal-bar-fill" style={{ width: `${getGoalProgress(goal)}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="dash-no-data">No active goals.</p>
                )}
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <h3>Achievements</h3>
              </div>
              <div className="dash-achievements-mini">
                {achievements.length > 0 ? (
                  achievements.map((a, i) => (
                    <div key={i} className="dash-achievement-icon"><i className={`bi ${a.icon}`}></i></div>
                  ))
                ) : (
                  <p className="dash-no-data">Keep working!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
