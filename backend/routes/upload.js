const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configure storage for uploaded files (images/videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/"); // Folder for storing files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Unique file name with extension
  },
});

const upload = multer({ storage: storage });

// Handle file upload (images or videos)
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Generate file URL (supports both images and videos)
  const fileUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  res.status(200).json({ url: fileUrl });
});

module.exports = router;
