import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

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

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">Bootcamp Management</h1>

      <button
        className="btn btn-primary mb-4"
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
        {showForm ? '✕ Cancel' : '+ New Bootcamp'}
      </button>

      {showForm && (
        <div className="card mb-4 p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <h3>{editingId ? 'Edit Bootcamp' : 'Create New Bootcamp'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-control"
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

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">What to Expect</label>
              <textarea
                className="form-control"
                name="expectations"
                value={formData.expectations}
                onChange={handleInputChange}
                rows="2"
                required
              ></textarea>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              {editingId ? 'Update Bootcamp' : 'Create Bootcamp'}
            </button>
          </form>
        </div>
      )}

      <div className="row">
        {bootcamps.map((bootcamp) => (
          <div key={bootcamp._id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{bootcamp.title}</h5>
                <p className="card-text text-muted mb-2">{bootcamp.description}</p>
                <p className="card-text small">
                  <i className="bi bi-calendar"></i> {new Date(bootcamp.startTime).toLocaleString()}
                </p>
                <p className="card-text small">
                  <i className="bi bi-hourglass-end"></i> {new Date(bootcamp.endTime).toLocaleString()}
                </p>
                <p className="card-text small">
                  <span className="badge bg-info">{bootcamp.difficulty}</span>
                </p>
                <p className="card-text small">
                  <strong>Participants:</strong> {bootcamp.participants.length}
                </p>
              </div>
              <div className="card-footer bg-white">
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(bootcamp)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(bootcamp._id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
