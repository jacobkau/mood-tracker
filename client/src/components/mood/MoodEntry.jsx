import { useState } from "react";
import axios from "axios";
import { useTheme } from "../../context/useTheme";

export default function MoodEntry({ setMoods }) {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

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
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true); // Set loading state
    
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
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleMoodChange = (e) => {
    setMood(e.target.value);
    setShowRecommendations(!!e.target.value);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${currentTheme.cardBg}`}>
      <h2 className={`text-xl font-semibold mb-4 ${currentTheme.bodyText}`}>Log Your Mood</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${currentTheme.labelText}`}>Mood</label>
          <select
            value={mood}
            onChange={handleMoodChange}
            className={`mt-1 p-2 w-full rounded-md focus:outline-none ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.inputFocus}`}
            required
            disabled={isSubmitting} // Disable when submitting
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
          <div className={`p-4 rounded-md border ${currentTheme.highlight}`}>
            <h3 className={`font-medium mb-2 ${currentTheme.bodyAccent}`}>{moodRecommendations[mood].advice}</h3>
            <h4 className={`text-sm font-semibold mb-1 ${currentTheme.bodySecondary}`}>Suggestions:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {moodRecommendations[mood].recommendations.map((item, index) => (
                <li key={index} className={currentTheme.bodyText}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <label className={`block text-sm font-medium ${currentTheme.labelText}`}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`mt-1 p-2 w-full rounded-md focus:outline-none ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.inputFocus}`}
            rows="3"
            placeholder="Add any additional thoughts about your mood..."
            disabled={isSubmitting} // Disable when submitting
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting} // Disable when submitting
          className={`w-full py-2 px-4 rounded-md transition ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed opacity-70' 
              : currentTheme.btnPrimary
          } flex items-center justify-center`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Mood...
            </>
          ) : (
            'Add Mood'
          )}
        </button>
      </form>
    </div>
  );
}
