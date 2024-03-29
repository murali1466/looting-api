const mongoose = require("mongoose");
const assetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    pinkCash: {
      type: Number,
      default: 0,
    },
    greenCash: {
      type: Number,
      default: 0,
    },
    goldCoins: {
      type: Number,
      default: 0,
    },
    silverCoins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('asset',assetSchema);