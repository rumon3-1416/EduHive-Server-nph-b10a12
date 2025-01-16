const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
// Mongodb Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;
const connectDB = async collection => {
  try {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
      console.log('Connected');
    }

    const database = client.db('a12DB');

    return database.collection(collection);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
