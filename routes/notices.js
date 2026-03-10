const express = require('express');
const router = express.Router();
const { verifyStudent } = require('../middleware/auth');
const Notice = require('../models/Notice');

// Get all notices for students
router.get('/', verifyStudent, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
