import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Add auth token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getProfile = () => API.get('/auth/profile');

// Mood API
export const addMood = (moodData) => API.post('/moods', moodData);
export const getMoods = (params) => API.get('/moods', { params });
export const updateMood = (id, moodData) => API.put(`/moods/${id}`, moodData);
export const deleteMood = (id) => API.delete(`/moods/${id}`);

// Stats API
export const getStats = (period) => API.get('/stats', { params: { period } });
export const getMoodPatterns = () => API.get('/stats/patterns');

// Profile API
export const updateProfile = (profileData) => API.put('/profile', profileData);
export const changePassword = (passwordData) => API.put('/profile/password', passwordData);

// Support API
export const contactSupport = (data) => API.post('/support/contact', data);
export const getSupportTickets = () => API.get('/support/tickets');
export const getSupportTicket = (id) => API.get(`/support/tickets/${id}`);

// Content API
export const getBlogPosts = (page = 1, limit = 6, category = '') => 
  API.get(`/content/blog?page=${page}&limit=${limit}&category=${category}`);
export const getBlogPost = (id) => API.get(`/content/blog/${id}`);
export const getGuides = () => API.get('/content/guides');
export const getGuide = (id) => API.get(`/content/guides/${id}`);
export const getTestimonials = () => API.get('/content/testimonials');
export const submitTestimonial = (data) => API.post('/content/testimonials', data);
export const subscribeToNewsletter = (email) => API.post('/content/newsletter', { email });

// Subscription API
export const getSubscriptionPlans = () => API.get('/subscription/plans');
export const subscribeToPlan = (planId) => API.post('/subscription/subscribe', { planId });
export const getSubscriptionStatus = () => API.get('/subscription/status');
export const cancelSubscription = () => API.post('/subscription/cancel');

// Contact API
export const submitContactForm = (data) => API.post('/contact', data);

export default API;
