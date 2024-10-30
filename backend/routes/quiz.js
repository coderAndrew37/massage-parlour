const express = require("express");
const { Lead, validateLead } = require("../models/lead");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const moment = require("moment");
const router = express.Router();

// Helper function to check daily submission limit (2 per day)
async function checkDailySubmissionLimit(email) {
  const startOfDay = moment().startOf("day").toDate();
  const submissionsToday = await Lead.countDocuments({
    email: email,
    createdAt: { $gte: startOfDay },
  });

  return submissionsToday >= 2;
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route to handle quiz submissions
router.post("/", async (req, res) => {
  const { error } = validateLead(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, quizAnswers } = req.body;

  try {
    // Check if the email has reached its submission limit
    const hasReachedLimit = await checkDailySubmissionLimit(email);
    if (hasReachedLimit) {
      return res.status(400).json({
        error:
          "You have already submitted the quiz twice today. Please try again tomorrow.",
      });
    }

    // Save lead as unverified without email verification
    const lead = new Lead({
      email: xss(email),
      quizAnswers: {
        q1: xss(quizAnswers.q1),
        q2: xss(quizAnswers.q2),
        q3: xss(quizAnswers.q3),
      },
      verified: true, // Mark as verified since there's no email validation
    });

    await lead.save();

    res.status(200).json({
      message: "Quiz submitted successfully.",
      recommendation:
        "We will contact you soon with personalized recommendations!",
    });
  } catch (error) {
    console.error("Error during quiz submission:", error);
    res.status(500).json({ error: "Failed to submit the quiz" });
  }
});

module.exports = router;
