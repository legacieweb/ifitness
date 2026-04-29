import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts, BASE_URL } from '../services/api';
import Preloader from '../components/Preloader';
import './Achievements.css';

export default function Achievements() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWorkouts();
        setWorkouts(res.data);
        calculateBadges(res.data);
        fetchGallery();
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };
    fetchData();
  }, [user]);

  const fetchGallery = async () => {
    try {
      if (!user?.id) return;
      setLoadingGallery(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/users/profile/${user.id}/gallery`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const calculateBadges = (workoutList) => {
    const allBadges = [
      { id: 1, name: 'INITIATE', desc: 'Execute 1 fusion protocol', icon: 'bi-rocket-takeoff', unlocked: workoutList.length >= 1 },
      { id: 2, name: 'OPERATOR', desc: 'Execute 7 fusion protocols', icon: 'bi-lightning-charge', unlocked: workoutList.length >= 7 },
      { id: 3, name: 'COMMANDER', desc: 'Execute 30 fusion protocols', icon: 'bi-trophy', unlocked: workoutList.length >= 30 },
      { id: 4, name: 'METABOLIC_ELITE', desc: 'Expend 5000 energy units', icon: 'bi-fire', unlocked: workoutList.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) >= 5000 },
      { id: 5, name: 'UPTIME_LEGEND', desc: '500+ minutes operational', icon: 'bi-stopwatch', unlocked: workoutList.reduce((sum, w) => sum + (w.duration || 0), 0) >= 500 },
      { id: 6, name: 'STABILITY_PRO', desc: '10 consecutive cycles', icon: 'bi-calendar-check', unlocked: hasConsecutiveDays(workoutList, 10) },
      { id: 7, name: 'COMPONENT_MASTER', desc: 'Synchronize 100 components', icon: 'bi-hammer', unlocked: countTotalExercises(workoutList) >= 100 },
      { id: 8, name: 'OMNIPOTENCE', desc: 'Achieve total system synchronization', icon: 'bi-infinity', unlocked: false },
    ];
    
    // Check if all other badges are unlocked
    const othersUnlocked = allBadges.slice(0, 7).every(b => b.unlocked);
    allBadges[7].unlocked = othersUnlocked;
    
    setBadges(allBadges);
  };

  const hasConsecutiveDays = (workoutList, days) => {
    if (workoutList.length === 0) return false;
    const dates = [...new Set(workoutList.map(w => new Date(w.date).toDateString()))].sort((a, b) => new Date(a) - new Date(b));
    let consecutive = 1;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diff = (currDate - prevDate) / (24 * 60 * 60 * 1000);
      if (diff === 1) {
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
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>ACHIEVEMENT_NODES</h1>
        <p>Synchronize milestones and expand your collection of operational glory</p>
      </div>

      <div className="badges-grid">
        {badges.map((badge) => (
          <div key={badge.id} className={`badge-card fusion-card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="badge-icon-wrapper">
              <i className={`bi ${badge.icon}`}></i>
            </div>
            <h6>{badge.name}</h6>
            <p>{badge.desc}</p>
            <span className={`badge-status ${badge.unlocked ? 'unlocked' : 'locked'}`}>
              {badge.unlocked ? (
                <><i className="bi bi-patch-check-fill me-1"></i> SYNCHRONIZED</>
              ) : (
                <><i className="bi bi-lock-fill me-1"></i> ENCRYPTED</>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="achievements-gallery-section">
        <h2>OPERATIONAL_GALLERY</h2>
        {loadingGallery ? (
          <Preloader text="EXTRACTING VISUAL DATA..." />
        ) : gallery.length === 0 ? (
          <div className="gallery-empty fusion-card">
            <i className="bi bi-images"></i>
            <p>VISUAL ARCHIVE IS CURRENTLY EMPTY.</p>
            <small>Data nodes uploaded by command will appear here.</small>
          </div>
        ) : (
          <div className="gallery-grid">
            {gallery.map((img) => (
              <div key={img.id} className="gallery-card fusion-card">
                <div className="gallery-image-wrapper">
                  <img src={img.imageUrl} alt={img.label} />
                  <span className="gallery-tag">{img.tag.toUpperCase()}</span>
                </div>
                <div className="gallery-body">
                  <h5>{img.label?.toUpperCase() || 'MILESTONE_SYNCHRONIZATION'}</h5>
                  <div className="gallery-date">
                    <i className="bi bi-calendar3"></i>
                    {new Date(img.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
