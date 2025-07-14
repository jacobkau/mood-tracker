import { useState } from "react";
import axios from "axios";

export default function MoodEntry({ setMoods }) {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  const moodRecommendations = {
    Happy: {
      advice: "Great to see you're feeling happy!",
      recommendations: [
        "Share your happiness with others",
        "Practice gratitude by listing things you're thankful for",
        "Engage in activities you enjoy to prolong this feeling",
        "Consider doing something kind for someone else"
      ]
    },
    Sad: {
      advice: "It's okay to feel sad sometimes.",
      recommendations: [
        "Reach out to a friend or loved one",
        "Practice self-care with a warm bath or your favorite comfort activity",
        "Consider journaling about your feelings",
        "Listen to soothing music or watch a comforting movie",
        "Remember that feelings are temporary"
      ]
    },
    Angry: {
      advice: "Anger is a natural emotion, but it's important to manage it healthily.",
      recommendations: [
        "Take deep breaths and count to 10 before reacting",
        "Go for a walk to cool down",
        "Try physical activity to release tension",
        "Write down what's bothering you, then tear it up",
        "Practice mindfulness or meditation"
      ]
    },
    Neutral: {
      advice: "A neutral mood can be a good opportunity for reflection.",
      recommendations: [
        "Check in with yourself to see if you need anything",
        "Consider trying something new to spark some energy",
        "Use this calm state to plan or organize something",
        "Practice mindfulness to stay present",
        "Engage in a creative activity"
      ]
    },
    Excited: {
      advice: "Wonderful! You're full of energy and enthusiasm!",
      recommendations: [
        "Channel your energy into a creative project",
        "Share your excitement with others",
        "Set new goals to take advantage of this motivated state",
        "Try something adventurous",
        "Document this feeling to look back on later"
      ]
    }
  };

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
      setShowRecommendations(false);
    } catch (err) {
      console.error("Failed to add mood", err);
    }
  };

  const handleMoodChange = (e) => {
    setMood(e.target.value);
    setShowRecommendations(!!e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Log Your Mood</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mood</label>
          <select
            value={mood}
            onChange={handleMoodChange}
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
        
        {showRecommendations && mood && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">{moodRecommendations[mood].advice}</h3>
            <h4 className="text-sm font-semibold text-blue-700 mb-1">Suggestions:</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              {moodRecommendations[mood].recommendations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Add any additional thoughts about your mood..."
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
