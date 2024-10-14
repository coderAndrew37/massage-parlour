const express = require("express");
const { Testimonial, validateTestimonial } = require("../models/testimonial"); // Import model and validation function
const router = express.Router();

// Public route: Fetch all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    if (!testimonials.length) {
      return res.status(404).json({ message: "No testimonials found" });
    }
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// Protected route: Add a new testimonial (admin only)
router.post("/", async (req, res) => {
  const { error } = validateTestimonial(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const testimonial = new Testimonial(req.body);
  try {
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

// Protected route: Update a testimonial (admin only)
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
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

// Protected route: Delete a testimonial (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial)
      return res.status(404).json({ error: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

module.exports = router;
