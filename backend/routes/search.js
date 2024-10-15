const express = require("express");
const { Service } = require("../models/service");
const { Testimonial } = require("../models/testimonial");
const { Gallery } = require("../models/gallery");
const router = express.Router();

// Search across services, testimonials, and gallery
router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "No search query provided" });
  }

  try {
    // Perform a case-insensitive search across models
    const services = await Service.find({
      title: { $regex: query, $options: "i" },
    });
    const testimonials = await Testimonial.find({
      quote: { $regex: query, $options: "i" },
    });
    const galleryItems = await Gallery.find({
      title: { $regex: query, $options: "i" },
    });

    // Combine results
    const results = {
      services,
      testimonials,
      gallery: galleryItems,
    };

    if (!services.length && !testimonials.length && !galleryItems.length) {
      return res.status(404).json({ message: "No results found" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to perform search" });
  }
});

module.exports = router;
