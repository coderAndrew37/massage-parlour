require("dotenv").config();
require("./backend/startup/logger")();
require("./backend/startup/db")();

const express = require("express");
const app = express();
const winston = require("winston");
require("./backend/startup/prod")(app);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet"); // Use helmet for setting security headers

require("express-async-errors");

// Configure helmet with a Content Security Policy that includes frame sources
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
          "'unsafe-inline'", // Allows inline styles (use cautiously)
        ],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        frameSrc: ["'self'", "https://www.google.com"], // Add Google to frame sources
      },
    },
  })
);

// Apply CORS globally for all routes
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  })
);

// Middleware to serve HTML files without requiring the .html extension
app.use((req, res, next) => {
  const requestedFile = path.join(__dirname, "public", req.path + ".html");

  if (req.path !== "/" && req.path.indexOf(".") === -1) {
    res.sendFile(requestedFile, (err) => {
      if (err) next(); // If the file is not found, continue to the next middleware
    });
  } else {
    next();
  }
});

// Serve all static files from 'public' (HTML, CSS, JS, images, videos)
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());

// Routes and middleware
require("./backend/startup/routes")(app);
require("./backend/startup/errorHandler")();

// Handle 404 errors for missing static files
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
