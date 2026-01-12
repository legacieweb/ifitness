import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';
import './AdminDashboard.css';
import './AdminBootcamp.css'; // Reusing styles

export default function AdminOutdoorActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    activityType: '',
    expectations: '',
    startTime: '',
    endTime: '',
    difficulty: 'Intermediate',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/outdoor-activities');
      const data = await response.json();
      setActivities(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
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
        ? `/api/outdoor-activities/${editingId}`
        : '/api/outdoor-activities';

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
          location: '',
          activityType: '',
          expectations: '',
          startTime: '',
          endTime: '',
          difficulty: 'Intermediate',
        });
        setShowForm(false);
        setEditingId(null);
        fetchActivities();
      }
    } catch (err) {
      console.error('Error saving activity:', err);
    }
  };

  const handleEdit = (activity) => {
    setFormData({
      title: activity.title,
      description: activity.description,
      location: activity.location,
      activityType: activity.activityType,
      expectations: activity.expectations,
      startTime: activity.startTime.slice(0, 16),
      endTime: activity.endTime.slice(0, 16),
      difficulty: activity.difficulty,
    });
    setEditingId(activity._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/outdoor-activities/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchActivities();
      } catch (err) {
        console.error('Error deleting activity:', err);
      }
    }
  };

  const handleInviteAll = async (id) => {
    if (window.confirm('Invite all users to this activity?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/outdoor-activities/${id}/invite-all`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) alert('Invitations sent to all users!');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <Preloader text="Loading outdoor activities..." />;

  return (
    <div className="admin-wrapper">
      <div className="admin-header-section mb-4">
        <div className="header-content">
          <div className="d-flex align-items-center gap-3">
            <div className="admin-avatar-placeholder" style={{ backgroundColor: '#00b09b' }}>
              <i className="bi bi-tree"></i>
            </div>
            <div>
              <h1>Outdoor Activities</h1>
              <p className="header-subtitle">Plan and manage community outdoor fitness events</p>
            </div>
          </div>
          <button
            className={`btn ${showForm ? 'btn-outline-danger' : 'btn-modern-primary'}`}
            style={!showForm ? { backgroundColor: '#00b09b', borderColor: '#00b09b' } : {}}
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
          >
            {showForm ? 'Close Form' : 'New Activity'}
          </button>
        </div>
      </div>

      <div className="admin-container">
        {showForm && (
          <div className="bootcamp-form-card fade-in">
            <h3 className="fw-bold mb-4">{editingId ? 'Edit Activity' : 'Plan New Outdoor Activity'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="bootcamp-input-group">
                    <label>Activity Title</label>
                    <input type="text" className="bootcamp-control" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="bootcamp-input-group">
                    <label>Type</label>
                    <input type="text" className="bootcamp-control" name="activityType" placeholder="Hiking, Yoga, etc." value={formData.activityType} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="bootcamp-input-group">
                    <label>Difficulty</label>
                    <select className="bootcamp-control" name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bootcamp-input-group">
                <label>Location</label>
                <input type="text" className="bootcamp-control" name="location" placeholder="City Park, Beachfront, etc." value={formData.location} onChange={handleInputChange} required />
              </div>

              <div className="bootcamp-input-group">
                <label>Description</label>
                <textarea className="bootcamp-control" name="description" value={formData.description} onChange={handleInputChange} rows="2" required></textarea>
              </div>

              <div className="bootcamp-input-group">
                <label>Expectations</label>
                <textarea className="bootcamp-control" name="expectations" value={formData.expectations} onChange={handleInputChange} rows="2" required></textarea>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="bootcamp-input-group">
                    <label>Start Time</label>
                    <input type="datetime-local" className="bootcamp-control" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bootcamp-input-group">
                    <label>End Time</label>
                    <input type="datetime-local" className="bootcamp-control" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              <div className="text-end mt-2">
                <button type="submit" className="btn btn-modern-primary px-5" style={{ backgroundColor: '#00b09b', borderColor: '#00b09b' }}>
                  {editingId ? 'Update Activity' : 'Plan Activity'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bootcamp-grid">
          {activities.map((activity) => (
            <div key={activity._id} className="bootcamp-card-modern">
              <div className="bootcamp-card-header">
                <span className={`difficulty-pill ${activity.difficulty.toLowerCase()}`}>
                  {activity.difficulty}
                </span>
                <div className="bootcamp-actions">
                  <button className="action-btn-circle invite" onClick={() => handleInviteAll(activity._id)} title="Invite All">
                    <i className="bi bi-send-fill"></i>
                  </button>
                  <button className="action-btn-circle edit" onClick={() => handleEdit(activity)} title="Edit">
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button className="action-btn-circle delete" onClick={() => handleDelete(activity._id)} title="Delete">
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
              <h4 className="bootcamp-title-modern">{activity.title}</h4>
              <p className="bootcamp-desc-modern">{activity.description}</p>
              <div className="bootcamp-stats-strip">
                <div className="stat-item-row">
                  <i className="bi bi-geo-alt"></i>
                  <span>Location: <span className="value">{activity.location}</span></span>
                </div>
                <div className="stat-item-row">
                  <i className="bi bi-calendar2-event"></i>
                  <span>Start: <span className="value">{new Date(activity.startTime).toLocaleDateString()}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
