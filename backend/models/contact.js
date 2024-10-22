const mongoose = require("mongoose");
const Joi = require("joi");

// Define the contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3, // Minimum length validation
    maxlength: 100, // Maximum length validation
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for basic email validation
  },
  message: {
    type: String,
    required: true,
    minlength: 10, // Message should have a minimum length
    maxlength: 1000, // Maximum message length
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Contact model
const Contact = mongoose.model("Contact", contactSchema);

// Validate contact data using Joi
function validateContact(contact) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(1000).required(),
  });
  return schema.validate(contact);
}

module.exports = {
  Contact,
  validateContact,
};
