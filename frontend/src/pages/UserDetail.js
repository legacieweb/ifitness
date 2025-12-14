import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { suspendUser, unsuspendUser } from '../services/api';
import './UserDetail.css';

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'https://ifitness.onrender.com'}/api/admin/users/${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        showAlert('Failed to load user details', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      showAlert('Error loading user', 'error');
    } finally {
      setLoading(false);
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
      
      // Refetch user data to get the latest state from server
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
      
      // Refetch user data to get the latest state from server
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
        `${process.env.REACT_APP_API_URL || 'https://ifitness.onrender.com'}/api/admin/users/${userId}`,
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

  if (loading) {
    return (
      <div className="user-detail-wrapper">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading user details...</p>
        </div>
      </div>
    );
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

  return (
    <div className="user-detail-wrapper">
      <div className="user-detail-header">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <i className="bi bi-chevron-left"></i> Back to Users
        </button>
      </div>

      <div className="user-detail-container">
        <div className="user-card-main">
          <div className="user-header-info">
            <div className="user-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="user-basic-info">
              <h1>{user.name}</h1>
              <p className="user-email">{user.email}</p>
              <div className="status-container">
                {user.suspended ? (
                  <span className="status-badge suspended">
                    <i className="bi bi-lock-fill"></i> Suspended
                  </span>
                ) : (
                  <span className="status-badge active">
                    <i className="bi bi-check-circle-fill"></i> Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="user-stats-grid">
            <div className="stat-item">
              <span className="stat-label">Join Date</span>
              <span className="stat-value">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Age</span>
              <span className="stat-value">{user.age || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Weight</span>
              <span className="stat-value">{user.weight ? `${user.weight} kg` : 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Height</span>
              <span className="stat-value">{user.height ? `${user.height} cm` : 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Fitness Goal</span>
              <span className="stat-value goal-badge">{user.goal || 'Not set'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Workouts</span>
              <span className="stat-value">0</span>
            </div>
          </div>

          {user.suspended && (
            <div className="suspension-info-box">
              <div className="suspension-header">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <h3>Suspension Details</h3>
              </div>
              <div className="suspension-details">
                <div className="detail-row">
                  <span className="label">Reason:</span>
                  <span className="value">{user.suspendedReason}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Suspended At:</span>
                  <span className="value">
                    {new Date(user.suspendedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="user-actions-sidebar">
          <div className="actions-card">
            <h3>User Actions</h3>
            
            <div className="action-group">
              <h4>Account Status</h4>
              {user.suspended ? (
                <button
                  className="btn-action btn-success"
                  onClick={handleUnsuspendUser}
                >
                  <i className="bi bi-unlock"></i>
                  Unsuspend User
                </button>
              ) : (
                <button
                  className="btn-action btn-warning"
                  onClick={() => setShowSuspendModal(true)}
                >
                  <i className="bi bi-exclamation-circle"></i>
                  Suspend User
                </button>
              )}
            </div>

            <div className="action-group">
              <h4>Danger Zone</h4>
              <button
                className="btn-action btn-danger"
                onClick={handleDeleteUser}
              >
                <i className="bi bi-trash"></i>
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuspendModal && (
        <div className="modal-overlay" onClick={() => setShowSuspendModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Suspend User</h2>
              <button className="modal-close" onClick={() => setShowSuspendModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Provide a reason for suspending {user.name}'s account:</p>
              <textarea
                placeholder="Enter suspension reason..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="suspend-textarea"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSuspendModal(false)}>
                Cancel
              </button>
              <button className="btn-warning" onClick={handleSuspendUser}>
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`alert-message ${messageType}`}>
          <i className={`bi ${messageType === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
          {message}
        </div>
      )}
    </div>
  );
}
