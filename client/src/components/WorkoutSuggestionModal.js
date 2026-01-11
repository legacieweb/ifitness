import React, { useState } from 'react';
import { createWorkout } from '../services/api';
import './Modals.css';

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
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
        <div className="modal-header-custom">
          <h5><i className="bi bi-lightning-charge-fill text-warning"></i> Workout Suggestions</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={loading}
          ></button>
        </div>

        <div className="modal-body-custom">
          {error && <div className="alert alert-danger rounded-4 mb-4">{error}</div>}

          {suggestions.length > 0 && (
            <div className="fade-in">
              <div className="suggestion-hero">
                <div className="suggestion-hero-decoration"></div>
                <div className="suggestion-index">
                  Recommendation {currentIndex + 1} of {suggestions.length}
                </div>
                <h3 className="suggestion-name">{currentSuggestion.name}</h3>
                <p className="suggestion-desc">{currentSuggestion.description}</p>
                
                <div className="suggestion-meta-row">
                  <div className="suggestion-meta-item">
                    <i className="bi bi-bullseye"></i>
                    <span>{currentSuggestion.muscleGroup}</span>
                  </div>
                  <div className="suggestion-meta-item">
                    <i className="bi bi-speedometer2"></i>
                    <span>{currentSuggestion.difficulty}</span>
                  </div>
                  <div className="suggestion-meta-item">
                    <i className="bi bi-tag"></i>
                    <span>{currentSuggestion.category}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small tracking-wider text-muted">Instructions</h6>
                <p className="instruction-text">{currentSuggestion.instructions}</p>
              </div>

              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={handlePrevious}
                  disabled={loading}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <div className="d-flex gap-2 mx-3">
                  {suggestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`page-dot ${idx === currentIndex ? 'active' : ''}`}
                    ></div>
                  ))}
                </div>

                <button
                  className="page-btn"
                  onClick={handleNext}
                  disabled={loading}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>

              <div className="exercise-selection-item rounded-4 mb-4" onClick={() => !loading && toggleWorkoutSelection(currentSuggestion)}>
                <div className="exercise-checkbox">
                  <i className="bi bi-check-lg"></i>
                </div>
                <span className="fw-bold text-dark">Add this workout to my routine</span>
                {selectedWorkouts.some((w) => w._id === currentSuggestion._id) && (
                  <span className="badge bg-success-soft text-success ms-auto">Selected</span>
                )}
              </div>

              {selectedWorkouts.length > 0 && (
                <div className="bg-light rounded-4 p-4 mt-4">
                  <h6 className="fw-bold mb-3 small text-uppercase text-muted">Selected for Routine ({selectedWorkouts.length})</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedWorkouts.map((w) => (
                      <span key={w._id} className="badge bg-white text-primary border px-3 py-2 rounded-pill d-flex align-items-center gap-2">
                        {w.name}
                        <i 
                          className="bi bi-x-circle-fill text-danger cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWorkoutSelection(w);
                          }}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer-custom">
          <button
            type="button"
            className="btn-modern-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modern-primary"
            onClick={handleStartWorkouts}
            disabled={loading || selectedWorkouts.length === 0}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Starting...</>
            ) : (
              <><i className="bi bi-play-fill me-2"></i>Add to Routine</>
            )}
          </button>
        </div>
      </div>
      
      <style>{`
        .bg-success-soft { background-color: rgba(16, 185, 129, 0.1); }
        .cursor-pointer { cursor: pointer; }
        .tracking-wider { letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}
