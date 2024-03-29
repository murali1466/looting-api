const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["freemium", "premium", "bill", "event", "refer"],
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  }, // for event cards
});

module.exports = mongoose.model("card", cardSchema);
