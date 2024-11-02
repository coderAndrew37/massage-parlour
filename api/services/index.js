const connectToDatabase = require("../../startup/db.js");
const { Service } = require("../../models/service.js");

module.exports = async (req, res) => {
  await connectToDatabase();
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
};
