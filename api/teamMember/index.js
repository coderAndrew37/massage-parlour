const connectToDatabase = require("../../startup/db");
const { TeamMember, validateTeamMember } = require("../../models/teamMember");
const slugify = require("slugify");

async function generateUniqueSlug(name) {
  const slug = slugify(name, { lower: true });
  const existingMember = await TeamMember.findOne({ slug });
  return existingMember ? `${slug}-${existingMember._id}` : slug;
}

module.exports = async (req, res) => {
  await connectToDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  if (req.method === "GET") {
    try {
      const totalCount = await TeamMember.countDocuments();
      const teamMembers = await TeamMember.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const totalPages = Math.ceil(totalCount / limit);
      return res.json({ teamMembers, currentPage: page, totalPages });
    } catch (error) {
      console.error("Error fetching team members:", error);
      return res.status(500).json({ error: "Failed to fetch team members" });
    }
  } else if (req.method === "POST") {
    const { error } = validateTeamMember(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const slug = await generateUniqueSlug(req.body.name);
      const teamMember = new TeamMember({ ...req.body, slug });
      await teamMember.save();
      return res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error adding team member:", error);
      return res.status(500).json({ error: "Failed to add team member" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
