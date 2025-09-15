const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middleware/auth');

const allowAdminRegister = process.env.ALLOW_ADMIN_REGISTER === 'true';

if (allowAdminRegister) {
  // One-time public admin registration
  router.post('/register', register);
} else {
  // Admin-only register after lock
  router.post('/register', protect, adminOnly, register);
}

router.post('/login', login);

module.exports = router;
