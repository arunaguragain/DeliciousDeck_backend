const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Reservation = sequelize.define('Reservation', {
  reservationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {  
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {  
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  reservationDate: {  
    type: DataTypes.DATE,
    allowNull: false
  },
  reservationTime: {  
    type: DataTypes.TIME,
    allowNull: false
  },
  guestCount: {  
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tableNo: {  
    type: DataTypes.INTEGER
  },
  UseruserId: {  
    type: DataTypes.INTEGER,
  }
});

module.exports = Reservation;
