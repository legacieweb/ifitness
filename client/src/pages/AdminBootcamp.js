import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';
import './AdminDashboard.css';
import './AdminBootcamp.css';

export default function AdminBootcamp() {
  const { user } = useAuth();
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expectations: '',
    startTime: '',
    endTime: '',
    difficulty: 'Intermediate',
    exercises: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const fetchBootcamps = async () => {
    try {
      const response = await fetch('/api/bootcamps');
      const data = await response.json();
      setBootcamps(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bootcamps:', err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/bootcamps/${editingId}`
        : '/api/bootcamps';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          expectations: '',
          startTime: '',
          endTime: '',
          difficulty: 'Intermediate',
          exercises: [],
        });
        setShowForm(false);
        setEditingId(null);
        fetchBootcamps();
      }
    } catch (err) {
      console.error('Error saving bootcamp:', err);
    }
  };

  const handleEdit = (bootcamp) => {
    setFormData({
      title: bootcamp.title,
      description: bootcamp.description,
      expectations: bootcamp.expectations,
      startTime: bootcamp.startTime.slice(0, 16),
      endTime: bootcamp.endTime.slice(0, 16),
      difficulty: bootcamp.difficulty,
      exercises: bootcamp.exercises,
    });
    setEditingId(bootcamp._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this bootcamp?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/bootcamps/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBootcamps();
      } catch (err) {
        console.error('Error deleting bootcamp:', err);
      }
    }
  };

  if (loading) return <Preloader text="Loading bootcamp management..." />;

  return (
    <div className="admin-wrapper">
      <div className="admin-header-section mb-4">
        <div className="header-content">
          <div className="d-flex align-items-center gap-3">
            <div className="admin-avatar-placeholder">
              <i className="bi bi-rocket-takeoff"></i>
            </div>
            <div>
              <h1>Bootcamp Programs</h1>
              <p className="header-subtitle">Create and manage intensive fitness challenges</p>
            </div>
          </div>
          <button
            className={`btn ${showForm ? 'btn-outline-danger' : 'btn-modern-primary'}`}
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                expectations: '',
                startTime: '',
                endTime: '',
                difficulty: 'Intermediate',
                exercises: [],
              });
            }}
          >
            {showForm ? <><i className="bi bi-x-lg me-2"></i>Close Form</> : <><i className="bi bi-plus-lg me-2"></i>New Program</>}
          </button>
        </div>
      </div>

      <div className="admin-container">
        {showForm && (
          <div className="bootcamp-form-card fade-in">
            <h3 className="fw-bold mb-4">{editingId ? 'Edit Program' : 'Design New Program'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="bootcamp-input-group">
                    <label>Program Title</label>
                    <input
                      type="text"
                      className="bootcamp-control"
                      name="title"
                      placeholder="e.g., 30-Day Summer Shred"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bootcamp-input-group">
                    <label>Difficulty Level</label>
                    <select
                      className="bootcamp-control"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bootcamp-input-group">
                <label>Detailed Description</label>
                <textarea
                  className="bootcamp-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the goals and target audience..."
                  required
                ></textarea>
              </div>

              <div className="bootcamp-input-group">
                <label>What Participants Should Expect</label>
                <textarea
                  className="bootcamp-control"
                  name="expectations"
                  value={formData.expectations}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Key takeaways, equipment needed, intensity..."
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="bootcamp-input-group">
                    <label>Launch Date & Time</label>
                    <input
                      type="datetime-local"
                      className="bootcamp-control"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bootcamp-input-group">
                    <label>Conclusion Date & Time</label>
                    <input
                      type="datetime-local"
                      className="bootcamp-control"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="text-end mt-2">
                <button type="submit" className="btn btn-modern-primary px-5">
                  {editingId ? <><i className="bi bi-cloud-check me-2"></i>Update Program</> : <><i className="bi bi-rocket-takeoff me-2"></i>Launch Bootcamp</>}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bootcamp-grid">
          {bootcamps.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-inboxes text-muted fs-1 d-block mb-3"></i>
              <p className="text-muted">No programs created yet.</p>
            </div>
          ) : (
            bootcamps.map((bootcamp) => (
              <div key={bootcamp._id} className="bootcamp-card-modern">
                <div className="bootcamp-card-header">
                  <span className={`difficulty-pill ${bootcamp.difficulty.toLowerCase()}`}>
                    {bootcamp.difficulty}
                  </span>
                  <div className="bootcamp-actions">
                    <button
                      className="action-btn-circle invite"
                      onClick={async () => {
                        if (window.confirm('Invite all users to this bootcamp?')) {
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`/api/bootcamps/${bootcamp._id}/invite-all`, {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (response.ok) alert('Invitations sent to all users!');
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                      title="Invite All"
                    >
                      <i className="bi bi-send-fill"></i>
                    </button>
                    <button
                      className="action-btn-circle edit"
                      onClick={() => handleEdit(bootcamp)}
                      title="Edit"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      className="action-btn-circle delete"
                      onClick={() => handleDelete(bootcamp._id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
                
                <h4 className="bootcamp-title-modern">{bootcamp.title}</h4>
                <p className="bootcamp-desc-modern">{bootcamp.description}</p>
                
                <div className="bootcamp-stats-strip">
                  <div className="stat-item-row">
                    <i className="bi bi-calendar2-event"></i>
                    <span>Start: <span className="value">{new Date(bootcamp.startTime).toLocaleDateString()}</span></span>
                    <span className="ms-auto text-muted small">{new Date(bootcamp.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="stat-item-row">
                    <i className="bi bi-people"></i>
                    <span>Enrolled: <span className="value">{bootcamp.participants.length} Participants</span></span>
                  </div>
                </div>
                
                <button className="view-engagement-btn">
                  View Engagement <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
