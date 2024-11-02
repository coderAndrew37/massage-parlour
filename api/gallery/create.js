const connectToDatabase = require("../../startup/db");
const { Gallery, validateGallery } = require("../../models/gallery");

module.exports = async (req, res) => {
  await connectToDatabase();

  const { error } = validateGallery(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const galleryItem = new Gallery(req.body);
    await galleryItem.save();
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add gallery item" });
  }
};
