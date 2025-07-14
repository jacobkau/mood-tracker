import { useState, useEffect } from "react";
import axios from "axios";
import MoodEntry from "../components/mood/MoodEntry";
import MoodList from "../components/mood/MoodList";
import MoodStats from "../components/mood/MoodStats";

export default function Dashboard() {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const fetchMoods = async () => {
     try {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/moods`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setMoods(res.data);
} catch (err) {
        console.error("Failed to fetch moods", err);
      }
    };
    fetchMoods();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mood Tracker</h1>
        <p><i>Your personal companion for emotional wellness!</i></p>
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
