import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Collapse } from 'bootstrap';
import './Navigation.css';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const navbarCollapseRef = useRef(null);
  const [expandedDropdowns, setExpandedDropdowns] = useState({});

  const closeMenu = () => {
    if (navbarCollapseRef.current) {
      const collapse = new Collapse(navbarCollapseRef.current, { toggle: false });
      collapse.hide();
    }
    setExpandedDropdowns({});
  };

  const toggleDropdown = (dropdownName) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const handleLogoutAndClose = () => {
    closeMenu();
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-clean">
      <div className="container-fluid">
        <Link className="navbar-brand navbar-brand-clean" to="/">
          <i className="bi bi-activity"></i>
          <span className="brand-text">ifitness</span>
        </Link>
        <button
          className="navbar-toggler navbar-toggler-clean"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav" ref={navbarCollapseRef}>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeMenu}>
                  <i className="bi bi-house"></i> Home
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <>
                {!user?.isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard" onClick={closeMenu}>
                        Dashboard
                      </Link>
                    </li>
                    
                    <li className="nav-item dropdown-custom">
                      <button
                        className="nav-link dropdown-toggle-custom"
                        onClick={() => toggleDropdown('training')}
                      >
                        <i className="bi bi-dumbbell"></i> Training
                        <i className={`bi bi-chevron-down chevron-icon ${expandedDropdowns.training ? 'expanded' : ''}`}></i>
                      </button>
                      {expandedDropdowns.training && (
                        <ul className="dropdown-menu-custom">
                          <li>
                            <Link className="dropdown-item-custom" to="/workouts" onClick={closeMenu}>
                              <i className="bi bi-list-check"></i> My Workouts
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item-custom" to="/workouts/new" onClick={closeMenu}>
                              <i className="bi bi-plus-circle"></i> New Workout
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item-custom" to="/templates" onClick={closeMenu}>
                              <i className="bi bi-file-earmark"></i> Workout Templates
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>

                    <li className="nav-item dropdown-custom">
                      <button
                        className="nav-link dropdown-toggle-custom"
                        onClick={() => toggleDropdown('progress')}
                      >
                        <i className="bi bi-graph-up"></i> Progress
                        <i className={`bi bi-chevron-down chevron-icon ${expandedDropdowns.progress ? 'expanded' : ''}`}></i>
                      </button>
                      {expandedDropdowns.progress && (
                        <ul className="dropdown-menu-custom">
                          <li>
                            <Link className="dropdown-item-custom" to="/analytics" onClick={closeMenu}>
                              <i className="bi bi-bar-chart"></i> Analytics
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item-custom" to="/journey" onClick={closeMenu}>
                              <i className="bi bi-rocket"></i> My Journey
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item-custom" to="/achievements" onClick={closeMenu}>
                              <i className="bi bi-trophy"></i> Achievements
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item-custom" to="/calendar" onClick={closeMenu}>
                              <i className="bi bi-calendar3"></i> Calendar
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>

                    <li className="nav-item dropdown-custom">
                      <button
                        className="nav-link dropdown-toggle-custom"
                        onClick={() => toggleDropdown('health')}
                      >
                        <i className="bi bi-heart"></i> Health
                        <i className={`bi bi-chevron-down chevron-icon ${expandedDropdowns.health ? 'expanded' : ''}`}></i>
                      </button>
                      {expandedDropdowns.health && (
                        <ul className="dropdown-menu-custom">
                          <li>
                            <Link className="dropdown-item-custom" to="/goals" onClick={closeMenu}>
                              <i className="bi bi-target"></i> Goals
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item-custom" to="/nutrition" onClick={closeMenu}>
                              <i className="bi bi-egg"></i> Nutrition
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item-custom" to="/profile" onClick={closeMenu}>
                              <i className="bi bi-person"></i> Profile
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </>
                )}

                {user?.isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin" onClick={closeMenu}>
                      <i className="bi bi-shield-check"></i> Admin Dashboard
                    </Link>
                  </li>
                )}

                <li className="nav-item dropdown-custom dropdown-user">
                  <button
                    className="nav-link dropdown-toggle-custom"
                    onClick={() => toggleDropdown('user')}
                  >
                    <i className="bi bi-person-circle"></i> {user?.name}
                    <i className={`bi bi-chevron-down chevron-icon ${expandedDropdowns.user ? 'expanded' : ''}`}></i>
                  </button>
                  {expandedDropdowns.user && (
                    <ul className="dropdown-menu-custom">
                      <li>
                        <Link className="dropdown-item-custom" to="/profile" onClick={closeMenu}>
                          <i className="bi bi-person"></i> My Profile
                        </Link>
                      </li>
                      <li className="dropdown-divider-custom"></li>
                      <li>
                        <button
                          className="dropdown-item-custom logout-btn"
                          onClick={handleLogoutAndClose}
                        >
                          <i className="bi bi-box-arrow-right"></i> Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={closeMenu}>
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
