import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
          username: data.username || "" 
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
      };
      
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      
      await axios.put(
        "http://localhost:5000/api/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Profile updated successfully");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      
      // Refresh user data
      const { data } = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      
    } catch (err) {
      console.error("Update failed:", err);
      const errorMessage = err.response?.data?.error || "Failed to update profile";
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        setErrors(prev => ({
          ...prev,
          currentPassword: "Incorrect current password"
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        localStorage.removeItem("token");
        toast.success("Account deleted successfully");
        navigate("/login");
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete account");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user.email || "Not provided"}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                  {errors.username && (
                    <span className="text-red-500 text-xs ml-2">{errors.username}</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.username ? "border-red-500" : ""
                  }`}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                      {errors.currentPassword && (
                        <span className="text-red-500 text-xs ml-2">{errors.currentPassword}</span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className={`mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.currentPassword ? "border-red-500" : ""
                      }`}
                      placeholder="Required to change password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                      {errors.newPassword && (
                        <span className="text-red-500 text-xs ml-2">{errors.newPassword}</span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className={`mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.newPassword ? "border-red-500" : ""
                      }`}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                      {errors.confirmPassword && (
                        <span className="text-red-500 text-xs ml-2">{errors.confirmPassword}</span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      placeholder="Must match new password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </button>
                
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete Account
                </button>
              </div>
            </form>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
}
