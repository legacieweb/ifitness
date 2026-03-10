import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, uploadProfilePicture, getUserGallery, getProfilePictureUrl } from '../services/api';
import Preloader from '../components/Preloader';
import './Profile.css';

export default function Profile() {
  const { user, updateUserProfilePicture } = useAuth();
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
      setError('Failed to fetch profile details.');
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
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setLoading(true);
      const response = await uploadProfilePicture(user.id, formData);
      const newPicUrl = response.data.profilePicture;
      setProfile((prev) => ({ ...prev, profilePicture: newPicUrl }));
      updateUserProfilePicture(newPicUrl);
      setSuccess('Profile picture updated!');
      setFile(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      setError('Failed to upload picture.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.name) {
    return <Preloader text="Loading your profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="hero-content">
          <div className="profile-avatar-wrapper">
            {profile.profilePicture ? (
              <img
                src={getProfilePictureUrl(profile.profilePicture)}
                alt="Profile"
                className="hero-avatar"
              />
            ) : (
              <div className="hero-avatar-placeholder">
                {profile.name?.charAt(0) || 'U'}
              </div>
            )}
            <label className="avatar-edit-badge" title="Change Photo">
              <i className="bi bi-camera-fill"></i>
              <input type="file" onChange={handleFileChange} accept="image/*" hidden />
            </label>
          </div>
          <div className="hero-user-info">
            <h1 className="hero-name">{profile.name}</h1>
            <p className="hero-email">{profile.email}</p>
            <div className="profile-badges">
              <span className="badge-item"><i className="bi bi-shield-check"></i> Verified Member</span>
              <span className="badge-item"><i className="bi bi-lightning-fill"></i> Pro Athlete</span>
            </div>
          </div>
        </div>
        
        {file && (
          <div className="upload-confirm-toast">
            <span>New photo selected</span>
            <button onClick={handleUpload} className="btn-confirm-upload">
              {loading ? 'Uploading...' : 'Confirm Upload'}
            </button>
            <button onClick={() => setFile(null)} className="btn-cancel-upload">Cancel</button>
          </div>
        )}
      </div>

      <div className="profile-main-content">
        <div className="profile-grid">
          <div className="profile-sidebar-col">
            <div className="settings-card glass-card">
              <h3>Account Settings</h3>
              <nav className="settings-nav">
                <button className="nav-item active"><i className="bi bi-person"></i> Personal Info</button>
                <button className="nav-item"><i className="bi bi-lock"></i> Security</button>
                <button className="nav-item"><i className="bi bi-bell"></i> Notifications</button>
                <button className="nav-item"><i className="bi bi-palette"></i> Appearance</button>
              </nav>
            </div>

            <div className="stats-card-mini glass-card">
              <div className="mini-stat">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">March 2024</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Total Workouts</span>
                <span className="stat-value">42</span>
              </div>
            </div>
          </div>

          <div className="profile-form-col">
            {error && (
              <div className="status-alert error">
                <i className="bi bi-exclamation-circle"></i> {error}
              </div>
            )}
            {success && (
              <div className="status-alert success">
                <i className="bi bi-check-circle"></i> {success}
              </div>
            )}

            <div className="form-container glass-card">
              <div className="form-header">
                <h2>Personal Information</h2>
                <p>Keep your health metrics updated for better tracking</p>
              </div>

              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-group-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <i className="bi bi-person"></i>
                      <input
                        type="text"
                        name="name"
                        value={profile.name || ''}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper readonly">
                      <i className="bi bi-envelope"></i>
                      <input
                        type="email"
                        value={profile.email || ''}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="form-metrics-grid">
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={profile.age || ''}
                      onChange={handleInputChange}
                      placeholder="Years"
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={profile.weight || ''}
                      onChange={handleInputChange}
                      placeholder="kg"
                    />
                  </div>
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={profile.height || ''}
                      onChange={handleInputChange}
                      placeholder="cm"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Fitness Goal</label>
                  <textarea
                    name="goal"
                    value={profile.goal || ''}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe what you want to achieve..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save-modern" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="gallery-container glass-card">
              <div className="gallery-header">
                <h2>Transformation Gallery</h2>
                <p>Visualizing your progress over time</p>
              </div>

              {galleryLoading ? (
                <div className="gallery-loading">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : gallery.length > 0 ? (
                <div className="modern-gallery-grid">
                  {gallery.map((image) => (
                    <div key={image.id} className="modern-gallery-item">
                      <img src={image.imageUrl} alt="Progress" />
                      <div className="item-overlay">
                        <span className="item-tag">{image.tag}</span>
                        <span className="item-date">{new Date(image.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="modern-gallery-empty">
                  <div className="empty-icon"><i className="bi bi-images"></i></div>
                  <p>No progress photos yet</p>
                  <small>Upload photos from your dashboard to see them here</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
