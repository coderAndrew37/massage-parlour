const express = require("express");
const connectToDatabase = require("../startup/db");
const { Gallery, validateGallery } = require("../models/gallery");
const app = express();
app.use(express.json());

// Fetch all gallery items with pagination
app.get("/", async (req, res) => {
  await connectToDatabase();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const galleryItems = await Gallery.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalItems = await Gallery.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      gallery: galleryItems,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// Add a new gallery item (admin only)
app.post("/", async (req, res) => {
  await connectToDatabase();

  const { error } = validateGallery(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const galleryItem = new Gallery(req.body);

  try {
    await galleryItem.save();
    res.status(201).json(galleryItem);
  } catch (error) {
    console.error("Error adding gallery item:", error);
    res.status(500).json({ error: "Failed to add gallery item" });
  }
});

// Update a gallery item by ID (admin only)
app.put("/:id", async (req, res) => {
  await connectToDatabase();

  const { error } = validateGallery(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!galleryItem)
      return res.status(404).json({ error: "Gallery item not found" });
    res.json(galleryItem);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res.status(500).json({ error: "Failed to update gallery item" });
  }
});

// Delete a gallery item by ID (admin only)
app.delete("/:id", async (req, res) => {
  await connectToDatabase();

  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!galleryItem)
      return res.status(404).json({ error: "Gallery item not found" });
    res.json({ message: "Gallery item deleted successfully", galleryItem });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

module.exports = app;
