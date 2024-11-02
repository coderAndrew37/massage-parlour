// api/teamMember/[id].js
const connectToDatabase = require("../../startup/db");
const { TeamMember, validateTeamMember } = require("../../models/teamMember");

module.exports = async (req, res) => {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const teamMember = await TeamMember.findById(id);
      if (!teamMember) return res.status(404).json({ message: "Not found" });
      return res.json(teamMember);
    } catch (error) {
      console.error("Error fetching team member:", error);
      return res.status(500).json({ error: "Failed to fetch team member" });
    }
  } else if (req.method === "PUT") {
    const { error } = validateTeamMember(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const teamMember = await TeamMember.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!teamMember) return res.status(404).json({ error: "Not found" });
      return res.json(teamMember);
    } catch (error) {
      console.error("Error updating team member:", error);
      return res.status(500).json({ error: "Failed to update team member" });
    }
  } else if (req.method === "DELETE") {
    try {
      const teamMember = await TeamMember.findByIdAndDelete(id);
      if (!teamMember) return res.status(404).json({ error: "Not found" });
      return res.json({ message: "Deleted successfully", teamMember });
    } catch (error) {
      console.error("Error deleting team member:", error);
      return res.status(500).json({ error: "Failed to delete team member" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
