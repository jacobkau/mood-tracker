import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGuides } from '../services/api';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading guides...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {guides.map((guide) => (
        <div key={guide._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="h-4 bg-indigo-600"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {guide.level}
              </span>
              <span className="text-sm text-gray-500">{guide.time}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
            <p className="text-gray-600 mb-4">{guide.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">{guide.category}</span>
              <Link to={`/guides/${guide._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                Read Guide →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
