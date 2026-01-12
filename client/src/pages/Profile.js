import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, uploadProfilePicture, getUserGallery } from '../services/api';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    profilePicture: null,
  });
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const response = await getUserProfile(user.id);
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to fetch profile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    try {
      setGalleryLoading(true);
      if (user?.id) {
        const response = await getUserGallery(user.id);
        setGallery(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchGallery();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(user.id, profile);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setLoading(true);
      const response = await uploadProfilePicture(user.id, formData);
      setProfile((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
      setSuccess('Profile picture updated!');
      setFile(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      setError('Failed to upload picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Personalize your experience and keep your stats up to date</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill"></i>
          {success}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-picture-section">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <i className="bi bi-person"></i>
              </div>
            )}
            <div className="upload-section">
              <input type="file" onChange={handleFileChange} accept="image/*" />
              <button
                className="btn-upload"
                onClick={handleUpload}
                disabled={loading || !file}
              >
                <i className="bi bi-camera-fill me-2"></i>
                {loading ? 'Uploading...' : 'Update Photo'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ''}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleInputChange}
                className="form-control"
                readOnly
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age || ''}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Years"
                />
              </div>

              <div className="form-group">
                <label>Weight</label>
                <input
                  type="number"
                  name="weight"
                  value={profile.weight || ''}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="kg"
                />
              </div>

              <div className="form-group">
                <label>Height</label>
                <input
                  type="number"
                  name="height"
                  value={profile.height || ''}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="cm"
                />
              </div>
            </div>

            <div className="form-group">
              <label>My Fitness Goal</label>
              <textarea
                name="goal"
                value={profile.goal || ''}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Tell us what you want to achieve..."
              />
            </div>

            <button type="submit" className="btn-save" disabled={loading}>
              <i className="bi bi-save2-fill me-2"></i>
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="gallery-section">
          <h2>Progress Gallery</h2>
          {galleryLoading ? (
            <Preloader text="Loading your transformation..." />
          ) : gallery.length > 0 ? (
            <div className="gallery-grid">
              {gallery.map((image) => (
                <div key={image.id} className="gallery-item">
                  <img src={image.imageUrl} alt={image.label || 'Progress'} />
                  <div className="gallery-item-info">
                    <span className="gallery-tag">{image.tag}</span>
                    <span className="gallery-date">
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <i className="bi bi-images fs-2 d-block mb-3 opacity-50"></i>
              <p>Your transformation gallery is waiting!</p>
              <small className="text-muted">Upload your first progress photo from your dashboard.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
