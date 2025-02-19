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
        type: DataTypes.STRING,
        unique: true
    },
    address: {
        type: DataTypes.STRING
    },
    password: {
        type:DataTypes.STRING,

    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
    }, {
        tableName: 'Users',  // ✅ Ensure Sequelize uses the correct table name
        timestamps: false  
      
})

module.exports = User;



  
    
   


