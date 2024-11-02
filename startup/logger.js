const winston = require("winston");
require("express-async-errors");

module.exports = function setupLogging() {
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "info",
    })
  );

  // Catch uncaught exceptions
  process.on("uncaughtException", (ex) => {
    console.error("Uncaught Exception:", ex);
    process.exit(1);
  });

  // Catch unhandled promise rejections
  process.on("unhandledRejection", (ex) => {
    console.error("Unhandled Rejection:", ex);
    process.exit(1);
  });
};
