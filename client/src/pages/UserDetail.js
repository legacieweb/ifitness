import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { suspendUser, unsuspendUser } from '../services/api';
import Preloader from '../components/Preloader';
import Footer from '../components/Footer';
import './UserDetail.css';

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [routine, setRoutine] = useState([
    { day: 'Monday', workout: '', exercises: [] },
    { day: 'Tuesday', workout: '', exercises: [] },
    { day: 'Wednesday', workout: '', exercises: [] },
    { day: 'Thursday', workout: '', exercises: [] },
    { day: 'Friday', workout: '', exercises: [] },
    { day: 'Saturday', workout: '', exercises: [] },
    { day: 'Sunday', workout: '', exercises: [] },
  ]);
  const [savingRoutine, setSavingRoutine] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({ tag: 'Progress', label: '' });
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (adminUser && !adminUser.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchUserDetail();
  }, [userId, adminUser]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      setIsAnimating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/users/${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setStats(data.stats);
        setRecentWorkouts(data.recentWorkouts || []);
        
        fetchGallery();
        if (data.user.weeklyRoutine && data.user.weeklyRoutine.length > 0) {
          setRoutine(data.user.weeklyRoutine);
        }
      } else {
        showAlert('Failed to load user details', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      showAlert('Error loading user', 'error');
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const fetchGallery = async () => {
    try {
      setLoadingGallery(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/users/${userId}/gallery`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingGallery(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tag', galleryFormData.tag);
      formData.append('label', galleryFormData.label);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/users/${userId}/gallery`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        showAlert('Image added to gallery successfully', 'success');
        setGalleryFormData({ tag: 'Progress', label: '' });
        fetchGallery();
      } else {
        showAlert('Failed to upload gallery image', 'error');
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      showAlert('Failed to upload gallery image', 'error');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!window.confirm('Remove this image from gallery?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/gallery/${imageId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.ok) {
        showAlert('Image removed from gallery', 'success');
        fetchGallery();
      }
    } catch (error) {
      console.error('Delete gallery image error:', error);
      showAlert('Failed to delete image', 'error');
    }
  };

  const showAlert = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleSuspendUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const reason = suspendReason || 'Account suspended by administrator';
      await suspendUser(userId, reason, token);
      await fetchUserDetail();
      showAlert('User suspended successfully', 'success');
      setShowSuspendModal(false);
      setSuspendReason('');
    } catch (error) {
      console.error('Failed to suspend user:', error);
      showAlert('Failed to suspend user', 'error');
    }
  };

  const handleUnsuspendUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await unsuspendUser(userId, token);
      await fetchUserDetail();
      showAlert('User unsuspended successfully', 'success');
    } catch (error) {
      console.error('Failed to unsuspend user:', error);
      showAlert('Failed to unsuspend user', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('This action cannot be undone. Delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        showAlert('User deleted successfully', 'success');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        showAlert('Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      showAlert('Failed to delete user', 'error');
    }
  };

  const handleUpdateRoutine = async () => {
    try {
      setSavingRoutine(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/routine`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ routine })
      });

      if (response.ok) {
        showAlert('Weekly routine updated successfully', 'success');
        // Refetch user details to get the saved routine
        await fetchUserDetail();
      } else {
        showAlert('Failed to update routine', 'error');
      }
    } catch (error) {
      console.error('Routine update error:', error);
      showAlert('Error updating routine', 'error');
    } finally {
      setSavingRoutine(false);
    }
  };

  const handleSendReminder = async (dayIndex) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/send-reminder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dayIndex })
      });

      if (response.ok) {
        showAlert(`Reminder for ${routine[dayIndex].day} sent!`, 'success');
      } else {
        showAlert('Failed to send reminder', 'error');
      }
    } catch (error) {
      console.error('Reminder error:', error);
      showAlert('Error sending reminder', 'error');
    }
  };

  const handleRoutineChange = (dayIndex, field, value) => {
    const newRoutine = [...routine];
    newRoutine[dayIndex][field] = value;
    setRoutine(newRoutine);
  };

  const handleAddExercise = (dayIndex) => {
    const newRoutine = [...routine];
    if (!newRoutine[dayIndex].exercises) newRoutine[dayIndex].exercises = [];
    newRoutine[dayIndex].exercises.push({ name: '', sets: 0, reps: 0 });
    setRoutine(newRoutine);
  };

  const handleExerciseChange = (dayIndex, exIndex, field, value) => {
    const newRoutine = [...routine];
    newRoutine[dayIndex].exercises[exIndex][field] = value;
    setRoutine(newRoutine);
  };

  const handleRemoveExercise = (dayIndex, exIndex) => {
    const newRoutine = [...routine];
    newRoutine[dayIndex].exercises.splice(exIndex, 1);
    setRoutine(newRoutine);
  };

  const handleTabClick = (tab) => {
    setIsAnimating(true);
    setActiveTab(tab);
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (loading) {
    return <Preloader text="Loading user details..." />;
  }

  if (!user) {
    return (
      <div className="user-detail-wrapper">
        <div className="error-state">
          <i className="bi bi-exclamation-circle"></i>
          <h2>User Not Found</h2>
          <button className="btn-primary" onClick={() => navigate('/admin')}>
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const getProgress = (value, max) => {
    return Math.min(100, Math.round((value / max) * 100));
  };

  return (
    <div className="user-detail-wrapper">
      <div className="user-detail-header">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <i className="bi bi-chevron-left"></i>
          <span>Back to Users</span>
        </button>
      </div>

      <div className="user-detail-container">
        {/* User Profile Header Card */}
        <div className="user-profile-header">
          <div className="profile-avatar-large">
            {user.profilePicture ? (
              <img 
                src={`${user.profilePicture}?t=${new Date(user.updatedAt || user.createdAt).getTime()}`} 
                alt="Profile" 
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <i className="bi bi-person-fill"></i>
              </div>
            )}
          </div>
          
          <div className="profile-info-main">
            <div className="profile-name-row">
              <h1 className="user-name">{user.name}</h1>
              <span className={`status-indicator ${user.suspended ? 'suspended' : 'active'}`}>
                <span className="status-dot"></span>
                {user.suspended ? 'Suspended' : 'Active'}
              </span>
            </div>
            <p className="user-email-primary">
              <i className="bi bi-envelope"></i>
              {user.email}
            </p>
            
            <div className="quick-stats-row">
              <div className="stat-pill">
                <i className="bi bi-calendar3"></i>
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="stat-pill">
                <i className="bi bi-dumbbell"></i>
                <span>{stats?.totalWorkouts || 0} Workouts</span>
              </div>
              <div className="stat-pill">
                <i className="bi bi-fire"></i>
                <span>{stats?.totalCalories || 0} Cal</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            {user.suspended ? (
              <button className="action-btn unsuspend" onClick={handleUnsuspendUser}>
                <i className="bi bi-unlock"></i>
                <span>Unsuspend</span>
              </button>
            ) : (
              <button className="action-btn suspend" onClick={() => setShowSuspendModal(true)}>
                <i className="bi bi-pause-circle"></i>
                <span>Suspend</span>
              </button>
            )}
            <button className="action-btn delete" onClick={handleDeleteUser}>
              <i className="bi bi-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Suspension Alert */}
        {user.suspended && (
          <div className="suspension-alert-banner">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <div className="alert-content">
              <strong>Account Suspended</strong>
              <span>Reason: {user.suspendedReason || 'No reason provided'}</span>
            </div>
            <span className="alert-time">
              {new Date(user.suspendedAt).toLocaleString()}
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="detail-tabs-container">
          <div className="tabs-nav">
            <button 
              className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick('profile')}
            >
              <i className="bi bi-person"></i>
              <span>Profile</span>
            </button>
            <button 
              className={`tab-item ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => handleTabClick('activity')}
            >
              <i className="bi bi-graph-up"></i>
              <span>Activity</span>
            </button>
            <button 
              className={`tab-item ${activeTab === 'routine' ? 'active' : ''}`}
              onClick={() => handleTabClick('routine')}
            >
              <i className="bi bi-calendar-week"></i>
              <span>Routine</span>
            </button>
            <button 
              className={`tab-item ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => handleTabClick('gallery')}
            >
              <i className="bi bi-images"></i>
              <span>Gallery</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className={`tab-panel ${isAnimating ? 'animating' : ''}`}>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content-area">
              <div className="content-grid">
                {/* Personal Info Card */}
                <div className="info-card">
                  <div className="card-header">
                    <i className="bi bi-person-vcard"></i>
                    <h3>Personal Information</h3>
                  </div>
                  <div className="info-list">
                    <div className="info-row">
                      <span className="label">Full Name</span>
                      <span className="value">{user.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email Address</span>
                      <span className="value">{user.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Age</span>
                      <span className="value">{user.age || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Weight</span>
                      <span className="value">{user.weight ? `${user.weight} kg` : 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Height</span>
                      <span className="value">{user.height ? `${user.height} cm` : 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Fitness Goal</span>
                      <span className="value goal">{user.goal || 'Not set'}</span>
                    </div>
                  </div>
                </div>

                {/* Account Stats Card */}
                <div className="info-card">
                  <div className="card-header">
                    <i className="bi bi-bar-chart"></i>
                    <h3>Account Statistics</h3>
                  </div>
                  <div className="stats-grid-mini">
                    <div className="stat-mini">
                      <div className="stat-icon-box blue">
                        <i className="bi bi-dumbbell"></i>
                      </div>
                      <div className="stat-details">
                        <span className="stat-number">{stats?.totalWorkouts || 0}</span>
                        <span className="stat-label">Total Workouts</span>
                      </div>
                    </div>
                    <div className="stat-mini">
                      <div className="stat-icon-box orange">
                        <i className="bi bi-fire"></i>
                      </div>
                      <div className="stat-details">
                        <span className="stat-number">{stats?.totalCalories || 0}</span>
                        <span className="stat-label">Calories Burned</span>
                      </div>
                    </div>
                    <div className="stat-mini">
                      <div className="stat-icon-box green">
                        <i className="bi bi-clock"></i>
                      </div>
                      <div className="stat-details">
                        <span className="stat-number">{stats?.totalDuration || 0}</span>
                        <span className="stat-label">Minutes Active</span>
                      </div>
                    </div>
                    <div className="stat-mini">
                      <div className="stat-icon-box purple">
                        <i className="bi bi-calendar-check"></i>
                      </div>
                      <div className="stat-details">
                        <span className="stat-number">
                          {user.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
                        </span>
                        <span className="stat-label">Days Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals Progress */}
              <div className="goals-progress-card">
                <div className="card-header">
                  <i className="bi bi-target"></i>
                  <h3>Goals Progress</h3>
                </div>
                <div className="goals-progress-grid">
                  <div className="goal-progress-item">
                    <div className="goal-header">
                      <span className="goal-title">Weekly Workouts</span>
                      <span className="goal-value">{stats?.totalWorkouts || 0} / 5</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-fill blue" style={{ width: `${getProgress(stats?.totalWorkouts || 0, 5)}%` }}></div>
                    </div>
                  </div>
                  <div className="goal-progress-item">
                    <div className="goal-header">
                      <span className="goal-title">Calorie Goal</span>
                      <span className="goal-value">{stats?.totalCalories || 0} / 5000</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-fill orange" style={{ width: `${getProgress(stats?.totalCalories || 0, 5000)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="tab-content-area">
              {/* Stats Overview */}
              <div className="stats-overview">
                <div className="stat-card-large">
                  <div className="stat-visual">
                    <i className="bi bi-dumbbell"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.totalWorkouts || 0}</span>
                    <span className="stat-label">Workouts Completed</span>
                  </div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-visual fire">
                    <i className="bi bi-fire"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.totalCalories || 0}</span>
                    <span className="stat-label">Calories Burned</span>
                  </div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-visual time">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.totalDuration || 0}</span>
                    <span className="stat-label">Minutes Trained</span>
                  </div>
                </div>
              </div>

              {/* Recent Workouts */}
              <div className="activity-section-card">
                <div className="card-header">
                  <i className="bi bi-clock-history"></i>
                  <h3>Recent Workouts</h3>
                </div>
                {recentWorkouts.length > 0 ? (
                  <div className="workout-history-list">
                    {recentWorkouts.slice(0, 8).map((w, i) => (
                      <div key={i} className="workout-history-item">
                        <div className="workout-icon">
                          <i className="bi bi-activity"></i>
                        </div>
                        <div className="workout-details">
                          <span className="workout-name">{w.name}</span>
                          <span className="workout-date">{new Date(w.date).toLocaleDateString()}</span>
                        </div>
                        <div className="workout-stats">
                          <span className="stat-cal">{w.caloriesBurned} kcal</span>
                          <span className="stat-duration">{w.duration} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <p>No workouts recorded yet</p>
                  </div>
                )}
              </div>

              {/* Simple Activity Chart */}
              <div className="activity-chart-card">
                <div className="card-header">
                  <i className="bi bi-bar-chart-steps"></i>
                  <h3>Weekly Activity</h3>
                </div>
                <div className="simple-chart">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const heights = [40, 70, 55, 90, 65, 30, 20];
                    return (
                      <div key={i} className="chart-bar-wrapper">
                        <div className="chart-bar" style={{ height: `${heights[i]}%` }}></div>
                        <span className="chart-label">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Routine Tab */}
          {activeTab === 'routine' && (
            <div className="tab-content-area">
              <div className="routine-header-section">
                <div className="card-header">
                  <i className="bi bi-calendar-week"></i>
                  <h3>Weekly Workout Routine</h3>
                </div>
                <button 
                  className="save-routine-btn"
                  onClick={handleUpdateRoutine}
                  disabled={savingRoutine}
                >
                  {savingRoutine ? (
                    <>
                      <span className="spinner-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save"></i>
                      Save Routine
                    </>
                  )}
                </button>
              </div>
              
              <p className="routine-description">
                Create a personalized workout schedule for {user.name.split(' ')[0]}. Each day's workout will be visible on their dashboard.
              </p>

              <div className="routine-grid">
                {routine.map((day, dayIndex) => (
                  <div key={day.day} className="routine-day-card">
                    <div className="day-card-header">
                      <h4>
                        <span className="day-indicator"></span>
                        {day.day}
                      </h4>
                      <button 
                        className="reminder-btn"
                        onClick={() => handleSendReminder(dayIndex)}
                        title="Send Reminder"
                      >
                        <i className="bi bi-bell"></i>
                      </button>
                    </div>
                    
                    <div className="day-card-body">
                      <input 
                        type="text" 
                        className="workout-title-input"
                        placeholder="Workout title..."
                        value={day.workout}
                        onChange={(e) => handleRoutineChange(dayIndex, 'workout', e.target.value)}
                      />

                      <div className="exercises-list">
                        {day.exercises && day.exercises.map((ex, exIndex) => (
                          <div key={exIndex} className="exercise-item">
                            <input 
                              type="text" 
                              className="exercise-name-input"
                              placeholder="Exercise name"
                              value={ex.name}
                              onChange={(e) => handleExerciseChange(dayIndex, exIndex, 'name', e.target.value)}
                            />
                            <div className="exercise-sets-reps">
                              <input 
                                type="number"
                                className="sr-input"
                                placeholder="Sets"
                                value={ex.sets || ''}
                                onChange={(e) => handleExerciseChange(dayIndex, exIndex, 'sets', parseInt(e.target.value) || 0)}
                              />
                              <span>×</span>
                              <input 
                                type="number"
                                className="sr-input"
                                placeholder="Reps"
                                value={ex.reps || ''}
                                onChange={(e) => handleExerciseChange(dayIndex, exIndex, 'reps', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <button 
                              className="remove-exercise-btn"
                              onClick={() => handleRemoveExercise(dayIndex, exIndex)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>

                      <button 
                        className="add-exercise-btn"
                        onClick={() => handleAddExercise(dayIndex)}
                      >
                        <i className="bi bi-plus"></i>
                        Add Exercise
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="tab-content-area">
              <div className="gallery-header-section">
                <div className="card-header">
                  <i className="bi bi-images"></i>
                  <h3>Progress Gallery</h3>
                </div>
              </div>

              <div className="gallery-upload-section">
                <div className="upload-form-row">
                  <select 
                    className="gallery-select"
                    value={galleryFormData.tag}
                    onChange={(e) => setGalleryFormData({...galleryFormData, tag: e.target.value})}
                  >
                    <option value="Progress">Progress</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Transformation">Transformation</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Winner">Winner</option>
                  </select>
                  <input 
                    type="text" 
                    className="gallery-input"
                    placeholder="Label or description..."
                    value={galleryFormData.label}
                    onChange={(e) => setGalleryFormData({...galleryFormData, label: e.target.value})}
                  />
                  <label className="upload-btn">
                    {uploadingGallery ? (
                      <>
                        <span className="spinner-sm"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-upload"></i>
                        Choose Image
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleGalleryUpload} 
                      disabled={uploadingGallery}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {loadingGallery ? (
                <div className="loading-state">
                  <span className="spinner-lg"></span>
                  <p>Loading gallery...</p>
                </div>
              ) : gallery.length > 0 ? (
                <div className="gallery-grid">
                  {gallery.map(img => (
                    <div key={img.id} className="gallery-item-card">
                      <div className="gallery-image-container">
                        <img src={img.imageUrl} alt={img.label} />
                        <div className="gallery-item-overlay">
                          <button 
                            className="delete-gallery-btn"
                            onClick={() => handleDeleteGalleryImage(img.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="gallery-item-info">
                        <span className={`gallery-tag ${img.tag.toLowerCase()}`}>{img.tag}</span>
                        <span className="gallery-label">{img.label || 'No label'}</span>
                        <span className="gallery-date">{new Date(img.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-gallery-state">
                  <i className="bi bi-images"></i>
                  <h4>No Photos Yet</h4>
                  <p>Upload progress photos to track {user.name.split(' ')[0]}'s fitness journey</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="modal-overlay" onClick={() => setShowSuspendModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon suspend">
                <i className="bi bi-pause-circle-fill"></i>
              </div>
              <h2>Suspend Account</h2>
              <button className="modal-close" onClick={() => setShowSuspendModal(false)}>
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                This will immediately prevent the user from logging in. Please provide a reason for the suspension.
              </p>
              <div className="form-group">
                <label>Suspension Reason</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter the reason for suspension..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal secondary" onClick={() => setShowSuspendModal(false)}>
                Cancel
              </button>
              <button className="btn-modal danger" onClick={handleSuspendUser}>
                <i className="bi bi-pause-circle"></i>
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Message */}
      {message && (
        <div className={`alert-toast ${messageType}`}>
          <div className="alert-content">
            <i className={`bi ${messageType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            <span>{message}</span>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
