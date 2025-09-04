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
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // fetch moods
      const moodsRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/moods`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMoods(moodsRes.data);

      // fetch profile
      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(profileRes.data); // profile should contain username/name
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  fetchData();
}, []);


  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen p-4 md:p-8`}>
      <PageHeader
  title={`Welcome back, ${user?.username || "Friend"} 🌿`}
  description="This is your personal space to reflect, track moods, and nurture your well-being each day."
/>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>Mood Tracker</h1>
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
