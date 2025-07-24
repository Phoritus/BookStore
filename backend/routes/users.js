const express = require('express');
const { getOne, update } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getOne(
      'SELECT id, email, phone, national_id, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile retrieved successfully',
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get booking statistics
    const stats = await getOne(
      `SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
        SUM(CASE WHEN status = 'completed' THEN final_price ELSE 0 END) as total_spent,
        SUM(CASE WHEN status = 'completed' THEN total_hours ELSE 0 END) as total_hours
       FROM bookings 
       WHERE user_id = ?`,
      [userId]
    );

    res.json({
      message: 'User statistics retrieved successfully',
      stats: {
        totalBookings: stats.total_bookings || 0,
        completedBookings: stats.completed_bookings || 0,
        pendingBookings: stats.pending_bookings || 0,
        cancelledBookings: stats.cancelled_bookings || 0,
        totalSpent: parseFloat(stats.total_spent || 0),
        totalHours: parseInt(stats.total_hours || 0)
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve user statistics' });
  }
});

module.exports = router;
