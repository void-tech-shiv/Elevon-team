const express = require('express');
const router = express.Router();
const { verifyStudent } = require('../middleware/auth');
const Project = require('../models/Project');

// Public route to get all approved projects (Showcase)
router.get('/showcase', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'approved' })
      .populate('studentId', 'name studentId department')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new project (Student only)
router.post('/', verifyStudent, async (req, res) => {
  try {
    const { title, description, githubLink, demoLink, pdfLink } = req.body;
    console.log("UPLOAD_RECEIVED:", { title, studentId: req.user.id });
    const project = new Project({
      studentId: req.user.id,
      title,
      description,
      githubLink,
      demoLink,
      pdfLink,
      status: 'pending'
    });

    await project.save();
    console.log("DB_INSERT_SUCCESS:", project._id);
    console.log("PROJECT_STATUS_PENDING:", project._id);
    res.status(201).json({ message: 'Project uploaded successfully. Waiting for admin approval.', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
