import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from '../context/ThemeContext';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { username, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      navigate("/", { replace: true });
      window.dispatchEvent(new Event('storage')); // Trigger storage event
    } catch (err) {
      console.error("Login failed:", err);
      const message = err.response?.data?.error || "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div
  className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex justify-center sm:items-center py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8`}
>
  <div
    className={`${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} p-6 sm:p-8 rounded-lg w-full max-w-md border`}
  >
        <div className="text-center">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Welcome Back
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>Sign in to your account</p>
        </div>
        
        {error && (
          <div className={`mt-6 p-3 rounded-md ${currentTheme.highlight}`}>
            <p className="text-center font-medium">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium ${currentTheme.labelText}`}>
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${currentTheme.inputBg} ${currentTheme.inputBorder} appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} sm:text-sm`}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.labelText}`}>
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${currentTheme.inputBg} ${currentTheme.inputBorder} appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} sm:text-sm`}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${currentTheme.btnPrimary} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className={`mt-6 text-center ${currentTheme.divider} pt-6 border-t`}>
          <p className={`text-sm ${currentTheme.bodyText}`}>
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className={`font-medium ${currentTheme.bodyAccent} hover:${currentTheme.navHover} transition-colors`}
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
