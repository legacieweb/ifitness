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
    <div className="profile-page crimson-theme">
      <div className="profile-container">
        {/* Profile Header */}
        <header className="profile-header-modern">
          <div className="profile-cover"></div>
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrapper">
                {profile.profilePicture ? (
                  <img
                    src={getProfilePictureUrl(profile.profilePicture)}
                    alt="Profile"
                    className="profile-avatar-main"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {profile.name?.charAt(0) || 'U'}
                  </div>
                )}
                <label className="avatar-edit-badge" title="Change Photo">
                  <i className="bi bi-camera-fill"></i>
                  <input type="file" onChange={handleFileChange} accept="image/*" hidden />
                </label>
              </div>
            </div>
            
            <div className="profile-identity">
              <h1 className="profile-name-main">{profile.name}</h1>
              <p className="profile-email-main">{profile.email}</p>
              <div className="profile-pills">
                <span className="profile-pill"><i className="bi bi-shield-check"></i> VERIFIED OPERATOR</span>
                <span className="profile-pill-alt"><i className="bi bi-lightning-charge-fill"></i> ACTIVE STATUS</span>
              </div>
            </div>

            <div className="profile-header-actions">
              <button onClick={() => setFile(null)} className="btn-outline-crimson" style={{display: file ? 'block' : 'none'}}>
                CANCEL
              </button>
              {file && (
                <button onClick={handleUpload} className="btn-crimson-main" disabled={loading}>
                  {loading ? 'UPLOADING...' : 'CONFIRM PHOTO'}
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="profile-content-grid">
          {/* Left Column: Form & Stats */}
          <div className="profile-left-col">
            <div className="glass-panel profile-form-panel">
              <div className="panel-header">
                <h3><i className="bi bi-person-gear"></i> BIOMETRIC DATA</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="crimson-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>NAME</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name || ''}
                      onChange={handleInputChange}
                      placeholder="ENTER NAME"
                      required
                    />
                  </div>
                </div>

                <div className="form-metrics-row">
                  <div className="form-group">
                    <label>AGE</label>
                    <input
                      type="number"
                      name="age"
                      value={profile.age || ''}
                      onChange={handleInputChange}
                      placeholder="--"
                    />
                  </div>
                  <div className="form-group">
                    <label>WEIGHT (KG)</label>
                    <input
                      type="number"
                      name="weight"
                      value={profile.weight || ''}
                      onChange={handleInputChange}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="form-group">
                    <label>HEIGHT (CM)</label>
                    <input
                      type="number"
                      name="height"
                      value={profile.height || ''}
                      onChange={handleInputChange}
                      placeholder="000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>PRIMARY OBJECTIVE</label>
                  <textarea
                    name="goal"
                    value={profile.goal || ''}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="DEFINE YOUR MISSION..."
                  />
                </div>

                <button type="submit" className="btn-crimson-submit" disabled={loading}>
                  {loading ? 'SYNCING...' : 'UPDATE PROFILE'}
                </button>
              </form>
            </div>

            <div className="stats-mini-grid">
              <div className="stat-mini-card">
                <span className="stat-mini-label">SESSIONS</span>
                <span className="stat-mini-value">42</span>
              </div>
              <div className="stat-mini-card">
                <span className="stat-mini-label">RANK</span>
                <span className="stat-mini-value">PRO</span>
              </div>
            </div>
          </div>

          {/* Right Column: Transformation Gallery */}
          <div className="profile-right-col">
            <div className="glass-panel gallery-panel">
              <div className="panel-header">
                <h3><i className="bi bi-images"></i> TRANSFORMATION GALLERY</h3>
                <p>VISUAL PROGRESS LOG</p>
              </div>

              {galleryLoading ? (
                <div className="gallery-spinner">
                  <div className="spinner-border text-danger"></div>
                </div>
              ) : gallery.length > 0 ? (
                <div className="transformation-grid">
                  {gallery.map((image) => (
                    <div key={image.id} className="transformation-item">
                      <div className="transformation-img-wrapper">
                        <img src={image.imageUrl} alt="Progress" />
                        <div className="transformation-overlay">
                          <span className="trans-tag">{image.tag}</span>
                          <span className="trans-date">{new Date(image.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="gallery-empty-state">
                  <i className="bi bi-camera-video"></i>
                  <p>NO VISUAL DATA RECORDED</p>
                  <small>UPLOAD VIA DASHBOARD</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="profile-alerts">
        {error && <div className="crimson-alert error">{error}</div>}
        {success && <div className="crimson-alert success">{success}</div>}
      </div>
    </div>
  );
}
