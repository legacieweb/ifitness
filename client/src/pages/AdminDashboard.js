import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAllUsers, getSystemHealth, BASE_URL } from '../services/api';
import Preloader from '../components/Preloader';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [logs, setLogs] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalWorkouts: 0,
    caloriesBurned: 0
  });
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    apiLatency: 0,
    uptime: 99.9
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Management states
  const [bootcamps, setBootcamps] = useState([]);
  const [outdoorActivities, setOutdoorActivities] = useState([]);
  const [showBootcampForm, setShowBootcampForm] = useState(false);
  const [bootcampFormData, setBootcampFormData] = useState({
    title: '', description: '', expectations: '', startTime: '', endTime: '', difficulty: 'Intermediate', exercises: []
  });
  const [editingBootcampId, setEditingBootcampId] = useState(null);

  const [showOutdoorForm, setShowOutdoorForm] = useState(false);
  const [outdoorFormData, setOutdoorFormData] = useState({
    title: '', description: '', location: '', activityType: '', expectations: '', startTime: '', endTime: '', difficulty: 'Intermediate'
  });
  const [editingOutdoorId, setEditingOutdoorId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const addLog = useCallback((message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const fetchBootcamps = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/bootcamps`);
      if (response.ok) {
        const data = await response.json();
        setBootcamps(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      addLog(`Error fetching bootcamps: ${err.message}`, 'error');
    }
  }, [addLog]);

  const fetchOutdoorActivities = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/outdoor-activities`);
      if (response.ok) {
        const data = await response.json();
        setOutdoorActivities(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      addLog(`Error fetching outdoor activities: ${err.message}`, 'error');
    }
  }, [addLog]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      addLog('Initiating secure data sync...', 'info');

      // Fetch admin stats
      const statsResponse = await getAdminStats(token);
      const statsData = statsResponse.data;
      setStats({
        totalUsers: statsData.totalUsers || 0,
        activeUsers: (statsData.totalUsers || 0) - (statsData.suspendedUsers || 0),
        totalWorkouts: statsData.totalWorkouts || 0,
        caloriesBurned: statsData.totalCalories || 0
      });

      // Fetch all users
      const usersResponse = await getAllUsers(token);
      const usersData = usersResponse.data || [];
      setAllUsers(usersData);
      setFilteredUsers(usersData);

      // Fetch system health
      const healthResponse = await getSystemHealth(token);
      setSystemHealth(healthResponse.data);

      fetchBootcamps();
      fetchOutdoorActivities();
      
      addLog('Data synchronization complete. System status: OPTIMAL', 'success');

    } catch (error) {
      addLog(`Critical sync failure: ${error.message}`, 'error');
    }
  }, [fetchBootcamps, fetchOutdoorActivities, addLog]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
    setLoading(false);
    
    if (activeTab === 'users') {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 3000);
    }
  }, [user, navigate, fetchDashboardData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    addLog(`Navigating to protocol: ${tab.toUpperCase()}`, 'info');
    
    if (tab === 'users') {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 3000);
    }
  };

  const handleLogout = () => {
    addLog('Terminating session...', 'warning');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUserSearch = (query) => {
    setSearchQuery(query);
    const term = query.toLowerCase();
    setFilteredUsers(allUsers.filter(u => 
      u.name?.toLowerCase().includes(term) || 
      u.email?.toLowerCase().includes(term)
    ));
  };

  const navigateToUserProfile = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // Bootcamp Handlers
  const handleBootcampSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingBootcampId ? 'PUT' : 'POST';
      const url = editingBootcampId ? `${BASE_URL}/bootcamps/${editingBootcampId}` : `${BASE_URL}/bootcamps`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(bootcampFormData),
      });

      if (response.ok) {
        showToast(editingBootcampId ? 'Bootcamp updated' : 'Bootcamp launched');
        addLog(`${editingBootcampId ? 'Updated' : 'Launched'} bootcamp protocol: ${bootcampFormData.title}`, 'success');
        setShowBootcampForm(false);
        setEditingBootcampId(null);
        setBootcampFormData({ title: '', description: '', expectations: '', startTime: '', endTime: '', difficulty: 'Intermediate', exercises: [] });
        fetchBootcamps();
      }
    } catch (err) {
      addLog(`Bootcamp operation failed: ${err.message}`, 'error');
    }
  };

  const deleteBootcamp = async (id) => {
    if (!window.confirm('Confirm protocol termination?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/bootcamps/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        showToast('Protocol terminated');
        addLog('Bootcamp protocol terminated', 'warning');
        fetchBootcamps();
      }
    } catch (err) {
      addLog(`Termination failed: ${err.message}`, 'error');
    }
  };

  // Outdoor Handlers
  const handleOutdoorSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingOutdoorId ? 'PUT' : 'POST';
      const url = editingOutdoorId ? `${BASE_URL}/outdoor-activities/${editingOutdoorId}` : `${BASE_URL}/outdoor-activities`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(outdoorFormData),
      });

      if (response.ok) {
        showToast(editingOutdoorId ? 'Activity updated' : 'Activity planned');
        addLog(`${editingOutdoorId ? 'Updated' : 'Planned'} outdoor activity: ${outdoorFormData.title}`, 'success');
        setShowOutdoorForm(false);
        setEditingOutdoorId(null);
        setOutdoorFormData({ title: '', description: '', location: '', activityType: '', expectations: '', startTime: '', endTime: '', difficulty: 'Intermediate' });
        fetchOutdoorActivities();
      }
    } catch (err) {
      addLog(`Outdoor activity operation failed: ${err.message}`, 'error');
    }
  };

  const deleteOutdoor = async (id) => {
    if (!window.confirm('Confirm expedition termination?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/outdoor-activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        showToast('Expedition terminated');
        addLog('Outdoor expedition aborted', 'warning');
        fetchOutdoorActivities();
      }
    } catch (err) {
      addLog(`Termination failed: ${err.message}`, 'error');
    }
  };

  if (loading) return <Preloader text="AUTHENTICATING COMMANDER..." />;

  return (
    <div className="admin-dashboard-wrapper">
      {toast.show && (
        <div className={`admin-toast ${toast.type}`}>
          <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {toast.message}
        </div>
      )}

      <div className="admin-main">
        {/* Header Section */}
        <div className="admin-header-section">
          <div className="admin-header-content">
            <div>
              <h1 className="admin-page-title">My FITNESS <span>COMMAND CENTER</span></h1>
              <div className="admin-status-badge">PROTOCOL ACTIVE: SECURE SESSION</div>
            </div>
            <button onClick={handleLogout} className="admin-btn-secondary">
              <i className="bi bi-power me-2"></i> TERMINATE SESSION
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="admin-navigation">
          <button className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => handleTabChange('overview')}>
            <i className="bi bi-cpu"></i> CORE STATUS
          </button>
          <button className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>
            <i className="bi bi-people"></i> USER PROTOCOLS
          </button>
          <button className={`admin-nav-tab ${activeTab === 'bootcamps' ? 'active' : ''}`} onClick={() => handleTabChange('bootcamps')}>
            <i className="bi bi-lightning-charge"></i> BOOTCAMP OPS
          </button>
          <button className={`admin-nav-tab ${activeTab === 'outdoor' ? 'active' : ''}`} onClick={() => handleTabChange('outdoor')}>
            <i className="bi bi-geo-alt"></i> OUTDOOR OPS
          </button>
        </div>

        {/* Content Area */}
        <div className="admin-main-content" ref={contentRef}>
          {activeTab === 'overview' && (
            <div className="admin-tab-content">
              {/* Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon"><i className="bi bi-people"></i></div>
                    <div className="admin-stat-label">Total Personnel</div>
                  </div>
                  <div className="admin-stat-value">{stats.totalUsers}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon"><i className="bi bi-person-check"></i></div>
                    <div className="admin-stat-label">Active Operators</div>
                  </div>
                  <div className="admin-stat-value">{stats.activeUsers}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon"><i className="bi bi-lightning"></i></div>
                    <div className="admin-stat-label">System Calories</div>
                  </div>
                  <div className="admin-stat-value">{stats.caloriesBurned.toLocaleString()}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon"><i className="bi bi-activity"></i></div>
                    <div className="admin-stat-label">Total Workouts</div>
                  </div>
                  <div className="admin-stat-value">{stats.totalWorkouts}</div>
                </div>
              </div>

              {/* Health and Logs */}
              <div className="row g-4">
                <div className="col-lg-7">
                  <h4 className="mb-4 text-white">OPERATIONAL OVERVIEW</h4>
                  <div className="health-monitor">
                    <div className="health-card">
                      <div className="health-label">
                        <span>USER RETENTION RATE</span>
                        <span>94%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    <div className="health-card">
                      <div className="health-label">
                        <span>SQUAD COMPLETION INDEX</span>
                        <span>78%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="health-card">
                      <div className="health-label">
                        <span>AVERAGE SESSION DEPTH</span>
                        <span>42 min</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <h4 className="mb-4 text-white">SYSTEM SUMMARY</h4>
                  <div className="terminal-log">
                    <div className="log-entry info">
                      <span className="log-timestamp">[SYSTEM]</span>
                      <span className="log-message">DATABASE CLUSTER: OPTIMAL</span>
                    </div>
                    <div className="log-entry success">
                      <span className="log-timestamp">[AUTH]</span>
                      <span className="log-message">SECURE GATEWAY: ACTIVE</span>
                    </div>
                    <div className="log-entry info">
                      <span className="log-timestamp">[MAIL]</span>
                      <span className="log-message">DISPATCH SERVICE: STANDBY</span>
                    </div>
                    <div className="log-entry warning">
                      <span className="log-timestamp">[BACKUP]</span>
                      <span className="log-message">LAST SYNC: 4m AGO</span>
                    </div>
                    <div className="log-entry success">
                      <span className="log-timestamp">[ADMIN]</span>
                      <span className="log-message">HIERARCHY VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-tab-content">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-white">PERSONNEL DIRECTORY</h3>
                <div className="admin-search-group">
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="SCAN BY NAME OR EMAIL..." 
                    value={searchQuery}
                    onChange={(e) => handleUserSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>PERSONNEL</th>
                      <th>CREDENTIALS</th>
                      <th>PROTOCOL STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="node-frame" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                              {u.profilePicture ? <img src={u.profilePicture} alt="" /> : <i className="bi bi-person text-crimson"></i>}
                            </div>
                            <span className="fw-bold">{u.name}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <div className="protocol-status">
                            <div className={`status-dot ${u.suspended ? 'suspended' : 'active'} ${isScanning ? 'scanning' : ''}`}></div>
                            <span className={`status-badge ${u.suspended ? 'suspended' : 'active'} ${isScanning ? 'dimmed' : ''}`}>
                              {u.suspended ? 'TERMINATED' : (isScanning ? 'CHECKING...' : 'STABLE')}
                            </span>
                            {!u.suspended && (
                              isScanning ? (
                                <span className="scanning-text blink">SCANNING BIOMETRICS...</span>
                              ) : (
                                <span className="confirmed-text">IDENTITY CONFIRMED</span>
                              )
                            )}
                          </div>
                        </td>
                        <td>
                          <button className="admin-btn-secondary" onClick={() => navigateToUserProfile(u.id)}>
                            <i className="bi bi-file-earmark-person"></i>
                            ACCESS FILE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bootcamps' && (
            <div className="admin-tab-content">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-white">BOOTCAMP OPERATIONS</h3>
                <button className="admin-btn-primary" onClick={() => { setShowBootcampForm(!showBootcampForm); setEditingBootcampId(null); }}>
                  {showBootcampForm ? 'CANCEL OPS' : 'INITIATE BOOTCAMP'}
                </button>
              </div>

              {showBootcampForm && (
                <div className="health-card mb-5">
                  <form onSubmit={handleBootcampSubmit} className="admin-form">
                    <div className="form-group full-width">
                      <label>OPERATION TITLE</label>
                      <input type="text" className="admin-input" value={bootcampFormData.title} onChange={e => setBootcampFormData({...bootcampFormData, title: e.target.value})} required />
                    </div>
                    <div className="form-group full-width">
                      <label>BRIEFING DESCRIPTION</label>
                      <textarea className="admin-textarea" rows="3" value={bootcampFormData.description} onChange={e => setBootcampFormData({...bootcampFormData, description: e.target.value})} required></textarea>
                    </div>
                    <div className="form-group">
                      <label>COMMENCE TIME</label>
                      <input type="datetime-local" className="admin-input" value={bootcampFormData.startTime} onChange={e => setBootcampFormData({...bootcampFormData, startTime: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>CONCLUDE TIME</label>
                      <input type="datetime-local" className="admin-input" value={bootcampFormData.endTime} onChange={e => setBootcampFormData({...bootcampFormData, endTime: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>INTENSITY LEVEL</label>
                      <select className="admin-select" value={bootcampFormData.difficulty} onChange={e => setBootcampFormData({...bootcampFormData, difficulty: e.target.value})}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Elite</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <button type="submit" className="admin-btn-primary w-100">LAUNCH OPERATION</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>OPERATION</th>
                      <th>SCHEDULE</th>
                      <th>INTENSITY</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bootcamps.map(b => (
                      <tr key={b._id}>
                        <td><span className="fw-bold">{b.title}</span></td>
                        <td>{new Date(b.startTime).toLocaleString()}</td>
                        <td><span className="text-crimson">{b.difficulty.toUpperCase()}</span></td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="admin-btn-secondary btn-sm" onClick={() => { setBootcampFormData(b); setEditingBootcampId(b._id); setShowBootcampForm(true); }}>MODIFY</button>
                            <button className="admin-btn-secondary btn-sm text-danger" onClick={() => deleteBootcamp(b._id)}>ABORT</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'outdoor' && (
            <div className="admin-tab-content">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-white">OUTDOOR EXPEDITIONS</h3>
                <button className="admin-btn-primary" onClick={() => { setShowOutdoorForm(!showOutdoorForm); setEditingOutdoorId(null); }}>
                  {showOutdoorForm ? 'CANCEL OPS' : 'PLAN EXPEDITION'}
                </button>
              </div>

              {showOutdoorForm && (
                <div className="health-card mb-5">
                  <form onSubmit={handleOutdoorSubmit} className="admin-form">
                    <div className="form-group full-width">
                      <label>EXPEDITION TITLE</label>
                      <input type="text" className="admin-input" value={outdoorFormData.title} onChange={e => setOutdoorFormData({...outdoorFormData, title: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>SECTOR / LOCATION</label>
                      <input type="text" className="admin-input" value={outdoorFormData.location} onChange={e => setOutdoorFormData({...outdoorFormData, location: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>ACTIVITY TYPE</label>
                      <input type="text" className="admin-input" placeholder="Hiking, Beach, etc." value={outdoorFormData.activityType} onChange={e => setOutdoorFormData({...outdoorFormData, activityType: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>COMMENCE TIME</label>
                      <input type="datetime-local" className="admin-input" value={outdoorFormData.startTime} onChange={e => setOutdoorFormData({...outdoorFormData, startTime: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>CONCLUDE TIME</label>
                      <input type="datetime-local" className="admin-input" value={outdoorFormData.endTime} onChange={e => setOutdoorFormData({...outdoorFormData, endTime: e.target.value})} required />
                    </div>
                    <div className="form-group full-width">
                      <button type="submit" className="admin-btn-primary w-100">AUTHORIZE EXPEDITION</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>EXPEDITION</th>
                      <th>SECTOR</th>
                      <th>SCHEDULE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outdoorActivities.map(o => (
                      <tr key={o._id}>
                        <td><span className="fw-bold">{o.title}</span></td>
                        <td>{o.location}</td>
                        <td>{new Date(o.startTime).toLocaleString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="admin-btn-secondary btn-sm" onClick={() => { setOutdoorFormData(o); setEditingOutdoorId(o._id); setShowOutdoorForm(true); }}>MODIFY</button>
                            <button className="admin-btn-secondary btn-sm text-danger" onClick={() => deleteOutdoor(o._id)}>ABORT</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
