const express = require('express');
const router = express.Router();
const { getAllTrains, searchTrains, getTrainById } = require('../controllers/trainController');

// GET /api/trains
router.get('/', getAllTrains);

// GET /api/trains/search
router.get('/search', searchTrains);

// GET /api/trains/:id
router.get('/:id', getTrainById);

module.exports = router;
