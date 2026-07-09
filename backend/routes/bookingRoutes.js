const express = require('express');
const router = express.Router();
const { getBookings, createBooking, cancelBooking } = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All booking routes are protected using our JWT-ready authMiddleware
router.use(authMiddleware);

// GET /api/bookings
router.get('/', getBookings);

// POST /api/bookings
router.post('/', createBooking);

// DELETE /api/bookings/:id
router.delete('/:id', cancelBooking);

module.exports = router;
