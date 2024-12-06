const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage(); // Stores files in memory
const upload = multer({ storage });

// File Upload Route
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // File URL (simulate storage path)
    const fileUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.originalname
    }`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
