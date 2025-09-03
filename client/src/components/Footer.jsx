import { Link } from "react-router-dom";
import { useTheme } from '../context/useTheme';

export default function Footer() {
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];
  console.log("Footer theme:", theme, currentTheme);
  

  return (
    <footer className={`${currentTheme.footerBg} ${currentTheme.footerText} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
          <h4 className={`${currentTheme.footerText} font-semibold mb-4`}>😊 Witty MoodTracker</h4>
          <p className="text-sm">Your companion for emotional wellness and mental health awareness.</p>
        </div>
        
        <div>
          <h4 className={`${currentTheme.footerText} font-semibold mb-4`}>Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/features" className={currentTheme.footerHover}>Features</Link></li>
            <li><Link to="/pricing" className={currentTheme.footerHover}>Pricing</Link></li>
            <li><Link to="/testimonials" className={currentTheme.footerHover}>Testimonials</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className={`${currentTheme.footerText} font-semibold mb-4`}>Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/blog" className={currentTheme.footerHover}>Blog</Link></li>
            <li><Link to="/guides" className={currentTheme.footerHover}>Guides</Link></li>
            <li><Link to="/faq" className={currentTheme.footerHover}>FAQ</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className={`${currentTheme.footerText} font-semibold mb-4`}>Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className={currentTheme.footerHover}>About</Link></li>
            <li><Link to="/contact" className={currentTheme.footerHover}>Contact</Link></li>
            <li><Link to="/privacy" className={currentTheme.footerHover}>Privacy</Link></li>
            <li><Link to="/terms" className={currentTheme.footerHover}>Terms</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={`max-w-7xl mx-auto mt-8 pt-8 border-t ${currentTheme.footerBorder} text-center text-sm`}>
        <p>© 2023 Witty MoodTracker. All rights reserved.</p>
      </div>
    </footer>
  );
}
