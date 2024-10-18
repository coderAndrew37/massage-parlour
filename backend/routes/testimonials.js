const express = require("express");
const { Testimonial, validateTestimonial } = require("../models/testimonial"); // Import model and validation function
const router = express.Router();

// Helper function for pagination
function paginate(array, page, limit) {
  return array.slice((page - 1) * limit, page * limit);
}

// Public route: Fetch all testimonials with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default page is 1
  const limit = parseInt(req.query.limit) || 6; // Default limit is 6 testimonials per page

  try {
    const testimonials = await Testimonial.find(); // Fetch all items
    if (!testimonials.length) {
      return res.status(404).json({ message: "No testimonials found" });
    }

    const paginatedTestimonials = paginate(testimonials, page, limit); // Paginate the results
    const totalPages = Math.ceil(testimonials.length / limit); // Calculate total pages

    res.json({
      testimonials: paginatedTestimonials,
      currentPage: page,
      totalPages: totalPages,
    });
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
