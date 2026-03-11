const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'elevon_secret_key_123';

// Student Signup
router.post('/student/signup', async (req, res) => {
  try {
    const { name, studentId, email, department, year, password } = req.body;
    
    // Check if student exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student ID or Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = new Student({
      name,
      studentId,
      email,
      department,
      year,
      password: hashedPassword,
      status: 'Pending'
    });

    await student.save();
    res.status(201).json({ message: 'Signup successful. Account is pending admin approval.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or studentId

    // Find student
    const student = await Student.findOne({ 
      $or: [{ email: identifier }, { studentId: identifier }] 
    });

    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check status
    if (student.status === 'Pending') {
      return res.status(403).json({ message: 'Your account is waiting for teacher approval.' });
    }
    if (student.status === 'Rejected') {
      return res.status(403).json({ message: 'Your account registration was rejected.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      student: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        status: student.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during local database operation' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message || 'Server error during admin verification' });
  }
});

module.exports = router;
