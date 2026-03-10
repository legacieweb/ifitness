import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkouts, getUserRoutine, getUserGoals, getProfilePictureUrl } from '../services/api';
import BootcampAlert from '../components/BootcampAlert';
import Preloader from '../components/Preloader';
import './Dashboard.css';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;
    const fetchData = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      const userId = user?.id || user?._id;
      if (!userId) {
        timeoutId = setTimeout(fetchData, 100);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [workoutsRes, routineRes, goalsRes] = await Promise.all([
          getWorkouts(),
          getUserRoutine(userId).catch(() => ({ data: [] })),
          getUserGoals(userId).catch(() => ({ data: [] }))
        ]);
        setWorkouts(workoutsRes.data || []);
        setRoutine(routineRes.data || []);
        setGoals(goalsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to sync with command center');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => timeoutId && clearTimeout(timeoutId);
  }, [user?.id, user?._id, isAuthenticated, authLoading]);

  const calculateStreak = useCallback((workouts) => {
    if (workouts.length === 0) return 0;
    const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let lastDate = new Date(sorted[0].date);
    lastDate.setHours(0, 0, 0, 0);
    if (Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)) > 1) return 0;
    let streak = 1;
    let checkDate = new Date(lastDate);
    for (let i = 1; i < sorted.length; i++) {
      const workoutDate = new Date(sorted[i].date);
      workoutDate.setHours(0, 0, 0, 0);
      checkDate.setDate(checkDate.getDate() - 1);
      if (workoutDate.getTime() === checkDate.getTime()) streak++;
      else break;
    }
    return streak;
  }, []);

  const stats = {
    totalWorkouts: workouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
    totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    streak: calculateStreak(workouts)
  };

  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const weeklyProgress = (() => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = new Date();
    const progress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const dayCalories = workouts
        .filter(w => {
          const wd = new Date(w.date);
          return wd >= date && wd < nextDate;
        })
        .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      progress.push({ day: days[date.getDay()], calories: dayCalories });
    }
    return progress;
  })();

  const maxCalories = Math.max(...weeklyProgress.map(d => d.calories), 100);

  if (authLoading || loading) return <Preloader text="ESTABLISHING SECURE CONNECTION..." />;

  if (!isAuthenticated) {
    return (
      <div className="crimson-dashboard-locked">
        <div className="lock-box glass-morphism">
          <i className="bi bi-shield-fill-exclamation"></i>
          <h2>SYSTEM LOCKED</h2>
          <p>Authentication required for protocol access.</p>
          <Link to="/login" className="btn-crimson">LOGIN</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="crimson-dashboard">
      <div className="hero-mesh-background"></div>
      <div className="hero-noise-overlay"></div>
      <div className="footer-scanner-line"></div>
      <div className="crimson-container">
        <BootcampAlert />
        
        {/* Terminal Header */}
        <header className="crimson-terminal-header">
          <div className="node-info-group">
            <div className="node-frame">
              {user?.profilePicture ? (
                <img src={getProfilePictureUrl(user.profilePicture)} alt="User" />
              ) : (
                <i className="bi bi-person-fill"></i>
              )}
            </div>
            <div className="node-text">
              <span className="node-id">OPERATOR_{user?.id?.substring(0, 6)}</span>
              <h1 className="node-welcome">WELCOME, {user?.name?.split(' ')[0].toUpperCase()}</h1>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/workouts/new" className="btn-crimson">
              <i className="bi bi-plus-lg"></i> NEW SESSION
            </Link>
          </div>
        </header>

        {/* Vital Stats */}
        <div className="vitals-grid">
          {[
            { label: 'SESSIONS', value: stats.totalWorkouts, icon: 'bi-activity' },
            { label: 'CALORIES', value: stats.totalCalories, icon: 'bi-fire' },
            { label: 'MINUTES', value: stats.totalDuration, icon: 'bi-clock-history' },
            { label: 'STREAK', value: stats.streak, icon: 'bi-lightning-fill' }
          ].map((stat, i) => (
            <div key={i} className="vital-card crimson-card">
              <div className="vital-icon"><i className={`bi ${stat.icon}`}></i></div>
              <div className="vital-data">
                <span className="vital-label">{stat.label}</span>
                <span className="vital-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Module Grid */}
        <div className="modules-grid">
          <div className="module-main">
            <div className="crimson-card module-box">
              <div className="module-head">
                <h3><i className="bi bi-graph-up"></i> PERFORMANCE TIMELINE</h3>
                <Link to="/analytics" className="module-action">DETAILS</Link>
              </div>
              <div className="performance-chart">
                {weeklyProgress.map((day, i) => (
                  <div key={i} className="performance-col">
                    <div 
                      className="performance-bar" 
                      style={{ height: `${(day.calories / maxCalories) * 100}%` }}
                    >
                      <div className="bar-crimson-glow"></div>
                    </div>
                    <span className="performance-day">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="crimson-card module-box">
              <div className="module-head">
                <h3><i className="bi bi-list-task"></i> RECENT PROTOCOLS</h3>
                <Link to="/workouts" className="module-action">ARCHIVE</Link>
              </div>
              <div className="protocol-list">
                {recentWorkouts.map((w) => (
                  <div key={w._id} className="protocol-entry" onClick={() => navigate(`/workouts/${w._id}`)}>
                    <div className="entry-icon"><i className="bi bi-shield-shaded"></i></div>
                    <div className="entry-info">
                      <span className="entry-name">{w.name}</span>
                      <span className="entry-date">{new Date(w.date).toLocaleDateString()}</span>
                    </div>
                    <div className="entry-meta">
                      <span className="entry-duration">{w.duration}M</span>
                      <i className="bi bi-arrow-right-short"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="module-side">
            <div className="crimson-card module-box">
              <div className="module-head">
                <h3><i className="bi bi-bullseye"></i> OBJECTIVES</h3>
              </div>
              <div className="objectives-stack">
                {goals.filter(g => !g.completed).slice(0, 3).map((goal, i) => {
                  const progress = Math.min(100, Math.round((goal.current / goal.target) * 100) || 0);
                  return (
                    <div key={i} className="obj-node">
                      <div className="obj-info">
                        <span>{goal.title}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="obj-bar-base">
                        <div className="obj-bar-progress" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="crimson-card module-box">
              <div className="module-head">
                <h3><i className="bi bi-trophy"></i> COMMANDER BADGES</h3>
              </div>
              <div className="badges-flex">
                {stats.totalWorkouts >= 1 && <div className="crimson-badge-item"><i className="bi bi-star-fill"></i></div>}
                {stats.totalWorkouts >= 5 && <div className="crimson-badge-item"><i className="bi bi-shield-fill-check"></i></div>}
                {stats.totalWorkouts >= 10 && <div className="crimson-badge-item"><i className="bi bi-lightning-fill"></i></div>}
                {stats.totalWorkouts >= 20 && <div className="crimson-badge-item"><i className="bi bi-gem"></i></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
