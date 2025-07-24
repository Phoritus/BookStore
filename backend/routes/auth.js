const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getOne, insert } = require('../config/database');
const { generateTokens } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),
  body('nationalId')
    .matches(/^[0-9]{13}$/)
    .withMessage('National ID must be 13 digits'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register endpoint
router.post('/register', registerValidation, async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Registration validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, phone, nationalId, firstName, lastName, password } = req.body;

    // Check if user already exists
    const existingUser = await getOne(
      'SELECT id FROM users WHERE email = ? OR phone = ? OR national_id = ?',
      [email, phone, nationalId]
    );

    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email, phone, or national ID already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const userId = await insert(
      'INSERT INTO users (email, phone, national_id, password, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)',
      [email, phone, nationalId, passwordHash, firstName, lastName]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId);

    // Get user data (without password)
    const newUser = await getOne(
      'SELECT id, email, phone, national_id, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json({
      message: 'Registration successful',
      user: newUser,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', loginValidation, async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await getOne(
      'SELECT id, email, phone, national_id, password, first_name, last_name, created_at FROM users WHERE email = ? AND status = "active"',
      [email]
    );

    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Stored hash:', user.password);
      console.log('Input password:', password);
    }

    if (!user) {
      return res.status(401).json({
        message: 'Login failed'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Login failed'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      user,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Logout endpoint (client-side token removal mainly)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
