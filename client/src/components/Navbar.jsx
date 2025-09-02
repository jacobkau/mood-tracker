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
  FiFileText
} from "react-icons/fi";
import { useTheme } from '../context/useTheme';

export default function Navbar({ setIsAuthenticated, isAuthenticated }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme, themes } = useTheme();
    const currentTheme = themes[theme];

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/login", { replace: true });
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
                className={`flex items-center ${
                    isActive 
                        ? currentTheme.active 
                        : `${currentTheme.text} ${currentTheme.hover}`
                } transition-colors`}
                aria-current={isActive ? "page" : undefined}
            >
                {icon}
                <span className="ml-1">{text}</span>
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
                className={`flex flex-col items-center text-xs ${
                    isActive 
                        ? currentTheme.active 
                        : `${currentTheme.text} ${currentTheme.hover}`
                }`}
                aria-current={isActive ? "page" : undefined}
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
        <nav className={`${currentTheme.navBg} shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className={`flex items-center text-xl font-bold ${currentTheme.text} hover:opacity-80`}
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-bold text-lg">W</span>
                            </div>
                            <span className="hidden sm:inline ml-3">Witty MoodTracker</span>
                        </Link>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Public pages (no auth required) */}
                        <NavLink to="/" icon={<FiHome size={18} />} text="Home" />
                        <NavLink to="/features" icon={<FiFeather size={18} />} text="Features" />
                        <NavLink to="/pricing" icon={<FiDollarSign size={18} />} text="Pricing" />
                        <NavLink to="/testimonials" icon={<FiStar size={18} />} text="Testimonials" />
                        <NavLink to="/blog" icon={<FiBook size={18} />} text="Blog" />
                        <NavLink to="/guides" icon={<FiFileText size={18} />} text="Guides" />
                        <NavLink to="/faq" icon={<FiHelpCircle size={18} />} text="FAQ" />
                        
                        {/* Protected pages (auth required) */}
                        <NavLink to="/dashboard" icon={<FiHome size={18} />} text="Dashboard" requiresAuth={true} />
                        <NavLink to="/stats" icon={<FiBarChart2 size={18} />} text="Statistics" requiresAuth={true} />
                        <NavLink to="/profile" icon={<FiUser size={18} />} text="Profile" requiresAuth={true} />
                        
                        {/* Always visible pages */}
                        <NavLink to="/contact" icon={<FiPhone size={18} />} text="Contact" />
                    </div>

                    {/* Auth buttons & Theme Toggle */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${currentTheme.text} ${currentTheme.hover}`}
                            aria-label={`Toggle theme - switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className={`flex items-center ${currentTheme.text} hover:text-red-300 transition-colors`}
                                aria-label="Logout"
                            >
                                <FiLogOut className="mr-1" size={18} />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <Link
                                    to="/login"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentTheme.text} ${currentTheme.hover}`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${currentTheme.mobileBg}`}>
                <div className="flex justify-around py-2">
                    {/* Public pages */}
                    <MobileNavLink to="/" icon={<FiHome size={20} />} text="Home" />
                    <MobileNavLink to="/features" icon={<FiFeather size={20} />} text="Features" />
                    <MobileNavLink to="/pricing" icon={<FiDollarSign size={20} />} text="Pricing" />
                    
                    {/* Protected pages */}
                    <MobileNavLink to="/dashboard" icon={<FiHome size={20} />} text="Dashboard" requiresAuth={true} />
                    <MobileNavLink to="/stats" icon={<FiBarChart2 size={20} />} text="Stats" requiresAuth={true} />
                    
                    {/* More menu items for mobile */}
                    <div className="relative group">
                        <button className="flex flex-col items-center text-xs">
                            <FiHelpCircle size={20} />
                            <span className="mt-1">More</span>
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <MobileNavLink to="/testimonials" icon={<FiStar size={16} />} text="Testimonials" />
                            <MobileNavLink to="/blog" icon={<FiBook size={16} />} text="Blog" />
                            <MobileNavLink to="/guides" icon={<FiFileText size={16} />} text="Guides" />
                            <MobileNavLink to="/faq" icon={<FiHelpCircle size={16} />} text="FAQ" />
                            <MobileNavLink to="/contact" icon={<FiPhone size={16} />} text="Contact" />
                            {isAuthenticated && (
                                <MobileNavLink to="/profile" icon={<FiUser size={16} />} text="Profile" requiresAuth={true} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
