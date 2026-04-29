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
    return <Preloader text="RETRIEVING_PROTOCOL_DATA..." />;
  }

  if (!workout) {
    return (
      <div className="workout-detail-container mt-5">
        <p className="text-center text-primary">PROTOCOL_NOT_LOCATED</p>
        <button onClick={() => navigate('/workouts')} className="btn-detail-action btn-back mx-auto d-block">
          RETURN_TO_ARCHIVE
        </button>
      </div>
    );
  }

  return (
    <div className="workout-detail-container fusion-theme">
      <div className="detail-header">
        <div>
          <h1 className="detail-title">{workout.name.toUpperCase()}</h1>
          <p className="m-0 text-muted">OPERATIONAL_ID: #{workout._id?.substring(0, 8).toUpperCase()}</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate(-1)} className="btn-detail-action btn-back">
            <i className="bi bi-arrow-left me-2"></i> RETURN
          </button>
          <button onClick={() => navigate(`/workouts/${id}/edit`)} className="btn-detail-action btn-edit-workout">
            <i className="bi bi-cpu-fill me-2"></i> CALIBRATE
          </button>
        </div>
      </div>

      <div className="detail-card fusion-card">
        {workout.description && (
          <p className="detail-description">{workout.description.toUpperCase()}</p>
        )}

        <div className="detail-stats-grid">
          <div className="detail-stat-item">
            <span className="detail-stat-label">TIMESTAMP</span>
            <span className="detail-stat-value">{new Date(workout.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-stat-item">
            <span className="detail-stat-label">UPTIME</span>
            <span className="detail-stat-value">{workout.duration} MIN</span>
          </div>
          <div className="detail-stat-item">
            <span className="detail-stat-label">ENERGY_YIELD</span>
            <span className="detail-stat-value">{workout.caloriesBurned || '0'} KCAL</span>
          </div>
        </div>

        {workout.exercises && workout.exercises.length > 0 && (
          <div className="exercises-section mt-5">
            <h4>INTEGRATED_COMPONENTS</h4>
            <div className="table-responsive">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>COMPONENT_ID</th>
                    <th>CYCLES</th>
                    <th>REPETITIONS</th>
                    <th>LOAD</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((ex, idx) => (
                    <tr key={idx}>
                      <td>{ex.exerciseId?.name?.toUpperCase() || 'UNKNOWN_MODULE'}</td>
                      <td>{ex.sets}</td>
                      <td>{ex.reps}</td>
                      <td>{ex.weight ? `${ex.weight} KG` : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {workout.notes && (
          <div className="detail-notes">
            <strong>OPERATIONAL_ANNOTATIONS</strong>
            <p>{workout.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
