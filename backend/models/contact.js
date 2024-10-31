const mongoose = require("mongoose");
const Joi = require("joi");

// Define the contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
    match: /^\+?\d{1,15}$/, // Regex for basic phone number validation
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

// Validate contact data using Joi
function validateContact(contact) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(1000).required(),
    phone: Joi.string()
      .pattern(/^(07|01)\d{8}$/) // Kenyan format starting with 07 or 01 and followed by 8 digits
      .required(),
  });
  return schema.validate(contact);
}

module.exports = {
  Contact,
  validateContact,
};
