require("dotenv").config();
const connectToDatabase = require("../startup/db");
const { Lead, validateLead } = require("../models/lead");
const nodemailer = require("nodemailer");
const xss = require("xss");
const moment = require("moment");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Helper function to check daily submission limit
async function checkDailySubmissionLimit(email) {
  const startOfDay = moment().startOf("day").toDate();
  const submissionsToday = await Lead.countDocuments({
    email,
    createdAt: { $gte: startOfDay },
  });
  return submissionsToday >= 3;
}

module.exports = async (req, res) => {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { error } = validateLead(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, quizAnswers } = req.body;

  try {
    if (await checkDailySubmissionLimit(email)) {
      return res.status(400).json({ error: "Daily submission limit reached." });
    }

    const recommendation = generateRecommendation(quizAnswers);
    const lead = new Lead({ email: xss(email), quizAnswers, verified: true });
    await lead.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Personalized Spa Recommendation",
      text: `Here is your recommendation: ${recommendation}`,
    });

    res
      .status(200)
      .json({ message: "Quiz submitted successfully.", recommendation });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit the quiz" });
  }
};
