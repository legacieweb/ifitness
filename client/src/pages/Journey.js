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
    'Intermediate': '💪',
    'Advanced': '🏆',
    'Elite': '👑'
  };

  return (
    <div className="journey-container">
      <div className="journey-header">
        <h1>Your Fitness Journey</h1>
      </div>

      <div className="level-card">
        <div className="level-info">
          <h3>
            Current Level
            <span className="level-badge">{journey.level}</span>
          </h3>
          <p className="level-desc">Keep going! You're making great progress towards your goals.</p>
          <div className="level-progress-wrapper">
            <div
              className="level-progress-fill"
              style={{ width: `${Math.min(journey.progress, 100)}%` }}
            >
              {Math.round(journey.progress)}% Complete
            </div>
          </div>
          <p className="mt-3 text-muted fw-bold">Total Workouts: {stats?.totalWorkouts || 0}</p>
        </div>
        <div className="level-emoji-wrapper">
          {levelEmojis[journey.level]}
        </div>
      </div>

      <div className="milestones-section">
        <h2>📍 Journey Milestones</h2>
        <div className="milestones-grid">
          {journey.milestones.map((milestone) => (
            <div key={milestone.id} className="milestone-card">
              <div className="milestone-header">
                <h5 className="milestone-title">{milestone.icon} {milestone.name}</h5>
                {milestone.current >= milestone.target && (
                  <span className="done-badge">✓ COMPLETED</span>
                )}
              </div>
              
              <div className="milestone-progress-bar">
                <div
                  className={`milestone-progress-fill bg-${getProgressColor(milestone.current, milestone.target)}`}
                  style={{ width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="milestone-stats">
                {Math.round(milestone.current)} / {milestone.target}
                {milestone.type === 'calories' && ' calories'}
                {milestone.type === 'duration' && ' minutes'}
                {!milestone.type && ' workouts'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="next-steps-section">
        <h2>What's Next?</h2>
        <div className="next-steps-grid">
          <Link to="/workouts/new" className="next-step-card">
            <div className="step-icon">📝</div>
            <h5>Log Workout</h5>
            <p>Start your next training session</p>
            <div className="btn-step">Begin Now</div>
          </Link>
          <Link to="/workouts" className="next-step-card">
            <div className="step-icon">📊</div>
            <h5>View History</h5>
            <p>Check your past workouts</p>
            <div className="btn-step">View All</div>
          </Link>
          <Link to="/profile" className="next-step-card">
            <div className="step-icon">⚙️</div>
            <h5>Update Profile</h5>
            <p>Adjust your fitness goals</p>
            <div className="btn-step">Edit Profile</div>
          </Link>
        </div>
      </div>

      {journey.level === 'Elite' && (
        <div className="elite-alert">
          <h4>🎉 Congratulations! You've Reached Elite Level!</h4>
          <p>You are a fitness champion! Keep pushing your limits and inspiring others!</p>
        </div>
      )}
    </div>
  );
}
