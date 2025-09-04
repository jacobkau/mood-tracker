import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from '../context/useTheme';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/public/approved?page=1&limit=5
` 
      );
      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <h3 className={`text-2xl font-bold ${currentTheme.bodyText} mb-6`}>Customer Reviews</h3>
      
      {reviews.length === 0 ? (
        <div className={`text-center py-8 ${currentTheme.cardBg} rounded-lg`}>
          <p className={currentTheme.bodyText}>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          {reviews.map((review) => (
            <div key={review._id} className={`p-6 rounded-lg ${currentTheme.cardBg} ${currentTheme.cardBorder} border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${currentTheme.highlight} flex items-center justify-center font-semibold`}>
                    {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.user?.username || 'Anonymous'}</h4>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                </div>
                <span className={`text-sm ${currentTheme.bodyAccent}`}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h5 className={`font-semibold text-lg mb-2 ${currentTheme.bodyText}`}>{review.title}</h5>
              <p className={currentTheme.bodyText}>{review.comment}</p>
              
              {review.adminResponse && (
                <div className={`mt-4 p-4 rounded-md ${currentTheme.highlight}`}>
                  <div className="flex items-center mb-2">
                    <span className={`font-semibold ${currentTheme.bodyAccent}`}>Admin Response:</span>
                    <span className={`text-sm ${currentTheme.bodyAccent} ml-2`}>
                      {new Date(review.adminResponse.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={currentTheme.bodyText}>{review.adminResponse.message}</p>
                </div>
              )}
            </div>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      pageNum === page
                        ? `${currentTheme.btnPrimary} text-white`
                        : `${currentTheme.btnAccent} hover:${currentTheme.navHover}`
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
