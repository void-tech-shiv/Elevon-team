const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const Project = require('../models/Project');

// Get all projects
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const projects = await Project.find().populate('studentId', 'name studentId department year').sort({ createdAt: -1 });
    console.log("ADMIN_FETCH_COUNT:", projects.length);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending projects only
router.get('/pending', verifyAdmin, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'pending' }).populate('studentId', 'name studentId department year').sort({ createdAt: -1 });
    console.log("ADMIN_PENDING_FETCH_COUNT:", projects.length);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project status (Approve / Reject) - Generic
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('studentId', 'name studentId');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log("APPROVAL_UPDATED:", { id: project._id, status: project.status });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve project
router.put('/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('studentId', 'name studentId');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    console.log("PROJECT_APPROVED:", project._id);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject project
router.put('/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('studentId', 'name studentId');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    console.log("PROJECT_REJECTED:", project._id);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
