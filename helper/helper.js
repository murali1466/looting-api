
const crypto = require('crypto');

// Function to generate a random token
const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};


// Function to generate expiration time (e.g., 15 minutes from now)
const generateExpiration = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15); // Expire after 15 minutes
    return now;
  };
  


module.exports = {
    generateToken,
    generateExpiration
}
