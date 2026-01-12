import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkout, updateWorkout, getExercises } from '../services/api';
import './WorkoutForm.css';

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
    return <Preloader text="Loading workout editor..." />;
  }

  return (
    <div className="workout-form-page">
      <div className="container">
        <div className="form-header-modern">
          <button className="btn btn-link text-decoration-none p-0 mb-3 text-muted" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i> Back to Workout
          </button>
          <h1>Edit Workout Details</h1>
          <p>Update your session statistics and exercise progress</p>
        </div>

        {error && <div className="alert alert-danger rounded-4 py-3 mb-4">{error}</div>}

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="workout-card-edit fade-in">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label-modern">Workout Name</label>
                  <input
                    type="text"
                    className="form-control-modern"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label-modern">Description</label>
                  <textarea
                    className="form-control-modern"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label-modern">Duration (min)</label>
                      <input
                        type="number"
                        className="form-control-modern"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label-modern">Calories Burned</label>
                      <input
                        type="number"
                        className="form-control-modern"
                        name="caloriesBurned"
                        value={formData.caloriesBurned}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label-modern">Notes</label>
                  <textarea
                    className="form-control-modern"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                  ></textarea>
                </div>

                <div className="d-flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="btn-custom-main btn-custom-primary flex-grow-1"
                    disabled={saving}
                  >
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-cloud-check-fill me-2"></i>Save Changes</>}
                  </button>
                  <button
                    type="button"
                    className="btn-custom-main btn-custom-outline px-4"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="exercise-manager-card fade-in">
              <h5 className="fw-bold mb-4">Exercises</h5>
              
              <div className="mb-4">
                <label className="form-label-modern">Add Exercise</label>
                <select
                  className="form-control-modern"
                  onChange={(e) => handleAddExercise(e.target.value)}
                  value=""
                >
                  <option value="">Select from library...</option>
                  {exercises.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {selectedExercises.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-list-task fs-1 d-block mb-2"></i>
                    <p className="small">No exercises added yet</p>
                  </div>
                ) : (
                  selectedExercises.map((ex) => (
                    <div key={ex.exerciseId?._id} className="exercise-item-edit">
                      <div className="exercise-header-edit">
                        <span className="exercise-title-edit">{ex.exerciseId?.name}</span>
                        <button
                          type="button"
                          className="btn-remove-ex"
                          onClick={() => handleRemoveExercise(ex.exerciseId?._id)}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <div className="exercise-stats-edit">
                        <div className="ex-input-group">
                          <label>Sets</label>
                          <input
                            type="number"
                            className="ex-control-sm"
                            value={ex.sets}
                            onChange={(e) => handleExerciseChange(ex.exerciseId?._id, 'sets', e.target.value)}
                          />
                        </div>
                        <div className="ex-input-group">
                          <label>Reps</label>
                          <input
                            type="number"
                            className="ex-control-sm"
                            value={ex.reps}
                            onChange={(e) => handleExerciseChange(ex.exerciseId?._id, 'reps', e.target.value)}
                          />
                        </div>
                        <div className="ex-input-group">
                          <label>Weight</label>
                          <input
                            type="number"
                            className="ex-control-sm"
                            value={ex.weight}
                            onChange={(e) => handleExerciseChange(ex.exerciseId?._id, 'weight', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
