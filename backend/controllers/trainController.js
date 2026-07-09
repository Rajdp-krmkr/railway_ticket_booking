// ==========================================================
// TRAIN CONTROLLER (DUMMY/PLACEHOLDER)
// ==========================================================

// TODO:
// Fetch data from RailwayDB
// Replace this mock data and static responses with database query actions.

// Mock train database
const mockTrains = [
  {
    id: 'T101',
    name: 'Rajdhani Express',
    number: '12429',
    source: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    departure: '16:55',
    arrival: '08:35',
    duration: '15h 40m',
    availableSeats: 45,
    fare: 2450,
    classes: ['AC 1st Class (1A)', 'AC 2-Tier (2A)', 'AC 3-Tier (3A)'],
    runsOn: ['Mon', 'Wed', 'Fri']
  },
  {
    id: 'T102',
    name: 'Shatabdi Express',
    number: '12004',
    source: 'New Delhi (NDLS)',
    destination: 'Lucknow Charbagh (LKO)',
    departure: '06:10',
    arrival: '12:40',
    duration: '06h 30m',
    availableSeats: 82,
    fare: 1150,
    classes: ['AC Chair Car (CC)', 'Exec. Chair Car (EC)'],
    runsOn: ['Tue', 'Wed', 'Thu', 'Sat', 'Sun']
  },
  {
    id: 'T103',
    name: 'Duronto Express',
    number: '12260',
    source: 'Howrah Junction (HWH)',
    destination: 'New Delhi (NDLS)',
    departure: '16:15',
    arrival: '10:30',
    duration: '18h 15m',
    availableSeats: 12,
    fare: 2100,
    classes: ['AC 3-Tier (3A)', 'AC 2-Tier (2A)', 'Sleeper Class (SL)'],
    runsOn: ['Tue', 'Thu', 'Sat']
  },
  {
    id: 'T104',
    name: 'Garib Rath',
    number: '12910',
    source: 'Hazrat Nizamuddin (NZM)',
    destination: 'Bandra Terminus (BDTS)',
    departure: '15:55',
    arrival: '08:10',
    duration: '16h 15m',
    availableSeats: 120,
    fare: 750,
    classes: ['AC 3-Tier (3A)'],
    runsOn: ['Wed', 'Fri', 'Sun']
  },
  {
    id: 'T105',
    name: 'Deccan Queen',
    number: '12124',
    source: 'Pune Junction (PUNE)',
    destination: 'Mumbai CSMT (CSMT)',
    departure: '07:15',
    arrival: '10:25',
    duration: '03h 10m',
    availableSeats: 250,
    fare: 350,
    classes: ['CC (Chair Car)', 'Sleeper Class (SL)'],
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'T106',
    name: 'Karnataka Express',
    number: '12628',
    source: 'New Delhi (NDLS)',
    destination: 'Bengaluru City (SBC)',
    departure: '20:15',
    arrival: '13:40',
    duration: '41h 25m',
    availableSeats: 35,
    fare: 3100,
    classes: ['AC 2-Tier (2A)', 'AC 3-Tier (3A)', 'Sleeper Class (SL)'],
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
];

// GET /api/trains
const getAllTrains = async (req, res) => {
  try {
    console.log('[TRAINS] Fetching all trains');
    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      trains: mockTrains
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/trains/search
const searchTrains = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    console.log(`[TRAINS] Search criteria: Source=${source}, Destination=${destination}, Date=${date}`);

    // Standardize inputs for case-insensitive partial match
    const srcQuery = source ? source.toLowerCase().trim() : '';
    const destQuery = destination ? destination.toLowerCase().trim() : '';

    // Filter mock trains that match source and destination keywords
    let results = mockTrains.filter(t => {
      const matchSrc = srcQuery ? t.source.toLowerCase().includes(srcQuery) : true;
      const matchDest = destQuery ? t.destination.toLowerCase().includes(destQuery) : true;
      return matchSrc && matchDest;
    });

    // If search results are empty, provide a few mock results anyway to show functionality
    if (results.length === 0 && srcQuery && destQuery) {
      results = [
        {
          id: 'T-MOCK',
          name: `Custom Route Train (${source} to ${destination})`,
          number: '19999',
          source: source,
          destination: destination,
          departure: '10:00',
          arrival: '18:00',
          duration: '08h 00m',
          availableSeats: 60,
          fare: 550,
          classes: ['AC 3-Tier (3A)', 'Sleeper Class (SL)'],
          runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ];
    }

    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      trains: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/trains/:id
const getTrainById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[TRAINS] Fetching train details for ID: ${id}`);

    const train = mockTrains.find(t => t.id === id);

    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train with ID ${id} not found.`
      });
    }

    return res.json({
      success: true,
      message: 'Replace this with MySQL query',
      train: train
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllTrains,
  searchTrains,
  getTrainById,
  mockTrains // exported for use in booking calculations if needed
};
