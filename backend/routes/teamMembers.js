const express = require("express");
const { TeamMember, validateTeamMember } = require("../models/teamMember"); // Import model and validation function
const slugify = require("slugify");
const router = express.Router();

// Helper function to generate unique slugs
async function generateUniqueSlug(name) {
  const slug = slugify(name, { lower: true });
  const existingMember = await TeamMember.findOne({ slug });

  if (existingMember) {
    return `${slug}-${existingMember._id}`; // Append ID to slug if it already exists
  }

  return slug;
}

// Helper function for pagination
function paginate(array, page, limit) {
  return array.slice((page - 1) * limit, page * limit);
}

// Public route: Fetch all team members with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default page is 1
  const limit = parseInt(req.query.limit) || 6; // Default limit is 6 team members per page

  try {
    const teamMembers = await TeamMember.find(); // Fetch all team members
    if (!teamMembers.length) {
      return res.status(404).json({ message: "No team members found" });
    }

    const paginatedTeamMembers = paginate(teamMembers, page, limit); // Paginate the results
    const totalPages = Math.ceil(teamMembers.length / limit); // Calculate total pages

    res.json({
      teamMembers: paginatedTeamMembers,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// Public route: Fetch a single team member by ID
router.get("/:id", async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

// Protected route: Add a new team member
router.post("/", async (req, res) => {
  const { error } = validateTeamMember(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Generate a unique slug for the team member's name
  const slug = await generateUniqueSlug(req.body.name);

  const teamMember = new TeamMember({
    name: req.body.name,
    role: req.body.role,
    bio: req.body.bio,
    image: req.body.image,
    slug, // Add the slug to the member object
  });

  try {
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to add team member" });
  }
});

// Protected route: Update a team member by ID
router.put("/:id", async (req, res) => {
  const { error } = validateTeamMember(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!teamMember)
      return res.status(404).json({ error: "Team member not found" });
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to update team member" });
  }
});

// Protected route: Delete a team member by ID
router.delete("/:id", async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember)
      return res.status(404).json({ error: "Team member not found" });
    res.json({ message: "Team member deleted successfully", teamMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

module.exports = router;
