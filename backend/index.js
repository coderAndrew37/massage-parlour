require("dotenv").config(); // This should be at the top of your file
require("./startup/logger")();
require("./startup/db")();

const express = require("express");
const app = express();
const winston = require("winston");
require("./startup/prod")(app);
const cors = require("cors");
const cookieParser = require("cookie-parser"); // For parsing cookies
const path = require("path");

require("express-async-errors");

const cors = require("cors");

app.use(
  cors({
    origin: [
      "https://massage-2-6xo1wesm3-coderandrew37s-projects.vercel.app", // Vercel frontend
      "http://127.0.0.1:5500", // Local development
    ],
    credentials: true, // Allow credentials (cookies, etc.)
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
