const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get mood statistics
// @route   GET /api/stats
router.get("/", protect, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.id });
    
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    const totalEntries = moods.length;
    const mostCommonMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    
    const positiveCount = moods.filter(m => 
      ['Happy', 'Excited', 'Content'].includes(m.mood)
    ).length;
    const positivePercentage = totalEntries > 0 
      ? Math.round((positiveCount / totalEntries) * 100) 
      : 0;

    res.json({
      totalEntries,
      mostCommonMood,
      positivePercentage,
      moodDistribution: moodCounts,
      weeklyTrend: calculateWeeklyTrend(moods) // Implement this function
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function for weekly trends
function calculateWeeklyTrend(moods) {
  // Implementation goes here
  return {};
}

module.exports = router;