const connectToDatabase = require("../../startup/db.js");
const { Service } = require("../../models/service.js");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
  await connectToDatabase();
  const { slugOrId } = req.query;
  let service;

  try {
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
};
