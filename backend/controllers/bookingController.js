// ==========================================================
// BOOKING CONTROLLER (DUMMY/PLACEHOLDER)
// ==========================================================

// TODO:
// Fetch data from RailwayDB and modify tables
// Replace this in-memory list with database queries.

const { mockTrains } = require('./trainController');

// In-memory bookings registry to allow live interactions during review
let mockBookings = [
  {
    id: 'B1001',
    pnr: '4829104829',
    trainId: 'T101',
    trainName: 'Rajdhani Express',
    trainNumber: '12429',
    source: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    passengerName: 'John Passenger',
    passengerAge: 32,
    passengerGender: 'Male',
    passengerPhone: '9876543210',
    journeyDate: '2026-07-15',
    seatNumber: 'B3-14 (Lower Berth)',
    status: 'Confirmed',
    fare: 2450
  },
  {
    id: 'B1002',
    pnr: '8392019482',
    trainId: 'T102',
    trainName: 'Shatabdi Express',
    trainNumber: '12004',
    source: 'New Delhi (NDLS)',
    destination: 'Lucknow Charbagh (LKO)',
    passengerName: 'Sarah Smith',
    passengerAge: 28,
    passengerGender: 'Female',
    passengerPhone: '9123456789',
    journeyDate: '2026-07-18',
    seatNumber: 'C1-45 (Chair)',
    status: 'Waiting',
    fare: 1150
  }
];

// GET /api/bookings
const getBookings = async (req, res) => {
  try {
    console.log('[BOOKINGS] Fetching bookings registry');
    
    // In a real application, we might filter by user: req.user.id
    // But since this is a demonstration, we will return all bookings.
    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      bookings: mockBookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { trainId, passengerName, passengerAge, passengerGender, passengerPhone, journeyDate } = req.body;
    
    console.log(`[BOOKINGS] Reservation request: Train=${trainId}, Name=${passengerName}`);

    if (!trainId || !passengerName || !passengerAge || !passengerGender || !passengerPhone || !journeyDate) {
      return res.status(400).json({
        success: false,
        message: 'All booking fields (trainId, passengerName, passengerAge, passengerGender, passengerPhone, journeyDate) are required.'
      });
    }

    // Resolve train details (name, fare)
    const train = mockTrains.find(t => t.id === trainId) || {
      name: 'Special Express',
      number: '00000',
      source: 'Custom Station A',
      destination: 'Custom Station B',
      fare: 500
    };

    // Generate random mock ticket metadata
    const randomPnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const mockSeat = `B${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 64) + 1}`;
    const newBookingId = `B${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: newBookingId,
      pnr: randomPnr,
      trainId,
      trainName: train.name,
      trainNumber: train.number,
      source: train.source,
      destination: train.destination,
      passengerName,
      passengerAge: parseInt(passengerAge),
      passengerGender,
      passengerPhone,
      journeyDate,
      seatNumber: mockSeat,
      status: 'Confirmed',
      fare: train.fare
    };

    mockBookings.push(newBooking);

    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /api/bookings/:id
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[BOOKINGS] Request to cancel booking ID: ${id}`);

    const bookingIndex = mockBookings.findIndex(b => b.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID ${id} not found.`
      });
    }

    // Mark as Cancelled or remove it. Let's mark as Cancelled for richer status details:
    mockBookings[bookingIndex].status = 'Cancelled';
    const cancelledBooking = mockBookings[bookingIndex];

    // Alternatively, we could filter it out:
    // mockBookings = mockBookings.filter(b => b.id !== id);

    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      booking: cancelledBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getBookings,
  createBooking,
  cancelBooking
};
