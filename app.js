require("dotenv").config();
require("./startup/logger")(); // Initialize logging
require("./startup/db")(); // Initialize DB connection

const express = require("express");
const path = require("path");
const app = express();
const winston = require("winston");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("express-async-errors");
require("./startup/prod")(app); // Production optimizations

// Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
        ],
        connectSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'",
        ],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        frameSrc: ["'self'", "https://www.google.com"],
      },
    },
  })
);

// Enable CORS for specific domains
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "https://massage-parlour.onrender.com", // Replace with your Vercel app URL
    ],
    credentials: true,
  })
);

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

// Middleware to remove .html extension
app.use((req, res, next) => {
  if (!path.extname(req.path)) {
    const requestedFile = path.join(__dirname, "public", req.path + ".html");
    res.sendFile(requestedFile, (err) => {
      if (err) next(); // Continue if file not found
    });
  } else {
    next(); // Continue if path already has an extension
  }
});

// Import and use all API routes
require("./startup/routes.js")(app);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  winston.error(err.message, err);
  res.status(500).send("Something went wrong on the server.");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
