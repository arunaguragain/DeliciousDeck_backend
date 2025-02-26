const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middleware/authorization');
const reservationController = require('../controllers/reservationController');

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

router.post('/create', authMiddleware(), createReservation);

router.get('/', authMiddleware(), getReservations);

router.get('/:id', authMiddleware(), getReservation);

router.put('/:id', authMiddleware(), updateReservation);

router.delete('/:id', authMiddleware(), deleteReservation);

module.exports = router;
