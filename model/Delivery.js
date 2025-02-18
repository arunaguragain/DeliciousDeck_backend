const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Delivery = sequelize.define('Delivery', {
    deliveryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING
    },
    estimatedTime: {
        type: DataTypes.TIME
    },
    OrderorderId: {
        type: DataTypes.INTEGER
    }
});

module.exports = Delivery;
