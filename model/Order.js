const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UseruserId: {
        type: DataTypes.INTEGER
    },
    orderDate: {
        type: DataTypes.DATE
    },
    totalAmount: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER
    },
    quantity: {
        type: DataTypes.INTEGER
    }
});

module.exports = Order;
