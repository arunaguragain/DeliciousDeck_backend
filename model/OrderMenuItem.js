const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const OrderMenuItem = sequelize.define('OrderMenuItem', {
    MenuItemitemID: {
        type: DataTypes.INTEGER
    },
    OrderorderId: {
        type: DataTypes.INTEGER
    }
}, { timestamps: false });

module.exports = OrderMenuItem;
