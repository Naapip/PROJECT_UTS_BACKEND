const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://UTS_BACKEND:12345678%40@ac-zg5vx83-shard-00-00.vfzzv7o.mongodb.net:27017,ac-zg5vx83-shard-00-01.vfzzv7o.mongodb.net:27017,ac-zg5vx83-shard-00-02.vfzzv7o.mongodb.net:27017/?ssl=true&replicaSet=atlas-jckcgo-shard-0&authSource=admin&appName=Cluster0";

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
  
  return client.db(process.env.DB_NAME || "Threads_App");
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