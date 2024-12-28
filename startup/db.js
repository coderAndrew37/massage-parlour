const mongoose = require("mongoose");

module.exports = async function connectToDatabase() {
  const db = process.env.MONGODB_URI;
  if (!db) throw new Error("MONGODB_URI is not defined.");

  // Check existing connections
  if (mongoose.connection.readyState === 1) return;

  // Dynamically set SSL based on environment
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    ssl: isProduction, // Use SSL only in production
    retryWrites: true,
    w: "majority",
    dbName: process.env.MONGO_DB_NAME || undefined, // Set database name if required
  };

  try {
    // Connect to MongoDB
    await mongoose.connect(db, options);
    console.info(`Connected to MongoDB at ${db}`);
  } catch (err) {
    console.error(`Could not connect to MongoDB: ${err.message}`);
    throw err; // Let the caller handle the error
  }
};
