// api/services.js
const express = require("express");
const connectToDatabase = require("../startup/db.js");
const { Service, validateService } = require("../models/service.js");
const slugify = require("slugify");
const mongoose = require("mongoose");

const setupValidation = require("../startup/validation");
setupValidation(); // Enable Joi ObjectId validation

const app = express();
app.use(express.json()); // Parse JSON bodies

// Helper function to generate unique slugs
async function generateUniqueSlug(title) {
  const slug = slugify(title, { lower: true });
  const existingService = await Service.findOne({ slug });

  if (existingService) {
    return `${slug}-${existingService._id}`;
  }

  return slug;
}

// Fetch all services with pagination
app.get("/", async (req, res) => {
  await connectToDatabase(); // Ensure MongoDB connection

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const totalCount = await Service.countDocuments();
    const services = await Service.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({ services, currentPage: page, totalPages });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Fetch a single service by slug or ID
app.get("/:slugOrId", async (req, res) => {
  await connectToDatabase();

  const { slugOrId } = req.params;
  let service;

  try {
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
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// Add a new service (admin only, assumes admin verification)
app.post("/", async (req, res) => {
  await connectToDatabase();

  const { error } = validateService(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const slug = await generateUniqueSlug(req.body.title);

    const service = new Service({
      title: req.body.title,
      description: req.body.description,
      priceCents: req.body.priceCents,
      image: req.body.image,
      slug,
      additionalImages: req.body.additionalImages,
      videoUrl: req.body.videoUrl,
      benefits: req.body.benefits,
      relatedServiceIds: req.body.relatedServiceIds.map((id) =>
        mongoose.Types.ObjectId(id)
      ),
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ error: "Failed to add service" });
  }
});

// Update a service by ID (admin only)
app.put("/:id", async (req, res) => {
  await connectToDatabase();

  const { error } = validateService(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("relatedServiceIds");
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Failed to update service" });
  }
});

// Delete a service by ID (admin only)
app.delete("/:id", async (req, res) => {
  await connectToDatabase();

  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully", service });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

module.exports = app;
