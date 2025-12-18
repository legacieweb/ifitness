import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout } from '../services/api';

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
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  if (!workout) {
    return <div className="container mt-5"><p>Workout not found</p></div>;
  }

  return (
    <div className="container mt-5">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        ← Back
      </button>

      <div className="card">
        <div className="card-body">
          <h2>{workout.name}</h2>
          <p className="text-muted">{workout.description}</p>

          <div className="row mt-4">
            <div className="col-md-3">
              <strong>Date:</strong>
              <p>{new Date(workout.date).toLocaleDateString()}</p>
            </div>
            <div className="col-md-3">
              <strong>Duration:</strong>
              <p>{workout.duration} minutes</p>
            </div>
            <div className="col-md-3">
              <strong>Calories Burned:</strong>
              <p>{workout.caloriesBurned || 'Not tracked'}</p>
            </div>
          </div>

          {workout.exercises && workout.exercises.length > 0 && (
            <div className="mt-4">
              <h4>Exercises</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((ex, idx) => (
                    <tr key={idx}>
                      <td>
                        {ex.exerciseId?.name || 'Unknown'}
                      </td>
                      <td>{ex.sets}</td>
                      <td>{ex.reps}</td>
                      <td>{ex.weight || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {workout.notes && (
            <div className="mt-4">
              <strong>Notes:</strong>
              <p>{workout.notes}</p>
            </div>
          )}

          <button onClick={() => navigate(`/workouts/${id}/edit`)} className="btn btn-warning me-2">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
