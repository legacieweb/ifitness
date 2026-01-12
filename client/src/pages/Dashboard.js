import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkouts, getUserRoutine, getUserGoals } from '../services/api';
import BootcampAlert from '../components/BootcampAlert';
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

  // Calculate stats from workouts
  const stats = {
    totalWorkouts: workouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
    totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    streak: calculateStreak(workouts)
  };

  // Calculate streak
  function calculateStreak(workouts) {
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
  }

  // Get recent workouts (last 5)
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate weekly progress
  const weeklyProgress = calculateWeeklyProgress(workouts);

  function calculateWeeklyProgress(workouts) {
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
  }

  // Calculate achievements
  const achievements = calculateAchievements(stats);
  
  function calculateAchievements(stats) {
    const achievements = [];
    
    if (stats.totalWorkouts >= 1) {
      achievements.push({ name: 'First Step', description: 'Completed first workout', icon: 'bi-star-fill' });
    }
    if (stats.totalWorkouts >= 5) {
      achievements.push({ name: 'Getting Serious', description: '5 workouts completed', icon: 'bi-heart-fill' });
    }
    if (stats.totalWorkouts >= 10) {
      achievements.push({ name: 'Workout Warrior', description: '10 workouts completed', icon: 'bi-lightning-fill' });
    }
    if (stats.streak >= 3) {
      achievements.push({ name: 'On Fire', description: `${stats.streak} day streak`, icon: 'bi-fire' });
    }
    if (stats.totalCalories >= 500) {
      achievements.push({ name: 'Calorie Crusher', description: '500+ calories burned', icon: 'bi-cup-hot-fill' });
    }
    if (stats.totalDuration >= 60) {
      achievements.push({ name: 'Time Invested', description: '60+ minutes total', icon: 'bi-clock-fill' });
    }
    
    return achievements;
  }

  const getWeekday = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Morning';
    if (hours < 18) return 'Afternoon';
    return 'Evening';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate goals progress
  const activeGoals = goals.filter(g => !g.completed);
  
  const getGoalIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    if (lowerTitle.includes('workout') || lowerTitle.includes('exercise')) return 'bi-dumbbell';
    if (lowerTitle.includes('weight') || lowerTitle.includes('loss')) return 'bi-graph-down';
    if (lowerTitle.includes('muscle') || lowerTitle.includes('gain')) return 'bi-person-plus';
    if (lowerTitle.includes('cardio') || lowerTitle.includes('run')) return 'bi-heart-pulse';
    if (lowerTitle.includes('water') || lowerTitle.includes('hydration')) return 'bi-cup';
    if (lowerTitle.includes('sleep')) return 'bi-moon';
    if (lowerTitle.includes('calorie') || lowerTitle.includes('food')) return 'bi-fire';
    if (lowerTitle.includes('stretch') || lowerTitle.includes('flex')) return 'bi-arrows-expand';
    return 'bi-check-circle';
  };

  const getGoalProgress = (goal) => {
    if (!goal?.target || goal.target === 0) return 0;
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  };

  const getTodayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="dashboard-container">
        <Preloader text="Loading your dashboard..." />
      </div>
    );
  }

  // Not authenticated
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

  const userName = user?.name || 'Fitness Enthusiast';
  const userGoal = user?.goal || 'Start your fitness journey!';
  const maxCalories = Math.max(...weeklyProgress.map(d => d.calories), 100);

  return (
    <div className="dashboard-container">
      <BootcampAlert />

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <i className="bi bi-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)}><i className="bi bi-x"></i></button>
        </div>
      )}

      {/* User Tile Section */}
      <div className="user-tile-section">
        <div className="user-tile">
          <div className="user-tile-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                <i className="bi bi-person"></i>
              </div>
            )}
          </div>
          <div className="user-tile-content">
            <p className="user-tile-greeting">Good {getWeekday()}</p>
            <h1 className="user-tile-name">{userName}</h1>
            <p className="user-tile-goal">{userGoal}</p>
          </div>
          <div className="user-tile-actions">
            <button className="user-tile-btn" onClick={() => navigate('/profile')} title="Profile">
              <i className="bi bi-person"></i>
            </button>
            <button className="user-tile-btn" onClick={() => navigate('/goals')} title="Goals">
              <i className="bi bi-flag"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <i className="bi bi-dumbbell"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.totalWorkouts}</span>
              <span className="stat-label">Workouts</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <i className="bi bi-fire"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.totalCalories}</span>
              <span className="stat-label">Calories</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <i className="bi bi-clock"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.totalDuration}<small>min</small></span>
              <span className="stat-label">Duration</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <i className="bi bi-flame"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.streak}<small>days</small></span>
              <span className="stat-label">Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-grid">
        {/* Left Column - Progress & Activity */}
        <div className="dashboard-main-content">
          {/* Weekly Progress */}
          <div className="progress-card">
            <div className="card-header">
              <h3>This Week</h3>
              <Link to="/analytics" className="link-btn">Details</Link>
            </div>
            <div className="weekly-bars">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div 
                      className="bar" 
                      style={{ 
                        height: day.calories > 0 ? `${(day.calories / maxCalories) * 100}%` : '8px'
                      }}
                    ></div>
                  </div>
                  <span className="bar-label">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="workouts-card">
            <div className="card-header">
              <h3>Recent Workouts</h3>
              <Link to="/workouts" className="link-btn">View All</Link>
            </div>
            <div className="workouts-list">
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map((workout) => (
                  <div 
                    key={workout._id} 
                    className="workout-row"
                    onClick={() => navigate(`/workouts/${workout._id}`)}
                  >
                    <div className="workout-icon">
                      <i className="bi bi-dumbbell"></i>
                    </div>
                    <div className="workout-info">
                      <span className="workout-name">{workout.name}</span>
                      <span className="workout-meta">{formatDate(workout.date)} • {formatTime(workout.date)}</span>
                    </div>
                    <div className="workout-stats">
                      <span className="stat-item">{workout.duration || 0}min</span>
                      <span className="stat-item">{workout.caloriesBurned || 0}cal</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-workouts">
                  <i className="bi bi-dumbbell"></i>
                  <p>No workouts yet</p>
                  <Link to="/workouts/create" className="btn-primary">Start Your First Workout</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Goals & Stats */}
        <div className="dashboard-side-content">
          {/* Goals Section */}
          <div className={`goals-card ${activeGoals.length > 0 ? '' : 'empty'}`}>
            <div className="card-header">
              <h3><i className="bi bi-trophy"></i> Goals</h3>
              <Link to="/goals" className="link-btn">View All</Link>
            </div>
            {activeGoals.length > 0 ? (
              <div className="goals-list">
                {activeGoals.slice(0, 3).map((goal, index) => (
                  <div key={index} className="goal-item">
                    <div className="goal-header">
                      <i className={`bi ${getGoalIcon(goal.title)}`}></i>
                      <span className="goal-title">{goal.title}</span>
                    </div>
                    <div className="goal-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${getGoalProgress(goal)}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{goal.current}/{goal.target} {goal.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-goals">
                <p>Start setting fitness goals to track your progress!</p>
                <Link to="/goals" className="btn-secondary-sm">Create Goal</Link>
              </div>
            )}
          </div>

          {/* My Routines Overview */}
          <div className="routines-card">
            <div className="card-header">
              <h3><i className="bi bi-calendar-week"></i> Weekly Routines</h3>
              <Link to="/routines" className="link-btn">View All</Link>
            </div>
            {routine.length > 0 ? (
              <div className="routines-overview-mini">
                {routine.slice(0, 7).map((day, index) => (
                  <div 
                    key={index} 
                    className={`routine-day-mini ${day.completed ? 'completed' : ''} ${day.day.toLowerCase() === getTodayName().toLowerCase() ? 'today' : ''}`}
                  >
                    <div className="day-label">{day.day.substring(0, 1)}</div>
                    <div className="day-status">
                      <i className={`bi ${day.completed ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-routines-mini">
                <i className="bi bi-calendar-x"></i>
                <p>No routines assigned</p>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="achievements-card-mini">
            <div className="card-header">
              <h3>Achievements</h3>
              <Link to="/achievements" className="link-btn">All</Link>
            </div>
            <div className="achievements-list-mini">
              {achievements.length > 0 ? (
                achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="achievement-item-mini" title={achievement.description}>
                    <i className={`bi ${achievement.icon}`}></i>
                  </div>
                ))
              ) : (
                <p className="empty-text">Keep working to earn trophies!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
