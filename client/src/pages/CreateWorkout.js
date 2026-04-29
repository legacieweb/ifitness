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
    return <Preloader text="Loading workout creator..." />;
  }

  return (
    <div className="create-workout-page">
      <div className="workout-header-section">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="header-content">
          <h1><i className="bi bi-cpu-fill"></i> INITIALIZE_CUSTOM_PROTOCOL</h1>
          <p>Configure unique operational parameters for your next sequence</p>
        </div>
      </div>

      <div className="create-workout-container">
        <div className="workout-form-section">
          {error && (
            <div className="alert-error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="form-card fusion-card">
            <div className="form-header">
              <h2>PROTOCOL_PARAMETERS</h2>
              <p>Establish primary identifiers and complexity nodes</p>
            </div>

            <div className="form-group">
              <label htmlFor="workoutName" className="form-label">
                <i className="bi bi-terminal-fill"></i> PROTOCOL_IDENTIFIER
              </label>
              <input
                type="text"
                id="workoutName"
                className="form-input"
                placeholder="e.g., UPPER_CHASSIS_OVERLOAD"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                disabled={submitting}
              />
              <div className="input-hint">Assign a unique string to identify this operation</div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <i className="bi bi-node-plus-fill"></i> COMPLEXITY_NODE
                </label>
                <select
                  className="form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={submitting}
                >
                  <option value="beginner">INITIATE</option>
                  <option value="intermediate">OPERATOR</option>
                  <option value="advanced">OVERLORD</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                <i className="bi bi-card-text"></i> OPERATIONAL_ANNOTATIONS
              </label>
              <textarea
                id="notes"
                className="form-textarea"
                placeholder="Include specific execution constraints or system notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                rows="3"
              />
            </div>
          </div>

          <div className="form-card fusion-card">
            <div className="form-header">
              <h2>COMPONENT_SELECTION</h2>
              <p>Select modular components to integrate into the sequence</p>
            </div>

            <div className="search-filters">
              <div className="search-box">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="FILTER_COMPONENTS..."
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
                    {cat ? cat.toUpperCase() : 'ALL_MODULES'}
                  </button>
                ))}
              </div>
            </div>

            <div className="exercises-grid">
              {filteredExercises.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-slash-circle"></i>
                  <p>NO COMPATIBLE COMPONENTS FOUND</p>
                </div>
              ) : (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise._id}
                    className={`exercise-card ${selectedExercises.some((e) => e._id === exercise._id) ? 'selected' : ''}`}
                    onClick={() => toggleExercise(exercise)}
                  >
                    <div className="exercise-header">
                      <div className="exercise-title">
                        <h4>{exercise.name.toUpperCase()}</h4>
                        <p className="category-badge">{exercise.category.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="exercise-meta">
                      <span className="muscle-group">{exercise.muscleGroup.toUpperCase()}</span>
                      <span className={`difficulty ${exercise.difficulty}`}>
                        {exercise.difficulty.toUpperCase()}
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
            <div className="summary-card fusion-card">
              <h3>INTEGRATED_COMPONENTS</h3>
              <div className="selected-count">
                <div className="count-badge">{selectedExercises.length}</div>
                <span>UNITS_STAGED</span>
              </div>

              {selectedExercises.length > 0 && (
                <div className="selected-list">
                  {selectedExercises.map((ex) => (
                    <div key={ex._id} className="selected-item">
                      <span>{ex.name.toUpperCase()}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleExercise(ex); }}
                        disabled={submitting}
                        className="btn-remove"
                      >
                        <i className="bi bi-x-circle-fill"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedExercises.length > 0 && (
              <div className="summary-card stats-card fusion-card">
                <h3>PROJECTED_YIELD</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <i className="bi bi-hourglass-split"></i>
                    <div>
                      <div className="stat-value">{duration}</div>
                      <div className="stat-label">UPTIME</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-fire"></i>
                    <div>
                      <div className="stat-value">{caloriesBurned}</div>
                      <div className="stat-label">ENERGY</div>
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
                ABORT_INITIALIZATION
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateWorkout}
                disabled={submitting || selectedExercises.length === 0 || !workoutName.trim()}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    INITIALIZING...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    COMMIT_PROTOCOL
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
