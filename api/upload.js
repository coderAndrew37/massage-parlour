// api/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express.Router();

// File storage for serverless Vercel environment
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File upload
app.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  res.status(200).json({ url: fileUrl });
});

module.exports = app;
