import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';
import { resetPassword, requestPasswordReset } from '../services/api';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
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
    const strengthColors = [
      currentTheme.strengthVeryWeak || 'bg-red-500',
      currentTheme.strengthWeak || 'bg-orange-500',
      currentTheme.strengthFair || 'bg-yellow-500',
      currentTheme.strengthGood || 'bg-blue-500',
      currentTheme.strengthStrong || 'bg-green-500'
    ];

    return (
      <div className="mt-2">
        <div className="flex space-x-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= strength ? strengthColors[strength - 1] : currentTheme.strengthEmpty || 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className={`text-xs ${
          strength === 0 ? currentTheme.strengthTextEmpty || 'text-gray-500' : 
          strength === 1 ? currentTheme.strengthTextVeryWeak || 'text-red-600' :
          strength === 2 ? currentTheme.strengthTextWeak || 'text-orange-600' :
          strength === 3 ? currentTheme.strengthTextFair || 'text-yellow-600' :
          strength === 4 ? currentTheme.strengthTextGood || 'text-blue-600' : 
          currentTheme.strengthTextStrong || 'text-green-600'
        }`}>
          {password ? strengthLabels[strength] : 'Enter a password'}
        </p>
      </div>
    );
  };

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} p-8 rounded-lg w-full max-w-md border`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            {step === 'request' && 'Reset Password'}
            {step === 'reset' && 'Create New Password'}
            {step === 'instructions-sent' && 'Check Your Email'}
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>
            {step === 'request' && "Enter your email address and we'll send you instructions to reset your password."}
            {step === 'reset' && 'Please enter your new password below.'}
            {step === 'instructions-sent' && "We've sent password reset instructions to your email address."}
          </p>
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="mt-6 space-y-6">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${currentTheme.labelText}`}>
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className={`h-5 w-5 ${currentTheme.inputIcon}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${currentTheme.inputBg} ${currentTheme.inputBorder} appearance-none block w-full pl-10 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} sm:text-sm`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`${currentTheme.btnPrimary} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-6">
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.labelText}`}>
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className={`h-5 w-5 ${currentTheme.inputIcon}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${currentTheme.inputBg} ${currentTheme.inputBorder} appearance-none block w-full pl-10 pr-10 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} sm:text-sm`}
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FiEyeOff className={`h-5 w-5 ${currentTheme.inputIcon}`} />
                  ) : (
                    <FiEye className={`h-5 w-5 ${currentTheme.inputIcon}`} />
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
                  <FiLock className={`h-5 w-5 ${currentTheme.inputIcon}`} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${currentTheme.inputBg} ${currentTheme.inputBorder} appearance-none block w-full pl-10 pr-10 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} sm:text-sm`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className={`h-5 w-5 ${currentTheme.inputIcon}`} />
                  ) : (
                    <FiEye className={`h-5 w-5 ${currentTheme.inputIcon}`} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`${currentTheme.btnPrimary} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'instructions-sent' && (
          <div className="mt-6 space-y-6">
            <div className={`p-3 rounded-md ${currentTheme.highlight}`}>
              <p className="text-center font-medium">
                If an account exists with {email}, you will receive password reset instructions shortly.
              </p>
            </div>
            
            <div className="text-center">
              <p className={`text-sm ${currentTheme.bodyText}`}>
                Didn't receive the email?{" "}
                <button
                  onClick={() => setStep('request')}
                  className={`font-medium ${currentTheme.bodyAccent} hover:${currentTheme.navHover} transition-colors`}
                >
                  Click here to try again
                </button>
              </p>
            </div>
          </div>
        )}

        <div className={`mt-6 text-center ${currentTheme.divider} pt-6 border-t`}>
          <Link 
            to="/login" 
            className={`inline-flex items-center text-sm font-medium ${currentTheme.bodyAccent} hover:${currentTheme.navHover} transition-colors`}
          >
            <FiArrowLeft className="mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
