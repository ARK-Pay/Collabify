const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to validate authentication token
const tokenValidation = (req, res, next) => {
  const token = req.headers['authorization'];

  // Return 401 if no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    // Verify token and extract user_id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.user_id; // Attach userId to request
    next(); // Proceed to the next handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { tokenValidation };
