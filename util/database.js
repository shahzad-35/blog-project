// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('nodecomplete', 'root', 'root', {
//   dialect: 'mysql',
//   host: '172.25.0.2'
// });

// module.exports = sequelize;


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(env('MONGO_URL'))
  .then(client => {
    console.log('Connected!');
    callback(client);
  })
  .catch(err => {
    console.log(err);
  });
}

module.exports = mongoConnect;

