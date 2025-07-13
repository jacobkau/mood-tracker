const express = require('express');
const Mood = require('../models/Mood');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMoods,
  addMood,
  deleteMood,
} = require('../controllers/mood');

router.route('/')
  .get(protect, getMoods)
  .post(protect, addMood);

router.route('/:id')
  .delete(protect, deleteMood);

  router.get('/stats', protect, async (req, res) => {
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
      moodDistribution: moodCounts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;