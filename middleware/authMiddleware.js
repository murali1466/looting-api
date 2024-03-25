const jwt = require('jsonwebtoken');
const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers.Authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, config.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;
