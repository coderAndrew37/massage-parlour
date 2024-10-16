const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for Service with timestamps
const serviceSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // URL to service image
    title: { type: String, required: true, minlength: 3, maxlength: 100 }, // Service title
    description: { type: String, required: true, minlength: 10 }, // Service description
    priceCents: { type: Number, required: true, min: 0 }, // Price in cents
    slug: { type: String, required: false, unique: true },
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

// Create a Mongoose model for Service
const Service = mongoose.model("Service", serviceSchema);

// Define a function for validating services using Joi
function validateService(service) {
  const schema = Joi.object({
    image: Joi.string().required(),
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    priceCents: Joi.number().min(0).required(),
  });

  return schema.validate(service);
}

module.exports = {
  Service,
  validateService,
};
