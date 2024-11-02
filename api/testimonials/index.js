const connectToDatabase = require("../../startup/db");
const {
  Testimonial,
  validateTestimonial,
} = require("../../models/testimonial");

module.exports = async (req, res) => {
  await connectToDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  if (req.method === "GET") {
    try {
      const testimonials = await Testimonial.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const totalItems = await Testimonial.countDocuments();
      const totalPages = Math.ceil(totalItems / limit);
      return res.json({ testimonials, currentPage: page, totalPages });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      return res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  } else if (req.method === "POST") {
    const { error } = validateTestimonial(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const testimonial = new Testimonial(req.body);

    try {
      await testimonial.save();
      return res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error adding testimonial:", error);
      return res.status(500).json({ error: "Failed to add testimonial" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
