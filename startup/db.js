// db.js
const mongoose = require("mongoose");

module.exports = async function connectToDatabase() {
  const db = process.env.MONGODB_URI;
  if (!db) throw new Error("MONGODB_URI is not defined.");

  // Check existing connections
  if (mongoose.connection.readyState === 1) return;

  // Connect to MongoDB
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info(`Connected to MongoDB at ${db}`);
  } catch (err) {
    console.error(`Could not connect to MongoDB: ${err.message}`);
    throw err; // Let Vercel function handle errors
  }
};
