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
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid mood ID format' });
    }

    const mood = await Mood.findById(id);

    if (!mood) {
      return res.status(404).json({ error: 'Mood not found' });
    }

    // req.user is a full Mongoose document, so use _id
    if (!req.user || mood.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this mood' });
    }

    await mood.deleteOne(); // or await mood.remove() if using Mongoose <7
    res.status(200).json({ message: 'Mood removed' });

  } catch (err) {
    console.error("🔥 Error in deleteMood:", err);
    res.status(500).json({ error: err.message || 'Server error during deletion' });
  }
};

module.exports = { deleteMood };



module.exports = { getMoods, addMood, deleteMood };
