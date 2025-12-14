import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';

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
        if (user?.id) {
          const response = await getUserStats(user.id);
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
  }, [user]);

  const getProgressColor = (current, target) => {
    const percent = (current / target) * 100;
    if (percent >= 100) return 'success';
    if (percent >= 75) return 'info';
    if (percent >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">🚀 Your Fitness Journey</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3>Current Level: <span className="badge bg-primary">{journey.level}</span></h3>
              <p className="text-muted">Keep going! You're doing amazing!</p>
              <div className="progress" style={{ height: '30px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${Math.min(journey.progress, 100)}%` }}
                >
                  {Math.round(journey.progress)}% Complete
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div style={{ fontSize: '60px' }}>
                {journey.level === 'Beginner' && '🌱'}
                {journey.level === 'Intermediate' && '💪'}
                {journey.level === 'Advanced' && '🏆'}
                {journey.level === 'Elite' && '👑'}
              </div>
              <p className="mt-2">Total Workouts: <strong>{stats?.totalWorkouts || 0}</strong></p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-4">📍 Milestones</h3>
      <div className="row">
        {journey.milestones.map((milestone) => (
          <div key={milestone.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title">{milestone.icon} {milestone.name}</h5>
                  {milestone.current >= milestone.target && (
                    <span className="badge bg-success">✓ Done</span>
                  )}
                </div>
                
                <div className="progress mb-2">
                  <div
                    className={`progress-bar bg-${getProgressColor(milestone.current, milestone.target)}`}
                    style={{ width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="text-center">
                  <span className="text-muted">
                    {Math.round(milestone.current)} / {milestone.target} 
                    {milestone.type === 'calories' && ' 🔥 cal'}
                    {milestone.type === 'duration' && ' ⏱️ min'}
                    {!milestone.type && ' 💪 workouts'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="mb-3">What's Next?</h3>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: '40px' }}>📝</div>
                <h5 className="card-title mt-2">Log Workout</h5>
                <p className="card-text">Start your next training session</p>
                <Link to="/workouts/new" className="btn btn-primary btn-sm">
                  Begin Now
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: '40px' }}>📊</div>
                <h5 className="card-title mt-2">View History</h5>
                <p className="card-text">Check your past workouts</p>
                <Link to="/workouts" className="btn btn-primary btn-sm">
                  View
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: '40px' }}>⚙️</div>
                <h5 className="card-title mt-2">Update Profile</h5>
                <p className="card-text">Adjust your fitness goals</p>
                <Link to="/profile" className="btn btn-primary btn-sm">
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {journey.level === 'Elite' && (
        <div className="alert alert-warning mt-4">
          <h4>🎉 Congratulations! You've Reached Elite Level!</h4>
          <p>You are a fitness champion! Keep pushing your limits and inspiring others!</p>
        </div>
      )}
    </div>
  );
}
