import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createWorkout } from '../services/api';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Initialize from localStorage
  useEffect(() => {
    const savedWorkout = localStorage.getItem('activeWorkout');
    if (savedWorkout) {
      const parsed = JSON.parse(savedWorkout);
      setActiveWorkout(parsed);
      setTotalSeconds(parsed.duration * 60);
      
      const savedStartTime = localStorage.getItem('workoutStartTime');
      const savedIsRunning = localStorage.getItem('workoutIsRunning') === 'true';
      const savedPausedTime = parseInt(localStorage.getItem('workoutPausedTime') || '0');

      setStartTime(savedStartTime ? parseInt(savedStartTime) : null);
      setIsRunning(savedIsRunning);

      if (savedIsRunning && savedStartTime) {
        const elapsed = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
        const remaining = Math.max(0, (parsed.duration * 60) - elapsed);
        setTimeLeft(remaining);
      } else {
        setTimeLeft(savedPausedTime || (parsed.duration * 60));
      }
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsed);
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          setIsRunning(false);
          localStorage.setItem('workoutIsRunning', 'false');
          localStorage.setItem('workoutPausedTime', '0');
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, totalSeconds, timeLeft]);

  const startWorkout = useCallback((workout) => {
    const workoutWithStatus = { ...workout, status: 'active' };
    const now = Date.now();
    setActiveWorkout(workoutWithStatus);
    const durationSeconds = workout.duration * 60;
    setTotalSeconds(durationSeconds);
    setTimeLeft(durationSeconds);
    setIsRunning(false); // Do not start automatically
    setStartTime(null);
    
    localStorage.setItem('activeWorkout', JSON.stringify(workoutWithStatus));
    localStorage.setItem('workoutStartTime', '');
    localStorage.setItem('workoutIsRunning', 'false');
    localStorage.setItem('workoutPausedTime', durationSeconds.toString());
  }, []);

  const togglePause = useCallback(() => {
    if (isRunning) {
      // Pausing
      localStorage.setItem('workoutIsRunning', 'false');
      localStorage.setItem('workoutPausedTime', timeLeft.toString());
      setIsRunning(false);
    } else {
      // Resuming
      const newStartTime = Date.now() - (totalSeconds - timeLeft) * 1000;
      setStartTime(newStartTime);
      localStorage.setItem('workoutStartTime', newStartTime.toString());
      localStorage.setItem('workoutIsRunning', 'true');
      setIsRunning(true);
    }
  }, [isRunning, timeLeft, totalSeconds]);

  const cancelWorkout = useCallback(() => {
    setActiveWorkout(null);
    setTimeLeft(0);
    setIsRunning(false);
    setStartTime(null);
    localStorage.removeItem('activeWorkout');
    localStorage.removeItem('workoutStartTime');
    localStorage.removeItem('workoutIsRunning');
    localStorage.removeItem('workoutPausedTime');
  }, []);

  const completeWorkout = useCallback(async () => {
    if (!activeWorkout) return;
    try {
      await createWorkout({
        name: activeWorkout.name,
        description: activeWorkout.description || '',
        duration: activeWorkout.duration,
        caloriesBurned: Math.round(activeWorkout.duration * 5),
        date: new Date(),
      });
      cancelWorkout();
      return true;
    } catch (err) {
      console.error('Failed to save workout:', err);
      return false;
    }
  }, [activeWorkout, cancelWorkout]);

  const value = {
    activeWorkout,
    timeLeft,
    isRunning,
    totalSeconds,
    startWorkout,
    togglePause,
    cancelWorkout,
    completeWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
