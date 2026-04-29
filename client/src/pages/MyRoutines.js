import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRoutine, updateRoutineDay } from '../services/api';
import Preloader from '../components/Preloader';
import './MyRoutines.css';

export default function MyRoutines() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoutine, setUpdatingRoutine] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    let timeoutId;
    
    const fetchRoutineData = async () => {
      // Wait for auth and user to be ready
      if (authLoading) return;
      if (!isAuthenticated) return;
      
      const userId = user?.id || user?._id;
      if (!userId) {
        console.log('[MyRoutines] User ID not available yet, scheduling retry...');
        // Retry after a short delay to allow user object to load
        timeoutId = setTimeout(fetchRoutineData, 100);
        return;
      }
      
      console.log('[MyRoutines] Fetching routine for user:', userId);
      
      try {
        setLoading(true);
        const response = await getUserRoutine(userId);
        console.log('[MyRoutines] Fetched routine:', response.data);
        setRoutine(response.data || []);
      } catch (error) {
        console.error('Failed to fetch routine:', error);
        setRoutine([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutineData();
    
    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user?.id, user?._id, authLoading, isAuthenticated]);

  const fetchRoutine = async () => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await getUserRoutine(userId);
      setRoutine(response.data || []);
    } catch (error) {
      console.error('Failed to fetch routine:', error);
      setRoutine([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRoutineDay = async (dayIndex) => {
    if (updatingRoutine) return;
    const userId = user?.id || user?._id;
    if (!userId) return;

    const day = routine[dayIndex];
    if (!day) return;

    try {
      setUpdatingRoutine(true);
      const newCompleted = !day.completed;

      // Optimistic update
      const newRoutine = [...routine];
      newRoutine[dayIndex] = { ...day, completed: newCompleted };
      setRoutine(newRoutine);

      await updateRoutineDay(userId, dayIndex, newCompleted);
    } catch (err) {
      console.error('Failed to update routine:', err);
      // Revert on error - refetch routine
      const response = await getUserRoutine(userId).catch(() => ({ data: routine }));
      setRoutine(response.data || []);
    } finally {
      setUpdatingRoutine(false);
    }
  };

  const getTodayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Calculate routine completion stats
  const completedDays = routine.filter(day => day.completed).length;
  const totalDays = routine.length;
  const completionPercentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  if (authLoading || loading) {
    return <Preloader text="SYNCING OPERATIONAL_ROUTINES..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="myroutines-container fusion-theme">
      <div className="myroutines-header">
        <h1><i className="bi bi-calendar-week"></i> OPERATIONAL_SCHEDULE</h1>
        <p>Monitor and track your weekly workout sequence assigned by command</p>
      </div>

      {/* Progress Overview */}
      <div className="routines-overview">
        <div className="overview-card fusion-card">
          <div className="overview-icon completed">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="overview-info">
            <span className="overview-value">{completedDays}</span>
            <span className="overview-label">UNITS_ARCHIVED</span>
          </div>
        </div>
        <div className="overview-card fusion-card">
          <div className="overview-icon remaining">
            <i className="bi bi-clock-fill"></i>
          </div>
          <div className="overview-info">
            <span className="overview-value">{totalDays - completedDays}</span>
            <span className="overview-label">PENDING_CYCLES</span>
          </div>
        </div>
        <div className="overview-card fusion-card">
          <div className="overview-icon progress">
            <i className="bi bi-graph-up"></i>
          </div>
          <div className="overview-info">
            <span className="overview-value">{completionPercentage}%</span>
            <span className="overview-label">PHASE_SYNC</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-overview-card fusion-card">
        <div className="progress-header">
          <h3>PHASE_PROGRESS</h3>
          <span className="progress-text">{completedDays} OF {totalDays} CYCLES SYNCHRONIZED</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      {/* Routines Grid */}
      {routine.length > 0 ? (
        <div className="routines-grid">
          {routine.map((day, index) => (
            <div
              key={day.day}
              className={`routine-card fusion-card ${day.completed ? 'completed' : ''} ${day.day.toLowerCase() === getTodayName().toLowerCase() ? 'today' : ''}`}
              onClick={() => handleToggleRoutineDay(index)}
            >
              <div className="routine-card-header">
                <div className="day-info">
                  <span className="day-name">{day.day.toUpperCase()}</span>
                  {day.day.toLowerCase() === getTodayName().toLowerCase() && (
                    <span className="today-badge">ACTIVE_NODE</span>
                  )}
                </div>
                <div className={`completion-indicator ${day.completed ? 'completed' : ''}`}>
                  <i className={`bi ${day.completed ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                </div>
              </div>

              <div className="routine-card-body">
                {day.workout ? (
                  <div className="workout-name">
                    <i className="bi bi-dumbbell"></i>
                    <span>{day.workout.toUpperCase()}</span>
                  </div>
                ) : (
                  <div className="rest-day">
                    <i className="bi bi-cup-hot"></i>
                    <span>SYSTEM_RECOVERY</span>
                  </div>
                )}

                {day.exercises && day.exercises.length > 0 && (
                  <div className="exercises-list">
                    <h4>COMPONENTS:</h4>
                    {day.exercises.map((ex, i) => (
                      <div key={i} className="exercise-item">
                        <span className="exercise-name">{ex.name.toUpperCase()}</span>
                        {ex.sets && ex.reps && (
                          <span className="exercise-sets-reps">{ex.sets} × {ex.reps}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="routine-card-footer">
                <span className={`status-badge ${day.completed ? 'completed' : 'pending'}`}>
                  {day.completed ? (
                    <>
                      <i className="bi bi-check-lg"></i> ARCHIVED
                    </>
                  ) : (
                    <>
                      <i className="bi bi-circle"></i> PENDING
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-routines fusion-card">
          <div className="empty-icon">
            <i className="bi bi-calendar-x"></i>
          </div>
          <h3>NO_ROUTINES_ASSIGNED</h3>
          <p>Command hasn't established your weekly operational sequence yet.</p>
          <p>Await further transmission or contact command center for deployment.</p>
        </div>
      )}
    </div>
  );
}
