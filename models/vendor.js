const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      type: {
        type: String,
        enum: ["blue", "pink", "silver", "gold"],
        required: true,
      },
      scansRemaining: { type: Number, required: true },
      expiresAt: {
        type: Date,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('vendor',vendorSchema);