const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Waktu tunggu koneksi 10 detik
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

connectMongo();

module.exports = mongoose;
