const express = require("express");
const { Service, validateService } = require("../models/service"); // Import model and validation function
const router = express.Router();

// Helper function to generate unique slugs

async function generateUniqueSlug(title) {
  const slug = slugify(title, { lower: true });
  const existingService = await Service.findOne({ slug });

  if (existingService) {
    return `${slug}-${existingService._id}`;
  }

  return slug;
}
// Helper function to slugify a string
const slugify = require("slugify");

// Helper function for pagination
function paginate(array, page, limit) {
  return array.slice((page - 1) * limit, page * limit);
}

// Public route: Fetch all services with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6; // Default limit to 6 services per page

  try {
    const services = await Service.find();
    if (!services.length) {
      return res.status(404).json({ message: "No services found" });
    }

    const paginatedServices = paginate(services, page, limit);
    const totalPages = Math.ceil(services.length / limit);

    res.json({
      services: paginatedServices,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Fetch a single service by slug
router.get("/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// Protected route: Add a new service (admin only, assumes isAdmin middleware)
router.post("/", async (req, res) => {
  // Validate the incoming service data
  const { error } = validateService(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Create a new service object
  const service = new Service({
    title: req.body.title,
    description: req.body.description,
    priceCents: req.body.priceCents,
    image: req.body.image,
    slug: slugify(req.body.title, { lower: true }), // Generate a slug from the title
    additionalImages: req.body.additionalImages, // Add additional images
    videoUrl: req.body.videoUrl, // Add video URL if provided
    benefits: req.body.benefits, // Add benefits if provided
  });

  try {
    // Save the service to the database
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to add service" });
  }
});

// Protected route: Update a service (admin only)
router.put("/:id", async (req, res) => {
  const { error } = validateService(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to update service" });
  }
});

// Protected route: Delete a service (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

module.exports = router;
