import { Link } from "react-router-dom";
import { useTheme } from '../context/useTheme';
export default function Footer() {
    const { theme, themes } = useTheme();
  const currentTheme = themes[theme];
  return (
 
      <footer className={'${currentTheme.footerBg} ${currentTheme.footerText} py-8 px-4 sm:px-6 lg:px-8 bg-gray-800 text-gray-300'}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">😊 Witty MoodTracker</h4>
            <p className="text-sm">Your companion for emotional wellness and mental health awareness.</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Features</Link></li>
              <li><Link to="/" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/" className="hover:text-white">Testimonials</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/guides" className="hover:text-white">Guides</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© 2023 Witty MoodTracker. All rights reserved.</p>
        </div>
      </footer>
  );
}
