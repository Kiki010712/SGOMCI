const { Sequelize } = require('sequelize');
const { database } = require('./config');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql' 
  });

  module.exports = sequelize;