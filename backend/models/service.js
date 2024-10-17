const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for Service with timestamps
const serviceSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Main image
    additionalImages: [String], // Array of additional images
    title: { type: String, required: true, minlength: 3, maxlength: 100 }, // Service title
    description: { type: String, required: true, minlength: 10 }, // Service description
    priceCents: { type: Number, required: true, min: 0 }, // Price in cents
    slug: { type: String, required: true, unique: true }, // Slug for SEO-friendly URLs
    videoUrl: { type: String }, // Optional video URL
    benefits: [
      {
        icon: { type: String, required: true }, // Font Awesome icon class
        description: { type: String, required: true }, // Description of the benefit
      },
    ],
    relatedServiceIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    ], // Related services as ObjectIds
  },
  { timestamps: true }
);

// Create a Mongoose model for Service
const Service = mongoose.model("Service", serviceSchema);

// Define a function for validating services using Joi
function validateService(service) {
  const schema = Joi.object({
    image: Joi.string().required(),
    additionalImages: Joi.array().items(Joi.string()), // Allow additionalImages as an array of strings
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    priceCents: Joi.number().min(0).required(),
    slug: Joi.string().min(3).max(100).required(),
    videoUrl: Joi.string().optional(), // Optional video URL
    benefits: Joi.array().items(
      Joi.object({
        icon: Joi.string().required(),
        description: Joi.string().required(),
      })
    ),
    relatedServiceIds: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .optional(), // Validate as array of valid ObjectId strings
  });

  return schema.validate(service);
}

// Export the Service model and validation function
module.exports = {
  Service,
  validateService,
};
