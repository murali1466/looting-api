const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required : false,
      maxLength: 40,
    },
    lastName: {
      type: String,
      required: false,
      maxLength: 40,
    },
    hashcodeToken: {
      type: String,
      required: false,
    },
    userType :{
      type : String,
      required : false
    },
    email: {
      type: String,
      required: true,
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
    registerStatus: {
      type: String,
      required: false,
    },
    verifyEmailStatus: {
      type: String,
      required: false,
    },
    resetToken: {
      type: String,
      required: false,
      default: '',
    },
    profileStatus: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
