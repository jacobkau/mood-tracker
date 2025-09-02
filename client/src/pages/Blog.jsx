import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Emotional Patterns: A Beginner's Guide",
      excerpt: "Learn how to identify and understand your emotional patterns for better mental health.",
      date: "June 15, 2023",
      author: "Dr. Emily Sanders",
      category: "Mental Health",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "5 Benefits of Daily Mood Tracking",
      excerpt: "Discover how tracking your mood daily can lead to significant improvements in your emotional well-being.",
      date: "June 8, 2023",
      author: "Michael Thompson",
      category: "Wellness",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "How Technology is Changing Mental Health Care",
      excerpt: "Explore the ways technology is making mental health support more accessible to everyone.",
      date: "May 30, 2023",
      author: "Sarah Johnson",
      category: "Technology",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "Seasonal Affective Disorder: Recognizing the Signs",
      excerpt: "Learn how to identify and manage seasonal mood changes effectively.",
      date: "May 22, 2023",
      author: "Dr. Robert Chen",
      category: "Mental Health",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "The Science Behind Mood Tracking",
      excerpt: "A deep dive into the research supporting mood tracking as an effective tool for emotional regulation.",
      date: "May 15, 2023",
      author: "Dr. Amanda Williams",
      category: "Science",
      readTime: "12 min read"
    },
    {
      id: 6,
      title: "Building Healthy Emotional Habits",
      excerpt: "Practical strategies for developing habits that support long-term emotional well-being.",
      date: "May 5, 2023",
      author: "Jessica Martinez",
      category: "Wellness",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Blog" 
        description="Insights, tips, and research on emotional wellness and mental health"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{post.category.charAt(0)}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600">{post.author}</span>
                  <Link to={`/blog/${post.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200">
            Load More Articles
          </button>
        </div>
        
        <div className="mt-16 bg-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Stay Updated</h2>
          <p className="text-gray-600 text-center mb-6">Subscribe to our newsletter for the latest articles and updates</p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-r-md transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
