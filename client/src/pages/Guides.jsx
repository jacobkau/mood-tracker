import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Guides = () => {
  const guides = [
    {
      title: "Getting Started with Mood Tracking",
      description: "A step-by-step guide to beginning your mood tracking journey",
      level: "Beginner",
      time: "10 minutes",
      category: "Getting Started"
    },
    {
      title: "Interpreting Your Mood Charts",
      description: "Learn how to read and understand your mood analytics",
      level: "Intermediate",
      time: "15 minutes",
      category: "Analytics"
    },
    {
      title: "Advanced Mood Tracking Techniques",
      description: "Expert strategies for getting the most from your mood data",
      level: "Advanced",
      time: "20 minutes",
      category: "Advanced"
    },
    {
      title: "Using Mood Data in Therapy",
      description: "How to effectively share your mood insights with healthcare providers",
      level: "Intermediate",
      time: "12 minutes",
      category: "Therapy"
    },
    {
      title: "Creating Effective Mood Tracking Reminders",
      description: "Design a reminder system that works for your lifestyle",
      level: "Beginner",
      time: "8 minutes",
      category: "Productivity"
    },
    {
      title: "Mood Tracking for Couples",
      description: "How partners can use mood tracking to improve their relationship",
      level: "Intermediate",
      time: "18 minutes",
      category: "Relationships"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Guides" 
        description="Step-by-step instructions and tips to make the most of Witty MoodTracker"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                  <Link to={`/guides/${index + 1}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Read Guide →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Can't find what you're looking for?</h2>
          <p className="text-gray-600 text-center mb-6">Our support team is here to help you with any questions</p>
          <div className="flex justify-center">
            <Link
              to="/contact"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;
