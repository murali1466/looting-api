const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const auth = require('../controllers/authController');

router.post('/register',auth.register);
router.post('/login',auth.login);
router.get('/confirm/:token',auth.confirmAccount);
router.post('/forgot-password',auth.forgotPassword)
router.post('/reset-password/:token',auth.resetPassword); 

module.exports = router;

// const express = require('express');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');

// const app = express();
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.once('open', () => console.log('Connected to MongoDB'));

// const userSchema = new mongoose.Schema({
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     isVerified: { type: Boolean, default: false },
//     resetPasswordToken: String,
//     resetPasswordExpires: Date
// });

// const User = mongoose.model('User', userSchema);

// // Register API
// app.post('/register', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ email, password: hashedPassword });
//         // Send confirmation email
//         const verificationToken = crypto.randomBytes(20).toString('hex');
//         user.resetPasswordToken = verificationToken;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//         await user.save();
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'your_email@gmail.com',
//                 pass: 'your_password'
//             }
//         });
//         const mailOptions = {
//             from: 'your_email@gmail.com',
//             to: user.email,
//             subject: 'Account Confirmation',
//             text: `Please click on the following link to confirm your account: http://localhost:3000/confirm/${verificationToken}`
//         };
//         await transporter.sendMail(mailOptions);
//         res.status(201).json({ message: 'User registered successfully. Please check your email for confirmation.' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Login API
// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         res.status(200).json({ message: 'Login successful' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Forgot Password API
// app.post('/forgot-password', async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         const resetToken = crypto.randomBytes(20).toString('hex');
//         user.resetPasswordToken = resetToken;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//         await user.save();
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'your_email@gmail.com',
//                 pass: 'your_password'
//             }
//         });
//         const mailOptions = {
//             from: 'your_email@gmail.com',
//             to: user.email,
//             subject: 'Password Reset',
//             text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n`
//                 + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
//                 + `http://localhost:3000/reset-password/${resetToken}\n\n`
//                 + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
//         };
//         await transporter.sendMail(mailOptions);
//         res.status(200).json({ message: 'Password reset instructions sent to your email' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Reset Password API
// app.post('/reset-password/:token', async (req, res) => {
//     try {
//         const { token } = req.params;
//         const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid or expired token' });
//         }
//         const { password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user.password = hashedPassword;
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;
//         await user.save();
//         res.status(200).json({ message: 'Password reset successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Confirm Account API
// app.get('/confirm/:token', async (req, res) => {
//     try {
//         const { token } = req.params;
//         const user = await User.findOneAndUpdate({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, { isVerified: true });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid or expired token' });
//         }
//         res.status(200).json({ message: 'Account verified successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

