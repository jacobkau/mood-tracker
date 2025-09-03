import { useEffect, useState } from "react";
import axios from "axios";
import { FiActivity, FiTrendingUp, FiCalendar, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import { useTheme } from '../context/useTheme';
import "react-toastify/dist/ReactToastify.css";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/moods/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.bodyAccent} mx-auto`}></div>
          <p className={`mt-4 ${currentTheme.bodyText}`}>Loading your statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen py-8 px-4 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Your Mood Statistics
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>Insights into your emotional journey</p>
        </div>
        
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={<FiActivity size={24} />}
              title="Most Common Mood"
              value={stats.mostCommonMood}
              theme={currentTheme}
              colorClass="text-blue-500"
            />
            <StatCard 
              icon={<FiTrendingUp size={24} />}
              title="Positive Days"
              value={`${stats.positivePercentage}%`}
              theme={currentTheme}
              colorClass="text-green-500"
            />
            <StatCard 
              icon={<FiCalendar size={24} />}
              title="Total Entries"
              value={stats.totalEntries}
              theme={currentTheme}
              colorClass="text-purple-500"
            />
          </div>
        ) : (
          <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} p-8 rounded-lg border text-center`}>
            <FiLoader className={`${currentTheme.bodyAccent} mx-auto h-12 w-12 mb-4`} />
            <p className={currentTheme.bodyText}>Unable to load statistics. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, theme, colorClass }) {
  return (
    <div className={`${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} p-6 rounded-lg border transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${theme.highlight} rounded-full ${colorClass}`}>
          {icon}
        </div>
        <div>
          <h3 className={`${theme.labelText} text-sm font-medium`}>{title}</h3>
          <p className={`text-2xl font-bold ${theme.bodySecondary}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
