// src/pages/GuideDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGuide } from '../services/api';
import { useTheme } from '../context/useTheme';

const GuideDetail = () => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setError(null);
        const response = await getGuide(id);
        setGuide(response.data);
      } catch (error) {
        console.error('Failed to fetch guide:', error);
        setError('Guide not found');
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!guide) return <div>Guide not found</div>;

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen`}>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/guides" className="text-blue-400 hover:text-blue-300">
            ← Back to Guides
          </Link>
        </nav>

        {/* Guide Header */}
        <div className="mb-8">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            guide.difficulty === 'beginner' ? 'bg-green-900/20 text-green-300' :
            guide.difficulty === 'intermediate' ? 'bg-blue-900/20 text-blue-300' :
            'bg-purple-900/20 text-purple-300'
          }`}>
            {guide.difficulty}
          </span>
          
          <h1 className="text-3xl font-bold mb-4">{guide.title}</h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{guide.readTime} min read</span>
            <span>•</span>
            <span>{guide.category}</span>
            <span>•</span>
            <span>{new Date(guide.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Guide Content */}
        <article className={`prose prose-invert max-w-none ${currentTheme.bodyText}`}>
          <div dangerouslySetInnerHTML={{ __html: guide.content }} />
        </article>

        {/* Related Guides */}
        {guide.relatedGuides && guide.relatedGuides.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.relatedGuides.map(relatedGuide => (
                <Link
                  key={relatedGuide._id}
                  to={`/guides/${relatedGuide.slug || relatedGuide._id}`}
                  className={`p-4 rounded-lg hover:shadow-lg transition-shadow ${currentTheme.cardBg}`}
                >
                  <h3 className="font-semibold mb-2">{relatedGuide.title}</h3>
                  <p className="text-sm opacity-80">{relatedGuide.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDetail;
