import { useState, useEffect } from "react";
import axios from "axios";
import MoodEntry from "../components/mood/MoodEntry";
import MoodList from "../components/mood/MoodList";
import MoodStats from "../components/mood/MoodStats";
import PageHeader from "../components/PageHeader";
import { useTheme } from '../context/useTheme';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        // Fetch user profile first
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(profileRes.data);

        // Then fetch moods
        const moodsRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/moods`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMoods(moodsRes.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Store user data in localStorage when it's fetched
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  if (loading) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.bodyAccent} mx-auto`}></div>
          <p className={`mt-4 ${currentTheme.bodyText}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen p-4 md:p-8`}>
      <PageHeader
        title={`Welcome back, ${user?.username || user?.firstName || "Friend"} 🌿`}
        description="This is your personal space to reflect, track moods, and nurture your well-being each day."
      />
      <div className="max-w-4xl mx-auto">
        <p className={`${currentTheme.bodySecondary}`}><i>Your personal companion for emotional wellness!</i></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <MoodEntry setMoods={setMoods} />
            <MoodList moods={moods} setMoods={setMoods} />
          </div>
          <div className="md:col-span-1">
            <MoodStats moods={moods} />
          </div>
        </div>
      </div>
    </div>
  );
}
