import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from '../context/useTheme';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(data);
        setFormData(prev => ({ 
          ...prev, 
          username: data.username || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: data.address || "",
        }));
      } catch (err) {
        console.error("Failed to fetch user", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to load profile data");
        }
      }
    };
    
    fetchUser();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
try {
  const token = localStorage.getItem("token");
  const payload = {
    username: formData.username,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    address: formData.address,
  };
  
  if (formData.newPassword) {
    payload.currentPassword = formData.currentPassword;
    payload.newPassword = formData.newPassword;
  }
  
  const response = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
    payload,
    { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    }
  );
  
  toast.success("Profile updated successfully");
  setFormData(prev => ({
    ...prev,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }));
  
  // Update user data with the response
  if (response.data.user) {
    setUser(response.data.user);
  }
  
} catch (err) {
  console.error("Update failed:", {
    status: err.response?.status,
    data: err.response?.data,
    message: err.message
  });
  
  const errorMessage = err.response?.data?.error || "Failed to update profile";
  toast.error(errorMessage);
  
  if (err.response?.status === 401) {
    setErrors(prev => ({
      ...prev,
      currentPassword: "Incorrect current password"
    }));
  } else if (err.response?.status === 400) {
    // Handle validation errors from backend
    if (err.response.data.error.includes("username")) {
      setErrors(prev => ({ ...prev, username: err.response.data.error }));
    }
  }
} finally {
  setIsLoading(false);
  }
};


  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Delete response:", response.data);
        localStorage.removeItem("token");
        toast.success(response.data.message || "Account deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Delete failed:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        toast.error(err.response?.data?.error || "Failed to delete account");
      }
    }
  };

  if (!user) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.bodyAccent} mx-auto`}></div>
          <p className={`mt-4 ${currentTheme.bodyText}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen py-8 px-4 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Your Profile
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>Manage your account settings</p>
        </div>
        
        <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} p-6 rounded-lg border`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${currentTheme.labelText}`}>Email</label>
              <p className={`mt-1 ${currentTheme.bodySecondary} font-medium`}>{user.email || "Not provided"}</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                Username
                {errors.username && (
                  <span className="text-red-500 text-xs ml-2">{errors.username}</span>
                )}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} ${
                  errors.username ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus}`}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus}`}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus}`}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus}`}
                rows="3"
                disabled={isLoading}
              />
            </div>
            
            <div className={`pt-6 border-t ${currentTheme.divider}`}>
              <h3 className={`text-lg font-medium ${currentTheme.bodySecondary} mb-4`}>Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                    Current Password
                    {errors.currentPassword && (
                      <span className="text-red-500 text-xs ml-2">{errors.currentPassword}</span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} ${
                      errors.currentPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Required to change password"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                    New Password
                    {errors.newPassword && (
                      <span className="text-red-500 text-xs ml-2">{errors.newPassword}</span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                    placeholder="At least 6 characters"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.labelText}`}>
                    Confirm New Password
                    {errors.confirmPassword && (
                      <span className="text-red-500 text-xs ml-2">{errors.confirmPassword}</span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`${currentTheme.inputBg} ${currentTheme.inputBorder} mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus} ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Must match new password"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`${currentTheme.btnPrimary} w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className={`${currentTheme.btnAccent} text-red-600 hover:text-red-700 px-4 py-2 rounded-md font-medium transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
