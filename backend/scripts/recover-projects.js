require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

async function recoverProjects() {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGO_URI ? 'URI FOUND' : 'NO URI');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elevon');
    console.log('Connected to DB.');

    const result = await Project.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }, { status: 'Pending' }, { status: '' }] },
      { $set: { status: 'pending' } }
    );

    console.log(`Recovery Complete: ${result.modifiedCount} old projects updated to 'pending'.`);
  } catch (error) {
    console.error('Recovery failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

recoverProjects();
