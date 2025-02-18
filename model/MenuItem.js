const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const MenuItem = sequelize.define('MenuItem', {
    itemID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    category: {
        type: DataTypes.STRING
    },
    UseruserId: {
        type: DataTypes.INTEGER
    }
});

module.exports = MenuItem;
