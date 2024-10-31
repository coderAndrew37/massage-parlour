require("dotenv").config(); // Load environment variables
require("./startup/logger")();
require("./startup/db")();

const express = require("express");
const app = express();
const winston = require("winston");
require("./startup/prod")(app);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("express-async-errors");

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

// Serve static files from 'images' directory (for both images and videos)
app.use("/images", express.static(path.join(__dirname, "..", "images")));

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies for token handling

// Routes and middleware
require("./startup/routes")(app); // Initialize all routes
require("./startup/errorHandler")(); // Error handler middleware

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
