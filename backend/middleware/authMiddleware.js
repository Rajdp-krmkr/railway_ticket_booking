const jwt = require('jsonwebtoken');

/**
 * JWT-ready authentication middleware structure.
 * Currently, for testing purposes, it allows proceeding with dummy user details
 * if no token is present, but has the complete structural scaffolding for real JWT verification.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    // Structural warning: No token provided.
    // For demo/development without DB setup, we can default to a dummy user if requested
    // or return a 401. Let's inspect if a token exists:
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No token provided. Include "Authorization: Bearer <token>" header.'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Invalid token format.'
    });
  }

  try {
    // TODO: Connect your RailwayDB database and verify user here
    // In production:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforrailwaybooking');
    // req.user = decoded;
    
    // For now, we will decode the dummy token if it contains JSON or just assign dummy data
    if (token === 'dummy-user-token') {
      req.user = { id: 1, name: 'John Passenger', email: 'passenger@railway.com', role: 'user' };
    } else if (token === 'dummy-admin-token') {
      req.user = { id: 99, name: 'Admin Officer', email: 'admin@railway.com', role: 'admin' };
    } else {
      // Decode attempt
      try {
        const decoded = jwt.decode(token);
        req.user = decoded || { id: 1, role: 'user' };
      } catch (err) {
        req.user = { id: 1, role: 'user' };
      }
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

/**
 * Middleware to restrict route to admin role only
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Administrator role required.'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
