const mongoose = require("mongoose");
const referralSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reward: {
      type: {
        type: String,
        enum: ["pinkCash", "greenCash", "goldCoin", "silverCoin"],
        required: true,
      },
      amount: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Refer", referralSchema);
