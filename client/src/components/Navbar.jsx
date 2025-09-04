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
  FiX,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/useTheme';

export default function Navbar({ setIsAuthenticated, isAuthenticated, user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme, themes } = useTheme();
    const currentTheme = themes[theme];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                            {/* Always show the title, even on small screens */}
                            <span className="inline">Witty MoodTracker</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {/* Public pages (no auth required) */}
                        <NavLink to="/" icon={<FiHome size={18} />} text="Home" />
                        
                        {/* Dropdown for Features, Testimonials, Blog, Guides */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentTheme.navText} ${currentTheme.navHover} transition-colors`}
                                aria-expanded={dropdownOpen}
                            >
                                <FiGrid size={18} className="mr-1" />
                                <span>More</span>
                                {dropdownOpen ? <FiChevronUp size={16} className="ml-1" /> : <FiChevronDown size={16} className="ml-1" />}
                            </button>
                            
                            {dropdownOpen && (
    <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1">
            <Link
                to="/features"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setDropdownOpen(false)}
            >
                <FiFeather size={16} className="inline mr-2" />
                Features
            </Link>
            <Link
                to="/testimonials"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setDropdownOpen(false)}
            >
                <FiStar size={16} className="inline mr-2" />
                Testimonials
            </Link>
            <Link
                to="/reviews"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setDropdownOpen(false)}
            >
                <FiStar size={18} className="inline mr-2" />
                Reviews
            </Link>
            <Link
                to="/blog"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setDropdownOpen(false)}
            >
                <FiBook size={16} className="inline mr-2" />
                Blog
            </Link>
            <Link
                to="/guides"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setDropdownOpen(false)}
            >
                <FiFileText size={16} className="inline mr-2" />
                Guides
            </Link>
            {/* Added Pricing link to dropdown */}
            <Link
                to="/pricing"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setDropdownOpen(false)}
            >
                <FiDollarSign size={16} className="inline mr-2" />
                Pricing
            </Link>
        </div>
    </div>
)}
                        </div>
                        
                        {/* Removed standalone Pricing link from navbar since it's now in dropdown */}
                        <NavLink to="/faq" icon={<FiHelpCircle size={18} />} text="FAQ" />
                        
                        {/* Protected pages (auth required) */}
                        <NavLink to="/dashboard" icon={<FiGrid size={18} />} text="Dashboard" requiresAuth={true} />
                        <NavLink to="/stats" icon={<FiBarChart2 size={18} />} text="Statistics" requiresAuth={true} />
                        
                        {/* Admin Panel Link */}
                        {user && user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 transition-colors`}
                            >
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
                        <MobileNavLink to="/testimonials" icon={<FiStar size={20} />} text="Testimonials" />
                        <MobileNavLink to="/blog" icon={<FiBook size={20} />} text="Blog" />
                        <MobileNavLink to="/guides" icon={<FiFileText size={20} />} text="Guides" />
                        <MobileNavLink to="/pricing" icon={<FiDollarSign size={20} />} text="Pricing" />
                        <MobileNavLink to="/faq" icon={<FiHelpCircle size={20} />} text="FAQ" />
                        
                        {/* Protected pages */}
                        <MobileNavLink to="/dashboard" icon={<FiGrid size={20} />} text="Dashboard" requiresAuth={true} />
                        <MobileNavLink to="/stats" icon={<FiBarChart2 size={20} />} text="Stats" requiresAuth={true} />
                        
                        {/* Admin Panel Link for Mobile */}
                        {user && user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className={`flex flex-col items-center text-xs p-2 rounded-md text-red-400 hover:text-red-300`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FiGrid size={20} />
                                <span className="mt-1">Admin</span>
                            </Link>
                        )}
                        
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
