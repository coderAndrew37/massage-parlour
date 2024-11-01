require("dotenv").config(); // Load environment variables
require("./backend/startup/logger")();
require("./backend/startup/db")();

const express = require("express");
const app = express();
const winston = require("winston");
require("./backend/startup/prod")(app);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("express-async-errors");

// Configure helmet with a relaxed Content Security Policy for scripts
const helmet = require("helmet"); // Use helmet for setting security headers

// Configure helmet with a relaxed Content Security Policy for scripts and styles
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
          "https://cdnjs.cloudflare.com", // Added to allow Font Awesome CSS
          "'unsafe-inline'", // Allows inline styles (use with caution)
        ],
        imgSrc: ["'self'", "data:"], // Adjust as needed for images
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"], // Allow external fonts from cdnjs
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
    next(); // Continue to the next middleware if the path includes an extension or is the root
  }
});

// Serve all static files from 'public' (HTML, CSS, JS, images, videos)
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies for token handling

// Routes and middleware
require("./backend/startup/routes")(app); // Initialize all routes
require("./backend/startup/errorHandler")(); // Error handler middleware

// Handle 404 errors for missing static files
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
