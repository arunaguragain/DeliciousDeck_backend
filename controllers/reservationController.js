const Reservation = require('../model/Reservation.js');

// Create a reservation
const createReservation = async (req, res) => {
    try {
        const { name, email, phone, reservationDate, reservationTime, guestCount, tableNo, UseruserId } = req.body;
        const reservation = await Reservation.create({
            name,           
            email,         
            phone,          
            reservationDate,
            reservationTime,
            guestCount,
            tableNo,
            UseruserId,
        });
        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ message: 'Error creating reservation', error: err.message });
    }
};

// Get all reservations for a customer
const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: {
                UseruserId: req.user.userId 
            }
        });
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reservations', error: err.message });
    }
};

// Get a specific reservation by ID
const getReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reservation', error: err.message });
    }
};

// Update a reservation
const updateReservation = async (req, res) => {
    try {
        const { name, email, phone, reservationDate, reservationTime, guestCount, tableNo } = req.body;
        const reservation = await Reservation.findByPk(req.params.id);
        if (reservation) {
            reservation.name = name || reservation.name;
            reservation.email = email || reservation.email;
            reservation.phone = phone || reservation.phone;
            reservation.reservationDate = reservationDate || reservation.reservationDate;
            reservation.reservationTime = reservationTime || reservation.reservationTime;
            reservation.guestCount = guestCount || reservation.guestCount;
            reservation.tableNo = tableNo || reservation.tableNo;
            await reservation.save();
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating reservation', error: err.message });
    }
};

// Delete a reservation
const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (reservation) {
            await reservation.destroy();
            res.status(200).json({ message: 'Reservation deleted successfully' });
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting reservation', error: err.message });
    }
};

module.exports = { 
    createReservation, 
    getReservations, 
    getReservation, 
    updateReservation, 
    deleteReservation 
};
