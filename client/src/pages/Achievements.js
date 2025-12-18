import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/api';

export default function Achievements() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await getWorkouts();
        setWorkouts(res.data);
        calculateBadges(res.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };
    fetchWorkouts();
  }, []);

  const calculateBadges = (workoutList) => {
    const allBadges = [
      { id: 1, name: 'Starter', desc: 'Complete 1 workout', icon: '🌱', unlocked: workoutList.length >= 1 },
      { id: 2, name: 'Week Warrior', desc: 'Complete 7 workouts', icon: '⭐', unlocked: workoutList.length >= 7 },
      { id: 3, name: 'Month Master', desc: 'Complete 30 workouts', icon: '👑', unlocked: workoutList.length >= 30 },
      { id: 4, name: 'Calorie Crusher', desc: 'Burn 5000 calories', icon: '🔥', unlocked: workoutList.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) >= 5000 },
      { id: 5, name: 'Endurance King', desc: '500+ minutes exercised', icon: '💪', unlocked: workoutList.reduce((sum, w) => sum + (w.duration || 0), 0) >= 500 },
      { id: 6, name: 'Consistency Pro', desc: '10 consecutive days', icon: '🎯', unlocked: hasConsecutiveDays(workoutList, 10) },
      { id: 7, name: 'Strength Builder', desc: 'Log 100 exercises', icon: '🏋️', unlocked: countTotalExercises(workoutList) >= 100 },
      { id: 8, name: 'Unstoppable', desc: 'Unlock all badges', icon: '🏆', unlocked: false },
    ];
    setBadges(allBadges);
  };

  const hasConsecutiveDays = (workoutList, days) => {
    if (workoutList.length === 0) return false;
    const dates = workoutList.map(w => new Date(w.date).toDateString()).sort();
    let consecutive = 1;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      if ((currDate - prevDate) === 24 * 60 * 60 * 1000) {
        consecutive++;
        if (consecutive >= days) return true;
      } else {
        consecutive = 1;
      }
    }
    return false;
  };

  const countTotalExercises = (workoutList) => {
    return workoutList.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
  };

  return (
    <div className="container-fluid container-md mt-4 mt-md-5 mb-5 px-3 px-md-0">
      <h1 className="mb-4 fs-4 fs-md-1">🏅 Achievements & Badges</h1>
      <div className="row g-3">
        {badges.map((badge) => (
          <div key={badge.id} className="col-6 col-md-6 col-lg-4">
            <div className={`card h-100 text-center ${badge.unlocked ? 'border-success' : 'border-secondary opacity-50'}`}>
              <div className="card-body p-2 p-md-3">
                <div style={{ fontSize: '50px', opacity: badge.unlocked ? 1 : 0.3 }}>
                  {badge.icon}
                </div>
                <h6 className="card-title mt-2 small">{badge.name}</h6>
                <p className="card-text text-muted small" style={{fontSize: '12px'}}>{badge.desc}</p>
                {badge.unlocked && (
                  <span className="badge bg-success small">Unlocked!</span>
                )}
                {!badge.unlocked && (
                  <span className="badge bg-secondary small">Locked</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
