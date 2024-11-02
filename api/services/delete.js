const connectToDatabase = require("../../startup/db.js");
const { Service } = require("../../models/service.js");

module.exports = async (req, res) => {
  await connectToDatabase();

  try {
    const service = await Service.findByIdAndDelete(req.query.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully", service });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
};
