const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");
const { Service, validateService } = require("../models/service"); // Assuming models are in "../models/service"
const connectToDatabase = require("../startup/db");
const router = express.Router();

// Helper function to generate unique slugs
async function generateUniqueSlug(title) {
  const slug = slugify(title, { lower: true });
  const existingService = await Service.findOne({ slug });
  return existingService ? `${slug}-${existingService._id}` : slug;
}

// Get service by slug or ID
router.get("/:slugOrId", async (req, res) => {
  const { slugOrId } = req.params;
  try {
    let service;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      service = await Service.findById(slugOrId).populate("relatedServiceIds");
    } else {
      service = await Service.findOne({ slug: slugOrId }).populate(
        "relatedServiceIds"
      );
    }

    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// Add a new service
router.post("/", async (req, res) => {
  const { error } = validateService(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const slug = await generateUniqueSlug(req.body.title);
    const service = new Service({ ...req.body, slug });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ error: "Failed to add service" });
  }
});

// Update a service
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
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Failed to update service" });
  }
});

// Delete a service
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully", service });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// Get paginated list of services
router.get("/", async (req, res) => {
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

module.exports = router;
