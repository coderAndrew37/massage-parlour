const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // Handling uncaught exceptions
  winston.exceptions.handle(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  // Log errors to a file
  winston.add(
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    })
  );

  // Log to the console
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "info",
    })
  );

  // Log all events to a file (not just errors)
  winston.add(
    new winston.transports.File({
      filename: "combined.log",
      level: "info",
    })
  );

  // Log errors to MongoDB
  winston.add(
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      level: "error",
      options: { useUnifiedTopology: true },
    })
  );
};
