import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getSubscriptionPlans, subscribeToPlan, getSubscriptionStatus } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/useTheme';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const navigate = useNavigate();
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's current subscription if logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const subStatus = await getSubscriptionStatus();
            console.log('Current subscription:', subStatus.data);
            setCurrentSubscription(subStatus.data.subscription);
          } catch (error) {
            console.error('Failed to fetch subscription status:', error);
          }
        }
        
        // Fetch all pricing plans
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

    fetchData();
  }, []);

  const handleSubscribe = async (plan, planName) => {
    try {
      // Check if user is already subscribed to this plan
      if (currentSubscription && currentSubscription.plan === (plan.id || plan.name?.toLowerCase())) {
        toast.info(`You are already on the ${planName} plan!`);
        return;
      }
      
      // Use the plan's id or name as the subscription ID
      const planIdToSend = plan.id || plan.name?.toLowerCase();
      console.log('Subscribing with plan ID:', planIdToSend);
      console.log('Full plan object:', plan);
      
      setSubscribing(planIdToSend);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/register', { 
          state: { 
            message: `Please create an account to subscribe to the ${planName} plan`,
            plan: planIdToSend
          } 
        });
        return;
      }

      const result = await subscribeToPlan(planIdToSend);
      console.log('Subscription result:', result);
      
      // Update current subscription
      if (result.data && result.data.subscription) {
        setCurrentSubscription(result.data.subscription);
      }
      
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

  const getButtonText = (plan) => {
    const planId = plan.id || plan.name?.toLowerCase();
    
    // Check if user is logged in and has current subscription
    if (!currentSubscription) {
      return plan.price?.monthly === 0 || plan.price === 0 ? 'Get Started' : `Subscribe to ${plan.name}`;
    }
    
    // If user is already on this plan
    if (currentSubscription.plan === planId) {
      return 'Current Plan';
    }
    
    // If user is on free plan and trying to upgrade
    if (currentSubscription.plan === 'free' && planId !== 'free') {
      return `Upgrade to ${plan.name}`;
    }
    
    // If user is on paid plan and trying to downgrade
    if (currentSubscription.plan !== 'free' && planId === 'free') {
      return `Downgrade to Free`;
    }
    
    // If user is switching between paid plans
    if (currentSubscription.plan !== 'free' && planId !== 'free') {
      return `Switch to ${plan.name}`;
    }
    
    return plan.price?.monthly === 0 || plan.price === 0 ? 'Get Started' : `Subscribe to ${plan.name}`;
  };

  const isButtonDisabled = (plan) => {
    const planId = plan.id || plan.name?.toLowerCase();
    // Disable if user is already on this plan
    return currentSubscription && currentSubscription.plan === planId;
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
      
      {/* Show current plan badge */}
      {currentSubscription && currentSubscription.plan !== 'free' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-6">
          <div className={`${currentTheme.cardBg} rounded-lg p-4 border border-green-500 bg-green-50 dark:bg-green-900/20`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-green-600 dark:text-green-400 font-semibold">Current Plan:</span>
                <span className={`ml-2 font-bold ${currentTheme.bodySecondary} capitalize`}>{currentSubscription.plan}</span>
                {currentSubscription.currentPeriodEnd && (
                  <span className="text-sm text-gray-500 ml-2">
                    Valid until {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                )}
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">
                ✓ Active Subscription
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${currentTheme.bodyText} text-lg`}>No pricing plans available at the moment.</p>
            <p className={`${currentTheme.bodyAccent} mt-2`}>Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const planId = plan.id || plan.name?.toLowerCase();
              const isCurrentPlan = currentSubscription && currentSubscription.plan === planId;
              
              return (
                <div 
                  key={plan._id || plan.id} 
                  className={`${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} rounded-xl p-6 transition-all duration-300 hover:shadow-xl border relative ${
                    plan.isPopular || plan.popular ? 'ring-2 ring-opacity-50 transform hover:scale-105' : ''
                  } ${isCurrentPlan ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
                >
                  {(plan.isPopular || plan.popular) && !isCurrentPlan && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className={`${currentTheme.highlight} text-sm font-medium px-4 py-1 rounded-full shadow-md`}>
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-green-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                        Current Plan
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
                        or ${plan.price.yearly}/year 
                        {plan.price?.monthly > 0 && (
                          <span className="text-green-600 ml-1">
                            (save {Math.round((1 - plan.price.yearly/(plan.price.monthly * 12)) * 100)}%)
                          </span>
                        )}
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
                      onClick={() => handleSubscribe(plan, plan.name)}
                      disabled={isButtonDisabled(plan) || subscribing === planId}
                      className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                        isCurrentPlan
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : (plan.isPopular || plan.popular) 
                            ? `${currentTheme.btnPrimary} shadow-md hover:shadow-lg` 
                            : `${currentTheme.btnSecondary}`
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {subscribing === planId ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        getButtonText(plan)
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
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
