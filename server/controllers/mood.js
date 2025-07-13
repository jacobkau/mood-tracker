const Mood = require('../models/Mood');

// @desc    Get all moods for a user
// @route   GET /api/moods
const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.id }).sort('-date');
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add a new mood
// @route   POST /api/moods
const addMood = async (req, res) => {
  try {
    const { mood, notes } = req.body;

    const newMood = await Mood.create({
      userId: req.user.id,
      mood,
      notes,
    });

    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete a mood
// @route   DELETE /api/moods/:id
const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ error: 'Mood not found' });
    }

    // Check if mood belongs to user
    if (mood.userId.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await mood.remove();
    res.json({ message: 'Mood removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMoods, addMood, deleteMood };