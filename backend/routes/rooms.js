const express = require('express');
const { getMany, getOne } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all active rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await getMany(
      `SELECT r.id, r.room_number as name, rt.capacity, rt.hourly_rate, rt.status as is_active 
       FROM rooms r 
       JOIN room_types rt ON r.room_type_id = rt.id 
       WHERE rt.status = 'active' 
       ORDER BY rt.capacity, r.room_number`
    );

    res.json({
      message: 'Rooms retrieved successfully',
      rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Failed to retrieve rooms' });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await getOne(
      `SELECT r.id, r.room_number as name, rt.capacity, rt.hourly_rate, rt.status as is_active 
       FROM rooms r 
       JOIN room_types rt ON r.room_type_id = rt.id 
       WHERE r.id = ? AND rt.status = 'active'`,
      [id]
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      message: 'Room retrieved successfully',
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Failed to retrieve room' });
  }
});

// Check room availability for specific date/time
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Date, start time, and end time are required' 
      });
    }

    // Check if room exists
    const room = await getOne(
      `SELECT r.id, r.room_number as name 
       FROM rooms r 
       JOIN room_types rt ON r.room_type_id = rt.id 
       WHERE r.id = ? AND rt.status = 'active'`,
      [id]
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Construct full datetime strings
    const startDateTime = `${date} ${startTime}`;
    const endDateTime = `${date} ${endTime}`;

    // Check for overlapping bookings
    const conflictingBookings = await getMany(
      `SELECT id, start_time, end_time FROM bookings 
       WHERE room_id = ? 
       AND booking_status IN ('confirmed', 'pending')
       AND (
         (start_time < ? AND end_time > ?) OR
         (start_time < ? AND end_time > ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [id, startDateTime, startDateTime, endDateTime, endDateTime, startDateTime, endDateTime]
    );

    const isAvailable = conflictingBookings.length === 0;

    res.json({
      message: 'Availability checked successfully',
      room,
      isAvailable,
      requestedTime: {
        date,
        startTime,
        endTime
      },
      conflictingBookings: isAvailable ? [] : conflictingBookings
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Failed to check availability' });
  }
});

// Get all availability for a specific date
router.get('/availability/date/:date', async (req, res) => {
  try {
    const { date } = req.params;

    // Get all rooms
    const rooms = await getMany(
      `SELECT r.id, r.room_number as name, rt.capacity, rt.hourly_rate 
       FROM rooms r 
       JOIN room_types rt ON r.room_type_id = rt.id 
       WHERE rt.status = 'active'`
    );

    // Get all bookings for the date
    const bookings = await getMany(
      `SELECT room_id, start_time, end_time, booking_status as status 
       FROM bookings 
       WHERE DATE(start_time) = ? 
       AND booking_status IN ('confirmed', 'pending')
       ORDER BY room_id, start_time`,
      [date]
    );

    // Group bookings by room
    const roomBookings = {};
    bookings.forEach(booking => {
      if (!roomBookings[booking.room_id]) {
        roomBookings[booking.room_id] = [];
      }
      roomBookings[booking.room_id].push({
        startTime: booking.start_time.toTimeString().slice(0, 5),
        endTime: booking.end_time.toTimeString().slice(0, 5),
        status: booking.status
      });
    });

    // Combine room data with booking info
    const roomAvailability = rooms.map(room => ({
      ...room,
      bookings: roomBookings[room.id] || []
    }));

    res.json({
      message: 'Room availability retrieved successfully',
      date,
      rooms: roomAvailability
    });

  } catch (error) {
    console.error('Get date availability error:', error);
    res.status(500).json({ message: 'Failed to retrieve availability' });
  }
});

// Get current status of all rooms
router.get('/status/current', async (req, res) => {
  try {
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().split('T')[0];
    const currentTimeStr = currentTime.toTimeString().slice(0, 8);

    // Get all rooms with room type information
    const rooms = await getMany(
      `SELECT r.id, r.room_number as name, rt.capacity, rt.hourly_rate, r.status
       FROM rooms r 
       JOIN room_types rt ON r.room_type_id = rt.id 
       WHERE rt.status = 'active'`
    );

    // Get current and upcoming bookings for today
    const bookings = await getMany(
      `SELECT room_id, start_time, end_time, booking_status, user_id
       FROM bookings 
       WHERE DATE(booking_date) = ? 
       AND booking_status = 'confirmed'
       AND end_time > ?
       ORDER BY room_id, start_time`,
      [currentDate, currentTimeStr]
    );

    // Determine status for each room
    const roomsWithStatus = rooms.map(room => {
      const roomBookings = bookings.filter(b => b.room_id === room.id);
      
      let currentStatus = 'available';
      let currentBooking = null;
      let nextBooking = null;

      // Check if room is currently occupied
      const activeBooking = roomBookings.find(booking => {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(booking.end_time);
        return currentTime >= startTime && currentTime <= endTime;
      });

      if (activeBooking) {
        currentStatus = 'occupied';
        currentBooking = {
          startTime: activeBooking.start_time.toTimeString().slice(0, 5),
          endTime: activeBooking.end_time.toTimeString().slice(0, 5),
          userId: activeBooking.user_id
        };
      } else {
        // Check for upcoming booking
        const upcomingBooking = roomBookings.find(booking => {
          const startTime = new Date(booking.start_time);
          return startTime > currentTime;
        });

        if (upcomingBooking) {
          const startTime = new Date(upcomingBooking.start_time);
          const timeDiff = (startTime - currentTime) / (1000 * 60 * 60); // hours
          
          if (timeDiff <= 1) { // Next booking within an hour
            currentStatus = 'upcoming';
          }
          
          nextBooking = {
            startTime: upcomingBooking.start_time.toTimeString().slice(0, 5),
            endTime: upcomingBooking.end_time.toTimeString().slice(0, 5),
            userId: upcomingBooking.user_id
          };
        }
      }

      return {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        hourlyRate: room.hourly_rate,
        currentStatus,
        currentBooking,
        nextBooking
      };
    });

    res.json({
      message: 'Current room status retrieved successfully',
      currentTime: currentTime.toISOString(),
      rooms: roomsWithStatus
    });

  } catch (error) {
    console.error('Get current status error:', error);
    res.status(500).json({ message: 'Failed to retrieve current status' });
  }
});

module.exports = router;
