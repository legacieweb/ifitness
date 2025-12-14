import React, { useState, useEffect } from 'react';
import { getExercises, createWorkout } from '../services/api';

export default function CustomWorkoutModal({ onClose, onWorkoutCreated }) {
  const [workoutName, setWorkoutName] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([]);
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
      
      await createWorkout({
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
      });

      onWorkoutCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  const { duration, caloriesBurned } = calculateStats();

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-content" style={{ borderRadius: '20px', border: 'none' }}>
          <div className="modal-header" style={{ borderBottom: 'none', padding: '30px 30px 20px' }}>
            <h5 className="modal-title fw-bold" style={{ color: '#ff6b6b' }}>
              <i className="bi bi-dumbbell"></i> Create Custom Workout
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            ></button>
          </div>

          <div className="modal-body" style={{ padding: '20px 30px' }}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-4">
              <label className="form-label fw-bold">Workout Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Upper Body Strength"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                disabled={submitting}
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Difficulty Level</label>
                <select
                  className="form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={submitting}
                  style={{ borderRadius: '10px', padding: '12px' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Search Exercises</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  disabled={submitting || loading}
                  style={{ borderRadius: '10px', padding: '12px' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Filter by Category</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['', 'cardio', 'strength', 'flexibility', 'balance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    disabled={submitting || loading}
                    style={{
                      background: categoryFilter === cat ? '#ff6b6b' : '#f0f0f0',
                      color: categoryFilter === cat ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {cat || 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Select Exercises</label>
              {loading ? (
                <p className="text-muted">Loading exercises...</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '10px', padding: '15px' }}>
                  {filteredExercises.length === 0 ? (
                    <p className="text-muted">No exercises found</p>
                  ) : (
                    filteredExercises.map((exercise) => (
                      <label
                        key={exercise._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          padding: '12px 0',
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedExercises.some((e) => e._id === exercise._id)}
                          onChange={() => toggleExercise(exercise)}
                          disabled={submitting}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#333' }}>{exercise.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {exercise.category} • {exercise.muscleGroup}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '12px',
                            background: '#f0f0f0',
                            padding: '4px 10px',
                            borderRadius: '10px',
                            color: '#666',
                          }}
                        >
                          {exercise.difficulty}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedExercises.length > 0 && (
              <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: 600 }}>
                  {selectedExercises.length} exercise(s) selected
                </p>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {selectedExercises.map((ex) => (
                    <div
                      key={ex._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      <span style={{ color: '#333', fontSize: '14px' }}>{ex.name}</span>
                      <button
                        onClick={() => toggleExercise(ex)}
                        disabled={submitting}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          fontSize: '18px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="form-label fw-bold">Workout Notes</label>
              <textarea
                className="form-control"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                rows="3"
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </div>

            {selectedExercises.length > 0 && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                  borderRadius: '15px',
                  padding: '20px',
                  color: 'white',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Estimated Duration</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{duration} min</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Estimated Calories</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{caloriesBurned} kcal</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', padding: '20px 30px 30px' }}>
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={submitting}
              style={{ background: '#f0f0f0', color: '#333', borderRadius: '50px', fontWeight: 600, border: 'none' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleCreateWorkout}
              disabled={submitting || selectedExercises.length === 0 || !workoutName.trim()}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                color: 'white',
                borderRadius: '50px',
                fontWeight: 600,
                border: 'none',
              }}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Create Workout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
