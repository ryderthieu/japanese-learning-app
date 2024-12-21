
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose')
const uri = "mongodb+srv://thieu:admin@ryderthieu.uwzdb.mongodb.net/japanese-learning-app?retryWrites=true&w=majority&appName=ryderthieu";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  try {
    await mongoose.connect(uri);
  }
  catch {
    console.log("Error connecting to MongoDB");
  }
}
connect().catch(console.dir);
module.exports = {connect}