import { useEffect, useState } from "react";
import axios from "axios";
import { FiActivity, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
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
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Mood Statistics</h1>
        
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={<FiActivity className="text-blue-500" size={24} />}
              title="Most Common Mood"
              value={stats.mostCommonMood}
            />
            <StatCard 
              icon={<FiTrendingUp className="text-green-500" size={24} />}
              title="Positive Days"
              value={`${stats.positivePercentage}%`}
            />
            <StatCard 
              icon={<FiCalendar className="text-purple-500" size={24} />}
              title="Total Entries"
              value={stats.totalEntries}
            />
          </div>
        ) : (
          <p>Loading statistics...</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
