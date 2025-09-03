import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from '../context/useTheme';

const AdminReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page);
      params.append("limit", 20);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/admin/all?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/admin/${reviewId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Review ${status} successfully`);
      fetchReviews();
      fetchStats();
    } catch (err) {
      console.error("Failed to update review status", err);
      toast.error("Failed to update review");
    }
  };

  const sendResponse = async () => {
    if (!responseMessage.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/admin/${selectedReview._id}/response`,
        { message: responseMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Response sent successfully");
      setSelectedReview(null);
      setResponseMessage("");
      fetchReviews();
    } catch (err) {
      console.error("Failed to send response", err);
      toast.error("Failed to send response");
    }
  };

  const toggleFeatured = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/admin/${reviewId}/featured`,
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.bodyAccent} mx-auto`}></div>
        <p className={`mt-4 ${currentTheme.bodyText}`}>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} p-6`}>
      <h2 className="text-2xl font-bold mb-6">Review Management</h2>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className={`${currentTheme.cardBg} p-4 rounded-lg text-center`}>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <div className="text-sm">Total Reviews</div>
          </div>
          <div className={`${currentTheme.cardBg} p-4 rounded-lg text-center`}>
            <div className="text-2xl font-bold text-green-600">{stats.approvedReviews}</div>
            <div className="text-sm">Approved</div>
          </div>
          <div className={`${currentTheme.cardBg} p-4 rounded-lg text-center`}>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
            <div className="text-sm">Pending</div>
          </div>
          <div className={`${currentTheme.cardBg} p-4 rounded-lg text-center`}>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedReviews}</div>
            <div className="text-sm">Rejected</div>
          </div>
          <div className={`${currentTheme.cardBg} p-4 rounded-lg text-center`}>
            <div className="text-2xl font-bold text-blue-600">{stats.featuredReviews}</div>
            <div className="text-sm">Featured</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`${currentTheme.cardBg} p-4 rounded-lg mb-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className={`${currentTheme.inputBg} ${currentTheme.inputBorder} p-2 rounded-md`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <input
            type="text"
            placeholder="Search reviews..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className={`${currentTheme.inputBg} ${currentTheme.inputBorder} p-2 rounded-md flex-1`}
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className={`${currentTheme.cardBg} p-4 rounded-lg border`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${currentTheme.highlight} flex items-center justify-center font-semibold`}>
                  {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold">{review.user?.username || 'Anonymous'}</h4>
                  <p className="text-sm text-gray-600">{review.user?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex text-yellow-400 mb-1">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  review.status === 'approved' ? 'bg-green-100 text-green-800' :
                  review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {review.status}
                </span>
              </div>
            </div>

            <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
            <p className="mb-3">{review.comment}</p>

            {review.adminResponse && (
              <div className={`${currentTheme.highlight} p-3 rounded-md mb-3`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">Admin Response:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(review.adminResponse.respondedAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{review.adminResponse.message}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {review.status !== 'approved' && (
                <button
                  onClick={() => updateReviewStatus(review._id, 'approved')}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Approve
                </button>
              )}
              {review.status !== 'rejected' && (
                <button
                  onClick={() => updateReviewStatus(review._id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => toggleFeatured(review._id)}
                className={`${
                  review.isFeatured ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-3 py-1 rounded text-sm`}
              >
                {review.isFeatured ? 'Unfeature' : 'Feature'}
              </button>
              <button
                onClick={() => setSelectedReview(review)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
              >
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setFilters({ ...filters, page: pageNum })}
                className={`px-3 py-1 rounded-md ${
                  pageNum === filters.page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme.cardBg} p-6 rounded-lg w-full max-w-md`}>
            <h3 className="text-lg font-semibold mb-4">Respond to Review</h3>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={4}
              className={`${currentTheme.inputBg} ${currentTheme.inputBorder} w-full p-2 border rounded-md mb-4`}
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
                onClick={sendResponse}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewManager;
