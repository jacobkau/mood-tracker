import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Support API
export const contactSupport = (data) => API.post('/support/contact-support', data);
export const getMySupportRequests = () => API.get('/support/my-requests');

// Content API
export const getBlogPosts = (page = 1, limit = 6) => 
  API.get(`/content/blog-posts?page=${page}&limit=${limit}`);
export const getBlogPost = (id) => API.get(`/content/blog-posts/${id}`);
export const getGuides = () => API.get('/content/guides');
export const getGuide = (id) => API.get(`/content/guides/${id}`);
export const subscribeToNewsletter = (email) => 
  API.post('/content/newsletter', { email });

// Subscription API
export const getSubscriptionPlans = () => API.get('/subscription/plans');
export const subscribeToPlan = (planId) => 
  API.post('/subscription/subscribe', { planId });

// Add auth token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
