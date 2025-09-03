import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getSubscriptionPlans, subscribeToPlan,extractPlansFromResponse  } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/useTheme';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const navigate = useNavigate();
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme]; 

useEffect(() => {
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getSubscriptionPlans();
      
      // Use the helper function to extract plans from different response formats
      const plansData = extractPlansFromResponse(response);
      
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      
      // Show fallback plans if API is unavailable
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Showing demo plans.');
        setPlans([
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
          ]);
        } else {
          toast.error('Failed to load pricing plans');
        setPlans([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId, planName) => {
    try {
      setSubscribing(planId);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/register', { 
          state: { 
            message: `Please create an account to subscribe to the ${planName} plan`,
            plan: planId
          } 
        });
        return;
      }

      await subscribeToPlan(planId);
      toast.success(`Successfully subscribed to ${planName} plan!`);
      navigate('/dashboard', { 
        state: { message: `Welcome to your ${planName} plan!` } 
      });
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error(error.response?.data?.error || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className={`${currentTheme.footerBg} ${currentTheme.footerText} min-h-screen bg-gray-50 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.footerBg} ${currentTheme.footerText} min-h-screen bg-gray-50`}>
      <PageHeader 
        title="Pricing" 
        description="Choose the plan that works best for your emotional wellness journey"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-indigo-600 relative transform hover:scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                {plan.period && <span className="text-gray-600 text-lg">/{plan.period}</span>}
              </div>
              <p className="mt-2 text-gray-600 text-center text-sm">{plan.description}</p>
              
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button
                  onClick={() => handleSubscribe(plan.id, plan.name)}
                  disabled={subscribing === plan.id}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                    plan.popular 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg' 
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {subscribing === plan.id ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </span>
                  ) : plan.id === 'free' ? (
                    'Get Started'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, all paid plans include a 14-day free trial. No credit card required to start with the Free plan.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and Apple Pay. Enterprise plans also support bank transfers.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I get a refund?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              to="/contact"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Have more questions? Contact our support team →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
