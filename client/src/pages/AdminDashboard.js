import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAllUsers, getSystemHealth } from '../services/api';
import Preloader from '../components/Preloader';
import './AdminDashboard.css';
import './AdminBootcamp.css';
import './Dashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    // Scroll to top of content area when tab changes
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchSuggestions(false);
      return;
    }

    const term = query.toLowerCase();
    const results = [];

    // Search Users
    allUsers.forEach(u => {
      if (u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)) {
        results.push({
          id: u.id || u._id,
          title: u.name,
          subtitle: u.email,
          type: 'user',
          icon: 'person-fill',
          tab: 'users'
        });
      }
    });

    // Search Bootcamps
    bootcamps.forEach(b => {
      if (b.title?.toLowerCase().includes(term) || b.description?.toLowerCase().includes(term)) {
        results.push({
          id: b._id,
          title: b.title,
          subtitle: 'Bootcamp Program',
          type: 'bootcamp',
          icon: 'lightning-charge-fill',
          tab: 'bootcamps'
        });
      }
    });

    // Search Outdoor Activities
    outdoorActivities.forEach(o => {
      if (o.title?.toLowerCase().includes(term) || o.location?.toLowerCase().includes(term)) {
        results.push({
          id: o._id,
          title: o.title,
          subtitle: `Outdoor: ${o.location}`,
          type: 'outdoor',
          icon: 'tree-fill',
          tab: 'outdoor'
        });
      }
    });

    setSearchResults(results.slice(0, 8)); // Limit suggestions
    setShowSearchSuggestions(true);
  };

  const handleSearchResultClick = (result) => {
    setSearchQuery('');
    setShowSearchSuggestions(false);
    
    if (result.type === 'user') {
      navigateToUserProfile(result.id);
    } else {
      handleTabChange(result.tab);
    }
  };


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
    return <Preloader text="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {toast.message}
        </div>
      )}

      {/* Mobile Sidebar Toggle */}
      <button 
        className="mobile-sidebar-toggle d-lg-none" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title="Toggle Menu"
      >
        <i className={`bi bi-${sidebarOpen ? 'x-lg' : 'list'}`}></i>
      </button>

      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop d-lg-none" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Redesigned Admin Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <div className="admin-logo-icon">
              <i className="bi bi-shield-check"></i>
            </div>
          </div>
        </div>

        <div className="admin-sidebar-profile">
          <div className="admin-profile-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="admin-profile-img" />
            ) : (
              <div className="admin-avatar-placeholder">
                <i className="bi bi-person-fill"></i>
              </div>
            )}
            <div className="admin-profile-status"></div>
          </div>
          <div className="admin-profile-info">
            <span className="admin-profile-name">{user?.name || 'Admin'}</span>
            <span className="admin-profile-role">System Administrator</span>
          </div>
          <button className="admin-profile-actions" title="Profile Settings">
            <i className="bi bi-three-dots-vertical"></i>
          </button>
        </div>
        
        <div className="admin-sidebar-notifications">
          <button className="admin-notification-btn">
            <i className="bi bi-bell-fill"></i>
            <span className="admin-notification-badge">3</span>
          </button>
          <button className="admin-message-btn">
            <i className="bi bi-chat-fill"></i>
            <span className="admin-message-badge">1</span>
          </button>
        </div>

        <div className="admin-sidebar-search">
          <div className="admin-search-input">
            <i className="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              onFocus={() => searchQuery && setShowSearchSuggestions(true)}
            />
          </div>
          
          {showSearchSuggestions && searchResults.length > 0 && (
            <div className="admin-search-suggestions">
              {searchResults.map((result, idx) => (
                <div 
                  key={idx} 
                  className="search-suggestion-item"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <div className={`suggestion-icon ${result.type}`}>
                    <i className={`bi bi-${result.icon}`}></i>
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-title">{result.title}</div>
                    <div className="suggestion-subtitle">{result.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section">
            <span className="admin-nav-section-title">Main Menu</span>
            <button
              className={`admin-nav-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
              title="Dashboard"
            >
              <div className="admin-nav-icon">
                <i className="bi bi-grid-fill"></i>
              </div>
              <span className="admin-nav-text">Dashboard</span>
              <div className="admin-nav-indicator"></div>
            </button>
            <button
              className={`admin-nav-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => handleTabChange('users')}
              title="Users"
            >
              <div className="admin-nav-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <span className="admin-nav-text">Users</span>
              <div className="admin-nav-indicator"></div>
            </button>
            <button
              className={`admin-nav-button ${activeTab === 'bootcamps' ? 'active' : ''}`}
              onClick={() => handleTabChange('bootcamps')}
              title="Bootcamps"
            >
              <div className="admin-nav-icon">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <span className="admin-nav-text">Bootcamps</span>
              <div className="admin-nav-indicator"></div>
            </button>
            <button
              className={`admin-nav-button ${activeTab === 'outdoor' ? 'active' : ''}`}
              onClick={() => handleTabChange('outdoor')}
              title="Outdoor Activities"
            >
              <div className="admin-nav-icon">
                <i className="bi bi-tree-fill"></i>
              </div>
              <span className="admin-nav-text">Outdoor</span>
              <div className="admin-nav-indicator"></div>
            </button>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-sidebar-logout">
            <div className="admin-logout-icon">
              <i className="bi bi-box-arrow-right"></i>
            </div>
            <span className="admin-logout-text">Logout</span>
          </button>
          <div className="admin-sidebar-version">
            <span>v2.0.1</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main-area">
        {/* Header */}
        <div className="admin-content-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">
              {activeTab === 'overview' && 'Admin Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'bootcamps' && 'Bootcamp Management'}
              {activeTab === 'outdoor' && 'Outdoor Activities'}
            </h1>
            <div className="admin-breadcrumb">
              <a href="/">Home</a> / <span>Admin</span> / <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content-area" ref={contentRef}>
        {activeTab === 'overview' && (
          <div className="admin-section">
            <div className="admin-quick-actions">
              <div className="admin-quick-action" onClick={() => handleTabChange('users')}>
                <div className="admin-quick-action-icon blue">
                  <i className="bi bi-person-plus"></i>
                </div>
                <div className="admin-quick-action-text">
                  <h4>Users</h4>
                  <p>Manage member accounts</p>
                </div>
              </div>
              <div className="admin-quick-action" onClick={() => handleTabChange('bootcamps')}>
                <div className="admin-quick-action-icon green">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <div className="admin-quick-action-text">
                  <h4>Bootcamps</h4>
                  <p>Track training programs</p>
                </div>
              </div>
              <div className="admin-quick-action" onClick={() => handleTabChange('outdoor')}>
                <div className="admin-quick-action-icon orange">
                  <i className="bi bi-tree"></i>
                </div>
                <div className="admin-quick-action-text">
                  <h4>Outdoor</h4>
                  <p>Manage field activities</p>
                </div>
              </div>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card primary">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon"><i className="bi bi-people"></i></div>
                </div>
                <div className="admin-stat-value">{stats.totalUsers.toLocaleString()}</div>
                <div className="admin-stat-label">Total Users</div>
              </div>

              <div className="admin-stat-card success">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon"><i className="bi bi-person-check"></i></div>
                </div>
                <div className="admin-stat-value">{stats.activeUsers.toLocaleString()}</div>
                <div className="admin-stat-label">Active Users</div>
              </div>

              <div className="admin-stat-card warning">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon"><i className="bi bi-lightning-charge"></i></div>
                </div>
                <div className="admin-stat-value">{outdoorActivities.length}</div>
                <div className="admin-stat-label">Outdoor Activities</div>
              </div>
            </div>

            <div className="admin-control-center">
              <div className="row">
                <div className="col-lg-6">
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h4><i className="bi bi-shield-lock me-2"></i>Platform Alerts</h4>
                    </div>
                    <div className="admin-card-body p-0">
                      <div className="platform-alerts-list">
                        <div className="alert-item warning">
                          <div className="alert-icon"><i className="bi bi-exclamation-triangle"></i></div>
                          <div className="alert-text">
                            <strong>{allUsers.filter(u => u.suspended).length} Suspended Accounts</strong>
                            <p>Accounts requiring review or unsuspension.</p>
                          </div>
                          <button className="alert-action" onClick={() => handleTabChange('users')}>Review</button>
                        </div>
                        <div className="alert-item info">
                          <div className="alert-icon"><i className="bi bi-info-circle"></i></div>
                          <div className="alert-text">
                            <strong>System Update</strong>
                            <p>Version v2.0.1 is active. All modules operational.</p>
                          </div>
                        </div>
                        <div className="alert-item success">
                          <div className="alert-icon"><i className="bi bi-people"></i></div>
                          <div className="alert-text">
                            <strong>New Members</strong>
                            <p>{allUsers.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} users joined this week.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h4><i className="bi bi-calendar-event me-2"></i>Upcoming Sessions</h4>
                    </div>
                    <div className="admin-card-body p-0">
                      <div className="upcoming-sessions-list">
                        {bootcamps.length > 0 ? (
                          <div className="session-item">
                            <div className="session-tag bootcamp">Bootcamp</div>
                            <div className="session-info">
                              <strong>{bootcamps[0].title}</strong>
                              <span><i className="bi bi-clock me-1"></i> {new Date(bootcamps[0].startTime).toLocaleDateString()}</span>
                            </div>
                            <button className="session-btn" onClick={() => handleTabChange('bootcamps')}><i className="bi bi-arrow-right"></i></button>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-muted">No upcoming bootcamps</div>
                        )}
                        
                        {outdoorActivities.length > 0 ? (
                          <div className="session-item">
                            <div className="session-tag outdoor">Outdoor</div>
                            <div className="session-info">
                              <strong>{outdoorActivities[0].title}</strong>
                              <span><i className="bi bi-geo-alt me-1"></i> {outdoorActivities[0].location}</span>
                            </div>
                            <button className="session-btn" onClick={() => handleTabChange('outdoor')}><i className="bi bi-arrow-right"></i></button>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-muted">No outdoor activities planned</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">User Management</h3>
              <div className="admin-section-actions">
                <div className="admin-search-box">
                  <i className="bi bi-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    onChange={(e) => {
                      const term = e.target.value.toLowerCase();
                      setFilteredUsers(allUsers.filter(u => 
                        u.name?.toLowerCase().includes(term) || 
                        u.email?.toLowerCase().includes(term)
                      ));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="users-grid">
              {filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <h4 className="empty-state-title">No users found</h4>
                  <p className="empty-state-text">Try adjusting your search terms.</p>
                </div>
              ) : (
                filteredUsers.map(u => (
                  <div key={u.id || u._id} className="user-card-clickable" onClick={() => navigateToUserProfile(u.id || u._id)}>
                    <div className="user-card-header">
                      <div className="user-card-avatar">
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt={u.name} />
                        ) : (
                          <span>{u.name?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div className="user-card-status-badge">
                        {u.suspended || u.isSuspended ? (
                          <i className="bi bi-clock-fill text-danger"></i>
                        ) : (
                          <i className="bi bi-check-circle-fill text-success"></i>
                        )}
                      </div>
                    </div>
                    <div className="user-card-body">
                      <h4 className="user-card-name">{u.name || 'Unknown User'}</h4>
                      <p className="user-card-email">{u.email}</p>
                    </div>
                    <div className="user-card-stats">
                      <div className="stat-item">
                        <i className="bi bi-calendar3"></i>
                        <span>Joined: <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span></span>
                      </div>
                    </div>
                    <div className="user-card-footer">
                      <span className={`user-card-status ${u.suspended || u.isSuspended ? 'suspended' : 'active'}`}>
                        {u.suspended || u.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                      <div className="user-card-arrow">
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'outdoor' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Outdoor Activities</h3>
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
                  {showOutdoorForm ? <><i className="bi bi-x-lg me-2"></i> Close</> : <><i className="bi bi-plus-lg me-2"></i> Plan Activity</>}
              </button>
            </div>

            {showOutdoorForm && (
              <div className="admin-form-card animate-fade-in">
                <h4 className="fw-bold mb-4">{editingOutdoorId ? 'Update Activity' : 'Plan New Outdoor Activity'}</h4>
                <form onSubmit={handleOutdoorSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="admin-form-group">
                        <label>Activity Title</label>
                        <input type="text" className="admin-form-control" name="title" value={outdoorFormData.title} onChange={handleOutdoorInputChange} required />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="admin-form-group">
                        <label>Type</label>
                        <input type="text" className="admin-form-control" name="activityType" placeholder="Hiking, Yoga, etc." value={outdoorFormData.activityType} onChange={handleOutdoorInputChange} required />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="admin-form-group">
                        <label>Difficulty</label>
                        <select className="admin-form-control" name="difficulty" value={outdoorFormData.difficulty} onChange={handleOutdoorInputChange}>
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Location</label>
                    <input type="text" className="admin-form-control" name="location" placeholder="City Park, Beachfront, etc." value={outdoorFormData.location} onChange={handleOutdoorInputChange} required />
                  </div>

                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea className="admin-form-control" name="description" value={outdoorFormData.description} onChange={handleOutdoorInputChange} rows="2" required></textarea>
                  </div>

                  <div className="admin-form-group">
                    <label>Expectations</label>
                    <textarea className="admin-form-control" name="expectations" value={outdoorFormData.expectations} onChange={handleOutdoorInputChange} rows="2" required></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="admin-form-group">
                        <label>Start Time</label>
                        <input type="datetime-local" className="admin-form-control" name="startTime" value={outdoorFormData.startTime} onChange={handleOutdoorInputChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="admin-form-group">
                        <label>End Time</label>
                        <input type="datetime-local" className="admin-form-control" name="endTime" value={outdoorFormData.endTime} onChange={handleOutdoorInputChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button type="submit" className="btn btn-primary-gradient px-5">
                      {editingOutdoorId ? 'Update Activity' : 'Plan Activity'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-bootcamp-grid mt-4">
              {outdoorActivities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <i className="bi bi-tree"></i>
                  </div>
                  <h4 className="empty-state-title">No activities planned</h4>
                  <p className="empty-state-text">Start by planning a new outdoor activity.</p>
                </div>
              ) : (
                outdoorActivities.map(activity => (
                  <div key={activity._id} className="admin-bootcamp-card">
                      <div className="admin-bootcamp-card-header">
                          <span className={`difficulty-pill ${activity.difficulty.toLowerCase()}`}>
                              {activity.difficulty}
                          </span>
                          <div className="admin-bootcamp-actions">
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
                      
                      <h4 className="admin-bootcamp-title">{activity.title}</h4>
                      <div className="mb-3"><span className="badge bg-soft-primary text-primary">{activity.activityType}</span></div>
                      <p className="admin-bootcamp-desc">{activity.description}</p>
                      
                      <div className="admin-bootcamp-stats">
                          <div className="admin-stat-item">
                              <i className="bi bi-geo-alt"></i>
                              <span>Location: <span className="value">{activity.location}</span></span>
                          </div>
                          <div className="admin-stat-item">
                              <i className="bi bi-calendar-event"></i>
                              <span>Date: <span className="value">{new Date(activity.startTime).toLocaleDateString()}</span></span>
                          </div>
                          <div className="admin-stat-item">
                              <i className="bi bi-people"></i>
                              <span>Participants: <span className="value">{activity.participants?.length || 0}</span></span>
                          </div>
                      </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'bootcamps' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Bootcamp Management</h3>
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
                <div className="admin-form-card">
                    <h4 className="fw-bold mb-4">{editingBootcampId ? 'Update Program' : 'Design New Program'}</h4>
                    <form onSubmit={handleBootcampSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="admin-form-group">
                                    <label>Program Title</label>
                                    <input
                                        type="text"
                                        className="admin-form-control"
                                        name="title"
                                        placeholder="e.g., 30-Day Summer Shred"
                                        value={bootcampFormData.title}
                                        onChange={handleBootcampInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="admin-form-group">
                                    <label>Difficulty Level</label>
                                    <select
                                        className="admin-form-control"
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

                        <div className="admin-form-group">
                            <label>Detailed Description</label>
                            <textarea
                                className="admin-form-control"
                                name="description"
                                value={bootcampFormData.description}
                                onChange={handleBootcampInputChange}
                                rows="3"
                                placeholder="Describe the goals and target audience..."
                                required
                            ></textarea>
                        </div>

                        <div className="admin-form-group">
                            <label>What Participants Should Expect</label>
                            <textarea
                                className="admin-form-control"
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
                                <div className="admin-form-group">
                                    <label>Launch Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="admin-form-control"
                                        name="startTime"
                                        value={bootcampFormData.startTime}
                                        onChange={handleBootcampInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="admin-form-group">
                                    <label>Conclusion Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="admin-form-control"
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

            <div className="admin-bootcamp-grid">
                {bootcamps.length === 0 ? (
                    <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                      <i className="bi bi-inboxes text-muted fs-1 d-block mb-3"></i>
                      <p className="text-muted">No programs created yet.</p>
                    </div>
                ) : (
                    bootcamps.map((bootcamp) => (
                        <div key={bootcamp._id} className="admin-bootcamp-card">
                            <div className="admin-bootcamp-card-header">
                                <span className={`difficulty-pill ${bootcamp.difficulty.toLowerCase()}`}>
                                    {bootcamp.difficulty}
                                </span>
                                <div className="admin-bootcamp-actions">
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
                             
                            <h4 className="admin-bootcamp-title">{bootcamp.title}</h4>
                            <p className="admin-bootcamp-desc">{bootcamp.description}</p>
                             
                            <div className="admin-bootcamp-stats">
                                <div className="admin-stat-item">
                                    <i className="bi bi-calendar2-event"></i>
                                    <span>Start: <span className="value">{new Date(bootcamp.startTime).toLocaleDateString()}</span></span>
                                    <span className="ms-auto text-muted small">{new Date(bootcamp.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className="admin-stat-item">
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
        {activeTab === 'analytics' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Platform Analytics</h3>
            </div>
            <div className="admin-stats-grid">
              <div className="admin-stat-card primary">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon"><i className="bi bi-people"></i></div>
                  <span className="trend positive"><i className="bi bi-arrow-up"></i> 12%</span>
                </div>
                <div className="admin-stat-value">{stats.totalUsers.toLocaleString()}</div>
                <div className="admin-stat-label">Total Platform Users</div>
              </div>
              <div className="admin-stat-card success">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon"><i className="bi bi-activity"></i></div>
                  <span className="trend positive"><i className="bi bi-arrow-up"></i> 8%</span>
                </div>
                <div className="admin-stat-value">{stats.totalWorkouts.toLocaleString()}</div>
                <div className="admin-stat-label">Workouts Logged</div>
              </div>
              <div className="admin-stat-card warning">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon"><i className="bi bi-fire"></i></div>
                  <span className="trend positive"><i className="bi bi-arrow-up"></i> 15%</span>
                </div>
                <div className="admin-stat-value">{stats.caloriesBurned.toLocaleString()}</div>
                <div className="admin-stat-label">Total Calories Burned</div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-lg-8">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h4>User Growth</h4>
                    <span className="text-muted small">Last 30 days</span>
                  </div>
                  <div className="admin-card-body">
                    <div className="analytics-placeholder-chart">
                      <div className="chart-bar-container">
                        {[40, 65, 55, 85, 75, 95, 80].map((h, i) => (
                          <div key={i} className="chart-bar" style={{ height: `${h}%` }}>
                            <span className="bar-tooltip">{h} new users</span>
                          </div>
                        ))}
                      </div>
                      <div className="chart-labels">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h4>Traffic Sources</h4>
                  </div>
                  <div className="admin-card-body">
                    <div className="traffic-sources">
                      <div className="traffic-source-item">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Direct</span>
                          <span>45%</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-primary" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div className="traffic-source-item mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Social Media</span>
                          <span>30%</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div className="traffic-source-item mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Referrals</span>
                          <span>25%</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-warning" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
