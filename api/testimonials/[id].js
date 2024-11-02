const connectToDatabase = require("../../startup/db");
const {
  Testimonial,
  validateTestimonial,
} = require("../../models/testimonial");

module.exports = async (req, res) => {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "PUT") {
    const { error } = validateTestimonial(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!testimonial) return res.status(404).json({ error: "Not found" });
      return res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      return res.status(500).json({ error: "Failed to update testimonial" });
    }
  } else if (req.method === "DELETE") {
    try {
      const testimonial = await Testimonial.findByIdAndDelete(id);
      if (!testimonial) return res.status(404).json({ error: "Not found" });
      return res.json({ message: "Deleted successfully", testimonial });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      return res.status(500).json({ error: "Failed to delete testimonial" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
