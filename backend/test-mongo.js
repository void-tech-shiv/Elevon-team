require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elevon', { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB! Network access is allowed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED: Could not connect to MongoDB. Error details:');
    console.error(err.message);
    process.exit(1);
  });
