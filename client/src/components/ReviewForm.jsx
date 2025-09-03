import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from '../context/useTheme';

const ReviewForm = ({ onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews`,
        { rating, title, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review submitted successfully! It will be visible after approval.");
      setRating(0);
      setTitle("");
      setComment("");
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      console.error("Failed to submit review", err);
      toast.error(err.response?.data?.error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg ${currentTheme.cardBg} ${currentTheme.cardBorder} border`}>
      <h3 className={`text-xl font-semibold mb-4 ${currentTheme.bodyText}`}>Share Your Experience</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${currentTheme.labelText} mb-2`}>
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl focus:outline-none ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${currentTheme.labelText} mb-2`}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${currentTheme.inputBg} ${currentTheme.inputBorder} w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus}`}
            placeholder="Brief summary of your experience"
            maxLength={100}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${currentTheme.labelText} mb-2`}>
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className={`${currentTheme.inputBg} ${currentTheme.inputBorder} w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:${currentTheme.inputFocus}`}
            placeholder="Share your experience in detail..."
            maxLength={1000}
            disabled={isSubmitting}
          />
          <p className={`text-xs ${currentTheme.bodyAccent} mt-1`}>
            {comment.length}/1000 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${currentTheme.btnPrimary} w-full py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
