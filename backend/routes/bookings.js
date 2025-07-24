const express = require('express');
const QRCode = require('qrcode');
const { body, validationResult } = require('express-validator');
const { getMany, getOne, insert, update } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Booking validation rules
const bookingValidation = [
  body('roomId').isInt({ min: 1 }).withMessage('Valid room ID required'),
  body('date').isDate().withMessage('Valid date required (YYYY-MM-DD)'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required (HH:MM)')
];

// Calculate booking price and discount
const calculateBookingPrice = (hours, pricePerHour) => {
  const totalPrice = hours * pricePerHour;
  const discountPercent = hours >= 5 ? 15 : 0;
  const discountAmount = (totalPrice * discountPercent) / 100;
  const finalPrice = totalPrice - discountAmount;

  return {
    totalHours: hours,
    totalPrice,
    discountPercent,
    discountAmount,
    finalPrice
  };
};

// Create a new booking
router.post('/', authenticateToken, bookingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { roomId, date, startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    // Validate time range
    const startDateTime = new Date(`${date} ${startTime}`);
    const endDateTime = new Date(`${date} ${endTime}`);
    
    if (endDateTime <= startDateTime) {
      return res.status(400).json({
        message: 'End time must be after start time'
      });
    }

    // Calculate hours
    const hours = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60));
    
    if (hours > 12) {
      return res.status(400).json({
        message: 'Maximum booking duration is 12 hours'
      });
    }

    // Check if room exists
    const room = await getOne(
      `SELECT r.id, r.room_number as name, rt.hourly_rate 
       FROM rooms r 
       JOIN room_types rt ON r.room_type_id = rt.id 
       WHERE r.id = ? AND rt.status = 'active'`,
      [roomId]
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check availability
    const conflictingBookings = await getMany(
      `SELECT id FROM bookings 
       WHERE room_id = ? 
       AND booking_status IN ('confirmed', 'pending')
       AND (
         (start_time < ? AND end_time > ?) OR
         (start_time < ? AND end_time > ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [roomId, startDateTime, startDateTime, endDateTime, endDateTime, startDateTime, endDateTime]
    );

    if (conflictingBookings.length > 0) {
      return res.status(409).json({
        message: 'Room is not available for the selected time'
      });
    }

    // Calculate pricing
    const pricing = calculateBookingPrice(hours, room.hourly_rate);

    // Create booking
    const bookingId = await insert(
      `INSERT INTO bookings 
       (user_id, room_id, start_time, end_time, total_hours, total_price, discount_percent, final_price, notes, booking_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId, 
        roomId, 
        startDateTime, 
        endDateTime, 
        pricing.totalHours, 
        pricing.totalPrice, 
        pricing.discountPercent, 
        pricing.finalPrice,
        notes || null
      ]
    );

    // Generate QR code
    const qrData = JSON.stringify({
      bookingId,
      userId,
      roomId,
      roomName: room.name,
      date,
      startTime,
      endTime
    });

    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // Update booking with QR code
    await update(
      'UPDATE bookings SET qr_code = ? WHERE id = ?',
      [qrCodeUrl, bookingId]
    );

    // Get complete booking data
    const booking = await getOne(
      `SELECT b.*, r.name as room_name, u.email, u.phone 
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = ?`,
      [bookingId]
    );

    // Emit real-time update via Socket.IO
    const io = req.app.locals.io;
    if (io) {
      io.to(`room-${roomId}`).emit('booking-created', {
        roomId,
        booking: {
          id: bookingId,
          startTime: startDateTime,
          endTime: endDateTime,
          status: 'pending'
        }
      });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      pricing
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let { status, limit = 10, offset = 0 } = req.query;
    
    // Parse and validate limit and offset
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);
    
    // Set defaults if parsing fails
    const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;
    const finalOffset = isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;

    let whereClause = 'WHERE b.user_id = ?';
    let params = [userId];

    if (status) {
      whereClause += ' AND b.booking_status = ?';
      params.push(status);
    }

    // Add limit and offset directly to query (not as placeholders)
    const query = `SELECT b.*, r.room_number as room_name, rt.capacity, rt.description
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN room_types rt ON r.room_type_id = rt.id
       ${whereClause}
       ORDER BY b.booking_date DESC, b.start_time DESC
       LIMIT ${finalLimit} OFFSET ${finalOffset}`;

    const bookings = await getMany(query, params);

    res.json({
      message: 'Bookings retrieved successfully',
      bookings
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await getOne(
      `SELECT b.*, r.name as room_name, r.capacity, r.description, r.hourly_rate
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.id = ? AND b.user_id = ?`,
      [id, userId]
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking retrieved successfully',
      booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Failed to retrieve booking' });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if booking exists and belongs to user
    const booking = await getOne(
      'SELECT id, room_id, booking_status as status, start_time FROM bookings WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    // Check if booking can be cancelled (e.g., at least 1 hour before start time)
    const now = new Date();
    const startTime = new Date(booking.start_time);
    const hoursBefore = (startTime - now) / (1000 * 60 * 60);

    if (hoursBefore < 1) {
      return res.status(400).json({ 
        message: 'Cannot cancel booking less than 1 hour before start time' 
      });
    }

    // Cancel booking
    await update(
      'UPDATE bookings SET booking_status = ?, payment_status = ? WHERE id = ?',
      ['cancelled', 'refunded', id]
    );

    // Emit real-time update
    const io = req.app.locals.io;
    if (io) {
      io.to(`room-${booking.room_id}`).emit('booking-cancelled', {
        roomId: booking.room_id,
        bookingId: id
      });
    }

    res.json({
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

module.exports = router;
