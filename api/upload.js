const multer = require("multer");
const storage = multer.memoryStorage(); // Stores files in memory
const upload = multer({ storage });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Handle the file upload
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ error: "Upload failed" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Use cloud storage for persistent storage (code for uploading to AWS S3 or similar would go here)
    const fileUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.originalname
    }`;
    res.status(200).json({ url: fileUrl });
  });
};
