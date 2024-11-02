const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for Testimonial with timestamps
const testimonialSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // URL to client's image
    quote: { type: String, required: true, minlength: 5 }, // Testimonial quote
    name: { type: String, required: true, minlength: 3, maxlength: 50 }, // Client's name
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

// Create a Mongoose model for Testimonial
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// Define a function for validating testimonials using Joi
function validateTestimonial(testimonial) {
  const schema = Joi.object({
    image: Joi.string().required(),
    quote: Joi.string().min(5).required(),
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(testimonial);
}

module.exports = {
  Testimonial,
  validateTestimonial,
};
