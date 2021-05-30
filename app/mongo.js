const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//mongo password = 7CaLVvUg8UUJbch
// Connection URL
const url = 'mongodb+srv://db_user:7CaLVvUg8UUJbch@cluster0.gpmad.mongodb.net/BookStore?retryWrites=true&w=majority';

// Database Name
const dbName = 'BookStore';

module.exports = {
    mongoClient:new MongoClient(url, { useUnifiedTopology: true })
    /*const connect = await mongoClient.connect();
    return connect.db(dbName);*/
};