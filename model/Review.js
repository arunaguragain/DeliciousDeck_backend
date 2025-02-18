const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require("./User")

const Review = sequelize.define('Review', {
    reviewID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UseruserId: {
        type: DataTypes.INTEGER
    },
    ratings: {
        type: DataTypes.INTEGER
    },
    comment: {
        type: DataTypes.STRING
    }
});
 

module.exports = Review;
