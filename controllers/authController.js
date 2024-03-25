const userDAL = require("../dal/userDal");
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const authValidations = require("../validations/authValidations");
const config = require('../config');
const jwt = require('jsonwebtoken');
const logger = require('../services/logger');
const fs = require('fs');
const path = require('path');
const helper = require('../helper/helper');

const register = async (req, res) => {
  try {
    // Validate request body against schema
    const { error } = authValidations.registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({status:config.error_message,message: error.details[0].message });
    }
    // Check if email is already registered
    const existingUser = await user.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({status:config.error_message,error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const userData = {
      email: req.body.email,
      password: hashedPassword,
    };
    // Save the user to the database
    const newUser = await userDAL.createUser(userData);
    return res.status(201).json({ message: newUser });
  } catch (err) {
    logger.error(err)
    return res.status(500).json({status:config.error_message,message:err});
  }
};

// Joi schema for user login

// Login API endpoint
const login = async (req, res) => {
  try {
    // Validate request body against schema
    const { error } = authValidations.loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({status:config.error_message,message: error.details[0].message });
    }

    // Find the user by email
    const userFind = await user.findOne({ email: req.body.email });
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
    const token = jwt.sign({ userId: userFind._id,email:userFind.email}, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({ status: config.success_message, data: { token : token}});
  } catch (err) {
    logger(err);
    res.status(500).json({ status:config.error_message,message:err });
  }
};

const sendForgotPasswordEmail = async (email, token) => {
  try {


    // Define the directory where your templates are located
    const viewsDirectory = path.join(__dirname, 'views');
    // Read the Handlebars template file
   const source = fs.readFileSync(path.join(viewsDirectory, 'forgotPassword.hbs'), 'utf8');
    const template = handlebars.compile(source);
    // Create a reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password',
      },
    });
    // Send email
    await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: template({ resetLink: `http://yourwebsite.com/reset-password?token=${token}` }),
    });
    console.log('Forgot password email sent');
  } catch (error) {
    console.error('Error sending forgot password email:', error);
  }
};





module.exports = {
  login,
  register,
  sendForgotPasswordEmail
};
