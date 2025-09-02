import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getBlogPosts, subscribeToNewsletter } from '../services/api';
import { toast } from 'react-toastify';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Blog" />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        title="Blog" 
        description="Insights, tips, and research on emotional wellness and mental health"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="text-white text-4xl font-bold z-10">{post.category?.charAt(0) || 'B'}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600">{post.author}</span>
                  <Link 
                    to={`/blog/${post._id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors duration-200"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
        
        <div className="mt-16 bg-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Stay Updated</h2>
          <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest articles, research updates, and mental health tips
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        {/* Categories Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mental Health', 'Wellness', 'Technology', 'Science', 'Relationships', 'Productivity', 'Therapy', 'Research'].map((category) => (
              <Link
                key={category}
                to={`/blog?category=${category.toLowerCase()}`}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
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
