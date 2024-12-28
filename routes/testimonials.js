const express = require("express");
const { Testimonial, validateTestimonial } = require("../models/testimonial");
const router = express.Router();

// Get all testimonials with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const totalCount = await Testimonial.countDocuments();
    const testimonials = await Testimonial.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);
    res.json({ testimonials, currentPage: page, totalPages });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// Add a new testimonial
router.post("/", async (req, res) => {
  const { error } = validateTestimonial(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

// Update a testimonial
router.put("/:id", async (req, res) => {
  const { error } = validateTestimonial(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!testimonial)
      return res.status(404).json({ error: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

// Delete a testimonial
router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial)
      return res.status(404).json({ error: "Testimonial not found" });
    res.json({ message: "Testimonial deleted successfully", testimonial });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

module.exports = router;
