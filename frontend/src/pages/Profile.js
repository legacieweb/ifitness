import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import Preloader from '../components/Preloader';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const response = await getUserProfile(user.id);
          setFormData({
            name: response.data.name || '',
            age: response.data.age || '',
            weight: response.data.weight || '',
            height: response.data.height || '',
            goal: response.data.goal || '',
          });
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (user?.id) {
        await updateUserProfile(user.id, formData);
        setSuccess('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Preloader text="Loading profile..." />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">My Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="age" className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="weight" className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="height" className="form-label">Height (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="goal" className="form-label">Fitness Goal</label>
                      <select
                        className="form-select"
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                      >
                        <option value="">Select goal</option>
                        <option value="weight loss">Weight Loss</option>
                        <option value="muscle gain">Muscle Gain</option>
                        <option value="maintain fitness">Maintain Fitness</option>
                        <option value="improve endurance">Improve Endurance</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>

              {formData.height && formData.weight && (
                <div className="mt-4">
                  <h5>Health Metrics</h5>
                  <p>
                    <strong>BMI:</strong> {(formData.weight / ((formData.height / 100) ** 2)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
