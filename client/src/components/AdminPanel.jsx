import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from '../context/useTheme';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success("User role updated successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Failed to update user role", err);
      toast.error("Failed to update user role");
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        toast.success("User deleted successfully");
        fetchUsers(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete user", err);
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.bodyAccent} mx-auto`}></div>
          <p className={`mt-4 ${currentTheme.bodyText}`}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen py-8 px-4 md:px-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Admin Panel
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>Manage users and system settings</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} p-6 rounded-lg border`}>
              <h3 className={`text-lg font-semibold ${currentTheme.bodySecondary} mb-2`}>Total Users</h3>
              <p className={`text-3xl font-bold ${currentTheme.bodyAccent}`}>{stats.totalUsers}</p>
            </div>
            <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} p-6 rounded-lg border`}>
              <h3 className={`text-lg font-semibold ${currentTheme.bodySecondary} mb-2`}>Admins</h3>
              <p className={`text-3xl font-bold ${currentTheme.bodyAccent}`}>{stats.adminUsers}</p>
            </div>
            <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} p-6 rounded-lg border`}>
              <h3 className={`text-lg font-semibold ${currentTheme.bodySecondary} mb-2`}>Regular Users</h3>
              <p className={`text-3xl font-bold ${currentTheme.bodyAccent}`}>{stats.regularUsers}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} p-6 rounded-lg border`}>
          <h2 className={`text-xl font-semibold ${currentTheme.bodySecondary} mb-4`}>User Management</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${currentTheme.divider}`}>
                  <th className={`text-left py-2 ${currentTheme.labelText}`}>Username</th>
                  <th className={`text-left py-2 ${currentTheme.labelText}`}>Email</th>
                  <th className={`text-left py-2 ${currentTheme.labelText}`}>Role</th>
                  <th className={`text-left py-2 ${currentTheme.labelText}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={`border-b ${currentTheme.divider}`}>
                    <td className="py-3">{user.username}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className={`${currentTheme.inputBg} ${currentTheme.inputBorder} px-2 py-1 border rounded text-sm`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className={`${currentTheme.btnAccent} text-red-600 hover:text-red-700 px-3 py-1 rounded text-sm`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
