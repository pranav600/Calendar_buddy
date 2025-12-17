const mongoose = require("mongoose");

const StickyNoteSchema = new mongoose.Schema({
  id: String,
  x: Number,
  y: Number,
  content: String, // Encrypted content
  color: String,
});

const EventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    note: {
      type: String, // Encrypted note
      default: "",
    },
    stickies: [StickyNoteSchema],
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Event", EventSchema);
