const MongoClient = require('mongodb').MongoClient;
//mongo password = 7CaLVvUg8UUJbch
// Connection URL
// const url = 'mongodb+srv://db_user:7CaLVvUg8UUJbch@cluster0.gpmad.mongodb.net/BookStore?retryWrites=true&w=majority';
const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

// Database Name
const dbName = 'BookStore';

module.exports = {
    mongoClient:new MongoClient(url, { useUnifiedTopology: true })
};