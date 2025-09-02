import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getGuides } from '../services/api';
import { useTheme } from '../context/useTheme';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await getGuides();
        setGuides(response.data);
      } catch (error) {
        console.error('Failed to fetch guides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const filteredGuides = filter === 'all' 
    ? guides 
    : guides.filter(guide => guide.level === filter);

  const categories = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return (
      <div className={'${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen bg-gray-50'}>
        <PageHeader title="Guides" />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-4 bg-indigo-600"></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Guides" 
        description="Step-by-step instructions and tips to make the most of Witty MoodTracker"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === category
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category === 'all' ? 'All Guides' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <div key={guide._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="h-4 bg-indigo-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    guide.level === 'Beginner' 
                      ? 'bg-green-100 text-green-800'
                      : guide.level === 'Intermediate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {guide.level}
                  </span>
                  <span className="text-sm text-gray-500">{guide.time}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                  {guide.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{guide.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {guide.category}
                  </span>
                  <Link 
                    to={`/guides/${guide._id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors duration-200"
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

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No guides found</h3>
            <p className="text-gray-600">We're working on more guides for this category. Check back soon!</p>
          </div>
        )}
        
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Can't find what you're looking for?</h2>
          <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
            Our support team is here to help you with any questions or guidance you might need on your mental wellness journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-center"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-center"
            >
              Visit FAQ
            </Link>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-4">Track Your Progress</h2>
          <p className="text-indigo-100 text-center mb-6">
            Apply what you learn from these guides and track your emotional wellness journey
          </p>
          <div className="flex justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
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
