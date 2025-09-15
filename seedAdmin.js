const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('✅ Admin created:', admin);
  process.exit();
}

createAdmin();
