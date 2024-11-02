const express = require("express");
const connectToDatabase = require("../startup/db");
const { TeamMember, validateTeamMember } = require("../models/teamMember");
const slugify = require("slugify");
const app = express();
app.use(express.json());

// Helper function to generate unique slugs
async function generateUniqueSlug(name) {
  const slug = slugify(name, { lower: true });
  const existingMember = await TeamMember.findOne({ slug });

  if (existingMember) {
    return `${slug}-${existingMember._id}`;
  }
  return slug;
}

// Fetch all team members with pagination
app.get("/", async (req, res) => {
  await connectToDatabase();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const totalCount = await TeamMember.countDocuments();
    const teamMembers = await TeamMember.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ teamMembers, currentPage: page, totalPages });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// Fetch a single team member by ID
app.get("/:id", async (req, res) => {
  await connectToDatabase();

  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember)
      return res.status(404).json({ message: "Team member not found" });
    res.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

// Add a new team member (admin only)
app.post("/", async (req, res) => {
  await connectToDatabase();

  const { error } = validateTeamMember(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const slug = await generateUniqueSlug(req.body.name);
  const teamMember = new TeamMember({ ...req.body, slug });

  try {
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    console.error("Error adding team member:", error);
    res.status(500).json({ error: "Failed to add team member" });
  }
});

// Update a team member (admin only)
app.put("/:id", async (req, res) => {
  await connectToDatabase();

  const { error } = validateTeamMember(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!teamMember)
      return res.status(404).json({ error: "Team member not found" });
    res.json(teamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ error: "Failed to update team member" });
  }
});

// Delete a team member (admin only)
app.delete("/:id", async (req, res) => {
  await connectToDatabase();

  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember)
      return res.status(404).json({ error: "Team member not found" });
    res.json({ message: "Team member deleted successfully", teamMember });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

module.exports = app;
