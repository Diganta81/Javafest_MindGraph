import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getPreferences: () => api.get('/users/preferences'),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
};

// Task services
export const taskService = {
  getTasks: (params = {}) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  markComplete: (id) => api.patch(`/tasks/${id}/complete`),
  searchTasks: (query) => api.get(`/tasks/search?q=${query}`),
};

// Event services
export const eventService = {
  getEvents: (params = {}) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getEventsByDateRange: (startDate, endDate) => 
    api.get(`/events/range?start=${startDate}&end=${endDate}`),
};

// Schedule services
export const scheduleService = {
  generateSchedule: (preferences = {}) => api.post('/schedule/generate', preferences),
  getScheduleConflicts: (taskId, startTime, endTime) => 
    api.get(`/schedule/conflicts?taskId=${taskId}&start=${startTime}&end=${endTime}`),
  getAvailableSlots: (duration, date) => 
    api.get(`/schedule/available?duration=${duration}&date=${date}`),
};

// Chatbot services
export const chatbotService = {
  sendMessage: (message) => api.post('/chatbot/message', { message }),
  healthCheck: () => api.get('/chatbot/health'),
};

// Analytics services
export const analyticsService = {
  getTaskStats: (period = 'week') => api.get(`/analytics/tasks?period=${period}`),
  getProductivityReport: (startDate, endDate) => 
    api.get(`/analytics/productivity?start=${startDate}&end=${endDate}`),
  getTimeSpentByCategory: (period = 'month') => 
    api.get(`/analytics/time-by-category?period=${period}`),
};

export default api;
