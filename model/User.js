const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('Users',{
    userId:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    fullName: {
        type: DataTypes.STRING
    },
    dob: {
        type: DataTypes.DATE
    },
    email: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    password: {
        type:DataTypes.STRING,

    }
})

module.exports = User;



  
    
   


