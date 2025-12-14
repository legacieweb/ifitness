import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-activity"></i> FitTracker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="bi bi-house"></i> Home
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <>
                {!user?.isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    
                    <li className="nav-item dropdown">
                      <span
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-dumbbell"></i> Training
                      </span>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/workouts">
                            <i className="bi bi-list-check"></i> My Workouts
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/workouts/new">
                            <i className="bi bi-plus-circle"></i> New Workout
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/templates">
                            <i className="bi bi-file-earmark"></i> Workout Templates
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item dropdown">
                      <span
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-graph-up"></i> Progress
                      </span>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/analytics">
                            <i className="bi bi-bar-chart"></i> Analytics
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/journey">
                            <i className="bi bi-rocket"></i> My Journey
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/achievements">
                            <i className="bi bi-trophy"></i> Achievements
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/calendar">
                            <i className="bi bi-calendar3"></i> Calendar
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item dropdown">
                      <span
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-heart"></i> Health
                      </span>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/goals">
                            <i className="bi bi-target"></i> Goals
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/nutrition">
                            <i className="bi bi-egg"></i> Nutrition
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            <i className="bi bi-person"></i> Profile
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}

                {user?.isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      <i className="bi bi-shield-check"></i> Admin Dashboard
                    </Link>
                  </li>
                )}

                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle"></i> {user?.name}
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person"></i> My Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <i className="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
