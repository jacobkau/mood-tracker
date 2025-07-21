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
    console.log("[BACKEND] Deleting mood ID:", id);

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("[BACKEND] Invalid ID format");
      return res.status(400).json({ error: "Invalid mood ID format" });
    }

    // Find the mood
    const mood = await Mood.findById(id);
    console.log("[BACKEND] Found mood:", mood);

    if (!mood) {
      console.log("[BACKEND] Mood not found");
      return res.status(404).json({ error: "Mood not found" });
    }

    // Check ownership
    console.log("[BACKEND] User ID from token:", req.user._id);
    console.log("[BACKEND] Mood's user ID:", mood.userId);

    if (mood.userId.toString() !== req.user._id.toString()) {
      console.log("[BACKEND] Unauthorized (user mismatch)");
      return res.status(401).json({ error: "Not authorized" });
    }

    // Delete
    await mood.deleteOne();
    console.log("[BACKEND] Mood deleted successfully");
    res.status(200).json({ message: "Mood removed" });

  } catch (err) {
    console.error("[BACKEND] Error:", err);
    res.status(500).json({ error: "Server error during deletion" });
  }
};

module.exports = { deleteMood };



module.exports = { getMoods, addMood, deleteMood };
