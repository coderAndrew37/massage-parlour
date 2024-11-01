const express = require("express");
const { Service, validateService } = require("../models/service"); // Import model and validation function
const mongoose = require("mongoose"); // Import mongoose to convert IDs to ObjectId
const slugify = require("slugify");
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

// Helper function for pagination
function paginate(array, page, limit) {
  return array.slice((page - 1) * limit, page * limit);
}

// Public route: Fetch all services with pagination
// Public route: Fetch all services with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6; // Default limit to 6 services per page

  try {
    // Get total count of services
    const totalCount = await Service.countDocuments();

    // Fetch paginated services
    const services = await Service.find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (!services.length) {
      return res.status(404).json({ message: "No services found" });
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      services,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch services", details: error.message });
  }
});

// **UPDATED ROUTE** to fetch a service by either slug or ID
router.get("/:slugOrId", async (req, res) => {
  const { slugOrId } = req.params;
  let service;

  try {
    // Check if the parameter is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      service = await Service.findById(slugOrId).populate("relatedServiceIds");
    } else {
      service = await Service.findOne({ slug: slugOrId }).populate(
        "relatedServiceIds"
      );
    }

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch service", details: error.message });
  }
});

// Protected route: Add a new service (admin only, assumes isAdmin middleware)
router.post("/", async (req, res) => {
  // Validate the incoming service data
  const { error } = validateService(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // Generate a unique slug
    const slug = await generateUniqueSlug(req.body.title);

    // Create a new service object
    const service = new Service({
      title: req.body.title,
      description: req.body.description,
      priceCents: req.body.priceCents,
      image: req.body.image,
      slug, // Use the unique slug here
      additionalImages: req.body.additionalImages,
      videoUrl: req.body.videoUrl,
      benefits: req.body.benefits,
      relatedServiceIds: req.body.relatedServiceIds.map((id) =>
        mongoose.Types.ObjectId(id)
      ),
    });

    // Save the service to the database
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to add service", details: error.message });
  }
});

// Protected route: Update a service (admin only)
router.put("/:id", async (req, res) => {
  const { error } = validateService(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("relatedServiceIds");
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to update service", details: error.message });
  }
});

// Protected route: Delete a service (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to delete service", details: error.message });
  }
});

module.exports = router;
