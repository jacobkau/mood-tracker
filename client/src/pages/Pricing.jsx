import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getSubscriptionPlans, subscribeToPlan } from '../services/api';
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
   // In pricing.jsx, update the plan mapping when fetching
const fetchPlans = async () => {
  try {
    setLoading(true);
    const response = await getSubscriptionPlans();
    
    console.log('Raw response:', response);
    
    let plansArray = [];
    if (response.data && Array.isArray(response.data)) {
      plansArray = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      plansArray = response.data.data;
    } else {
      plansArray = [];
    }
    
    // Ensure each plan has a proper ID for subscription
    const processedPlans = plansArray.map(plan => ({
      ...plan,
      subscriptionId: plan.id || plan.name?.toLowerCase() || 'free'
    }));
    
    console.log('Processed plans:', processedPlans);
    setPlans(processedPlans);
    
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    toast.error('Failed to load pricing plans');
  } finally {
    setLoading(false);
  }
};

    fetchPlans();
  }, []);

 const handleSubscribe = async (plan, planName) => {
  try {
    setSubscribing(plan.id || plan._id);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/register', { 
        state: { 
          message: `Please create an account to subscribe to the ${planName} plan`,
          plan: plan.id || plan._id
        } 
      });
      return;
    }

    // Send the plan ID (should be 'free', 'pro', or 'premium')
    const planIdToSend = plan.id || plan.name?.toLowerCase();
    console.log('Subscribing with plan ID:', planIdToSend);
    
    await subscribeToPlan(planIdToSend);
    toast.success(`Successfully subscribed to ${planName} plan!`);
    
    // Wait a moment before redirecting
    setTimeout(() => {
      navigate('/dashboard', { 
        state: { message: `Welcome to your ${planName} plan!` } 
      });
    }, 1500);
    
  } catch (error) {
    console.error('Subscription failed:', error);
    toast.error(error.response?.data?.error || 'Subscription failed. Please try again.');
  } finally {
    setSubscribing(null);
  }
};
  if (loading) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.bodyAccent} mx-auto`}></div>
          <p className={`mt-4 ${currentTheme.bodyText}`}>Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen`}>
      <PageHeader 
        title="Pricing" 
        description="Choose the plan that works best for your emotional wellness journey"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${currentTheme.bodyText} text-lg`}>No pricing plans available at the moment.</p>
            <p className={`${currentTheme.bodyAccent} mt-2`}>Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan._id || plan.id} 
                className={`${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} rounded-xl p-6 transition-all duration-300 hover:shadow-xl border relative ${
                  plan.isPopular || plan.popular ? 'ring-2 ring-opacity-50 transform hover:scale-105' : ''
                }`}
              >
                {(plan.isPopular || plan.popular) && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className={`${currentTheme.highlight} text-sm font-medium px-4 py-1 rounded-full shadow-md`}>
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className={`text-2xl font-bold ${currentTheme.bodySecondary} text-center mb-2`}>{plan.name}</h3>
                <div className="mt-4 text-center">
                  <span className={`text-4xl font-bold ${currentTheme.bodySecondary}`}>
                    ${plan.price?.monthly || plan.price || 0}
                  </span>
                  <span className={`${currentTheme.bodyAccent} text-lg`}>/month</span>
                </div>
                {plan.price?.yearly && (
                  <div className="text-center text-sm mt-1">
                    <span className={`${currentTheme.bodyAccent}`}>
                      or ${plan.price.yearly}/year (save {Math.round((1 - plan.price.yearly/(plan.price.monthly * 12)) * 100)}%)
                    </span>
                  </div>
                )}
                <p className={`mt-2 ${currentTheme.bodyAccent} text-center text-sm`}>{plan.description}</p>
                
                <ul className="mt-6 space-y-3">
                  {(plan.features || []).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className={`h-5 w-5 ${currentTheme.bodyAccent} mr-2 mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`${currentTheme.bodyText} text-sm`}>
                        {typeof feature === 'string' ? feature : feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <button
                    onClick={() => handleSubscribe(plan._id || plan.id, plan.name)}
                    disabled={subscribing === (plan._id || plan.id)}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                      plan.isPopular || plan.popular 
                        ? `${currentTheme.btnPrimary} shadow-md hover:shadow-lg` 
                        : `${currentTheme.btnSecondary}`
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {subscribing === (plan._id || plan.id) ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Processing...
                      </span>
                    ) : (plan.price?.monthly === 0 || plan.price === 0) ? (
                      'Get Started'
                    ) : (
                      `Subscribe to ${plan.name}`
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className={`mt-16 ${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} rounded-xl p-8 border`}>
          <h2 className={`text-2xl font-bold ${currentTheme.bodySecondary} text-center mb-6`}>Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-lg font-semibold ${currentTheme.bodySecondary} mb-3`}>Can I change plans anytime?</h3>
              <p className={currentTheme.bodyText}>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${currentTheme.bodySecondary} mb-3`}>Is there a free trial?</h3>
              <p className={currentTheme.bodyText}>Yes, all paid plans include a 14-day free trial. No credit card required to start with the Free plan.</p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${currentTheme.bodySecondary} mb-3`}>What payment methods do you accept?</h3>
              <p className={currentTheme.bodyText}>We accept all major credit cards, PayPal, and Apple Pay. Enterprise plans also support bank transfers.</p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${currentTheme.bodySecondary} mb-3`}>Can I get a refund?</h3>
              <p className={currentTheme.bodyText}>We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              to="/contact"
              className={`${currentTheme.bodyAccent} hover:${currentTheme.navHover} font-medium transition-colors`}
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
