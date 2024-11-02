// api/testimonials.js
const express = require("express");
const connectToDatabase = require("../startup/db");
const { Testimonial, validateTestimonial } = require("../models/testimonial");
const app = express();
app.use(express.json());

// Fetch all testimonials with pagination
app.get("/", async (req, res) => {
  await connectToDatabase();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const testimonials = await Testimonial.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalItems = await Testimonial.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      testimonials,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// Add a new testimonial (admin only)
app.post("/", async (req, res) => {
  await connectToDatabase();

  const { error } = validateTestimonial(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const testimonial = new Testimonial(req.body);

  try {
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

// Update a testimonial by ID (admin only)
app.put("/:id", async (req, res) => {
  await connectToDatabase();

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

// Delete a testimonial by ID (admin only)
app.delete("/:id", async (req, res) => {
  await connectToDatabase();

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

module.exports = app;
