import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
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
export const checkUserStatus = () => API.get('/auth/user/status');

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
export const inviteAllToBootcamp = (id) => API.post(`/bootcamps/${id}/invite-all`);

export const getOutdoorActivities = () => API.get('/outdoor-activities');
export const getActiveOutdoorActivity = () => API.get('/outdoor-activities/active');
export const createOutdoorActivity = (data) => API.post('/outdoor-activities', data);
export const updateOutdoorActivity = (id, data) => API.put(`/outdoor-activities/${id}`, data);
export const deleteOutdoorActivity = (id) => API.delete(`/outdoor-activities/${id}`);
export const acceptOutdoorActivity = (id) => API.post(`/outdoor-activities/${id}/accept`);
export const inviteAllToOutdoorActivity = (id) => API.post(`/outdoor-activities/${id}/invite-all`);

export const getUserProfile = (id) => API.get(`/users/profile/${id}`);
export const updateUserProfile = (id, userData) => API.put(`/users/profile/${id}`, userData);
export const uploadProfilePicture = (id, file, token) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  return API.post(`/users/profile/${id}/upload`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const getUserStats = (id) => API.get(`/users/stats/${id}`);
export const getUserDashboard = (id) => API.get(`/users/dashboard/${id}`);
export const getUserGallery = (id) => API.get(`/users/profile/${id}/gallery`);
export const getUserGoals = (id) => API.get(`/users/goals/${id}`);
export const createGoal = (id, goalData) => API.post(`/users/goals/${id}`, goalData);
export const updateGoal = (userId, goalId, data) => API.put(`/users/goals/${userId}/${goalId}`, data);
export const deleteGoal = (userId, goalId) => API.delete(`/users/goals/${userId}/${goalId}`);
export const getUserRoutine = (id) => API.get(`/users/profile/${id}/routine`);
export const updateRoutineDay = (id, dayIndex, completed) => API.put(`/users/profile/${id}/routine/${dayIndex}`, { completed });
export const getRecentWorkouts = (id) => API.get(`/users/dashboard/${id}`).then(res => res.data.recentWorkouts);

export const getAllUsers = (token) => API.get('/admin/users', {
  headers: { Authorization: `Bearer ${token}` }
});

export const getUserDetails = (id, token) => API.get(`/admin/users/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const getAdminStats = (token) => API.get('/admin/stats', {
  headers: { Authorization: `Bearer ${token}` }
});

export const getWeeklyActivity = (token, period = 'week') => API.get('/admin/weekly-activity', {
  params: { period },
  headers: { Authorization: `Bearer ${token}` }
});

export const getWorkoutDistribution = (token) => API.get('/admin/workout-distribution', {
  headers: { Authorization: `Bearer ${token}` }
});

export const getSystemHealth = (token) => API.get('/admin/system-health', {
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
