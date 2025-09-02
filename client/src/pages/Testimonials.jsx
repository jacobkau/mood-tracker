import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getTestimonials } from '../services/api';
import { useTheme } from '../context/useTheme';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
    const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await getTestimonials();
        // setTestimonials(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setTestimonials([
            {
              id: 1,
              name: "Sarah Johnson",
              role: "Marketing Manager",
              image: "SJ",
              content: "Witty MoodTracker has completely changed how I understand my emotional patterns. The insights have helped me manage stress during high-pressure projects.",
              rating: 5,
              featured: true
            },
            {
              id: 2,
              name: "Michael Chen",
              role: "Software Developer",
              image: "MC",
              content: "As someone who struggles with anxiety, this app has been a game-changer. The reminder system helps me check in regularly, and the data visualization makes it easy to spot triggers.",
              rating: 5,
              featured: true
            },
            {
              id: 3,
              name: "Emily Rodriguez",
              role: "Teacher",
              image: "ER",
              content: "I've recommended Witty MoodTracker to all my colleagues. It's helped us maintain better emotional balance in our high-stress profession.",
              rating: 5,
              featured: false
            },
            {
              id: 4,
              name: "David Kim",
              role: "Graduate Student",
              image: "DK",
              content: "The analytics features are incredible. I discovered patterns in my mood that I never would have noticed otherwise. It's like having a personal therapist in my pocket.",
              rating: 5,
              featured: true
            },
            {
              id: 5,
              name: "Jessica Williams",
              role: "Freelance Designer",
              image: "JW",
              content: "I love how intuitive and beautiful the interface is. Tracking my mood feels like a rewarding ritual rather than a chore.",
              rating: 5,
              featured: false
            },
            {
              id: 6,
              name: "Robert Taylor",
              role: "HR Director",
              image: "RT",
              content: "Our company started offering Witty MoodTracker as part of our wellness program. The feedback has been overwhelmingly positive from employees at all levels.",
              rating: 5,
              featured: true
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className={'${currentTheme.footerBg} ${currentTheme.footerText} min-h-screen bg-gray-50'}>
        <PageHeader title="Testimonials" />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
        title="Testimonials" 
        description="See what our users are saying about their experience with Witty MoodTracker"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Featured testimonials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.filter(t => t.featured).map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* All testimonials */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">More Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.filter(t => !t.featured).map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-bold mr-3">
                    {testimonial.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Happy Users</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Start your journey to better emotional awareness and join thousands of users who have transformed their mental well-being
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600">5,000+</div>
              <div className="text-gray-600 mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600">92%</div>
              <div className="text-gray-600 mt-1">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600">50+</div>
              <div className="text-gray-600 mt-1">Countries</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600">4.9/5</div>
              <div className="text-gray-600 mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
