require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MongoDB URI is missing! Check your .env file.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000, // Timeout lebih lama (30 detik)
  serverSelectionTimeoutMS: 30000,  // Cegah koneksi terputus
});
async function connectMongo() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
  }
}

connectMongo();

module.exports = client;
