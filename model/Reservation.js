const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Reservation = sequelize.define('Reservation', {
  reservationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {  // Added name field from BookingForm
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {  // Added email field from BookingForm
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {  // Added phone field from BookingForm
    type: DataTypes.STRING,
    allowNull: false
  },
  reservationDate: {  // Updated to use reservationDate from BookingForm
    type: DataTypes.DATE,
    allowNull: false
  },
  reservationTime: {  // Updated to use reservationTime from BookingForm
    type: DataTypes.TIME,
    allowNull: false
  },
  guestCount: {  // Updated to use guests field from BookingForm
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tableNo: {  // Added tableNo as a field in case you want to manage reservations by table number
    type: DataTypes.INTEGER
  },
  UseruserId: {  // This links the reservation to a user, assuming you have a User model for authentication
    type: DataTypes.INTEGER,
  }
});

module.exports = Reservation;
