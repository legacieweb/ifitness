import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAllUsers, getSystemHealth } from '../services/api';
import './AdminDashboard.css';
import './AdminBootcamp.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalWorkouts: 0,
    caloriesBurned: 0
  });
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    apiLatency: 0,
    uptime: 99.9
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Bootcamp management state
  const [bootcamps, setBootcamps] = useState([]);
  const [showBootcampForm, setShowBootcampForm] = useState(false);
  const [bootcampFormData, setBootcampFormData] = useState({
    title: '',
    description: '',
    expectations: '',
    startTime: '',
    endTime: '',
    difficulty: 'Intermediate',
    exercises: [],
  });
  const [editingBootcampId, setEditingBootcampId] = useState(null);

  // Outdoor activities state
  const [outdoorActivities, setOutdoorActivities] = useState([]);
  const [showOutdoorForm, setShowOutdoorForm] = useState(false);
  const [outdoorFormData, setOutdoorFormData] = useState({
    title: '',
    description: '',
    location: '',
    activityType: '',
    expectations: '',
    startTime: '',
    endTime: '',
    difficulty: 'Intermediate',
  });
  const [editingOutdoorId, setEditingOutdoorId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchBootcamps = useCallback(async () => {
    try {
      const response = await fetch('/api/bootcamps');
      if (response.ok) {
        const data = await response.json();
        setBootcamps(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching bootcamps:', err);
    }
  }, []);

  const fetchOutdoorActivities = useCallback(async () => {
    try {
      const response = await fetch('/api/outdoor-activities');
      if (response.ok) {
        const data = await response.json();
        setOutdoorActivities(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching outdoor activities:', err);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch admin stats
      try {
        const statsResponse = await getAdminStats(token);
        const statsData = statsResponse.data;
        setStats({
          totalUsers: statsData.totalUsers || 0,
          activeUsers: (statsData.totalUsers || 0) - (statsData.suspendedUsers || 0),
          totalWorkouts: statsData.totalWorkouts || 0,
          caloriesBurned: statsData.totalCalories || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }

      // Fetch all users
      try {
        const usersResponse = await getAllUsers(token);
        const usersData = usersResponse.data || [];
        setAllUsers(usersData);
        setFilteredUsers(usersData);

        // Generate recent activity
        if (Array.isArray(usersData)) {
          const activity = usersData.slice(0, 5).map((u, index) => ({
            type: index === 0 ? 'user' : index === 1 ? 'workout' : 'activity',
            text: `<strong>${u.name || 'A new user'}</strong> ${index === 0 ? 'joined the platform' : 'updated their profile'}`,
            time: `${index + 1}h ago`,
            icon: index === 0 ? 'person-plus' : 'person-check'
          }));
          setRecentActivity(activity);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }

      // Fetch system health
      try {
        const healthResponse = await getSystemHealth(token);
        setSystemHealth(healthResponse.data);
      } catch (err) {
        console.error('Error fetching system health:', err);
      }

      // Fetch bootcamps and outdoor activities
      fetchBootcamps();
      fetchOutdoorActivities();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [fetchBootcamps, fetchOutdoorActivities]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchDashboardData();
    setLoading(false);
  }, [user, navigate, fetchDashboardData]);


  const navigateToUserProfile = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleBootcampInputChange = (e) => {
    const { name, value } = e.target;
    setBootcampFormData({ ...bootcampFormData, [name]: value });
  };

  const handleBootcampSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingBootcampId ? 'PUT' : 'POST';
      const url = editingBootcampId
        ? `/api/bootcamps/${editingBootcampId}`
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
        showToast(editingBootcampId ? 'Bootcamp updated successfully' : 'Bootcamp launched successfully');
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
        setEditingBootcampId(null);
        fetchBootcamps();
      } else {
        showToast('Error saving bootcamp', 'danger');
      }
    } catch (err) {
      console.error('Error saving bootcamp:', err);
      showToast('Connection error', 'danger');
    }
  };

  const handleEditBootcamp = (bootcamp) => {
    setBootcampFormData({
      title: bootcamp.title,
      description: bootcamp.description,
      expectations: bootcamp.expectations,
      startTime: bootcamp.startTime?.slice(0, 16) || '',
      endTime: bootcamp.endTime?.slice(0, 16) || '',
      difficulty: bootcamp.difficulty,
      exercises: bootcamp.exercises,
    });
    setEditingBootcampId(bootcamp._id);
    setShowBootcampForm(true);
    setActiveTab('bootcamps');
  };

  const handleDeleteBootcamp = async (id) => {
    if (window.confirm('Delete this bootcamp?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/bootcamps/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          showToast('Bootcamp deleted');
          fetchBootcamps();
        }
      } catch (err) {
        console.error('Error deleting bootcamp:', err);
      }
    }
  };

  const handleOutdoorInputChange = (e) => {
    const { name, value } = e.target;
    setOutdoorFormData({ ...outdoorFormData, [name]: value });
  };

  const handleOutdoorSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingOutdoorId ? 'PUT' : 'POST';
      const url = editingOutdoorId
        ? `/api/outdoor-activities/${editingOutdoorId}`
        : '/api/outdoor-activities';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(outdoorFormData),
      });

      if (response.ok) {
        showToast(editingOutdoorId ? 'Activity updated' : 'Activity planned');
        setOutdoorFormData({
          title: '',
          description: '',
          location: '',
          activityType: '',
          expectations: '',
          startTime: '',
          endTime: '',
          difficulty: 'Intermediate',
        });
        setShowOutdoorForm(false);
        setEditingOutdoorId(null);
        fetchOutdoorActivities();
      } else {
        showToast('Error saving activity', 'danger');
      }
    } catch (err) {
      console.error('Error saving activity:', err);
    }
  };

  const handleEditOutdoor = (activity) => {
    setOutdoorFormData({
      title: activity.title,
      description: activity.description,
      location: activity.location,
      activityType: activity.activityType,
      expectations: activity.expectations,
      startTime: activity.startTime?.slice(0, 16) || '',
      endTime: activity.endTime?.slice(0, 16) || '',
      difficulty: activity.difficulty,
    });
    setEditingOutdoorId(activity._id);
    setShowOutdoorForm(true);
    setActiveTab('outdoor');
  };

  const handleDeleteOutdoor = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/outdoor-activities/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          showToast('Activity deleted');
          fetchOutdoorActivities();
        }
      } catch (err) {
        console.error('Error deleting activity:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {toast.message}
        </div>
      )}

      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">
            <i className="bi bi-activity"></i>
            <span>iFitness</span>
          </a>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              <div className="sidebar-avatar-placeholder">
                <i className="bi bi-person"></i>
              </div>
            )}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'Admin'}</span>
            <span className="sidebar-user-status">System Administrator</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}>
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </div>
          <div className={`sidebar-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}>
            <i className="bi bi-people"></i>
            <span>Users</span>
          </div>
          <div className={`sidebar-nav-item ${activeTab === 'bootcamps' ? 'active' : ''}`} onClick={() => { setActiveTab('bootcamps'); setSidebarOpen(false); }}>
            <i className="bi bi-lightning-charge"></i>
            <span>Bootcamps</span>
          </div>
          <div className={`sidebar-nav-item ${activeTab === 'outdoor' ? 'active' : ''}`} onClick={() => { setActiveTab('outdoor'); setSidebarOpen(false); }}>
            <i className="bi bi-tree"></i>
            <span>Outdoor Activities</span>
          </div>
          <div className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="bi bi-list"></i>
            </button>
            <div>
              <h1 className="page-title">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'bootcamps' && 'Bootcamp Management'}
                {activeTab === 'outdoor' && 'Outdoor Activities'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <div className="breadcrumb">
                <a href="/">Home</a> / <span>Admin</span> / <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="admin-dropdown">
              <button className="admin-dropdown-btn">
                <div className="admin-dropdown-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>
                <span className="admin-dropdown-name">{user?.name || 'Admin'}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div className="quick-actions">
                <div className="quick-action" onClick={() => setActiveTab('users')}>
                  <div className="quick-action-icon blue">
                    <i className="bi bi-person-plus"></i>
                  </div>
                  <div className="quick-action-text">
                    <h4>Users</h4>
                    <p>Manage member accounts</p>
                  </div>
                </div>
                <div className="quick-action" onClick={() => setActiveTab('bootcamps')}>
                  <div className="quick-action-icon green">
                    <i className="bi bi-lightning-charge"></i>
                  </div>
                  <div className="quick-action-text">
                    <h4>Bootcamps</h4>
                    <p>Track training programs</p>
                  </div>
                </div>
                <div className="quick-action" onClick={() => setActiveTab('outdoor')}>
                  <div className="quick-action-icon orange">
                    <i className="bi bi-tree"></i>
                  </div>
                  <div className="quick-action-text">
                    <h4>Outdoor</h4>
                    <p>Manage field activities</p>
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-header">
                    <div className="stat-icon"><i className="bi bi-people"></i></div>
                  </div>
                  <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
                  <div className="stat-label">Total Users</div>
                </div>

                <div className="stat-card success">
                  <div className="stat-header">
                    <div className="stat-icon"><i className="bi bi-person-check"></i></div>
                  </div>
                  <div className="stat-value">{stats.activeUsers.toLocaleString()}</div>
                  <div className="stat-label">Active Users</div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-header">
                    <div className="stat-icon"><i className="bi bi-lightning-charge"></i></div>
                  </div>
                  <div className="stat-value">{outdoorActivities.length}</div>
                  <div className="stat-label">Outdoor Activities</div>
                </div>
              </div>

              <div className="data-section mt-4">
                <div className="data-header">
                  <h3 className="data-title">Recent Activity</h3>
                </div>
                <ul className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="activity-item">
                      <div className={`activity-icon ${activity.type}`}>
                        <i className={`bi bi-${activity.icon}`}></i>
                      </div>
                      <div className="activity-content">
                        <div className="activity-text" dangerouslySetInnerHTML={{ __html: activity.text }}></div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="data-section animate-fade-in">
              <div className="data-header">
                <h3 className="data-title">All Users</h3>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id || u._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {u.profilePicture ? (
                                <img src={u.profilePicture} alt={u.name} />
                              ) : (
                                u.name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div className="user-name-cell">
                                <div className="fw-bold">{u.name || 'Unknown User'}</div>
                                <div className="text-muted small">ID: {(u.id || u._id)?.slice(-6) || '......'}</div>
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`badge ${u.suspended || u.isSuspended ? 'bg-danger' : 'bg-success'}`}>
                            {u.suspended || u.isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => navigateToUserProfile(u.id || u._id)}>
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'outdoor' && (
            <div className="animate-fade-in">
              <div className="data-header d-flex justify-content-between align-items-center mb-4">
                <h3 className="data-title">Outdoor Activities Management</h3>
                <button 
                    className={`btn ${showOutdoorForm ? 'btn-outline-danger' : 'btn-primary-gradient'}`}
                    onClick={() => {
                        setShowOutdoorForm(!showOutdoorForm);
                        setEditingOutdoorId(null);
                        setOutdoorFormData({
                            title: '',
                            description: '',
                            location: '',
                            activityType: '',
                            expectations: '',
                            startTime: '',
                            endTime: '',
                            difficulty: 'Intermediate',
                        });
                    }}
                >
                    {showOutdoorForm ? <><i className="bi bi-x-lg me-2"></i> Close</> : <><i className="bi bi-plus-lg me-2"></i> Plan New Activity</>}
                </button>
              </div>

              {showOutdoorForm && (
                <div className="bootcamp-form-card fade-in mb-4">
                  <h4 className="fw-bold mb-4">{editingOutdoorId ? 'Update Activity' : 'Plan New Outdoor Activity'}</h4>
                  <form onSubmit={handleOutdoorSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="bootcamp-input-group">
                          <label>Activity Title</label>
                          <input type="text" className="bootcamp-control" name="title" value={outdoorFormData.title} onChange={handleOutdoorInputChange} required />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="bootcamp-input-group">
                          <label>Type</label>
                          <input type="text" className="bootcamp-control" name="activityType" placeholder="Hiking, Yoga, etc." value={outdoorFormData.activityType} onChange={handleOutdoorInputChange} required />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="bootcamp-input-group">
                          <label>Difficulty</label>
                          <select className="bootcamp-control" name="difficulty" value={outdoorFormData.difficulty} onChange={handleOutdoorInputChange}>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bootcamp-input-group">
                      <label>Location</label>
                      <input type="text" className="bootcamp-control" name="location" placeholder="City Park, Beachfront, etc." value={outdoorFormData.location} onChange={handleOutdoorInputChange} required />
                    </div>

                    <div className="bootcamp-input-group">
                      <label>Description</label>
                      <textarea className="bootcamp-control" name="description" value={outdoorFormData.description} onChange={handleOutdoorInputChange} rows="2" required></textarea>
                    </div>

                    <div className="bootcamp-input-group">
                      <label>Expectations</label>
                      <textarea className="bootcamp-control" name="expectations" value={outdoorFormData.expectations} onChange={handleOutdoorInputChange} rows="2" required></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="bootcamp-input-group">
                          <label>Start Time</label>
                          <input type="datetime-local" className="bootcamp-control" name="startTime" value={outdoorFormData.startTime} onChange={handleOutdoorInputChange} required />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="bootcamp-input-group">
                          <label>End Time</label>
                          <input type="datetime-local" className="bootcamp-control" name="endTime" value={outdoorFormData.endTime} onChange={handleOutdoorInputChange} required />
                        </div>
                      </div>
                    </div>

                    <div className="text-end mt-2">
                      <button type="submit" className="btn btn-primary-gradient px-5">
                        {editingOutdoorId ? 'Update Activity' : 'Plan Activity'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bootcamp-grid">
                {outdoorActivities.length === 0 ? (
                  <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                    <i className="bi bi-tree text-muted fs-1 d-block mb-3"></i>
                    <p className="text-muted">No outdoor activities planned yet.</p>
                  </div>
                ) : (
                  outdoorActivities.map(activity => (
                    <div key={activity._id} className="bootcamp-card-modern">
                        <div className="bootcamp-card-header">
                            <span className={`difficulty-pill ${activity.difficulty.toLowerCase()}`}>
                                {activity.difficulty}
                            </span>
                            <div className="bootcamp-actions">
                                <button
                                    className="action-btn-circle invite"
                                    onClick={async () => {
                                        if (window.confirm('Invite all users to this activity?')) {
                                            try {
                                                const token = localStorage.getItem('token');
                                                const response = await fetch(`/api/outdoor-activities/${activity._id}/invite-all`, {
                                                    method: 'POST',
                                                    headers: { Authorization: `Bearer ${token}` }
                                                });
                                                if (response.ok) showToast('Invitations sent to all users!');
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
                                    onClick={() => handleEditOutdoor(activity)}
                                    title="Edit"
                                >
                                    <i className="bi bi-pencil-fill"></i>
                                </button>
                                <button
                                    className="action-btn-circle delete"
                                    onClick={() => handleDeleteOutdoor(activity._id)}
                                    title="Delete"
                                >
                                    <i className="bi bi-trash-fill"></i>
                                </button>
                            </div>
                        </div>
                        
                        <h4 className="bootcamp-title-modern">{activity.title}</h4>
                        <div className="mb-2"><span className="badge bg-light text-primary">{activity.activityType}</span></div>
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
                            <div className="stat-item-row">
                                <i className="bi bi-people"></i>
                                <span>Joined: <span className="value">{activity.participants?.length || 0}</span></span>
                            </div>
                        </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'bootcamps' && (
            <div className="animate-fade-in">
                <div className="data-header d-flex justify-content-between align-items-center mb-4">
                    <h3 className="data-title">Bootcamp Management</h3>
                    <button 
                        className={`btn ${showBootcampForm ? 'btn-outline-danger' : 'btn-primary-gradient'}`}
                        onClick={() => {
                            setShowBootcampForm(!showBootcampForm);
                            setEditingBootcampId(null);
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
                        {showBootcampForm ? <><i className="bi bi-x-lg me-2"></i> Close</> : <><i className="bi bi-plus-lg me-2"></i> Launch New Program</>}
                    </button>
                </div>

                {showBootcampForm && (
                    <div className="bootcamp-form-card fade-in mb-4">
                        <h4 className="fw-bold mb-4">{editingBootcampId ? 'Update Program' : 'Design New Program'}</h4>
                        <form onSubmit={handleBootcampSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="bootcamp-input-group">
                                        <label>Program Title</label>
                                        <input
                                            type="text"
                                            className="bootcamp-control"
                                            name="title"
                                            placeholder="e.g., 30-Day Summer Shred"
                                            value={bootcampFormData.title}
                                            onChange={handleBootcampInputChange}
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
                                            value={bootcampFormData.difficulty}
                                            onChange={handleBootcampInputChange}
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
                                    value={bootcampFormData.description}
                                    onChange={handleBootcampInputChange}
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
                                    value={bootcampFormData.expectations}
                                    onChange={handleBootcampInputChange}
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
                                            value={bootcampFormData.startTime}
                                            onChange={handleBootcampInputChange}
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
                                            value={bootcampFormData.endTime}
                                            onChange={handleBootcampInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-end mt-2">
                                <button type="submit" className="btn btn-primary-gradient px-5">
                                    {editingBootcampId ? <><i className="bi bi-cloud-check me-2"></i>Update Program</> : <><i className="bi bi-rocket-takeoff me-2"></i>Launch Bootcamp</>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bootcamp-grid">
                    {bootcamps.length === 0 ? (
                        <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
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
                                                        if (response.ok) showToast('Invitations sent to all users!');
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
                                            onClick={() => handleEditBootcamp(bootcamp)}
                                            title="Edit"
                                        >
                                            <i className="bi bi-pencil-fill"></i>
                                        </button>
                                        <button
                                            className="action-btn-circle delete"
                                            onClick={() => handleDeleteBootcamp(bootcamp._id)}
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
                                        <span>Enrolled: <span className="value">{bootcamp.participants?.length || 0} Participants</span></span>
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
          )}

        </div>
      </main>
    </div>
  );
}
