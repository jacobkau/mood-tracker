import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FiLogOut, 
  FiHome, 
  FiBarChart2, 
  FiUser, 
  FiPhone, 
  FiSun, 
  FiMoon,
  FiFeather,
  FiDollarSign,
  FiStar,
  FiBook,
  FiHelpCircle,
  FiFileText,
  FiGrid,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState } from 'react';
import { useTheme } from '../context/useTheme';

export default function Navbar({ setIsAuthenticated, isAuthenticated }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme, themes } = useTheme();
    const currentTheme = themes[theme];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/", { replace: true });
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    function NavLink({ to, icon, text, requiresAuth = false }) {
        // Don't show protected links if not authenticated
        if (requiresAuth && !isAuthenticated) return null;
        
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                        ? `${currentTheme.navActive} ${currentTheme.navBg} bg-opacity-20` 
                        : `${currentTheme.navText} ${currentTheme.navHover}`
                } transition-colors`}
                aria-current={isActive ? "page" : undefined}
            >
                {icon}
                <span className="ml-2">{text}</span>
            </Link>
        );
    }
    
    function MobileNavLink({ to, icon, text, requiresAuth = false }) {
        // Don't show protected links if not authenticated
        if (requiresAuth && !isAuthenticated) return null;
        
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex flex-col items-center text-xs p-2 rounded-md ${
                    isActive 
                        ? `${currentTheme.navActive} ${currentTheme.navBg} bg-opacity-20` 
                        : `${currentTheme.navText} ${currentTheme.navHover}`
                }`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
            >
                {icon}
                <span className="mt-1">{text}</span>
            </Link>
        );
    }

    const toggleTheme = () => {
        const themeKeys = Object.keys(themes);
        const currentIndex = themeKeys.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setTheme(themeKeys[nextIndex]);
    };

    return (
        <nav className={`sticky top-0 z-50 ${currentTheme.navBg} shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Mobile Menu Button */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-md ${currentTheme.navText} ${currentTheme.navHover} mr-2`}
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                        
                        <Link
                            to="/"
                            className={`flex items-center text-xl font-bold ${currentTheme.navText} hover:opacity-80`}
                        >
                            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                                <span className="text-white font-bold text-lg">😊</span>
                            </div>
                            <span className="hidden sm:inline">Witty MoodTracker</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {/* Public pages (no auth required) */}
                        <NavLink to="/" icon={<FiHome size={18} />} text="Home" />
                        <NavLink to="/features" icon={<FiFeather size={18} />} text="Features" />
                        <NavLink to="/pricing" icon={<FiDollarSign size={18} />} text="Pricing" />
                        <NavLink to="/testimonials" icon={<FiStar size={18} />} text="Testimonials" />
                        <NavLink to="/blog" icon={<FiBook size={18} />} text="Blog" />
                        <NavLink to="/guides" icon={<FiFileText size={18} />} text="Guides" />
                        <NavLink to="/faq" icon={<FiHelpCircle size={18} />} text="FAQ" />
                        
                        {/* Protected pages (auth required) */}
                        <NavLink to="/dashboard" icon={<FiGrid size={18} />} text="Dashboard" requiresAuth={true} />
                        <NavLink to="/stats" icon={<FiBarChart2 size={18} />} text="Statistics" requiresAuth={true} />
                      
{user && user.role === 'admin' && (
  <Link to="/admin" className="text-red-600 hover:text-red-700">
    Admin Panel
  </Link>
)}
                        <NavLink to="/profile" icon={<FiUser size={18} />} text="Profile" requiresAuth={true} />
                        
                        {/* Always visible pages */}
                        <NavLink to="/contact" icon={<FiPhone size={18} />} text="Contact" />
                    </div>

                    {/* Auth buttons & Theme Toggle - Only show on desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${currentTheme.navText} ${currentTheme.navHover}`}
                            aria-label={`Toggle theme - switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentTheme.navText} hover:bg-opacity-20 hover:bg-red-500 transition-colors`}
                                aria-label="Logout"
                            >
                                <FiLogOut className="mr-1" size={18} />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <Link
                                    to="/login"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentTheme.navText} ${currentTheme.navHover}`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentTheme.btnPrimary}`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile theme toggle - Only show on mobile */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${currentTheme.navText} ${currentTheme.navHover}`}
                            aria-label={`Toggle theme - switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Only shown when toggled */}
            {mobileMenuOpen && (
                <div className={`md:hidden ${currentTheme.mobileNavBg} px-2 pt-2 pb-3 space-y-1`}>
                    <div className="grid grid-cols-4 gap-2">
                        {/* Public pages */}
                        <MobileNavLink to="/" icon={<FiHome size={20} />} text="Home" />
                        <MobileNavLink to="/features" icon={<FiFeather size={20} />} text="Features" />
                        <MobileNavLink to="/pricing" icon={<FiDollarSign size={20} />} text="Pricing" />
                        <MobileNavLink to="/testimonials" icon={<FiStar size={20} />} text="Testimonials" />
                        
                        {/* Protected pages */}
                        <MobileNavLink to="/dashboard" icon={<FiGrid size={20} />} text="Dashboard" requiresAuth={true} />
                        <MobileNavLink to="/stats" icon={<FiBarChart2 size={20} />} text="Stats" requiresAuth={true} />
                        <MobileNavLink to="/blog" icon={<FiBook size={20} />} text="Blog" />
                        <MobileNavLink to="/guides" icon={<FiFileText size={20} />} text="Guides" />
                        
                        <MobileNavLink to="/faq" icon={<FiHelpCircle size={20} />} text="FAQ" />
                        <MobileNavLink to="/contact" icon={<FiPhone size={20} />} text="Contact" />
                        
                        {isAuthenticated && (
                            <MobileNavLink to="/profile" icon={<FiUser size={20} />} text="Profile" requiresAuth={true} />
                        )}
                    </div>
                    
                    {/* Auth buttons for mobile - Only show if not authenticated */}
                    {!isAuthenticated && (
                        <div className="pt-4 border-t border-opacity-20 border-white grid grid-cols-2 gap-2">
                            <Link
                                to="/login"
                                className={`text-center px-4 py-2 rounded-md ${currentTheme.navText} ${currentTheme.navHover}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className={`text-center px-4 py-2 rounded-md ${currentTheme.btnPrimary}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                    
                    {/* Logout button for mobile - Only show if authenticated */}
                    {isAuthenticated && (
                        <div className="pt-4 border-t border-opacity-20 border-white">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full text-center px-4 py-2 rounded-md ${currentTheme.navText} hover:bg-opacity-20 hover:bg-red-500 transition-colors`}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
