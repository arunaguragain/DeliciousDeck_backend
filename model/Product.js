const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../database/db');
const User = require("./User")
const Product = sequelize.define('Product',{

    id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productImage: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
})

module.exports = Product;