import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkouts, deleteWorkout, createWorkout } from '../services/api';
import Preloader from '../components/Preloader';
import './Workouts.css';

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function Workouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchWorkouts();
    const workout = localStorage.getItem('activeWorkout');
    if (workout) {
      const parsed = JSON.parse(workout);
      setActiveWorkout(parsed);
      setTotalSeconds(parsed.duration * 60);
      setTimeLeft(parsed.duration * 60);
    }
  }, []);

  useEffect(() => {
    if (!activeWorkout || !isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout, isRunning]);

  const fetchWorkouts = async () => {
    try {
      const response = await getWorkouts();
      setWorkouts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch workouts');
      setLoading(false);
    }
  };

  const handleTogglePause = () => {
    setIsRunning(!isRunning);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this workout?')) {
      localStorage.removeItem('activeWorkout');
      setActiveWorkout(null);
      setTimeLeft(0);
      setIsRunning(false);
    }
  };

  const handleComplete = async () => {
    try {
      await createWorkout({
        name: activeWorkout.name,
        description: activeWorkout.description,
        duration: activeWorkout.duration,
        caloriesBurned: Math.round(activeWorkout.duration * 5),
        date: new Date(),
      });
      localStorage.removeItem('activeWorkout');
      setActiveWorkout(null);
      setTimeLeft(0);
      setIsRunning(false);
      fetchWorkouts();
    } catch (err) {
      setError('Failed to save workout');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(id);
        setWorkouts(workouts.filter((w) => w._id !== id));
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  const sortedWorkouts = () => {
    const sorted = [...workouts];
    if (sortBy === 'recent') {
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'calories') {
      return sorted.sort((a, b) => b.caloriesBurned - a.caloriesBurned);
    } else if (sortBy === 'duration') {
      return sorted.sort((a, b) => b.duration - a.duration);
    }
    return sorted;
  };

  const progressPercentage = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

  if (loading) {
    return <Preloader text="Loading workouts..." />;
  }

  return (
    <div className="workouts-page">
      {activeWorkout && (
        <div className="active-workout-card">
          <div className="active-workout-bg"></div>

          <h2 className="active-workout-title">{activeWorkout.name}</h2>

          <div className="timer-display">{formatTime(timeLeft)}</div>

          <div className="progress-bar-custom">
            <div className="progress-fill-custom" style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <div className="status-info">
            <div className="status-item">
              <span className="status-label">Status</span>
              <span className={`status-value ${isRunning ? 'running' : timeLeft === 0 ? 'completed' : 'paused'}`}>
                {isRunning ? '🔴 Running' : (timeLeft === 0 ? '✓ Completed' : '⏸ Paused')}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Duration</span>
              <span className="status-value">{activeWorkout.duration} min</span>
            </div>
          </div>

          <div className="workout-controls">
            <button onClick={handleTogglePause} className={`btn-control ${isRunning ? 'btn-pause' : 'btn-play'}`}>
              <i className={`bi ${isRunning ? 'bi-pause-fill' : 'bi-play-fill'}`}></i> {isRunning ? 'Pause' : 'Start'}
            </button>

            <button onClick={handleCancel} className="btn-control btn-cancel">
              <i className="bi bi-x-circle"></i> Cancel
            </button>

            {timeLeft === 0 && (
              <button onClick={handleComplete} className="btn-control btn-complete">
                <i className="bi bi-check-circle"></i> Save & Complete
              </button>
            )}
          </div>
        </div>
      )}

      <div className="workouts-container">
        <div className="page-header">
          <div className="header-top">
            <div className="header-content">
              <h1 className="page-title">My Workouts</h1>
              <p className="page-subtitle">Track and manage your fitness journey</p>
            </div>
            <Link to="/workouts/new" className="btn-create-workout">
              <i className="bi bi-plus-lg"></i> New Workout
            </Link>
          </div>

          {workouts.length > 0 && (
            <div className="stats-bar">
              <div className="stat-item-bar">
                <div className="stat-icon">
                  <i className="bi bi-activity"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-label">Total Workouts</span>
                  <span className="stat-value">{workouts.length}</span>
                </div>
              </div>
              <div className="stat-item-bar">
                <div className="stat-icon">
                  <i className="bi bi-fire"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-label">Total Calories</span>
                  <span className="stat-value">{totalCalories.toLocaleString()}</span>
                </div>
              </div>
              <div className="stat-item-bar">
                <div className="stat-icon">
                  <i className="bi bi-hourglass-split"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-label">Total Time</span>
                  <span className="stat-value">{totalDuration} min</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="alert-error"><i className="bi bi-exclamation-circle"></i> {error}</div>}

        {workouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <i className="bi bi-calendar-check"></i>
            </div>
            <h3>No workouts yet</h3>
            <p>Start your fitness journey by logging your first workout</p>
            <Link to="/workouts/new" className="btn-create-workout d-inline-flex mx-auto">
              <i className="bi bi-plus-circle"></i> Create Your First Workout
            </Link>
          </div>
        ) : (
          <div className="workouts-content">
            <div className="sort-section">
              <div className="sort-controls">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="recent">Most Recent</option>
                  <option value="calories">Most Calories</option>
                  <option value="duration">Longest Duration</option>
                </select>
              </div>
            </div>

            <div className="workouts-grid">
              {sortedWorkouts().map((workout) => (
                <div key={workout._id} className="workout-card">
                  <div className="workout-card-inner">
                    <div className="card-header">
                      <h5 className="workout-name">{workout.name}</h5>
                      <div className="card-badge">
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                    </div>

                    <div className="card-divider"></div>

                    <div className="workout-stats-grid">
                      <div className="stat-item-card">
                        <div className="stat-icon-card">
                          <i className="bi bi-calendar-event"></i>
                        </div>
                        <div className="stat-text">
                          <span className="stat-label-card">Date</span>
                          <span className="stat-value-card">{new Date(workout.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="stat-item-card">
                        <div className="stat-icon-card">
                          <i className="bi bi-hourglass-split"></i>
                        </div>
                        <div className="stat-text">
                          <span className="stat-label-card">Duration</span>
                          <span className="stat-value-card">{workout.duration} min</span>
                        </div>
                      </div>
                      <div className="stat-item-card">
                        <div className="stat-icon-card">
                          <i className="bi bi-fire"></i>
                        </div>
                        <div className="stat-text">
                          <span className="stat-label-card">Calories</span>
                          <span className="stat-value-card">{workout.caloriesBurned} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <Link to={`/workouts/${workout._id}`} className="action-btn view-btn" title="View Details">
                        <i className="bi bi-eye"></i>
                      </Link>
                      <Link to={`/workouts/${workout._id}/edit`} className="action-btn edit-btn" title="Edit">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button onClick={() => handleDelete(workout._id)} className="action-btn delete-btn" title="Delete">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
