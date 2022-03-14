const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodecomplete', 'root', 'root', {
  dialect: 'mysql',
  host: '172.25.0.2'
});

module.exports = sequelize;
