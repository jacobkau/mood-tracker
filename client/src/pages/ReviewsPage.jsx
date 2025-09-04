import { useState } from "react";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useTheme } from '../context/useTheme';

const ReviewsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  const handleReviewSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen py-8 px-4 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Customer Reviews
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>Share your experience and read what others have to say</p>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
          <ReviewList key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
