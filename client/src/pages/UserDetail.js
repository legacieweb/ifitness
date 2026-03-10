import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { suspendUser, unsuspendUser, updateUserRoutine, sendRoutineReminder } from '../services/api';
import Preloader from '../components/Preloader';
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
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [weeklyRoutine, setWeeklyRoutine] = useState([]);
  const [isSavingRoutine, setIsSavingRoutine] = useState(false);

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
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setStats(data.stats);
        setRecentWorkouts(data.recentWorkouts || []);
        setWeeklyRoutine(data.user.weeklyRoutine || []);
      }
    } catch (error) {
      showToast('Error loading user file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSuspendUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await suspendUser(userId, suspendReason || 'Violation of protocol', token);
      await fetchUserDetail();
      showToast('Personnel suspended', 'success');
      setShowSuspendModal(false);
    } catch (error) {
      showToast('Suspension failed', 'error');
    }
  };

  const handleUnsuspendUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await unsuspendUser(userId, token);
      await fetchUserDetail();
      showToast('Personnel reinstated', 'success');
    } catch (error) {
      showToast('Reinstatement failed', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('THIS ACTION CANNOT BE UNDONE. PURGE PERSONNEL FILE?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Personnel purged from system', 'success');
        setTimeout(() => navigate('/admin', { state: { activeTab: 'users' } }), 1500);
      }
    } catch (error) {
      showToast('Purge failed', 'error');
    }
  };

  const handleAddRoutineDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const usedDays = weeklyRoutine.map(r => r.day);
    const nextDay = days.find(d => !usedDays.includes(d)) || 'Monday';
    
    setWeeklyRoutine([...weeklyRoutine, {
      day: nextDay,
      workout: '',
      completed: false,
      exercises: []
    }]);
  };

  const handleRemoveRoutineDay = (index) => {
    const newRoutine = [...weeklyRoutine];
    newRoutine.splice(index, 1);
    setWeeklyRoutine(newRoutine);
  };

  const handleUpdateRoutineDay = (index, field, value) => {
    const newRoutine = [...weeklyRoutine];
    newRoutine[index] = { ...newRoutine[index], [field]: value };
    setWeeklyRoutine(newRoutine);
  };

  const handleAddExercise = (dayIndex) => {
    const newRoutine = [...weeklyRoutine];
    newRoutine[dayIndex].exercises.push({ name: '', sets: '', reps: '' });
    setWeeklyRoutine(newRoutine);
  };

  const handleRemoveExercise = (dayIndex, exIndex) => {
    const newRoutine = [...weeklyRoutine];
    newRoutine[dayIndex].exercises.splice(exIndex, 1);
    setWeeklyRoutine(newRoutine);
  };

  const handleUpdateExercise = (dayIndex, exIndex, field, value) => {
    const newRoutine = [...weeklyRoutine];
    newRoutine[dayIndex].exercises[exIndex] = { 
      ...newRoutine[dayIndex].exercises[exIndex], 
      [field]: value 
    };
    setWeeklyRoutine(newRoutine);
  };

  const handleSaveRoutine = async () => {
    try {
      setIsSavingRoutine(true);
      const token = localStorage.getItem('token');
      await updateUserRoutine(userId, weeklyRoutine, token);
      showToast('Weekly routine synchronized', 'success');
      await fetchUserDetail();
    } catch (error) {
      showToast('Synchronization failed', 'error');
    } finally {
      setIsSavingRoutine(false);
    }
  };

  const handleSendReminder = async (dayIndex) => {
    try {
      const token = localStorage.getItem('token');
      await sendRoutineReminder(userId, dayIndex, token);
      showToast('Mission brief dispatched', 'success');
    } catch (error) {
      showToast('Dispatch failed', 'error');
    }
  };

  if (loading) return <Preloader text="ACCESSING PERSONNEL FILE..." />;

  if (!user) return (
    <div className="user-detail-wrapper">
      <div className="text-center py-5">
        <h2 className="text-crimson">PERSONNEL FILE NOT FOUND</h2>
        <button className="admin-btn-secondary mt-4" onClick={() => navigate('/admin')}>RETURN TO HQ</button>
      </div>
    </div>
  );

  return (
    <div className="user-detail-wrapper">
      {toast.show && (
        <div className={`admin-toast ${toast.type}`}>
          <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {toast.message}
        </div>
      )}

      <div className="user-detail-container">
        <div className="user-detail-header">
          <button className="back-btn" onClick={() => navigate('/admin', { state: { activeTab: 'users' } })}>
            <i className="bi bi-arrow-left"></i> RETURN TO PERSONNEL DIRECTORY
          </button>
        </div>

        <div className="user-profile-header">
          <div className="profile-avatar-large">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="" />
            ) : (
              <div className="avatar-placeholder"><i className="bi bi-person"></i></div>
            )}
          </div>
          
          <div className="profile-info-main">
            <h1 className="user-name">{user.name.toUpperCase()}</h1>
            <div className={`status-indicator ${user.suspended ? 'suspended' : 'active'}`}>
              {user.suspended ? 'STATUS: SUSPENDED' : 'STATUS: ACTIVE OPERATOR'}
            </div>
            <p className="user-email-primary mt-3"><i className="bi bi-envelope"></i> {user.email}</p>
            
            <div className="d-flex gap-3 flex-wrap">
              <div className="stat-pill"><i className="bi bi-calendar"></i> JOINED: {new Date(user.createdAt).toLocaleDateString()}</div>
              <div className="stat-pill"><i className="bi bi-dumbbell"></i> {stats?.totalWorkouts || 0} SESSIONS</div>
              <div className="stat-pill"><i className="bi bi-fire"></i> {stats?.totalCalories || 0} KCAL</div>
            </div>
          </div>

          <div className="header-actions">
            {user.suspended ? (
              <button className="action-btn unsuspend" onClick={handleUnsuspendUser}>
                <i className="bi bi-unlock"></i> REINSTATE
              </button>
            ) : (
              <button className="action-btn suspend" onClick={() => setShowSuspendModal(true)}>
                <i className="bi bi-pause-circle"></i> SUSPEND
              </button>
            )}
            <button className="action-btn delete" onClick={handleDeleteUser}>
              <i className="bi bi-trash"></i> PURGE FILE
            </button>
          </div>
        </div>

        <div className="tabs-nav">
          <button className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>VITAL SIGNS</button>
          <button className={`tab-item ${activeTab === 'workouts' ? 'active' : ''}`} onClick={() => setActiveTab('workouts')}>MISSION LOGS</button>
          <button className={`tab-item ${activeTab === 'routine' ? 'active' : ''}`} onClick={() => setActiveTab('routine')}>WEEKLY ROUTINE</button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="detail-card">
                  <h3>BIOMETRIC DATA</h3>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="text-muted small d-block">WEIGHT</label>
                      <span className="h5">{user.weight || '--'} KG</span>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small d-block">HEIGHT</label>
                      <span className="h5">{user.height || '--'} CM</span>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small d-block">AGE</label>
                      <span className="h5">{user.age || '--'} YRS</span>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small d-block">GOAL</label>
                      <span className="h5 text-crimson">{user.goal || 'NOT SET'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="detail-card">
                  <h3>OPERATIONAL STATS</h3>
                  <div className="health-monitor">
                    <div className="health-card p-2 mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>CONSISTENCY INDEX</span>
                        <span>85%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: '85%' }}></div></div>
                    </div>
                    <div className="health-card p-2">
                      <div className="d-flex justify-content-between mb-2">
                        <span>GOAL COMPLETION</span>
                        <span>{user.goal ? '42%' : '0%'}</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: user.goal ? '42%' : '0%' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="detail-card">
              <h3>RECENT MISSION LOGS</h3>
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map(w => (
                  <div key={w._id} className="workout-item">
                    <div>
                      <span className="fw-bold d-block">{w.name.toUpperCase()}</span>
                      <span className="text-muted small">{new Date(w.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-end">
                      <span className="text-crimson fw-bold">{w.caloriesBurned} KCAL</span>
                      <span className="d-block text-muted small">{w.duration} MIN</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">NO MISSIONS LOGGED</div>
              )}
            </div>
          )}

          {activeTab === 'routine' && (
            <div className="routine-editor-container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>WEEKLY MISSION PARAMETERS</h3>
                <div className="d-flex gap-2">
                  <button className="admin-btn-secondary" onClick={handleAddRoutineDay}>
                    <i className="bi bi-plus-lg"></i> ADD OPERATIONAL DAY
                  </button>
                  <button 
                    className="admin-btn-primary" 
                    onClick={handleSaveRoutine}
                    disabled={isSavingRoutine}
                  >
                    {isSavingRoutine ? 'SYNCHRONIZING...' : 'SYNCHRONIZE ROUTINE'}
                  </button>
                </div>
              </div>

              {weeklyRoutine.length > 0 ? (
                <div className="routine-days-list">
                  {weeklyRoutine.map((day, dIdx) => (
                    <div key={dIdx} className="routine-day-card mb-4">
                      <div className="routine-day-header">
                        <div className="row g-3 align-items-center flex-1">
                          <div className="col-md-3">
                            <select 
                              className="admin-select"
                              value={day.day}
                              onChange={(e) => handleUpdateRoutineDay(dIdx, 'day', e.target.value)}
                            >
                              <option>Monday</option>
                              <option>Tuesday</option>
                              <option>Wednesday</option>
                              <option>Thursday</option>
                              <option>Friday</option>
                              <option>Saturday</option>
                              <option>Sunday</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <input 
                              type="text"
                              className="admin-input"
                              placeholder="MISSION NAME (e.g. UPPER BODY STRIKE)"
                              value={day.workout}
                              onChange={(e) => handleUpdateRoutineDay(dIdx, 'workout', e.target.value)}
                            />
                          </div>
                          <div className="col-md-3 d-flex gap-2 justify-content-end">
                            <button 
                              className="icon-btn reminder" 
                              title="Send Reminder"
                              onClick={() => handleSendReminder(dIdx)}
                            >
                              <i className="bi bi-bell"></i>
                            </button>
                            <button 
                              className="icon-btn delete" 
                              title="Remove Day"
                              onClick={() => handleRemoveRoutineDay(dIdx)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="routine-exercises-section">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="m-0 small text-muted">EXERCISE PROTOCOLS</h4>
                          <button className="text-btn" onClick={() => handleAddExercise(dIdx)}>
                            <i className="bi bi-plus"></i> ATTACH PROTOCOL
                          </button>
                        </div>

                        {day.exercises && day.exercises.length > 0 ? (
                          <div className="exercises-grid">
                            {day.exercises.map((ex, eIdx) => (
                              <div key={eIdx} className="exercise-row mb-2">
                                <div className="row g-2 align-items-center">
                                  <div className="col-5">
                                    <input 
                                      type="text"
                                      className="admin-input-sm"
                                      placeholder="EXERCISE NAME"
                                      value={ex.name}
                                      onChange={(e) => handleUpdateExercise(dIdx, eIdx, 'name', e.target.value)}
                                    />
                                  </div>
                                  <div className="col-2">
                                    <input 
                                      type="text"
                                      className="admin-input-sm"
                                      placeholder="SETS"
                                      value={ex.sets}
                                      onChange={(e) => handleUpdateExercise(dIdx, eIdx, 'sets', e.target.value)}
                                    />
                                  </div>
                                  <div className="col-2">
                                    <input 
                                      type="text"
                                      className="admin-input-sm"
                                      placeholder="REPS"
                                      value={ex.reps}
                                      onChange={(e) => handleUpdateExercise(dIdx, eIdx, 'reps', e.target.value)}
                                    />
                                  </div>
                                  <div className="col-3 text-end">
                                    <button 
                                      className="text-crimson border-0 bg-transparent p-0"
                                      onClick={() => handleRemoveExercise(dIdx, eIdx)}
                                    >
                                      <i className="bi bi-x-circle"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-2 text-muted small border border-dashed rounded">
                            NO EXERCISE PROTOCOLS DEFINED
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="detail-card text-center py-5">
                  <i className="bi bi-calendar-x h1 text-muted d-block mb-3"></i>
                  <p className="text-muted">NO MISSION PARAMETERS DEFINED FOR THIS OPERATOR</p>
                  <button className="admin-btn-primary mt-3" onClick={handleAddRoutineDay}>
                    INITIALIZE WEEKLY ROUTINE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSuspendModal && (
        <div className="admin-modal-overlay">
          <div className="detail-card m-auto" style={{ maxWidth: '500px' }}>
            <h3>SUSPEND PERSONNEL</h3>
            <div className="form-group mb-4">
              <label>REASON FOR PROTOCOL SUSPENSION</label>
              <textarea 
                className="admin-textarea" 
                rows="3" 
                value={suspendReason}
                onChange={e => setSuspendReason(e.target.value)}
                placeholder="Detail the violation..."
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button className="admin-btn-primary flex-1" onClick={handleSuspendUser}>EXECUTE SUSPENSION</button>
              <button className="admin-btn-secondary" onClick={() => setShowSuspendModal(false)}>ABORT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
