import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiHome, FiBarChart2, FiUser, FiPhone, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from '../context/useTheme';

export default function Navbar({ setIsAuthenticated }) {
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

  function NavLink({ to, icon, text }) {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center ${isActive ? currentTheme.active : ${currentTheme.text} ${currentTheme.hover}} transition-colors`}
        aria-current={isActive ? "page" : undefined}
      >
        {icon}
        <span className="ml-1">{text}</span>
      </Link>
    );
  }
  
  function MobileNavLink({ to, icon, text }) {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex flex-col items-center text-xs ${isActive ? currentTheme.active : ${currentTheme.text} ${currentTheme.hover}}`}
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
    <nav className={${currentTheme.navBg} shadow-lg}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className={flex items-center text-xl font-bold ${currentTheme.text} hover:opacity-80}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                <img
                  src="/icon.png"
                  alt="Witty MoodTracker Application Logo"
                  className="h-10 w-10"
                />
              </div>
              <span className="hidden sm:inline ml-3">Witty MoodTracker</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<FiHome />} text="Dashboard" />
            <NavLink to="/stats" icon={<FiBarChart2 />} text="Statistics" />
            <NavLink to="/profile" icon={<FiUser />} text="Profile" />
            <NavLink to="/contact" icon={<FiPhone />} text="Contact" />
          </div>

          {/* Theme Toggle & Logout */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={p-2 rounded-full ${currentTheme.text} ${currentTheme.hover}}
              aria-label={Toggle theme - switch to ${theme === 'dark' ? 'light' : 'dark'} mode}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            
            <button
              onClick={handleLogout}
              className={flex items-center ${currentTheme.text} hover:text-red-300 transition-colors}
              aria-label="Logout"
            >
              <FiLogOut className="mr-1" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={md:hidden ${currentTheme.mobileBg}}>
        <div className="flex justify-around py-2">
          <MobileNavLink to="/" icon={<FiHome size={20} />} text="Home" />
          <MobileNavLink to="/stats" icon={<FiBarChart2 size={20} />} text="Stats" />
          <MobileNavLink to="/profile" icon={<FiUser size={20} />} text="Me" />
        </div>
      </div>
    </nav>
  );
}
