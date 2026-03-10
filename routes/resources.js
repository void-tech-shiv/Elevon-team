const express = require('express');
const router = express.Router();
const { verifyStudent } = require('../middleware/auth');
const Resource = require('../models/Resource');

// Get all resources for students
router.get('/', verifyStudent, async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 }).populate('uploadedBy', 'username');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
