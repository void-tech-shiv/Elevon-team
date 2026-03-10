const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  profileImage: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Active', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
