const connectToDatabase = require("../../startup/db");
const { Gallery } = require("../../models/gallery");

module.exports = async (req, res) => {
  await connectToDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const galleryItems = await Gallery.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalItems = await Gallery.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    res.json({ gallery: galleryItems, currentPage: page, totalPages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery items" });
  }
};
