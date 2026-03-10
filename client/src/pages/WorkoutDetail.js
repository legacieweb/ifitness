import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout } from '../services/api';
import Preloader from '../components/Preloader';
import './WorkoutDetail.css';

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await getWorkout(id);
        setWorkout(response.data);
      } catch (error) {
        console.error('Failed to fetch workout:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  if (loading) {
    return <Preloader text="Loading workout details..." />;
  }

  if (!workout) {
    return (
      <div className="workout-detail-container mt-5">
        <p className="text-center">Workout not found</p>
        <button onClick={() => navigate('/workouts')} className="btn-detail-action btn-back mx-auto d-block">
          Back to Workouts
        </button>
      </div>
    );
  }

  return (
    <div className="workout-detail-container">
      <div className="detail-header">
        <div>
          <h1 className="detail-title">{workout.name}</h1>
          <p className="m-0 text-muted">Protocol ID: #{workout._id?.substring(0, 8)}</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate(-1)} className="btn-detail-action btn-back">
            <i className="bi bi-arrow-left me-2"></i> Back
          </button>
          <button onClick={() => navigate(`/workouts/${id}/edit`)} className="btn-detail-action btn-edit-workout">
            <i className="bi bi-pencil-square me-2"></i> Edit
          </button>
        </div>
      </div>

      <div className="detail-card">
        {workout.description && (
          <p className="detail-description">{workout.description}</p>
        )}

        <div className="detail-stats-grid">
          <div className="detail-stat-item">
            <span className="detail-stat-label">Date Recorded</span>
            <span className="detail-stat-value">{new Date(workout.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="detail-stat-item">
            <span className="detail-stat-label">Total Duration</span>
            <span className="detail-stat-value">{workout.duration} MIN</span>
          </div>
          <div className="detail-stat-item">
            <span className="detail-stat-label">Energy Burned</span>
            <span className="detail-stat-value">{workout.caloriesBurned || '0'} KCAL</span>
          </div>
        </div>

        {workout.exercises && workout.exercises.length > 0 && (
          <div className="exercises-section mt-5">
            <h4>Training Exercises</h4>
            <div className="table-responsive">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Exercise Name</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((ex, idx) => (
                    <tr key={idx}>
                      <td>{ex.exerciseId?.name || 'Unknown Exercise'}</td>
                      <td>{ex.sets}</td>
                      <td>{ex.reps}</td>
                      <td>{ex.weight ? `${ex.weight} kg` : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {workout.notes && (
          <div className="detail-notes">
            <strong>Commander's Notes</strong>
            <p>{workout.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
