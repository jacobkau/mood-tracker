import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with mood tracking",
      features: [
        "Basic mood tracking",
        "7-day history",
        "Standard charts",
        "Email support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$4.99",
      period: "/month",
      description: "For those who want deeper insights",
      features: [
        "Unlimited mood tracking",
        "90-day history",
        "Advanced analytics",
        "Custom reminders",
        "Data export",
        "Priority support"
      ],
      cta: "Try Free for 14 Days",
      popular: true
    },
    {
      name: "Premium",
      price: "$49.99",
      period: "/year",
      description: "Best value for committed users",
      features: [
        "Everything in Pro",
        "365-day history",
        "Trend predictions",
        "Personalized insights",
        "Therapist sharing",
        "24/7 support"
      ],
      cta: "Get Premium",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Pricing" 
        description="Choose the plan that works best for your emotional wellness journey"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-md p-6 ${plan.popular ? 'ring-2 ring-indigo-600 relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 text-center">{plan.name}</h3>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-600">{plan.period}</span>}
              </div>
              <p className="mt-2 text-gray-600 text-center">{plan.description}</p>
              
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link
                  to="/register"
                  className={`w-full block text-center py-3 px-4 rounded-md font-medium ${
                    plan.popular 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                  } transition-colors duration-200`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Can I change plans anytime?</h3>
              <p className="mt-2 text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Is there a free trial?</h3>
              <p className="mt-2 text-gray-600">Yes, the Pro plan offers a 14-day free trial. No credit card required to start with the Free plan.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and for annual plans, we also accept bank transfers.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Can I get a refund?</h3>
              <p className="mt-2 text-gray-600">We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
