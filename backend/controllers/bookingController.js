// ==========================================================
// BOOKING CONTROLLER (MYSQL DIRECT INTEGRATION)
// ==========================================================

const db = require('../config/db');

// Helper to map join query rows to frontend objects
const mapDbBookingToFrontend = (r) => {
  return {
    id: r.pnr.toString(),
    pnr: r.pnr.toString(),
    trainId: r.train_no.toString(),
    trainName: r.train_name || 'Special Express',
    trainNumber: r.train_no.toString(),
    source: r.source || 'Station A',
    destination: r.destination || 'Station B',
    passengerName: r.passengerName,
    passengerAge: r.passengerAge,
    passengerGender: r.passengerGender,
    journeyDate: r.journey_date ? new Date(r.journey_date).toISOString().split('T')[0] : '',
    seatNumber: r.seat_no ? `Seat ${r.seat_no}` : 'N/A',
    status: r.status || 'Confirmed',
    fare: parseFloat(r.fare || 1000)
  };
};

// GET /api/bookings
const getBookings = async (req, res) => {
  try {
    console.log('[DATABASE] Fetching bookings registry from MySQL...');
    
    // Join query over Tickets, Passengers, and Trains to fetch complete booking data
    const [rows] = await db.query(`
      SELECT 
        t.PNR_No AS pnr,
        t.Passenger_ID AS passenger_id,
        t.Train_No AS train_no,
        t.Journey_Date AS journey_date,
        t.Seat_No AS seat_no,
        t.Fare AS fare,
        t.Status AS status,
        p.Name AS passengerName,
        p.Age AS passengerAge,
        p.Gender AS passengerGender,
        tr.Train_Name AS train_name,
        tr.Source_Station AS source,
        tr.Destination_Station AS destination
      FROM Tickets t
      LEFT JOIN Passengers p ON t.Passenger_ID = p.Passenger_ID
      LEFT JOIN Trains tr ON t.Train_No = tr.Train_No
      ORDER BY t.PNR_No DESC
    `);

    const bookings = rows.map(mapDbBookingToFrontend);

    return res.json({
      success: true,
      message: 'Bookings successfully fetched from MySQL',
      bookings: bookings
    });
  } catch (error) {
    console.error('[DATABASE ERROR] getBookings failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings from database.',
      error: error.message
    });
  }
};

