const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const Resource = require('../models/Resource');

// Get all resources
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 }).populate('uploadedBy', 'username');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create resource
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, description, fileLink } = req.body;
    const resource = new Resource({
      title,
      description,
      fileLink,
      uploadedBy: req.user.id
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resource
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
