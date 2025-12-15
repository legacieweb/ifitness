import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExercises, createWorkout } from '../services/api';
import './CreateWorkout.css';

export default function CreateWorkout() {
  const navigate = useNavigate();
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
  const [showExerciseList, setShowExerciseList] = useState(false);

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
      navigate('/workouts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  const { duration, caloriesBurned } = calculateStats();

  if (loading) {
    return (
      <div className="create-workout-container">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-body"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-workout-page">
      <div className="workout-header-section">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="header-content">
          <h1><i className="bi bi-dumbbell"></i> Create Custom Workout</h1>
          <p>Build your personalized fitness routine</p>
        </div>
      </div>

      <div className="create-workout-container">
        <div className="workout-form-section">
          {error && (
            <div className="alert-error">
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="form-card">
            <div className="form-header">
              <h2>Workout Details</h2>
              <p>Give your workout a name and difficulty level</p>
            </div>

            <div className="form-group">
              <label htmlFor="workoutName" className="form-label">
                <i className="bi bi-pencil"></i> Workout Name
              </label>
              <input
                type="text"
                id="workoutName"
                className="form-input"
                placeholder="e.g., Upper Body Strength"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                disabled={submitting}
              />
              <div className="input-hint">Give your workout a descriptive name</div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <i className="bi bi-speedometer2"></i> Difficulty Level
                </label>
                <select
                  className="form-select"
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

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                <i className="bi bi-chat"></i> Notes (Optional)
              </label>
              <textarea
                id="notes"
                className="form-textarea"
                placeholder="Add any additional notes about this workout..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                rows="3"
              />
            </div>
          </div>

          <div className="form-card">
            <div className="form-header">
              <h2>Select Exercises</h2>
              <p>Choose exercises to add to your workout</p>
            </div>

            <div className="search-filters">
              <div className="search-box">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="category-filters">
                {['', 'cardio', 'strength', 'flexibility', 'balance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    disabled={submitting}
                    className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                  >
                    {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="exercises-grid">
              {filteredExercises.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-inbox"></i>
                  <p>No exercises found</p>
                </div>
              ) : (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise._id}
                    className={`exercise-card ${selectedExercises.some((e) => e._id === exercise._id) ? 'selected' : ''}`}
                    onClick={() => toggleExercise(exercise)}
                  >
                    <div className="exercise-header">
                      <div className="exercise-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedExercises.some((e) => e._id === exercise._id)}
                          onChange={() => {}}
                          disabled={submitting}
                        />
                      </div>
                      <div className="exercise-title">
                        <h4>{exercise.name}</h4>
                        <p className="category-badge">{exercise.category}</p>
                      </div>
                    </div>
                    <div className="exercise-meta">
                      <span className="muscle-group">{exercise.muscleGroup}</span>
                      <span className={`difficulty ${exercise.difficulty}`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="workout-summary-section">
          <div className="summary-sticky">
            <div className="summary-card">
              <h3>Selected Exercises</h3>
              <div className="selected-count">
                <div className="count-badge">{selectedExercises.length}</div>
                <span>exercises selected</span>
              </div>

              {selectedExercises.length > 0 && (
                <div className="selected-list">
                  {selectedExercises.map((ex) => (
                    <div key={ex._id} className="selected-item">
                      <span>{ex.name}</span>
                      <button
                        onClick={() => toggleExercise(ex)}
                        disabled={submitting}
                        className="btn-remove"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedExercises.length > 0 && (
              <div className="summary-card stats-card">
                <h3>Estimated Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <i className="bi bi-hourglass-split"></i>
                    <div>
                      <div className="stat-value">{duration}</div>
                      <div className="stat-label">minutes</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-fire"></i>
                    <div>
                      <div className="stat-value">{caloriesBurned}</div>
                      <div className="stat-label">calories</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn-secondary"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateWorkout}
                disabled={submitting || selectedExercises.length === 0 || !workoutName.trim()}
              >
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i>
                    Create Workout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
