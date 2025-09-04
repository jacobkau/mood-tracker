import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from '../context/useTheme';
import { 
  FiUsers, 
  FiStar, 
  FiFileText, 
  FiMail, 
  FiMessageSquare, 
  FiSettings,
  FiBarChart2,
  FiGrid,
  FiEye,
  FiEyeOff,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiSend,
  FiDownload
} from "react-icons/fi";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [pages, setPages] = useState([]);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewResponse, setReviewResponse] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'reviews') fetchReviews();
    if (activeTab === 'contacts') fetchContacts();
    if (activeTab === 'pages') fetchPages();
    if (activeTab === 'emails') fetchEmails();
  }, [activeTab]);

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
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      toast.error("Failed to load reviews");
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/contacts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
      toast.error("Failed to load contacts");
    }
  };

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPages(data);
    } catch (err) {
      console.error("Failed to fetch pages", err);
      toast.error("Failed to load pages");
    }
  };

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/emails`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmails(data);
    } catch (err) {
      console.error("Failed to fetch emails", err);
      toast.error("Failed to load emails");
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
      fetchUsers();
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
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
        toast.error("Failed to delete user");
      }
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews/${reviewId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Review ${status} successfully`);
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review status", err);
      toast.error("Failed to update review");
    }
  };

  const sendReviewResponse = async () => {
    if (!reviewResponse.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews/${selectedReview._id}/response`,
        { message: reviewResponse },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Response sent successfully");
      setSelectedReview(null);
      setReviewResponse("");
      fetchReviews();
    } catch (err) {
      console.error("Failed to send response", err);
      toast.error("Failed to send response");
    }
  };

  const toggleReviewFeatured = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews/${reviewId}/featured`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Featured status updated");
      fetchReviews();
    } catch (err) {
      console.error("Failed to toggle featured", err);
      toast.error("Failed to update featured status");
    }
  };

  const updatePageStatus = async (pageId, isPublished) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pages/${pageId}/status`,
        { isPublished },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Page ${isPublished ? 'published' : 'unpublished'} successfully`);
      fetchPages();
    } catch (err) {
      console.error("Failed to update page status", err);
      toast.error("Failed to update page");
    }
  };

  const sendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error("Please enter subject and content");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/emails/bulk`,
        { subject: emailSubject, content: emailContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Bulk email sent successfully");
      setEmailSubject("");
      setEmailContent("");
    } catch (err) {
      console.error("Failed to send bulk email", err);
      toast.error("Failed to send email");
    }
  };

  const exportData = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/export/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-export-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`${type} data exported successfully`);
    } catch (err) {
      console.error("Failed to export data", err);
      toast.error("Failed to export data");
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

  const TabButton = ({ name, icon, label }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        activeTab === name
          ? `${currentTheme.btnPrimary} text-white`
          : `${currentTheme.btnAccent} hover:${currentTheme.navHover}`
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen py-8 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Admin Panel
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>Complete system management dashboard</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton name="dashboard" icon={<FiBarChart2 />} label="Dashboard" />
          <TabButton name="users" icon={<FiUsers />} label="Users" />
          <TabButton name="reviews" icon={<FiStar />} label="Reviews" />
          <TabButton name="contacts" icon={<FiMessageSquare />} label="Contacts" />
          <TabButton name="pages" icon={<FiFileText />} label="Pages" />
          <TabButton name="emails" icon={<FiMail />} label="Emails" />
          <TabButton name="settings" icon={<FiSettings />} label="Settings" />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
              <FiUsers className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
              <FiStar className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
              <p className="text-3xl font-bold">{stats.totalReviews}</p>
            </div>
            <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
              <FiMessageSquare className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Pending Contacts</h3>
              <p className="text-3xl font-bold">{stats.pendingContacts}</p>
            </div>
            <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
              <FiMail className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Emails Sent</h3>
              <p className="text-3xl font-bold">{stats.emailsSent}</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button
                onClick={() => exportData('users')}
                className={`${currentTheme.btnPrimary} flex items-center px-3 py-1 rounded`}
              >
                <FiDownload className="mr-1" /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Username</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-3">{user.username}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded text-sm"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Review Management</h2>
              <button
                onClick={() => exportData('reviews')}
                className={`${currentTheme.btnPrimary} flex items-center px-3 py-1 rounded`}
              >
                <FiDownload className="mr-1" /> Export
              </button>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{review.user?.username}</h4>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
                  <p className="mb-3">{review.comment}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateReviewStatus(review._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiX />
                    </button>
                    <button
                      onClick={() => toggleReviewFeatured(review._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {review.isFeatured ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiMessageSquare />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Contact Messages</h2>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-gray-600">{contact.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mb-3">{contact.message}</p>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      Reply
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                      Mark Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Page Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page) => (
                <div key={page._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{page.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      page.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{page.slug}</p>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => updatePageStatus(page._id, !page.isPublished)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {page.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emails Tab */}
        {activeTab === 'emails' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Email Management</h2>
            
            {/* Bulk Email Form */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Send Bulk Email</h3>
              <input
                type="text"
                placeholder="Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Email content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={4}
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={sendBulkEmail}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiSend className="inline mr-1" /> Send to All Users
              </button>
            </div>

            {/* Email History */}
            <h3 className="font-semibold mb-3">Email History</h3>
            <div className="space-y-3">
              {emails.map((email) => (
                <div key={email._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{email.subject}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(email.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{email.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">General Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Enable user registration
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Require email verification
                  </label>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Email Settings</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="SMTP Host"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="SMTP Port"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Review Response Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Respond to Review</h3>
              <textarea
                value={reviewResponse}
                onChange={(e) => setReviewResponse(e.target.value)}
                rows={4}
                className="w-full p-2 border rounded mb-4"
                placeholder="Type your response here..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReviewResponse}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
