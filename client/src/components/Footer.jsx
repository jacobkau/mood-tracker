import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-blue-600">
             <span className="text-2xl mr-2">😊</span>Witty MoodTracker
            </Link>
            <p className="text-gray-500 text-sm mt-1">
              Track your moods, improve your wellbeing
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </Link>
            <Link to="/developer" className="text-gray-600 hover:text-blue-600">
              Developer
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Witty MoodTracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}