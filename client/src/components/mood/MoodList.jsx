import axios from "axios";
import { useState } from "react";
import { useTheme } from "../../context/useTheme";


export default function MoodList({ moods, setMoods }) {
  const [expandedMoodId, setExpandedMoodId] = useState(null);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  const moodRecommendations = {
    Happy: {
      advice: "Great to see you were feeling happy!",
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
      advice: "Wonderful! You were full of energy and enthusiasm!",
      recommendations: [
        "Channel your energy into a creative project",
        "Share your excitement with others",
        "Set new goals to take advantage of this motivated state",
        "Try something adventurous",
        "Document this feeling to look back on later"
      ]
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/moods/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMoods((prevMoods) => prevMoods.filter((mood) => mood._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete mood: ${err.response?.data?.error || err.message}`);
    }
  };

  const toggleRecommendations = (id) => {
    setExpandedMoodId(expandedMoodId === id ? null : id);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${currentTheme.cardBg}`}>
      <h2 className={`text-xl font-semibold mb-4 ${currentTheme.bodyText}`}>Your Mood History</h2>
      {moods.length === 0 ? (
        <p className={currentTheme.bodySecondary}>No moods logged yet.</p>
      ) : (
        <ul className="space-y-3">
          {moods.map((mood) => (
            <li
              key={mood._id}
              className={`border rounded-md overflow-hidden ${currentTheme.cardBorder}`}
            >
              <div className="flex justify-between items-center p-3">
                <div>
                  <span className={`font-medium ${currentTheme.bodyText}`}>{mood.mood}</span>
                  {mood.notes && (
                    <p className={`text-sm mt-1 ${currentTheme.bodySecondary}`}>{mood.notes}</p>
                  )}
                  <p className={`text-xs mt-1 ${currentTheme.bodySecondary}`}>
                    {new Date(mood.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRecommendations(mood._id)}
                    className={`text-sm ${currentTheme.bodyAccent} hover:${currentTheme.bodySecondary}`}
                  >
                    {expandedMoodId === mood._id ? "Hide Tips" : "Show Tips"}
                  </button>
                  <button
                    onClick={() => handleDelete(mood._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {expandedMoodId === mood._id && (
                <div className={`p-4 border-t ${currentTheme.highlight}`}>
                  <h3 className={`font-medium mb-2 ${currentTheme.bodyAccent}`}>
                    {moodRecommendations[mood.mood]?.advice || "Tips for this mood:"}
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {moodRecommendations[mood.mood]?.recommendations.map((item, index) => (
                      <li key={index} className={currentTheme.bodyText}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
