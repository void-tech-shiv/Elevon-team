require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://live-web-ek36.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log(`API_SUCCESS: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
    } else {
      console.log(`API_FAILURE: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elevon', {
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('MongoDB Connected Successfully');
  mongoose.connection.on('error', err => console.error('MongoDB Connection Error after initialization:', err));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB Disconnected! Reconnecting...'));
})
  .catch(err => {
    console.error('MongoDB Initial Connection Error:');
    console.error(err.message);
    if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
       console.error('CRITICAL: MONGO_URI missing in production Vercel environment.');
    }
  });

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

// Global Error Handling
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Production Error [Stack trace]:', err.stack || err.message);
  } else {
    console.error('Development Error:', err.stack || err.message);
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
