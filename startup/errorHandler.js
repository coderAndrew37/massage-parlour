const express = require("express");
const app = express();

module.exports = function () {
  // Handle invalid routes (404)
  app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Handle server errors (500)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Server Error" });
  });
};
