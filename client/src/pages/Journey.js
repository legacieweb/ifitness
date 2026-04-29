import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';
import './Journey.css';

export default function Journey() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [journey, setJourney] = useState({
    level: 'Beginner',
    progress: 0,
    milestones: [
      { id: 1, name: 'First Workout', target: 1, current: 0, icon: '🎯' },
      { id: 2, name: 'Week Warrior', target: 7, current: 0, icon: '⭐' },
      { id: 3, name: 'Consistency King', target: 30, current: 0, icon: '👑' },
      { id: 4, name: 'Calorie Burner', target: 5000, current: 0, icon: '🔥', type: 'calories' },
      { id: 5, name: 'Endurance Master', target: 500, current: 0, icon: '💪', type: 'duration' },
    ],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = user?.id || user?._id;
        if (userId) {
          const response = await getUserStats(userId);
          setStats(response.data);
          
          const milestonesUpdated = journey.milestones.map((m) => {
            if (m.type === 'calories') {
              return { ...m, current: Math.round(response.data.totalCalories) };
            } else if (m.type === 'duration') {
              return { ...m, current: response.data.totalDuration };
            } else {
              return { ...m, current: response.data.totalWorkouts };
            }
          });

          const level = response.data.totalWorkouts < 5 ? 'Beginner' :
                       response.data.totalWorkouts < 15 ? 'Intermediate' :
                       response.data.totalWorkouts < 30 ? 'Advanced' : 'Elite';

          const completedMilestones = milestonesUpdated.filter(m => m.current >= m.target).length;
          const progress = (completedMilestones / milestonesUpdated.length) * 100;

          setJourney({
            level,
            progress,
            milestones: milestonesUpdated,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, [user?.id, user?._id]);

  const getProgressColor = (current, target) => {
    const percent = (current / target) * 100;
    if (percent >= 100) return 'success';
    if (percent >= 75) return 'info';
    if (percent >= 50) return 'warning';
    return 'danger';
  };

  const levelEmojis = {
    'Beginner': '🌱',
    'Intermediate': '⚙️',
    'Advanced': '⚡',
    'Elite': '💎'
  };

  const levelTitles = {
    'Beginner': 'INITIATE',
    'Intermediate': 'OPERATOR',
    'Advanced': 'COMMANDER',
    'Elite': 'OVERLORD'
  };

  return (
    <div className="journey-container fusion-theme">
      <div className="journey-header">
        <h1>OPERATIONAL_EVOLUTION</h1>
      </div>

      <div className="level-card fusion-card">
        <div className="level-info">
          <h3>
            CURRENT_RANK
            <span className="level-badge">{levelTitles[journey.level]}</span>
          </h3>
          <p className="level-desc">System calibration in progress. Evolution of physical nodes proceeding at optimal parameters.</p>
          <div className="level-progress-wrapper">
            <div
              className="level-progress-fill"
              style={{ width: `${Math.min(journey.progress, 100)}%` }}
            >
              {Math.round(journey.progress)}% SYNCHRONIZED
            </div>
          </div>
          <p className="mt-3 text-muted fw-bold">TOTAL_SESSIONS: {stats?.totalWorkouts || 0}</p>
        </div>
        <div className="level-emoji-wrapper">
          {levelEmojis[journey.level]}
        </div>
      </div>

      <div className="milestones-section">
        <h2>📍 EVOLUTION_MARKERS</h2>
        <div className="milestones-grid">
          {journey.milestones.map((milestone) => (
            <div key={milestone.id} className="milestone-card fusion-card">
              <div className="milestone-header">
                <h5 className="milestone-title">{milestone.icon} {milestone.name.toUpperCase()}</h5>
                {milestone.current >= milestone.target && (
                  <span className="done-badge">✓ ARCHIVED</span>
                )}
              </div>
              
              <div className="milestone-progress-bar">
                <div
                  className={`milestone-progress-fill milestone-fusion-fill`}
                  style={{ width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="milestone-stats">
                {Math.round(milestone.current)} / {milestone.target}
                {milestone.type === 'calories' && ' KCAL'}
                {milestone.type === 'duration' && ' MIN'}
                {!milestone.type && ' SESSIONS'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="next-steps-section">
        <h2>NEXT_OBJECTIVES</h2>
        <div className="next-steps-grid">
          <Link to="/workouts/new" className="next-step-card fusion-card">
            <div className="step-icon">📝</div>
            <h5>INITIATE_SESSION</h5>
            <p>Begin next training protocol</p>
            <div className="btn-step">START_NOW</div>
          </Link>
          <Link to="/workouts" className="next-step-card fusion-card">
            <div className="step-icon">📊</div>
            <h5>SESSION_ARCHIVE</h5>
            <p>Review historical data</p>
            <div className="btn-step">OPEN_ARCHIVE</div>
          </Link>
          <Link to="/profile" className="next-step-card fusion-card">
            <div className="step-icon">⚙️</div>
            <h5>BIOMETRIC_SYNC</h5>
            <p>Adjust core parameters</p>
            <div className="btn-step">UPDATE_NODES</div>
          </Link>
        </div>
      </div>

      {journey.level === 'Elite' && (
        <div className="elite-alert fusion-card">
          <h4>🎉 MAXIMUM SYNCHRONIZATION ACHIEVED!</h4>
          <p>You have reached OVERLORD status. Physical and digital nodes are fully integrated.</p>
        </div>
      )}
    </div>
  );
}