// POST /api/bookings
const createBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { trainId, passengerName, passengerAge, passengerGender, journeyDate } = req.body;
    console.log(`[DATABASE] Creating booking in MySQL for Train=${trainId}, Passenger=${passengerName}`);

    if (!trainId || !passengerName || !passengerAge || !passengerGender || !journeyDate) {
      return res.status(400).json({
        success: false,
        message: 'All booking fields (trainId, passengerName, passengerAge, passengerGender, journeyDate) are required.'
      });
    }

    const trainNo = parseInt(trainId);
    
    // Begin database transaction
    await connection.beginTransaction();

    // 1. Generate next Passenger_ID (COALESCE handles empty tables)
    const [[passengerIdRes]] = await connection.query(
      'SELECT COALESCE(MAX(Passenger_ID), 0) + 1 AS nextId FROM Passengers'
    );
    const nextPassengerId = passengerIdRes.nextId;

    // 2. Generate next PNR_No (starts at 5000)
    const [[pnrRes]] = await connection.query(
      'SELECT COALESCE(MAX(PNR_No), 5000) + 1 AS nextPnr FROM Tickets'
    );
    const nextPnr = pnrRes.nextPnr;

    // 3. Generate Seat_No (count existing bookings on this date for this train + 1)
    const [[seatsRes]] = await connection.query(
      'SELECT COUNT(*) AS booked FROM Tickets WHERE Train_No = ? AND Journey_Date = ?',
      [trainNo, journeyDate]
    );
    const nextSeatNo = seatsRes.booked + 1;

    // 4. Resolve Train details and fare
    const defaultFares = { 101: 1500, 102: 1300, 103: 1800, 104: 900, 105: 1200 };
    const fare = defaultFares[trainNo] || 1000;

    // 5. Insert Passenger details
    await connection.query(
      'INSERT INTO Passengers (Passenger_ID, Name, Age, Gender) VALUES (?, ?, ?, ?)',
      [nextPassengerId, passengerName, parseInt(passengerAge), passengerGender]
    );

    // 6. Insert Ticket details. Status is sent as NULL so that the MySQL trigger (trg_ticket_status) 
    //    can automatically assign 'Confirmed' or 'Waiting' based on seat availability!
    await connection.query(
      'INSERT INTO Tickets (PNR_No, Train_No, Passenger_ID, Journey_Date, Seat_No, Fare, Status) VALUES (?, ?, ?, ?, ?, ?, NULL)',
      [nextPnr, trainNo, nextPassengerId, journeyDate, nextSeatNo, fare]
    );

    // Commit Transaction
    await connection.commit();

    // 7. Fetch the newly created booking joining the fields (showing the status updated by the SQL trigger)
    const [[newBooking]] = await db.query(`
      SELECT 
        t.PNR_No AS pnr,
        t.Passenger_ID AS passenger_id,
        t.Train_No AS train_no,
        t.Journey_Date AS journey_date,
        t.Seat_No AS seat_no,
        t.Fare AS fare,
        t.Status AS status,
        p.Name AS passengerName,
        p.Age AS passengerAge,
        p.Gender AS passengerGender,
        tr.Train_Name AS train_name,
        tr.Source_Station AS source,
        tr.Destination_Station AS destination
      FROM Tickets t
      LEFT JOIN Passengers p ON t.Passenger_ID = p.Passenger_ID
      LEFT JOIN Trains tr ON t.Train_No = tr.Train_No
      WHERE t.PNR_No = ?
    `, [nextPnr]);

    const result = mapDbBookingToFrontend(newBooking);

    return res.json({
      success: true,
      message: 'Booking successfully stored in MySQL database',
      booking: result
    });
  } catch (error) {
    // Rollback transaction on failure
    await connection.rollback();
    console.error('[DATABASE ERROR] createBooking transaction failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store booking in database.',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// DELETE /api/bookings/:id
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const pnrNo = parseInt(id);
    
    console.log(`[DATABASE] Cancelling booking PNR in MySQL: ${pnrNo}`);

    // Update status in Tickets table to 'Cancelled'
    const [result] = await db.query(
      'UPDATE Tickets SET Status = "Cancelled" WHERE PNR_No = ?',
      [pnrNo]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket with PNR ${pnrNo} not found.`
      });
    }

    // Retrieve the updated cancelled ticket
    const [[cancelledRow]] = await db.query(`
      SELECT 
        t.PNR_No AS pnr,
        t.Passenger_ID AS passenger_id,
        t.Train_No AS train_no,
        t.Journey_Date AS journey_date,
        t.Seat_No AS seat_no,
        t.Fare AS fare,
        t.Status AS status,
        p.Name AS passengerName,
        p.Age AS passengerAge,
        p.Gender AS passengerGender,
        tr.Train_Name AS train_name,
        tr.Source_Station AS source,
        tr.Destination_Station AS destination
      FROM Tickets t
      LEFT JOIN Passengers p ON t.Passenger_ID = p.Passenger_ID
      LEFT JOIN Trains tr ON t.Train_No = tr.Train_No
      WHERE t.PNR_No = ?
    `, [pnrNo]);

    const bookingResult = mapDbBookingToFrontend(cancelledRow);

    return res.json({
      success: true,
      message: 'Booking successfully updated to Cancelled in MySQL database',
      booking: bookingResult
    });
  } catch (error) {
    console.error('[DATABASE ERROR] cancelBooking failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking in database.',
      error: error.message
    });
  }
};

module.exports = {
  getBookings,
  createBooking,
  cancelBooking
};
