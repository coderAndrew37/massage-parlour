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

function validateContact(contact) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "Name must be a text string.",
      "string.empty": "Please enter your name.",
      "string.min": "Name should have at least 3 characters.",
      "any.required": "Name is a required field.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is a required field.",
    }),
    message: Joi.string().min(10).max(1000).required().messages({
      "string.min": "Message should be at least 10 characters long.",
      "any.required": "Message is a required field.",
    }),
    phone: Joi.string()
      .pattern(/^(07|01)\d{8}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must start with 07 or 01 and contain 10 digits.",
        "any.required": "Phone number is a required field.",
      }),
  });
  return schema.validate(contact);
}

module.exports = {
  Contact,
  validateContact,
};
