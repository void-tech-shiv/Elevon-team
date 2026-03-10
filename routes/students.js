const express = require('express');
const router = express.Router();
const { verifyStudent } = require('../middleware/auth');
const Student = require('../models/Student');
const Project = require('../models/Project');

// Get current student profile
router.get('/profile', verifyStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile', verifyStudent, async (req, res) => {
  try {
    // Only allow updating certain fields
    const { phone, bio, skills, profileImage } = req.body;
    
    // Convert comma-separated string to array if necessary, or just use array
    const parsedSkills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { phone, bio, skills: parsedSkills, profileImage },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get projects for current student
router.get('/projects', verifyStudent, async (req, res) => {
  try {
    const projects = await Project.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
