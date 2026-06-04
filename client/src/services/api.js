import axios from 'axios';

const baseURL =
  process.env.VITE_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://moodtracker-api.onrender.com/api"
    : "http://localhost:5000/api");

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 10000,
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
// Password reset API
export const requestPasswordReset = (email) =>
  API.post('/auth/request-reset', { email });

export const resetPassword = (token, newPassword) =>
  API.post('/auth/reset-password', { token, newPassword });

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
export const getGuides = () => API.get('/guides');
export const getGuide = (id) => API.get(`/guides/${id}`);
export const getTestimonials = () => API.get('/content/testimonials');
export const submitTestimonial = (data) => API.post('/content/testimonials', data);
export const subscribeToNewsletter = (email) => API.post('/content/newsletter', { email });

// Subscription API - COMPLETELY FIXED
export const getSubscriptionPlans = async () => {
  try {
    // Fetch from the public pricing endpoint
    const response = await API.get('/pricing');
    console.log('Pricing API response:', response.data);
    
    // Transform the data to use consistent IDs
    const plans = response.data.map(plan => ({
      _id: plan._id,
      id: plan.name.toLowerCase(), // Use name as ID (free, pro, premium)
      name: plan.name,
      price: plan.price?.monthly || 0,
      yearlyPrice: plan.price?.yearly || 0,
      description: plan.description,
      features: plan.features?.map(f => f.name) || [
        'Access to core features',
        'Email support',
        'Basic analytics'
      ],
      popular: plan.isPopular || false,
      period: 'month'
    }));
    
    return { data: plans };
  } catch (error) {
    console.error('Failed to fetch pricing plans from API:', error);
    
    // Fallback to subscription plans endpoint
    try {
      const subResponse = await API.get('/subscription/plans');
      if (subResponse.data && subResponse.data.success && subResponse.data.plans) {
        return { data: subResponse.data.plans };
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
    
    // Return mock data as last resort
    return {
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
    };
  }
};

// Subscribe to plan - SIMPLIFIED VERSION
export const subscribeToPlan = async (planId) => {
  console.log('Subscribing to plan:', planId);
  
  // Ensure we have a valid plan ID
  let finalPlanId = String(planId).toLowerCase().trim();
  
  // Map common variations to standard IDs
  if (finalPlanId === 'basic' || finalPlanId === 'free') finalPlanId = 'free';
  if (finalPlanId === 'professional' || finalPlanId === 'pro') finalPlanId = 'pro';
  if (finalPlanId === 'enterprise' || finalPlanId === 'premium') finalPlanId = 'premium';
  
  console.log('Final plan ID for subscription:', finalPlanId);
  
  // Send the subscription request
  return API.post('/subscription/subscribe', { planId: finalPlanId });
};
// Helper function to extract plans from API response - UPDATED
export const extractPlansFromResponse = (response) => {
  console.log('Extracting plans from response:', response);
  
  // Check if response.data is an array (direct from API)
  if (Array.isArray(response.data)) {
    console.log('Response is direct array');
    return response.data;
  }
  
  // Check if response.data has a data property that's an array
  if (response.data && Array.isArray(response.data.data)) {
    console.log('Response has data.data array');
    return response.data.data;
  }
  
  // Check if response itself is an array
  if (Array.isArray(response)) {
    console.log('Response itself is array');
    return response;
  }
  
  // If none of the above, return empty array
  console.warn('Unexpected response format:', response);
  return [];
};


export const getSubscriptionStatus = () => API.get('/subscription/status');
export const cancelSubscription = () => API.post('/subscription/cancel');

// Contact API
export const submitContactForm = (data) => API.post('/contact', data);

export default API;
