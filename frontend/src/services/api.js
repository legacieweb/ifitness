import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ifitness.onrender.com/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);

export const getWorkouts = () => API.get('/workouts');
export const getWorkout = (id) => API.get(`/workouts/${id}`);
export const createWorkout = (workoutData) => API.post('/workouts', workoutData);
export const updateWorkout = (id, workoutData) => API.put(`/workouts/${id}`, workoutData);
export const deleteWorkout = (id) => API.delete(`/workouts/${id}`);

export const getExercises = (filters) => API.get('/exercises', { params: filters });
export const getExercise = (id) => API.get(`/exercises/${id}`);
export const getWorkoutSuggestions = (goal) => API.get(`/exercises/suggestions/${goal}`);

export const getBootcamps = () => API.get('/bootcamps');
export const getUpcomingBootcamp = () => API.get('/bootcamps/upcoming');
export const getActiveBootcamp = () => API.get('/bootcamps/active');
export const getBootcampStatus = (id) => API.get(`/bootcamps/status/${id}`);
export const createBootcamp = (bootcampData) => API.post('/bootcamps', bootcampData);
export const updateBootcamp = (id, bootcampData) => API.put(`/bootcamps/${id}`, bootcampData);
export const deleteBootcamp = (id) => API.delete(`/bootcamps/${id}`);
export const acceptBootcamp = (id) => API.post(`/bootcamps/${id}/accept`);
export const declineBootcamp = (id) => API.post(`/bootcamps/${id}/decline`);

export const getUserProfile = (id) => API.get(`/users/profile/${id}`);
export const updateUserProfile = (id, userData) => API.put(`/users/profile/${id}`, userData);
export const getUserStats = (id) => API.get(`/users/stats/${id}`);

export const getAllUsers = (token) => API.get('/admin/users', {
  headers: { Authorization: `Bearer ${token}` }
});

export const getUserDetails = (id, token) => API.get(`/admin/users/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const getAdminStats = (token) => API.get('/admin/stats', {
  headers: { Authorization: `Bearer ${token}` }
});

export const deleteUser = (id, token) => API.delete(`/admin/users/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const suspendUser = (id, reason, token) => API.put(`/admin/users/${id}/suspend`, 
  { reason },
  { headers: { Authorization: `Bearer ${token}` } }
);

export const unsuspendUser = (id, token) => API.put(`/admin/users/${id}/unsuspend`,
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);

export default API;
