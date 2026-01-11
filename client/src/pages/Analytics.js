import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/api';

export default function Analytics() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWorkouts();
        setWorkouts(res.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getFiltered = () => {
    const now = new Date();
    return workouts.filter(w => {
      const d = new Date(w.date);
      if (timeRange === 'week') return (now - d) < 7 * 24 * 60 * 60 * 1000;
      if (timeRange === 'month') return (now - d) < 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  };

  const filtered = getFiltered();
  const totalCal = filtered.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalMin = filtered.reduce((sum, w) => sum + (w.duration || 0), 0);

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container-fluid container-md mt-4 mt-md-5 mb-5 px-3 px-md-0">
      <h1 className="mb-4 fs-4 fs-md-1">Analytics & Progress</h1>
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button
          className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTimeRange('month')}
        >
          Month
        </button>
        <button
          className={`btn btn-sm ${timeRange === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTimeRange('all')}
        >
          All Time
        </button>
      </div>
      <div className="row g-2 g-md-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title small mb-2">Workouts</h6>
              <h3 className="text-primary mb-0">{filtered.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title small mb-2">Duration</h6>
              <h3 className="text-success mb-0">{totalMin}m</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title small mb-2">Calories</h6>
              <h3 className="text-danger mb-0">{Math.round(totalCal)}</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title small mb-2">Avg/Workout</h6>
              <h3 className="text-warning mb-0">{filtered.length > 0 ? Math.round(totalCal / filtered.length) : 0}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
