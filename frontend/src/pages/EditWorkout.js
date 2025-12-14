import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkout, updateWorkout, getExercises } from '../services/api';

export default function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    caloriesBurned: '',
    notes: '',
  });
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutRes = await getWorkout(id);
        const exercisesRes = await getExercises({});

        const workout = workoutRes.data;
        setFormData({
          name: workout.name || '',
          description: workout.description || '',
          duration: workout.duration || '',
          caloriesBurned: workout.caloriesBurned || '',
          notes: workout.notes || '',
        });

        setExercises(exercisesRes.data);
        setSelectedExercises(workout.exercises || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load workout');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExercise = (exerciseId) => {
    const exercise = exercises.find((e) => e._id === exerciseId);
    if (exercise && !selectedExercises.find((e) => e.exerciseId?._id === exerciseId)) {
      setSelectedExercises([
        ...selectedExercises,
        { exerciseId: exercise, sets: 3, reps: 10, weight: 0 },
      ]);
    }
  };

  const handleRemoveExercise = (exerciseId) => {
    setSelectedExercises(
      selectedExercises.filter((e) => e.exerciseId?._id !== exerciseId)
    );
  };

  const handleExerciseChange = (exerciseId, field, value) => {
    setSelectedExercises(
      selectedExercises.map((e) =>
        e.exerciseId?._id === exerciseId ? { ...e, [field]: value } : e
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const workoutData = {
        ...formData,
        duration: parseInt(formData.duration),
        caloriesBurned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : 0,
        exercises: selectedExercises.map((e) => ({
          exerciseId: e.exerciseId?._id || e.exerciseId,
          sets: parseInt(e.sets),
          reps: parseInt(e.reps),
          weight: e.weight ? parseInt(e.weight) : 0,
        })),
      };

      await updateWorkout(id, workoutData);
      navigate(`/workouts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update workout');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Edit Workout</h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Workout Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="caloriesBurned" className="form-label">Calories Burned (optional)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="caloriesBurned"
                        name="caloriesBurned"
                        value={formData.caloriesBurned}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Exercises</h5>
              <div className="mb-3">
                <select
                  className="form-select"
                  onChange={(e) => handleAddExercise(e.target.value)}
                  value=""
                >
                  <option value="">Add exercise</option>
                  {exercises.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedExercises.map((ex) => (
                <div key={ex.exerciseId?._id} className="mb-3 p-2 border rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">{ex.exerciseId?.name}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveExercise(ex.exerciseId?._id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(ex.exerciseId?._id, 'sets', e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(ex.exerciseId?._id, 'reps', e.target.value)}
                      />
                    </div>
                  </div>
                  <input
                    type="number"
                    className="form-control form-control-sm mt-2"
                    placeholder="Weight (kg)"
                    value={ex.weight}
                    onChange={(e) => handleExerciseChange(ex.exerciseId?._id, 'weight', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
