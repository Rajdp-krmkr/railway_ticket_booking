// ==========================================================
// AUTH CONTROLLER (DUMMY/PLACEHOLDER)
// ==========================================================

// TODO:
// Fetch data from RailwayDB and verify credentials using bcrypt
// Replace dummy responses with database query actions.

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`[AUTH] Login attempt for: ${email}`);

    // Simple dummy authentication logic
    if (email === 'admin@railway.com') {
      return res.json({
        success: true,
        message: 'Replace this with MySQL query',
        token: 'dummy-admin-token',
        user: {
          id: 99,
          name: 'Admin Officer',
          email: 'admin@railway.com',
          role: 'admin'
        }
      });
    }

    // Default mock passenger user
    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      token: 'dummy-user-token',
      user: {
        id: 1,
        name: 'John Passenger',
        email: email || 'passenger@railway.com',
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`[AUTH] Registration request for: ${email}`);

    // TODO:
    // Insert new user into RailwayDB with hashed password
    
    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      user: {
        id: Math.floor(Math.random() * 1000) + 10,
        name: name || 'New User',
        email: email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  login,
  register
};
