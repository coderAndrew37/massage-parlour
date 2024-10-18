const express = require("express");
const { Gallery, validateGallery } = require("../models/gallery"); // Import model and validation function
const router = express.Router();

// Helper function for pagination
function paginate(array, page, limit) {
  return array.slice((page - 1) * limit, page * limit);
}

// Public route: Fetch all gallery items with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default page is 1
  const limit = parseInt(req.query.limit) || 6; // Default limit is 6 items per page

  try {
    const galleryItems = await Gallery.find(); // Fetch all items
    if (!galleryItems.length) {
      return res.status(404).json({ message: "No gallery items found" });
    }

    const paginatedGallery = paginate(galleryItems, page, limit); // Paginate the results
    const totalPages = Math.ceil(galleryItems.length / limit); // Calculate total pages

    res.json({
      gallery: paginatedGallery,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// Protected route: Add a new gallery item (admin only)
router.post("/", async (req, res) => {
  const { error } = validateGallery(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const galleryItem = new Gallery(req.body);
  try {
    await galleryItem.save();
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add gallery item" });
  }
});

// Protected route: Update a gallery item (admin only)
router.put("/:id", async (req, res) => {
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
    res.status(500).json({ error: "Failed to update gallery item" });
  }
});

// Protected route: Delete a gallery item (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!galleryItem)
      return res.status(404).json({ error: "Gallery item not found" });
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

module.exports = router;
