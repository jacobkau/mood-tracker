import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';
import { resetPassword, requestPasswordReset } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/useTheme';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(token ? 'reset' : 'request');
  const navigate = useNavigate();
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      await requestPasswordReset(email);
      toast.success('Password reset instructions sent to your email');
      setStep('instructions-sent');
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error(error.response?.data?.error || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = (pwd) => {
      if (pwd.length === 0) return 0;
      if (pwd.length < 6) return 1;
      
      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (/[A-Z]/.test(pwd)) strength++;
      if (/[0-9]/.test(pwd)) strength++;
      if (/[^A-Za-z0-9]/.test(pwd)) strength++;
      
      return strength;
    };

    const strength = getStrength(password);
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return (
      <div className="mt-2">
        <div className="flex space-x-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= strength ? strengthColors[strength - 1] : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className={`text-xs ${
          strength === 0 ? 'text-gray-500' : 
          strength === 1 ? 'text-red-600' :
          strength === 2 ? 'text-orange-600' :
          strength === 3 ? 'text-yellow-600' :
          strength === 4 ? 'text-blue-600' : 'text-green-600'
        }`}>
          {password ? strengthLabels[strength] : 'Enter a password'}
        </p>
      </div>
    );
  };

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-2">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <span className="text-indigo-600 font-bold text-lg">😊</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Witty MoodTracker</span>
          </Link>
          
          {step === 'request' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
              <p className="mt-2 text-gray-600">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </>
          )}

          {step === 'reset' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Create New Password</h2>
              <p className="mt-2 text-gray-600">
                Please enter your new password below.
              </p>
            </>
          )}

          {step === 'instructions-sent' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
              <p className="mt-2 text-gray-600">
                We've sent password reset instructions to your email address.
              </p>
            </>
          )}
        </div>

        <div className={`rounded-lg shadow-md p-8 ${currentTheme.cardBg}`}>
          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${currentTheme.labelText}`}>
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 block w-full rounded-md focus:outline-none ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.inputFocus}`}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.btnPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.labelText}`}>
                  New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 block w-full rounded-md focus:outline-none ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.inputFocus}`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <PasswordStrengthIndicator password={password} />
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${currentTheme.labelText}`}>
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 block w-full rounded-md focus:outline-none ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.inputFocus}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.btnPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {step === 'instructions-sent' && (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-700">
                  If an account exists with {email}, you will receive password reset instructions shortly.
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Didn't receive the email?</p>
                <button
                  onClick={() => setStep('request')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Click here to try again
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Back to login
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link to="/contact" className="font-medium text-indigo-600 hover:text-indigo-800">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
