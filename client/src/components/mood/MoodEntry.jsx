import { useState } from "react";
import axios from "axios";

export default function MoodEntry({ setMoods }) {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/moods`,
      { mood, notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setMoods((prev) => [...prev, res.data]);
    setMood("");
    setNotes("");
  } catch (err) {
    console.error("Failed to add mood", err);
  }
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Log Your Mood</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a mood</option>
            <option value="Happy">😊 Happy</option>
            <option value="Sad">😢 Sad</option>
            <option value="Angry">😠 Angry</option>
            <option value="Neutral">😐 Neutral</option>
            <option value="Excited">🤩 Excited</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Add Mood
        </button>
      </form>
    </div>
  );
}
