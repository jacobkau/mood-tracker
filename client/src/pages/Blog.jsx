import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getBlogPosts, subscribeToNewsletter } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/useTheme';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await getBlogPosts(currentPage, 6);
        setBlogPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [currentPage]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setSubscribing(true);
    try {
      await subscribeToNewsletter(email);
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error(error.response?.data?.error || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen`}>
        <PageHeader title="Blog" />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className={`rounded-xl shadow-md overflow-hidden animate-pulse ${currentTheme.cardBg}`}>
                <div className={`h-48 ${currentTheme.bodyAccent} bg-opacity-20`}></div>
                <div className="p-6">
                  <div className={`h-4 rounded mb-4 w-1/3 ${currentTheme.bodyAccent} bg-opacity-20`}></div>
                  <div className={`h-6 rounded mb-3 ${currentTheme.bodyAccent} bg-opacity-20`}></div>
                  <div className={`h-4 rounded mb-2 ${currentTheme.bodyAccent} bg-opacity-20`}></div>
                  <div className={`h-4 rounded mb-2 ${currentTheme.bodyAccent} bg-opacity-20`}></div>
                  <div className={`h-4 rounded w-2/3 ${currentTheme.bodyAccent} bg-opacity-20`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bodyBg} ${currentTheme.bodyText}`}>
      <PageHeader 
        title="Blog" 
        description="Insights, tips, and research on emotional wellness and mental health"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post._id} className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group ${currentTheme.cardBg}`}>
              <div className={`h-48 bg-gradient-to-r ${currentTheme.headerGradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="text-white text-4xl font-bold z-10">{post.category?.charAt(0) || 'B'}</span>
              </div>
              <div className="p-6">
                <div className={`flex items-center text-sm mb-3 ${currentTheme.bodySecondary}`}>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className={`text-xl font-semibold mb-3 line-clamp-2 group-hover:${currentTheme.bodyAccent} transition-colors duration-200`}>
                  {post.title}
                </h3>
                <p className={`mb-4 line-clamp-3 ${currentTheme.bodyText}`}>{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${currentTheme.bodyAccent}`}>{post.author}</span>
                  <Link 
                    to={`/blog/${post._id}`}
                    className={`${currentTheme.bodyAccent} hover:${currentTheme.bodySecondary} font-medium flex items-center transition-colors duration-200`}
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {currentPage < totalPages && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={`${currentTheme.btnPrimary} font-medium py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More Articles'
              )}
            </button>
          </div>
        )}
        
        <div className={`mt-16 rounded-xl p-8 ${currentTheme.highlight}`}>
          <h2 className="text-2xl font-bold text-white text-center mb-4">Stay Updated</h2>
          <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest articles, research updates, and mental health tips
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-grow px-4 py-3 rounded-md border focus:outline-none focus:ring-2 ${currentTheme.inputBorder} ${currentTheme.inputFocus} ${currentTheme.inputBg}`}
              required
            />
            <button
              type="submit"
              disabled={subscribing}
              className={`${currentTheme.btnPrimary} font-medium px-6 py-3 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          <p className={`text-xs text-center mt-3 ${currentTheme.bodySecondary}`}>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        {/* Categories Section */}
        <div className={`mt-12 rounded-xl shadow-md p-6 ${currentTheme.cardBg}`}>
          <h2 className="text-xl font-bold text-white mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mental Health', 'Wellness', 'Technology', 'Science', 'Relationships', 'Productivity', 'Therapy', 'Research'].map((category) => (
              <Link
                key={category}
                to={`/blog?category=${category.toLowerCase()}`}
                className={`text-center p-4 rounded-lg hover:${currentTheme.highlight} hover:${currentTheme.bodyAccent} transition-colors duration-200 ${currentTheme.bodyBg}`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
