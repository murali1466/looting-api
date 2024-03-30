const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      maxLength: 40,
    },
    lastName: {
      type: String,
      required: false,
      maxLength: 40,
    },
    userType: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      maxLength: 100,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: false,
    },
    lastLogIn: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      require: false,
    },
    profileStatus: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
