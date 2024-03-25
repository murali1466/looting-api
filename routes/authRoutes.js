const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const auth = require('../controllers/authController');

router.post('/register',auth.register);
router.post('/login',auth.login);

module.exports = router;
