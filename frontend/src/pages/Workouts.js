import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkouts, deleteWorkout, createWorkout } from '../services/api';
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

  const progressPercentage = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  if (loading) {
    return <div className="workouts-container"><p>Loading workouts...</p></div>;
  }

  return (
    <div className="workouts-container">
      {activeWorkout && (
        <div className="active-workout-card">
          <div className="active-workout-bg"></div>

          <h2 className="active-workout-title">{activeWorkout.name}</h2>

          <div className="timer-display">{formatTime(timeLeft)}</div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
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

      <div className="workouts-header">
        <div>
          <h1>My Workouts</h1>
          <p className="header-subtitle">{workouts.length} workouts recorded</p>
        </div>
        <Link to="/workouts/new" className="btn-add-workout">
          <i className="bi bi-plus-circle-fill"></i> Add New Workout
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {workouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No workouts yet</h3>
          <p>Start tracking your fitness journey!</p>
          <Link to="/workouts/new" className="btn-start-first">Create Your First Workout</Link>
        </div>
      ) : (
        <div className="workouts-grid">
          {workouts.map((workout) => (
            <div key={workout._id} className="workout-card">
              <div className="workout-card-header">
                <h5 className="workout-name">{workout.name}</h5>
                <div className="workout-actions">
                  <Link to={`/workouts/${workout._id}`} className="action-btn view-btn" title="View">
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

              <div className="workout-stats">
                <div className="stat">
                  <i className="bi bi-calendar-event"></i>
                  <span>{new Date(workout.date).toLocaleDateString()}</span>
                </div>
                <div className="stat">
                  <i className="bi bi-hourglass-split"></i>
                  <span>{workout.duration} min</span>
                </div>
                <div className="stat">
                  <i className="bi bi-fire"></i>
                  <span>{workout.caloriesBurned} kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
