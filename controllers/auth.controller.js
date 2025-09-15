
// REGISTER USER
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if this is the very first user in the DB
    const userCount = await User.countDocuments();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Admin registration is locked except for first user
    if (role === 'admin') {
      if (process.env.ALLOW_ADMIN_REGISTER !== 'true' && userCount > 0) {
        return res.status(403).json({
          success: false,
          message: 'Admin registration is disabled',
        });
      }
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// LOGIN USER
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
