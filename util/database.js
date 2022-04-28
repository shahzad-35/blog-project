// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('nodecomplete', 'root', 'root', {
//   dialect: 'mysql',
//   host: '172.25.0.2'
// });

// module.exports = sequelize;


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_URL)
  .then(client => {
    console.log('Connected!');
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
  });
}

const getDb = ()=>{
  if(_db){
    return _db;
  }
  throw ' No Database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
