// ==========================================================
// TRAIN CONTROLLER (MYSQL DIRECT INTEGRATION)
// ==========================================================

const db = require('../config/db');

/**
 * Helper function to map MySQL `trains` row schema to 
 * the keys and properties expected by the React frontend interface.
 */
const mapDbTrainToFrontend = (t) => {
  // Fares aligned with the existing ticket records in the database
  const defaultFares = {
    101: 1500,
    102: 1300,
    103: 1800,
    104: 900,
    105: 1200
  };

  // Schedule times aligned with typical routes
  const defaultTimes = {
    101: { dep: '16:55', arr: '08:35', dur: '15h 40m' },
    102: { dep: '06:10', arr: '12:40', dur: '06h 30m' },
    103: { dep: '16:15', arr: '10:30', dur: '18h 15m' },
    104: { dep: '15:55', arr: '08:10', dur: '16h 15m' },
    105: { dep: '07:15', arr: '10:25', dur: '03h 10m' }
  };

  const trainNo = t.Train_No;
  const time = defaultTimes[trainNo] || { dep: '08:00', arr: '16:00', dur: '08h 00m' };

  return {
    id: trainNo.toString(),
    name: t.Train_Name,
    number: trainNo.toString(),
    source: t.Source_Station,
    destination: t.Destination_Station,
    departure: time.dep,
    arrival: time.arr,
    duration: time.dur,
    availableSeats: t.Total_Seats || 100,
    fare: defaultFares[trainNo] || 1000,
    classes: ['AC 3-Tier (3A)', 'Sleeper Class (SL)'],
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };
};

// GET /api/trains
const getAllTrains = async (req, res) => {
  try {
    console.log('[DATABASE] Fetching all trains from MySQL...');
    const [rows] = await db.query('SELECT * FROM trains');
    
    const mappedTrains = rows.map(mapDbTrainToFrontend);

    return res.json({
      success: true,
      message: 'Data successfully fetched from MySQL database',
      trains: mappedTrains
    });
  } catch (error) {
    console.error('[DATABASE ERROR] getAllTrains failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trains from database.',
      error: error.message
    });
  }
};

// GET /api/trains/search
const searchTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;
    console.log(`[DATABASE] Searching trains in MySQL: Source=${source}, Destination=${destination}`);

    // If source or destination are not provided, return empty
    if (!source || !destination) {
      return res.json({
        success: true,
        trains: []
      });
    }

    const srcPattern = `%${source.toLowerCase().trim()}%`;
    const destPattern = `%${destination.toLowerCase().trim()}%`;

    const [rows] = await db.query(
      'SELECT * FROM trains WHERE LOWER(Source_Station) LIKE ? AND LOWER(Destination_Station) LIKE ?',
      [srcPattern, destPattern]
    );

    const mappedTrains = rows.map(mapDbTrainToFrontend);

    return res.json({
      success: true,
      message: 'Search query fetched from MySQL database',
      trains: mappedTrains
    });
  } catch (error) {
    console.error('[DATABASE ERROR] searchTrains failed:', error);
    res.status(500).json({
      success: false,
      message: 'Search query failed on database.',
      error: error.message
    });
  }
};

// GET /api/trains/:id
const getTrainById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DATABASE] Fetching train details from MySQL for ID: ${id}`);

    const [rows] = await db.query('SELECT * FROM trains WHERE Train_No = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Train with number ${id} not found.`
      });
    }

    const train = mapDbTrainToFrontend(rows[0]);

    return res.json({
      success: true,
      message: 'Train details fetched from MySQL database',
      train: train
    });
  } catch (error) {
    console.error('[DATABASE ERROR] getTrainById failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve train details.',
      error: error.message
    });
  }
};

module.exports = {
  getAllTrains,
  searchTrains,
  getTrainById,
  mapDbTrainToFrontend // exported for code reuse
};
