const router = require("express").Router();
const Event = require("../models/Event");
const { encrypt, decrypt } = require("../utils/encryption");

// Middleware to check if user is authenticated
const ensureAuth = (req, res, next) => {
  console.log("ensureAuth check:", req.isAuthenticated(), req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("User NOT authenticated");
  res.status(401).json({ error: "Not authenticated" });
};

// GET all events for the current user
router.get("/", ensureAuth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id });
    
    // Decrypt data before sending to frontend
    const decryptedEvents = events.map(event => ({
        ...event.toObject(),
        note: decrypt(event.note),
        stickies: event.stickies.map(sticky => ({
            ...sticky,
            content: decrypt(sticky.content)
        }))
    }));

    res.status(200).json(decryptedEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// SAVE (Upsert) event for a specific date
router.post("/save", ensureAuth, async (req, res) => {
  const { date, note, stickies } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    // Encrypt sensitive data
    const encryptedNote = encrypt(note);
    const encryptedStickies = stickies.map(sticky => ({
        ...sticky,
        content: encrypt(sticky.content)
    }));

    const event = await Event.findOneAndUpdate(
      { userId: req.user.id, date },
      {
        userId: req.user.id,
        date,
        note: encryptedNote,
        stickies: encryptedStickies,
      },
      { new: true, upsert: true }
    );
    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
