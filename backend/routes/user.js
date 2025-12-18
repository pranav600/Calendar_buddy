const router = require("express").Router();
const User = require("../models/User");

// Middleware to ensure user is authenticated
const ensureAuth = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// GET user's calendar colors
router.get("/colors", ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.calendarColors || {});
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST to update a specific month's color
router.post("/colors", ensureAuth, async (req, res) => {
  const { monthKey, color } = req.body; // e.g., monthKey="2024-12", color="bg-blue-50..."

  if (!monthKey || !color) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const user = await User.findById(req.user.id);

    // Ensure calendarColors exists
    if (!user.calendarColors) {
      user.calendarColors = new Map();
    }

    user.calendarColors.set(monthKey, color);
    await user.save();

    res.status(200).json({ message: "Color saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
