import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/api';
import './Calendar.css';

export default function Calendar() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await getWorkouts();
        setWorkouts(res.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };
    fetchWorkouts();
  }, [user?.id]);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const workoutsByDate = {};
  workouts.forEach((w) => {
    const dateStr = new Date(w.date).toDateString();
    if (!workoutsByDate[dateStr]) workoutsByDate[dateStr] = [];
    workoutsByDate[dateStr].push(w);
  });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const totalWorkouts = Object.values(workoutsByDate).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Workout Calendar</h1>
      </div>

      <div className="calendar-card">
        <div className="calendar-nav">
          <button className="btn-nav" onClick={prevMonth} aria-label="Previous Month">
            <i className="bi bi-chevron-left"></i>
          </button>
          <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button className="btn-nav" onClick={nextMonth} aria-label="Next Month">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div className="calendar-grid-wrapper">
          <table className="calendar-table">
            <thead>
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(Math.ceil((daysInMonth + firstDay) / 7)).fill(null).map((_, weekIdx) => (
                <tr key={weekIdx}>
                  {days.slice(weekIdx * 7, (weekIdx + 1) * 7).concat(Array(Math.max(0, 7 - (days.slice(weekIdx * 7, (weekIdx + 1) * 7).length))).fill(null)).map((day, dayIdx) => {
                    const dateObj = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) : null;
                    const dateStr = dateObj?.toDateString();
                    const dayWorkouts = dateStr ? (workoutsByDate[dateStr] || []) : [];

                    return (
                      <td 
                        key={dayIdx} 
                        className={`calendar-day ${day ? 'active-month' : ''} ${dayWorkouts.length > 0 ? 'has-workouts' : ''}`}
                      >
                        {day && (
                          <>
                            <span className="day-number">{day}</span>
                            {dayWorkouts.length > 0 && (
                              <>
                                <div className="workout-badges">
                                  {dayWorkouts.map((_, i) => <span key={i} className="workout-badge"></span>)}
                                </div>
                                <span className="workout-count">{dayWorkouts.length}</span>
                              </>
                            )}
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calendar-legend">
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color workout"></span>
              <span>Workout Completed</span>
            </div>
            <div className="legend-item">
              <span className="legend-color empty"></span>
              <span>Rest Day</span>
            </div>
          </div>
          <div className="total-stats">
            Total this month: <strong>{totalWorkouts}</strong> workouts
          </div>
        </div>
      </div>
    </div>
  );
}
