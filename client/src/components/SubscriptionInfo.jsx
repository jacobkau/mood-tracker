import { useState, useEffect } from 'react';
import { getSubscriptionStatus } from '../services/api';
import { toast } from 'react-toastify';

export default function SubscriptionInfo({ currentTheme }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await getSubscriptionStatus();
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const planColors = {
    free: 'bg-gray-500',
    pro: 'bg-blue-500',
    premium: 'bg-purple-500'
  };

  const daysLeft = subscription?.currentPeriodEnd 
    ? Math.ceil((new Date(subscription.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className={`${currentTheme.cardBg} rounded-lg p-6 border`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Current Plan</h3>
          <div className="flex items-center gap-2">
            <span className={`${planColors[subscription?.plan || 'free']} text-white px-3 py-1 rounded-full text-sm font-medium capitalize`}>
              {subscription?.plan || 'free'}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {subscription?.status}
            </span>
          </div>
        </div>
        {subscription?.plan !== 'premium' && (
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Upgrade
          </button>
        )}
      </div>

      {subscription?.currentPeriodEnd && subscription?.plan !== 'free' && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">
            {daysLeft > 0 ? `${daysLeft} days remaining` : 'Subscription expired'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.max(0, (daysLeft / 30) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-medium mb-2">Plan Features:</h4>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {subscription?.plan === 'free' ? '50 mood entries' : 'Unlimited mood entries'}
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {subscription?.plan === 'free' ? '100 character notes' : `${subscription?.plan === 'pro' ? '500' : '1000'} character notes`}
          </li>
          {(subscription?.plan === 'pro' || subscription?.plan === 'premium') && (
            <>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Data export
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Custom reminders
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Advanced analytics
              </li>
            </>
          )}
          {subscription?.plan === 'premium' && (
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Priority support
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
