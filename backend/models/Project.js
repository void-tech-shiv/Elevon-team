const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  githubLink: { type: String, default: '' },
  demoLink: { type: String, default: '' },
  pdfLink: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
