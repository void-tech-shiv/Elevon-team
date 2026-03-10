const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'elevon_secret_key_123';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
  });
};

const verifyStudent = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'student') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Student privileges required.' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin, verifyStudent };
