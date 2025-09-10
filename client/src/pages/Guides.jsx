import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getGuides } from '../services/api';
import { useTheme } from '../context/useTheme';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setError(null);
        const response = await getGuides();
        console.log('API Response:', response);
        
        let guidesData = [];
        
        // Handle different response structures
        if (response.data && Array.isArray(response.data)) {
          guidesData = response.data;
        } else if (response.data && response.data.guides) {
          guidesData = response.data.guides;
        } else if (Array.isArray(response)) {
          guidesData = response;
        } else if (response.guides) {
          guidesData = response.guides;
        }
        
        console.log('Extracted guides:', guidesData);
        setGuides(guidesData);
      } catch (error) {
        console.error('Failed to fetch guides:', error);
        setError('Failed to load guides. Please try again later.');
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const filteredGuides = filter === 'all' 
    ? guides 
    : guides.filter(guide => 
        guide.difficulty?.toLowerCase() === filter.toLowerCase()
      );

  const categories = ['all', 'beginner', 'intermediate', 'advanced'];

  const levelColors = {
    beginner: `${currentTheme.highlight} bg-opacity-50`,
    intermediate: 'bg-blue-900/20 text-blue-300',
    advanced: 'bg-purple-900/20 text-purple-300'
  };

  // Debug logs
  console.log('Current guides:', guides);
  console.log('Filtered guides:', filteredGuides);

  if (loading) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen`}>
        <PageHeader title="Guides" />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className={`rounded-xl shadow-md overflow-hidden animate-pulse ${currentTheme.cardBg}`}>
                <div className={`h-4 ${currentTheme.btnPrimary}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className={`h-6 rounded w-20 ${currentTheme.bodyBg}`}></div>
                    <div className={`h-4 rounded w-12 ${currentTheme.bodyBg}`}></div>
                  </div>
                  <div className={`h-5 rounded mb-3 w-3/4 ${currentTheme.bodyBg}`}></div>
                  <div className={`h-4 rounded mb-2 ${currentTheme.bodyBg}`}></div>
                  <div className={`h-4 rounded mb-4 w-2/3 ${currentTheme.bodyBg}`}></div>
                  <div className="flex justify-between items-center">
                    <div className={`h-4 rounded w-16 ${currentTheme.bodyBg}`}></div>
                    <div className={`h-4 rounded w-20 ${currentTheme.bodyBg}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen`}>
        <PageHeader title="Guides" />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-xl p-8 text-center`}>
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Unable to load guides</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`${currentTheme.btnPrimary} px-6 py-2 rounded-lg`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen`}>
      <PageHeader 
        title="Guides" 
        description="Step-by-step instructions and tips to make the most of Witty MoodTracker"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`rounded-lg shadow-sm p-1 inline-flex ${currentTheme.cardBg}`}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === category
                    ? `${currentTheme.btnPrimary} text-white`
                    : `${currentTheme.bodyText} hover:${currentTheme.bodyAccent}`
                }`}
              >
                {category === 'all' ? 'All Guides' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <div key={guide._id} className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group ${currentTheme.cardBg}`}>
              {guide.featuredImage && (
                <img 
                  src={guide.featuredImage} 
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    levelColors[guide.difficulty?.toLowerCase()] || levelColors.beginner
                  }`}>
                    {guide.difficulty || 'General'}
                  </span>
                  <span className={`text-sm ${currentTheme.bodyAccent}`}>
                    {guide.readTime ? `${guide.readTime} min read` : '5 min read'}
                  </span>
                </div>
                <h3 className={`text-xl font-semibold mb-3 group-hover:${currentTheme.bodyAccent} transition-colors duration-200`}>
                  {guide.title}
                </h3>
                <p className={`${currentTheme.bodyText} mb-4 line-clamp-3 opacity-80`}>
                  {guide.excerpt || guide.content?.substring(0, 150) + '...' || 'No description available.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${currentTheme.highlight}`}>
                    {guide.category || 'General'}
                  </span>
                  <Link 
                    to={`/guides/${guide.slug || guide._id}`}
                    className={`font-medium flex items-center transition-colors duration-200 ${currentTheme.bodyAccent} hover:${currentTheme.bodySecondary}`}
                  >
                    Read Guide
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium mb-2">
              {filter === 'all' ? 'No guides available yet' : `No ${filter} guides found`}
            </h3>
            <p className="opacity-80">We're working on more guides. Check back soon!</p>
          </div>
        )}
        
        <div className={`mt-16 rounded-xl shadow-md p-8 ${currentTheme.cardBg}`}>
          <h2 className="text-2xl font-bold text-center mb-6">Can't find what you're looking for?</h2>
          <p className="text-center mb-6 max-w-2xl mx-auto opacity-80">
            Our support team is here to help you with any questions or guidance you might need on your mental wellness journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className={`text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-center ${currentTheme.btnPrimary}`}
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className={`border font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-center ${currentTheme.cardBorder} hover:${currentTheme.bodyBg}`}
            >
              Visit FAQ
            </Link>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className={`mt-12 rounded-xl shadow-md p-8 text-white bg-gradient-to-r ${currentTheme.headerGradient}`}>
          <h2 className="text-2xl font-bold text-center mb-4">Track Your Progress</h2>
          <p className="text-center mb-6 opacity-90">
            Apply what you learn from these guides and track your emotional wellness journey
          </p>
          <div className="flex justify-center">
            <Link
              to="/register"
              className="bg-white text-gray-900 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;
