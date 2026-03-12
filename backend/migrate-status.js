const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');

async function migrateStatuses() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elevon';
    console.log(`Connecting to MongoDB using: ${mongoUri}`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected Successfully');

    // Find all students with uppercase statuses
    const studentsToMigrate = await Student.find({
      status: { $in: ['Pending', 'Active', 'Rejected'] }
    });

    console.log(`Found ${studentsToMigrate.length} students to migrate.`);

    let migratedCount = 0;
    for (const student of studentsToMigrate) {
      student.status = student.status.toLowerCase();
      // We use save() to trigger the pre-validate hook and other schema validations just in case
      await student.save();
      migratedCount++;
    }

    console.log(`Successfully migrated ${migratedCount} student statuses to lowercase.`);
    process.exit(0);

  } catch (err) {
    const fs = require('fs');
    let log = 'Error message: ' + err.message + '\n';
    if (err.errors) {
      log += 'Validation errors: ' + JSON.stringify(err.errors, null, 2) + '\n';
    }
    log += 'Stack: ' + err.stack + '\n';
    fs.writeFileSync('migration-error.txt', log);
    process.exit(1);
  }
}

migrateStatuses();
