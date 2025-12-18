import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showBootcampForm, setShowBootcampForm] = useState(false);
  const [bootcampEditingId, setBootcampEditingId] = useState(null);
  const [bootcampFormData, setBootcampFormData] = useState({
    title: '',
    description: '',
    expectations: '',
    startTime: '',
    endTime: '',
    difficulty: 'Intermediate',
    exercises: [],
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    achievementAlerts: true,
    maintenanceMode: false,
    publicRegistrations: true,
    sessionTimeout: 30,
    passwordResetRequired: true,
  });

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
    }
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, usersRes, bootcampsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/bootcamps', { headers }),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const bootcampsData = await bootcampsRes.json();
      
      setStats(statsData);
      setUsers(usersData);
      setBootcamps(bootcampsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showAlert('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleBootcampInputChange = (e) => {
    const { name, value } = e.target;
    setBootcampFormData({ ...bootcampFormData, [name]: value });
  };

  const handleBootcampSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = bootcampEditingId ? 'PUT' : 'POST';
      const url = bootcampEditingId
        ? `/api/bootcamps/${bootcampEditingId}`
        : '/api/bootcamps';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bootcampFormData),
      });

      if (response.ok) {
        setBootcampFormData({
          title: '',
          description: '',
          expectations: '',
          startTime: '',
          endTime: '',
          difficulty: 'Intermediate',
          exercises: [],
        });
        setShowBootcampForm(false);
        setBootcampEditingId(null);
        fetchAllData();
        showAlert(`Bootcamp ${bootcampEditingId ? 'updated' : 'created'} successfully`, 'success');
      }
    } catch (err) {
      console.error('Error saving bootcamp:', err);
      showAlert('Failed to save bootcamp', 'error');
    }
  };

  const handleBootcampEdit = (bootcamp) => {
    setBootcampFormData({
      title: bootcamp.title,
      description: bootcamp.description,
      expectations: bootcamp.expectations,
      startTime: bootcamp.startTime.slice(0, 16),
      endTime: bootcamp.endTime.slice(0, 16),
      difficulty: bootcamp.difficulty,
      exercises: bootcamp.exercises,
    });
    setBootcampEditingId(bootcamp._id);
    setShowBootcampForm(true);
  };

  const handleBootcampDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bootcamp?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/bootcamps/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAllData();
        showAlert('Bootcamp deleted successfully', 'success');
      } catch (err) {
        console.error('Error deleting bootcamp:', err);
        showAlert('Failed to delete bootcamp', 'error');
      }
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showAlert('Settings saved successfully', 'success');
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Preloader text="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-header-section">
        <div className="header-content">
          <div>
            <h1><i className="bi bi-shield-check"></i> Admin Dashboard</h1>
            <p className="header-subtitle">Welcome back, {user?.name}</p>
          </div>
          <div className="header-meta">
            <span className="admin-badge">Administrator</span>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="tabs-section">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              title="Overview"
            >
              <i className="bi bi-graph-up"></i> <span className="tab-label">Overview</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              title="Users"
            >
              <i className="bi bi-people-fill"></i> <span className="tab-label">Users</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'bootcamp' ? 'active' : ''}`}
              onClick={() => setActiveTab('bootcamp')}
              title="Bootcamps"
            >
              <i className="bi bi-fire"></i> <span className="tab-label">Bootcamps</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
              title="Analytics"
            >
              <i className="bi bi-bar-chart-fill"></i> <span className="tab-label">Analytics</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
              title="Settings"
            >
              <i className="bi bi-gear"></i> <span className="tab-label">Settings</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="stats-section">
              <h2 className="section-title">Platform Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon primary">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalUsers || 0}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon success">
                    <i className="bi bi-dumbbell"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalWorkouts || 0}</h3>
                    <p>Total Workouts</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon warning">
                    <i className="bi bi-fire"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalCalories ? (stats.totalCalories / 1000).toFixed(1) : 0}K</h3>
                    <p>Calories Burned</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon info">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalDuration ? (stats.totalDuration / 60).toFixed(0) : 0}h</h3>
                    <p>Total Duration</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon danger">
                    <i className="bi bi-lock"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.suspendedUsers || 0}</h3>
                    <p>Suspended Users</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-cards">
                <div className="action-card">
                  <div className="action-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <h4>User Management</h4>
                  <p>View and manage user accounts</p>
                  <button className="action-btn" onClick={() => setActiveTab('users')}>
                    View Users
                  </button>
                </div>

                <div className="action-card">
                  <div className="action-icon">
                    <i className="bi bi-graph-up"></i>
                  </div>
                  <h4>Analytics</h4>
                  <p>Detailed platform analytics and insights</p>
                  <button className="action-btn" onClick={() => setActiveTab('analytics')}>
                    View Analytics
                  </button>
                </div>

                <div className="action-card">
                  <div className="action-icon">
                    <i className="bi bi-gear"></i>
                  </div>
                  <h4>System Settings</h4>
                  <p>Configure platform settings</p>
                  <button className="action-btn" onClick={() => setActiveTab('settings')}>
                    Go to Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="users-management">
              <div className="section-header">
                <h2>User Management</h2>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-people"></i>
                  <h3>No Users Found</h3>
                  <p>No users match your search criteria</p>
                </div>
              ) : (
                <div className="users-grid">
                  {filteredUsers.map(u => (
                    <div key={u.id} className={`user-card ${u.suspended ? 'suspended' : ''}`}>
                      <div className="user-card-header">
                        <div className="user-avatar-small">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="user-card-title">
                          <h3>{u.name}</h3>
                          <p>{u.email}</p>
                        </div>
                        {u.suspended && (
                          <span className="status-badge suspended">
                            <i className="bi bi-lock-fill"></i>
                          </span>
                        )}
                      </div>

                      <div className="user-card-body">
                        <div className="info-row">
                          <span className="label">Goal:</span>
                          <span className="value goal-badge">{u.goal || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Workouts:</span>
                          <span className="value workout-badge">{u.workoutCount}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Joined:</span>
                          <span className="value">{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="user-card-footer">
                        <button
                          className="card-btn view"
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          title="View full details"
                        >
                          <i className="bi bi-arrow-right"></i> View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="analytics-section">
              <h2 className="section-title">Website Analytics</h2>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="card-header">
                    <h3><i className="bi bi-lightning-charge"></i> Performance</h3>
                  </div>
                  <div className="card-body">
                    <div className="metric">
                      <span>Page Load Time</span>
                      <strong>1.2s</strong>
                    </div>
                    <div className="metric">
                      <span>API Response</span>
                      <strong>180ms</strong>
                    </div>
                    <div className="metric">
                      <span>Uptime</span>
                      <strong>99.9%</strong>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="card-header">
                    <h3><i className="bi bi-speedometer2"></i> Speed Metrics</h3>
                  </div>
                  <div className="card-body">
                    <div className="metric">
                      <span>First Contentful Paint</span>
                      <strong>0.8s</strong>
                    </div>
                    <div className="metric">
                      <span>Largest Contentful Paint</span>
                      <strong>1.5s</strong>
                    </div>
                    <div className="metric">
                      <span>Cumulative Layout Shift</span>
                      <strong>0.05</strong>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="card-header">
                    <h3><i className="bi bi-globe"></i> Geographic Distribution</h3>
                  </div>
                  <div className="card-body">
                    <div className="metric">
                      <span>Africa</span>
                      <strong>45%</strong>
                    </div>
                    <div className="metric">
                      <span>Europe</span>
                      <strong>30%</strong>
                    </div>
                    <div className="metric">
                      <span>Asia</span>
                      <strong>20%</strong>
                    </div>
                    <div className="metric">
                      <span>Other</span>
                      <strong>5%</strong>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="card-header">
                    <h3><i className="bi bi-bar-chart"></i> Website Stats</h3>
                  </div>
                  <div className="card-body">
                    <div className="metric">
                      <span>Total Visitors</span>
                      <strong>{stats?.totalUsers || 0}</strong>
                    </div>
                    <div className="metric">
                      <span>Active Sessions</span>
                      <strong>{Math.floor((stats?.totalUsers || 0) * 0.3)}</strong>
                    </div>
                    <div className="metric">
                      <span>Bounce Rate</span>
                      <strong>12.5%</strong>
                    </div>
                    <div className="metric">
                      <span>Avg Session Duration</span>
                      <strong>8m 42s</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-chart">
                <h3>User Activity Trend</h3>
                <div className="chart-placeholder">
                  <i className="bi bi-graph-up"></i>
                  <p>User activity chart (7 days)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bootcamp' && (
          <div className="tab-content">
            <div className="bootcamp-section">
              <div className="section-header">
                <h2><i className="bi bi-fire"></i> Bootcamp Management</h2>
                <button
                  className="btn-add-bootcamp"
                  onClick={() => {
                    setShowBootcampForm(!showBootcampForm);
                    setBootcampEditingId(null);
                    setBootcampFormData({
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
                  <i className="bi bi-plus-circle"></i> {showBootcampForm ? 'Cancel' : 'New Bootcamp'}
                </button>
              </div>

              {showBootcampForm && (
                <div className="bootcamp-form-container">
                  <form onSubmit={handleBootcampSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={bootcampFormData.title}
                          onChange={handleBootcampInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Difficulty *</label>
                        <select
                          name="difficulty"
                          value={bootcampFormData.difficulty}
                          onChange={handleBootcampInputChange}
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        name="description"
                        value={bootcampFormData.description}
                        onChange={handleBootcampInputChange}
                        rows="3"
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>What to Expect *</label>
                      <textarea
                        name="expectations"
                        value={bootcampFormData.expectations}
                        onChange={handleBootcampInputChange}
                        rows="2"
                        required
                      ></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Time *</label>
                        <input
                          type="datetime-local"
                          name="startTime"
                          value={bootcampFormData.startTime}
                          onChange={handleBootcampInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time *</label>
                        <input
                          type="datetime-local"
                          name="endTime"
                          value={bootcampFormData.endTime}
                          onChange={handleBootcampInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        <i className="bi bi-check-circle"></i> {bootcampEditingId ? 'Update' : 'Create'} Bootcamp
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {bootcamps.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-fire"></i>
                  <h3>No Bootcamps Yet</h3>
                  <p>Create your first bootcamp to get started</p>
                </div>
              ) : (
                <div className="bootcamps-grid">
                  {bootcamps.map((bootcamp) => (
                    <div key={bootcamp._id} className="bootcamp-card">
                      <div className="bootcamp-card-header">
                        <h3>{bootcamp.title}</h3>
                        <span className={`difficulty-badge ${bootcamp.difficulty.toLowerCase()}`}>
                          {bootcamp.difficulty}
                        </span>
                      </div>
                      <p className="bootcamp-description">{bootcamp.description}</p>
                      <div className="bootcamp-details">
                        <div className="detail">
                          <i className="bi bi-calendar-event"></i>
                          <span>{new Date(bootcamp.startTime).toLocaleString()}</span>
                        </div>
                        <div className="detail">
                          <i className="bi bi-hourglass-end"></i>
                          <span>{new Date(bootcamp.endTime).toLocaleString()}</span>
                        </div>
                        <div className="detail">
                          <i className="bi bi-people-fill"></i>
                          <span>{bootcamp.participants?.length || 0} Participants</span>
                        </div>
                      </div>
                      <div className="bootcamp-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleBootcampEdit(bootcamp)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleBootcampDelete(bootcamp._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="settings-section">
              <h2>System Settings</h2>

              <div className="settings-card">
                <h3><i className="bi bi-bell"></i> Notifications</h3>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span></span>
                  </div>
                </div>
                <div className="setting-item">
                  <label>User Achievement Alerts</label>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.achievementAlerts}
                      onChange={(e) => handleSettingChange('achievementAlerts', e.target.checked)}
                    />
                    <span></span>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3><i className="bi bi-lock"></i> Security</h3>
                <div className="setting-item">
                  <label>Admin Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    min="5" 
                    max="480" 
                  />
                </div>
                <div className="setting-item">
                  <label>Password Reset Email Required</label>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.passwordResetRequired}
                      onChange={(e) => handleSettingChange('passwordResetRequired', e.target.checked)}
                    />
                    <span></span>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3><i className="bi bi-palette"></i> Platform</h3>
                <div className="setting-item">
                  <label>Maintenance Mode</label>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    />
                    <span></span>
                  </div>
                </div>
                <div className="setting-item">
                  <label>Public Registrations</label>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.publicRegistrations}
                      onChange={(e) => handleSettingChange('publicRegistrations', e.target.checked)}
                    />
                    <span></span>
                  </div>
                </div>
              </div>

              <button className="btn-primary save-settings" onClick={handleSaveSettings}>
                <i className="bi bi-check-circle"></i> Save Settings
              </button>
            </div>
          </div>
        )}
      </div>



      {message && (
        <div className={`alert-message ${messageType}`}>
          <i className={`bi ${messageType === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i> {message}
        </div>
      )}
    </div>
  );
}
