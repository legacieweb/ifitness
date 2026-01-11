import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/api';
import TopNewsletterFooter from '../components/TopNewsletterFooter';

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
  }, []);

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

  return (
    <div className="container-fluid container-md mt-4 mt-md-5 mb-5 px-3 px-md-0">
      <h1 className="mb-4 fs-4 fs-md-1">Workout Calendar</h1>

      <div className="card">
        <div className="card-body p-2 p-md-3">
          <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
            <button className="btn btn-sm btn-outline-primary" onClick={prevMonth}>← Prev</button>
            <h5 className="mb-0 small">{currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={nextMonth}>Next →</button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center small mb-0">
              <thead>
                <tr>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <th key={day} className="bg-light p-1" style={{fontSize: '12px'}}>{day.slice(0, 1)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(Math.ceil((daysInMonth + firstDay) / 7)).fill(null).map((_, weekIdx) => (
                  <tr key={weekIdx} style={{ height: '70px' }}>
                    {days.slice(weekIdx * 7, (weekIdx + 1) * 7).concat(Array(7 - ((daysInMonth + firstDay) % 7 || 7)).fill(null)).slice(0, 7).map((day, dayIdx) => {
                      const dateObj = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) : null;
                      const dateStr = dateObj?.toDateString();
                      const dayWorkouts = dateStr ? (workoutsByDate[dateStr] || []) : [];

                      return (
                        <td key={dayIdx} className={day ? (dayWorkouts.length > 0 ? 'bg-success bg-opacity-10 border-success' : 'bg-light') : ''} style={{padding: '4px', fontSize: '12px'}}>
                          {day && (
                            <div>
                              <strong className="small">{day}</strong>
                              {dayWorkouts.length > 0 && (
                                <div className="mt-1">
                                  <span className="badge bg-success" style={{fontSize: '10px'}}>{dayWorkouts.length}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 small">
            <h6>Legend</h6>
            <p className="mb-1"><span className="badge bg-success">Workout Day</span> - Days with completed workouts</p>
            <p className="mb-0">Total: <strong>{Object.values(workoutsByDate).reduce((sum, arr) => sum + arr.length, 0)}</strong> workouts</p>
          </div>
        </div>
      </div>
      <TopNewsletterFooter />
    </div>
  );
}
