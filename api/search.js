const connectToDatabase = require("../startup/db");
const { Service } = require("../models/service");
const { Testimonial } = require("../models/testimonial");
const { Gallery } = require("../models/gallery");

module.exports = async (req, res) => {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "No search query provided" });
  }

  try {
    const services = await Service.find({
      title: { $regex: query, $options: "i" },
    });
    const testimonials = await Testimonial.find({
      quote: { $regex: query, $options: "i" },
    });
    const galleryItems = await Gallery.find({
      title: { $regex: query, $options: "i" },
    });

    if (!services.length && !testimonials.length && !galleryItems.length) {
      return res.status(404).json({ message: "No results found" });
    }

    res.json({ services, testimonials, gallery: galleryItems });
  } catch (error) {
    res.status(500).json({ error: "Failed to perform search" });
  }
};
