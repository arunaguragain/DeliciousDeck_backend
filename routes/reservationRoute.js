const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middleware/authorization');
const reservationController = require('../controllers/reservationController');

// Check if controller functions are properly imported
if (!reservationController.createReservation) {
    console.error("createReservation function is undefined!");
}


const { 
    createReservation, 
    getReservations, 
    getReservation, 
    updateReservation, 
    deleteReservation 
} = reservationController;

// Create a reservation route (POST)
router.post('/create', authMiddleware(), createReservation);

// Get all reservations route (GET)
router.get('/', authMiddleware(), getReservations);

// Get a specific reservation by ID route (GET)
router.get('/:id', authMiddleware(), getReservation);

// Update a reservation route (PUT)
router.put('/:id', authMiddleware(), updateReservation);

// Delete a reservation route (DELETE)
router.delete('/:id', authMiddleware(), deleteReservation);

module.exports = router;
