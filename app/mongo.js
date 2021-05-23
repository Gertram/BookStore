const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'BookStore';

module.exports = async function(){
    const client = await MongoClient.connect(url);
    return client.db(dbName);
};