const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const Notice = require('../models/Notice');

// Get all notices
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notice
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const notice = new Notice({
      title: req.body.title,
      message: req.body.message
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notice
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
