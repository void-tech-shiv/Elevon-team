const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elevon')
  .then(async () => {
    console.log('MongoDB Connected');
    
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new Admin({
        username: 'admin',
        password: hashedPassword
      });
      await newAdmin.save();
      console.log('Default admin created: admin / admin123');
    } else {
      console.log('Admin already exists');
    }
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
