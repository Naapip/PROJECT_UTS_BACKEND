const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://yumna535230179_db_user:xdpf5V27quZ39fAg@cluster0.pblperr.mongodb.net/Thereads_Apps?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return client;
  }

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    isConnected = true;
    console.log("Successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

const getDB = () => {
  if (!isConnected) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return client.db("Thereads_Apps");
};

const closeDB = async () => {
  if (isConnected) {
    await client.close();
    isConnected = false;
    console.log("MongoDB connection closed");
  }
};

process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  getDB,
  closeDB,
  client
};