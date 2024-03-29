const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["blue", "pink", "silver", "gold"],
    },
    maxScans: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('subscription',subscriptionSchema);