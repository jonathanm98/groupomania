const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config()

// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGODB_URI;

module.exports = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});