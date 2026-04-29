import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkouts, deleteWorkout, createWorkout } from '../services/api';
import { useWorkout } from '../context/WorkoutContext';
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
  const { 
    activeWorkout, 
    timeLeft, 
    isRunning, 
    totalSeconds, 
    togglePause, 
    cancelWorkout, 
    completeWorkout 
  } = useWorkout();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchWorkouts();
  }, []);

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
    togglePause();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this workout?')) {
      cancelWorkout();
    }
  };

  const handleComplete = async () => {
    const success = await completeWorkout();
    if (success) {
      fetchWorkouts();
    } else {
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
    return <Preloader text="SYNCING SESSION ARCHIVE..." />;
  }

  return (
    <div className="workouts-page fusion-theme">
      {activeWorkout && (
        <div className="active-workout-card fusion-card">
          <div className="active-workout-bg"></div>

          <h2 className="active-workout-title">{activeWorkout.name.toUpperCase()}</h2>

          <div className="timer-display">{formatTime(timeLeft)}</div>

          <div className="progress-bar-custom">
            <div className="progress-fill-custom" style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <div className="status-info">
            <div className="status-item">
              <span className="status-label">PROTOCOL_STATUS</span>
              <span className={`status-value ${isRunning ? 'running' : timeLeft === 0 ? 'completed' : 'paused'}`}>
                {isRunning ? '🔴 ACTIVE_EXECUTION' : (timeLeft === 0 ? '✓ SEQUENCE_COMPLETE' : '⏸ SYSTEM_PAUSED')}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">PLANNED_DURATION</span>
              <span className="status-value">{activeWorkout.duration}M</span>
            </div>
          </div>

          <div className="workout-controls">
            <button onClick={handleTogglePause} className={`btn-control ${isRunning ? 'btn-pause' : 'btn-play'}`}>
              <i className={`bi ${isRunning ? 'bi-pause-fill' : 'bi-play-fill'}`}></i> {isRunning ? 'SUSPEND' : 'RESUME'}
            </button>

            <button onClick={handleCancel} className="btn-control btn-cancel">
              <i className="bi bi-x-circle"></i> ABORT
            </button>

            {timeLeft === 0 && (
              <button onClick={handleComplete} className="btn-control btn-complete">
                <i className="bi bi-check-circle"></i> COMMIT_DATA
              </button>
            )}
          </div>
        </div>
      )}

      <div className="workouts-container">
        <div className="page-header">
          <div className="header-top">
            <div className="header-content">
              <h1 className="page-title">SESSION_ARCHIVE</h1>
              <p className="page-subtitle">Historical data of all fusion protocols executed</p>
            </div>
            <Link to="/workouts/new" className="btn-create-workout">
              <i className="bi bi-plus-lg"></i> INITIATE_NEW
            </Link>
          </div>

          {workouts.length > 0 && (
            <div className="stats-bar">
              <div className="stat-item-bar">
                <div className="stat-icon">
                  <i className="bi bi-activity"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-label">TOTAL_SESSIONS</span>
                  <span className="stat-value">{workouts.length}</span>
                </div>
              </div>
              <div className="stat-item-bar">
                <div className="stat-icon">
                  <i className="bi bi-fire"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-label">AGGREGATE_ENERGY</span>
                  <span className="stat-value">{totalCalories.toLocaleString()} KCAL</span>
                </div>
              </div>
              <div className="stat-item-bar">
                <div className="stat-icon">
                  <i className="bi bi-hourglass-split"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-label">CUMULATIVE_UPTIME</span>
                  <span className="stat-value">{totalDuration} MIN</span>
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
            <h3>NO ARCHIVED SESSIONS</h3>
            <p>Initiate your first fusion protocol to begin data collection</p>
            <Link to="/workouts/new" className="btn-create-workout d-inline-flex mx-auto">
              <i className="bi bi-plus-circle"></i> INITIATE_FIRST_PROTOCOL
            </Link>
          </div>
        ) : (
          <div className="workouts-content">
            <div className="sort-section">
              <div className="sort-controls">
                <label htmlFor="sort">FILTER_BY:</label>
                <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="recent">CHRONOLOGICAL</option>
                  <option value="calories">ENERGY_YIELD</option>
                  <option value="duration">SESSION_LENGTH</option>
                </select>
              </div>
            </div>

            <div className="workouts-grid">
              {sortedWorkouts().map((workout) => (
                <div key={workout._id} className="workout-card fusion-card">
                  <div className="workout-card-inner">
                    <div className="card-header">
                      <h5 className="workout-name">{workout.name.toUpperCase()}</h5>
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
                          <span className="stat-label-card">TIMESTAMP</span>
                          <span className="stat-value-card">{new Date(workout.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="stat-item-card">
                        <div className="stat-icon-card">
                          <i className="bi bi-hourglass-split"></i>
                        </div>
                        <div className="stat-text">
                          <span className="stat-label-card">UPTIME</span>
                          <span className="stat-value-card">{workout.duration}M</span>
                        </div>
                      </div>
                      <div className="stat-item-card">
                        <div className="stat-icon-card">
                          <i className="bi bi-fire"></i>
                        </div>
                        <div className="stat-text">
                          <span className="stat-label-card">ENERGY</span>
                          <span className="stat-value-card">{workout.caloriesBurned}K</span>
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
