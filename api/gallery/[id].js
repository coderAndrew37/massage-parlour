const connectToDatabase = require("../../startup/db");
const { Gallery, validateGallery } = require("../../models/gallery");

module.exports = async (req, res) => {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const galleryItem = await Gallery.findById(id);
      if (!galleryItem)
        return res.status(404).json({ error: "Gallery item not found" });
      res.json(galleryItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery item" });
    }
  } else if (req.method === "PUT") {
    const { error } = validateGallery(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const galleryItem = await Gallery.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!galleryItem)
        return res.status(404).json({ error: "Gallery item not found" });
      res.json(galleryItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update gallery item" });
    }
  } else if (req.method === "DELETE") {
    try {
      const galleryItem = await Gallery.findByIdAndDelete(id);
      if (!galleryItem)
        return res.status(404).json({ error: "Gallery item not found" });
      res.json({ message: "Gallery item deleted successfully", galleryItem });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gallery item" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
