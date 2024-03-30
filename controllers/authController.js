const userDAL = require("../dal/userDal");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authValidations = require("../validations/authValidations");
const config = require('../config');
const jwt = require('jsonwebtoken');
const logger = require('../services/logger');
const nodemailer = require('nodemailer');
const crypto = require('crypto');




const register = async (req, res) => {
  try {
    const { error } = authValidations.registerSchema.validate(req.body); // Validate request body against schema
    if (error) {
      return res.status(400).json({status:config.error_message,message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email: req.body.email }); // Check if email is already registered
    if (existingUser) {
      return res.status(400).json({status:config.error_message,error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //Hash the password
    const verificationToken = crypto.randomBytes(20).toString('hex');
    // Create a new user
    const userData = {
      email: req.body.email,
      password: hashedPassword,
      userType:'credential',
      resetPasswordToken : verificationToken,
      resetPasswordExpires : Date.now() + 3600000 // 1 hour
    };
    // Save the user to the database
    await userDAL.createUser(userData);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD
      }
  });
  const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: req.body.email,
      subject: 'Account Confirmation',
      text: `Please click on the following link to confirm your account: http://localhost:3000/confirm/${verificationToken}`
  };
  await transporter.sendMail(mailOptions);
  return res.status(201).json({status : config.success_message, message: 'User registered successfully,Please check'});
  } catch (err) {
    logger.error(err)
    return res.status(500).json({status:config.error_message,message:err});
  }
};


const confirmAccount = async (req, res) => {
  try {
      const { token } = req.params;
      const userData = await User.findOneAndUpdate({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } },{ isVerified: true });
      if (!userData) {
          return res.status(400).json({ message: 'Invalid or expired token' });
      }
      if(userData.isVerified === true){
        return res.status(200).json({ status:config.success_message, message: 'User Verfied' });
      }
      res.status(200).json({ message: 'Account verified successfully' });
  } catch (err) {
      res.status(500).json({ status: config.error_message,message: err });
  }
}

const login = async (req, res) => {
  try {
    const { error } = authValidations.loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({status:config.error_message,message: error.details[0].message });
    }
    // Find the user by email
    const userFind = await User.findOne({ email: req.body.email });
    if (!userFind) {
      return res.status(401).json({status:config.error_message,message: "Invalid email or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userFind.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if(userFind.isVerified === false){
      return res.status(400).json({status:config.error_message,message: 'Confirm Your Account' })
    }
    const token = jwt.sign({ userId: userFind._id,email:userFind.email}, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({ status: config.success_message, data: { token : token}});
  } catch (err) {
    logger(err);
    res.status(500).json({ status:config.error_message,message:err });
  }
};

const forgotPassword = async (req,res) => {
  try {
    const {error} = authValidations.forgotPasswordSchema.validate(req.body)
    if(error){
      return res.status(400).json({status:config.error_message,message: error.details[0].message })
    }
    const user = await userDAL.getUserByEmail(req.body.email);
    if(!user){
      return res.status(400).json({status:config.error_message,message: 'User with this email does not exists' });
    }
    if(user.userType !== 'credential'){
      return res.status(400).json({status:config.error_message,message: `Cannot change login  ${user.userType} account password` });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: req.body.email,
      subject: 'Password Reset Request',
      html: `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <p>http://localhost:3000/reset-password/${resetToken}</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    });
    return res.status(200).json({status:config.success_message,message:"Reset password email sent"})
  } catch (err) {
    console.error('Error sending forgot password email:', err);
  }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        // Find the user with the provided reset password token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and reset token
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const passport = require('passport');
const User = require('../models/user');
const authValidations = require('../validations/authValidations');
const config = require('../config');
const jwt = require('jsonwebtoken');
const logger = require('../services/logger');

// Register using Google
const registerWithGoogle = async (req, res) => {
  // Handle registration using data obtained from Google authentication
  // You can access user data from req.user
  try {
    const user = req.user; // Assuming user data is available after successful Google authentication
    // Check if user exists in your database, if not, create one
    let existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      // Create a new user
      existingUser = await User.create({
        email: user.email,
        // Other user data you want to save
      });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    // Return token to the client
    res.status(200).json({ status: config.success_message, data: { token } });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: config.error_message, message: error.message });
  }
};

// Register using Facebook
const registerWithFacebook = async (req, res) => {
  // Handle registration using data obtained from Facebook authentication
  // You can access user data from req.user
  try {
    const user = req.user; // Assuming user data is available after successful Facebook authentication
    // Check if user exists in your database, if not, create one
    let existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      // Create a new user
      existingUser = await User.create({
        email: user.email,
        // Other user data you want to save
      });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    // Return token to the client
    res.status(200).json({ status: config.success_message, data: { token } });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: config.error_message, message: error.message });
  }
};

const logoUpdate = async ()=>{

}


module.exports = {
  register,
  confirmAccount,
  login,
  forgotPassword,
  resetPassword,
  registerWithGoogle,
  registerWithFacebook,
  logoUpdate
};
