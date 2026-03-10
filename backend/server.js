require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elevon')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes Configuration
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/admin/students', require('./routes/students.admin'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/admin/projects', require('./routes/projects.admin'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/admin/resources', require('./routes/resources.admin'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/admin/notices', require('./routes/notices.admin'));
app.use('/api/upload', require('./routes/upload'));

app.get('/', (req, res) => {
  res.send('Elevon API is running');
});

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
