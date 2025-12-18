import React, { useState } from 'react';
import { createWorkout } from '../services/api';

export default function WorkoutSuggestionModal({ suggestions, onClose, userId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentSuggestion = suggestions[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? suggestions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === suggestions.length - 1 ? 0 : prev + 1));
  };

  const toggleWorkoutSelection = (workout) => {
    setSelectedWorkouts((prev) => {
      const isSelected = prev.some((w) => w._id === workout._id);
      if (isSelected) {
        return prev.filter((w) => w._id !== workout._id);
      } else {
        return [...prev, workout];
      }
    });
  };

  const handleStartWorkouts = async () => {
    if (selectedWorkouts.length === 0) {
      setError('Please select at least one workout');
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (const workout of selectedWorkouts) {
        await createWorkout({
          name: workout.name,
          description: workout.description,
          exercises: [],
          duration: 0,
          caloriesBurned: 0,
          notes: `Started from suggestion: ${workout.description}`,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create workouts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '20px', border: 'none' }}>
          <div className="modal-header" style={{ borderBottom: 'none', padding: '30px 30px 20px' }}>
            <h5 className="modal-title fw-bold" style={{ color: '#ff6b6b' }}>
              <i className="bi bi-lightning-charge"></i> Workout Suggestions
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <div className="modal-body" style={{ padding: '20px 30px' }}>
            {error && <div className="alert alert-danger">{error}</div>}

            {suggestions.length > 0 && (
              <div>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                    borderRadius: '15px',
                    padding: '30px',
                    color: 'white',
                    marginBottom: '25px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '14px', opacity: 0.9 }}>
                      {currentIndex + 1} of {suggestions.length}
                    </span>
                    <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px' }}>
                      {currentSuggestion.category}
                    </span>
                  </div>
                  <h3 style={{ marginBottom: '10px', fontSize: '28px', fontWeight: 800 }}>
                    {currentSuggestion.name}
                  </h3>
                  <p style={{ marginBottom: '15px', opacity: 0.95, lineHeight: 1.5 }}>
                    {currentSuggestion.description}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '14px' }}>
                    <div>
                      <strong>Muscle Group:</strong> {currentSuggestion.muscleGroup}
                    </div>
                    <div>
                      <strong>Difficulty:</strong> {currentSuggestion.difficulty}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                    <strong>Instructions:</strong>
                  </p>
                  <p style={{ color: '#666', lineHeight: 1.6, fontSize: '15px' }}>
                    {currentSuggestion.instructions}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '25px' }}>
                  <button
                    className="btn"
                    onClick={handlePrevious}
                    disabled={loading}
                    style={{
                      background: '#f0f0f0',
                      border: 'none',
                      borderRadius: '50px',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bi bi-chevron-left" style={{ fontSize: '20px', color: '#ff6b6b' }}></i>
                  </button>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {suggestions.map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: idx === currentIndex ? '#ff6b6b' : '#ddd',
                          transition: 'all 0.3s ease',
                        }}
                      ></div>
                    ))}
                  </div>

                  <button
                    className="btn"
                    onClick={handleNext}
                    disabled={loading}
                    style={{
                      background: '#f0f0f0',
                      border: 'none',
                      borderRadius: '50px',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bi bi-chevron-right" style={{ fontSize: '20px', color: '#ff6b6b' }}></i>
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      checked={selectedWorkouts.some((w) => w._id === currentSuggestion._id)}
                      onChange={() => toggleWorkoutSelection(currentSuggestion)}
                      disabled={loading}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, color: '#333' }}>Add this workout to my routine</span>
                  </label>
                </div>

                {selectedWorkouts.length > 0 && (
                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                      <strong>{selectedWorkouts.length} workout(s) selected:</strong>
                    </p>
                    <div>
                      {selectedWorkouts.map((w) => (
                        <div
                          key={w._id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px solid #ddd',
                          }}
                        >
                          <span style={{ color: '#333', fontSize: '14px' }}>{w.name}</span>
                          <button
                            onClick={() => toggleWorkoutSelection(w)}
                            disabled={loading}
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
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', padding: '20px 30px 30px' }}>
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
              style={{ background: '#f0f0f0', color: '#333', borderRadius: '50px', fontWeight: 600, border: 'none' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleStartWorkouts}
              disabled={loading || selectedWorkouts.length === 0}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                color: 'white',
                borderRadius: '50px',
                fontWeight: 600,
                border: 'none',
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Starting...
                </>
              ) : (
                <>
                  <i className="bi bi-play-fill me-2"></i>
                  Start Workouts
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
