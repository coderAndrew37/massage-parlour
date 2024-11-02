const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for Gallery with timestamps
const gallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // URL to gallery image
    title: { type: String, required: true, minlength: 3, maxlength: 100 }, // Title of the gallery item
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

// Create a Mongoose model for Gallery
const Gallery = mongoose.model("Gallery", gallerySchema);

// Define a function for validating gallery items using Joi
function validateGallery(galleryItem) {
  const schema = Joi.object({
    image: Joi.string().required(),
    title: Joi.string().min(3).max(100).required(),
  });

  return schema.validate(galleryItem);
}

module.exports = {
  Gallery,
  validateGallery,
};
