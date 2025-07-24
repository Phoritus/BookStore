const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getOne } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Get fresh user data from database
    const user = await getOne(
      'SELECT id, email, phone, national_id, created_at, status FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const generateTokens = (userId) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

module.exports = {
  authenticateToken,
  generateTokens
};
