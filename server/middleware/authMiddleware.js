const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          error: 'User not found',
          redirectTo: '/register'  // Signal that frontend should redirect
        });
      }

      req.user = user;
      next();
    } catch (err) {
      // Handle different error cases
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Session expired', 
          redirectTo: '/login' 
        });
      }
      return res.status(401).json({ 
        error: 'Not authorized',
        redirectTo: '/register'  // Signal that frontend should redirect
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided',
      redirectTo: '/register'  // Signal that frontend should redirect
    });
  }
};

module.exports = { protect };
