const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  const db = process.env.MONGODB_URI; // Get the MongoDB URI from environment variables
  if (!db) {
    throw new Error("FATAL ERROR: MONGODB_URI is not defined.");
  }

  mongoose
    .connect(db)
    .then(() => winston.info(`Connected to MongoDB at ${db}`))
    .catch((err) => {
      winston.error(`Could not connect to MongoDB: ${err.message}`);
      process.exit(1); // Exit the process with failure
    });
};
