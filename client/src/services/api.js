import axios from 'axios';

const baseURL =
  process.env.VITE_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://moodtracker-api.onrender.com/api"
    : "http://localhost:5000/api");
  withCredentials: true,
  timeout: 10000, // Add timeout
});

// Add request interceptor for debugging
API.interceptors.request.use((req) => {
  console.log('Making request to:', req.url);
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Improve response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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
export const getSubscriptionPlans = () => {
  // For development or if API fails, return mock data
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      data: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          description: 'Perfect for getting started with mood tracking',
          features: [
            'Basic mood tracking',
            '7-day history',
            'Standard charts',
            'Email support',
            'Basic analytics'
          ],
          popular: false,
          period: 'month'
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 4.99,
          period: 'month',
          description: 'For those who want deeper insights',
          features: [
            'Unlimited mood tracking',
            '90-day history',
            'Advanced analytics',
            'Custom reminders',
            'Data export',
            'Priority support',
            'Trend analysis'
          ],
          popular: true
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 49.99,
          period: 'year',
          description: 'Best value for committed users',
          features: [
            'Everything in Pro',
            '365-day history',
            'Trend predictions',
            'Personalized insights',
            'Therapist sharing',
            '24/7 support',
            'Custom reports',
            'Advanced patterns'
          ],
          popular: false
        }
      ]
    });
  }
  
  return API.get('/subscription/plans');
};
export const subscribeToPlan = (planId) => API.post('/subscription/subscribe', { planId });
export const getSubscriptionStatus = () => API.get('/subscription/status');
export const cancelSubscription = () => API.post('/subscription/cancel');

// Contact API
export const submitContactForm = (data) => API.post('/contact', data);

export default API;
