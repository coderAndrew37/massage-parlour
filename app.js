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

// Helmet for security headers with Content Security Policy
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

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://your-vercel-app.vercel.app", // Production Vercel domain
    ],
    credentials: true,
  })
);

// Static file serving
app.use(express.static(path.join(__dirname, "public")));

// Middleware for handling JSON requests, cookies, and HTML routing
app.use(express.json());
app.use(cookieParser());

// Middleware to serve HTML files without requiring the .html extension
app.use((req, res, next) => {
  const requestedFile = path.join(__dirname, "public", req.path + ".html");
  if (req.path !== "/" && req.path.indexOf(".") === -1) {
    res.sendFile(requestedFile, (err) => {
      if (err) next(); // If not found, move to the next middleware
    });
  } else {
    next();
  }
});

// Route handlers and error handling
require("./startup/errorHandler")();

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Start server for local dev; Vercel will handle in production
const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
