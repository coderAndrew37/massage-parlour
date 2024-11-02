const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for Team Members with timestamps
const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 100 }, // Team member's name
    role: { type: String, required: true, minlength: 3, maxlength: 100 }, // Role of the team member
    image: { type: String, required: true }, // URL to the team member's image
    bio: { type: String, maxlength: 500 }, // Optional bio or description
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

// Create a Mongoose model for Team Member
const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

// Define a function for validating team members using Joi
function validateTeamMember(teamMember) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    role: Joi.string().min(3).max(100).required(),
    image: Joi.string().required(), // Ensure image is a valid URI
    bio: Joi.string().max(500).optional(), // Optional bio with a max length of 500 characters
  });

  return schema.validate(teamMember);
}

// Export the TeamMember model and validation function
module.exports = {
  TeamMember,
  validateTeamMember,
};
