// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    req.user = verified; // Set the user object to req.user
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = { verifyToken };
