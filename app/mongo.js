const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'BookStore';

module.exports = async function(){
    const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
    const connect = await mongoClient.connect();
    return connect.db(dbName);
};