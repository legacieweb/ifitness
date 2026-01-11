import React, { useState, useEffect } from 'react';
import { getExercises, createWorkout } from '../services/api';
import './Modals.css';

export default function CustomWorkoutModal({ onClose, onWorkoutCreated }) {
  const [workoutName, setWorkoutName] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [notes, setNotes] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await getExercises({});
      setAllExercises(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load exercises');
      setLoading(false);
    }
  };

  const filteredExercises = allExercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = !categoryFilter || ex.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e._id === exercise._id);
      if (isSelected) {
        return prev.filter((e) => e._id !== exercise._id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const calculateStats = () => {
    const duration = selectedExercises.length * 5;
    const caloriesBurned = duration * 5;
    return { duration, caloriesBurned };
  };

  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) {
      setError('Please enter a workout name');
      return;
    }

    if (selectedExercises.length === 0) {
      setError('Please select at least one exercise');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { duration, caloriesBurned } = calculateStats();
      
      const workoutData = {
        name: workoutName,
        description: `Custom ${difficulty} workout with ${selectedExercises.length} exercises`,
        exercises: selectedExercises.map((ex) => ({
          exerciseId: ex._id,
          sets: 3,
          reps: 12,
          weight: 0,
          notes: '',
        })),
        duration,
        caloriesBurned,
        notes,
      };
      
      await createWorkout(workoutData);

      setWorkoutName('');
      setSelectedExercises([]);
      setNotes('');
      setDifficulty('intermediate');
      setError('');

      onWorkoutCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setWorkoutName('');
    setSelectedExercises([]);
    setNotes('');
    setDifficulty('intermediate');
    setError('');
    setSearchFilter('');
    setCategoryFilter('');
    onClose();
  };

  const { duration, caloriesBurned } = calculateStats();

  return (
    <div className="modal-backdrop-custom" onClick={handleClose}>
      <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
        <div className="modal-header-custom">
          <h5><i className="bi bi-plus-circle-fill"></i> Create Custom Workout</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            disabled={submitting}
          ></button>
        </div>

        <div className="modal-body-custom">
          {error && <div className="alert alert-danger rounded-4 py-3">{error}</div>}

          <div className="modal-form-group">
            <label className="modal-form-label">Workout Name</label>
            <input
              type="text"
              className="modal-form-control"
              placeholder="e.g., Upper Body Strength"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="modal-form-group">
                <label className="modal-form-label">Difficulty Level</label>
                <select
                  className="modal-form-control"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={submitting}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="modal-form-group">
                <label className="modal-form-label">Search Exercises</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="modal-form-control"
                    placeholder="Search..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    disabled={submitting || loading}
                  />
                  <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-form-group">
            <label className="modal-form-label">Category</label>
            <div className="category-filters">
              {['', 'cardio', 'strength', 'flexibility', 'balance'].map((cat) => (
                <div
                  key={cat}
                  className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => !submitting && !loading && setCategoryFilter(cat)}
                >
                  {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All'}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-form-group">
            <label className="modal-form-label">Select Exercises</label>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary spinner-border-sm"></div>
              </div>
            ) : (
              <div className="exercise-selection-list">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-4 text-muted">No exercises found</div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div
                      key={exercise._id}
                      className={`exercise-selection-item ${selectedExercises.some((e) => e._id === exercise._id) ? 'selected' : ''}`}
                      onClick={() => !submitting && toggleExercise(exercise)}
                    >
                      <div className="exercise-checkbox">
                        <i className="bi bi-check-lg"></i>
                      </div>
                      <div className="exercise-info">
                        <div className="exercise-name">{exercise.name}</div>
                        <div className="exercise-meta">
                          {exercise.category} • {exercise.muscleGroup}
                        </div>
                      </div>
                      <span className="difficulty-tag">
                        {exercise.difficulty}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="modal-form-group mt-4">
            <label className="modal-form-label">Workout Notes</label>
            <textarea
              className="modal-form-control"
              placeholder="Add any additional notes or goals..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
              rows="2"
            />
          </div>

          {selectedExercises.length > 0 && (
            <div className="modal-stats-card fade-in">
              <div className="stat-group">
                <div className="label">Estimated Duration</div>
                <div className="value">{duration} min</div>
              </div>
              <div className="stat-group">
                <div className="label">Calories Burned</div>
                <div className="value">{caloriesBurned} kcal</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer-custom">
          <button
            type="button"
            className="btn-modern-cancel"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modern-primary"
            onClick={handleCreateWorkout}
            disabled={submitting || selectedExercises.length === 0 || !workoutName.trim()}
          >
            {submitting ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
            ) : (
              <><i className="bi bi-check-circle-fill me-2"></i>Create Workout</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
