const connectToDatabase = require("../../startup/db.js");
const { Service, validateService } = require("../../models/service.js");
const slugify = require("slugify");

async function generateUniqueSlug(title) {
  const slug = slugify(title, { lower: true });
  const existingService = await Service.findOne({ slug });
  return existingService ? `${slug}-${existingService._id}` : slug;
}

module.exports = async (req, res) => {
  await connectToDatabase();
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
};
