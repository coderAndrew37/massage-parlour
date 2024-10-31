// Import required modules
const express = require("express");
const { Lead, validateLead } = require("../models/lead");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const moment = require("moment");

const router = express.Router();

// Rate limiting middleware
const quizLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Helper function to check daily submission limit (3 per day)
async function checkDailySubmissionLimit(email) {
  const startOfDay = moment().startOf("day").toDate();
  const submissionsToday = await Lead.countDocuments({
    email: email,
    createdAt: { $gte: startOfDay },
  });

  return submissionsToday >= 3;
}

// Function to generate recommendation based on answers
function generateRecommendation(quizAnswers) {
  const { q1, q2, q3 } = quizAnswers;

  if (q1 === "relaxation" && q2 === "occasionally" && q3 === "calm") {
    return "We recommend a soothing hot stone massage for deep relaxation.";
  } else if (q1 === "detox" && q2 === "weekly" && q3 === "luxurious") {
    return "A rejuvenating full-body massage would be perfect for you!";
  } else if (q1 === "rejuvenation" && q2 === "monthly" && q3 === "social") {
    return "Try our invigorating deep tissue massage to boost your energy.";
  } else if (q1 === "pain-relief" && q2 === "never" && q3 === "calm") {
    return "We suggest a targeted deep tissue massage to relieve your pain.";
  } else {
    return "A full-body massage is ideal for overall relaxation and well-being.";
  }
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route to handle quiz submissions with rate limiting
router.post("/", quizLimiter, async (req, res) => {
  const { error } = validateLead(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, quizAnswers } = req.body;

  try {
    // Check if the email has reached its submission limit
    const hasReachedLimit = await checkDailySubmissionLimit(email);
    if (hasReachedLimit) {
      return res.status(400).json({
        error:
          "You have already submitted the quiz thrice today. Please try again tomorrow.",
      });
    }

    // Generate a recommendation based on combined answers
    const recommendation = generateRecommendation(quizAnswers);

    // Save lead as unverified without email verification
    const lead = new Lead({
      email: xss(email),
      quizAnswers: {
        q1: xss(quizAnswers.q1),
        q2: xss(quizAnswers.q2),
        q3: xss(quizAnswers.q3),
      },
      verified: true,
    });
    await lead.save();

    // Send recommendation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Personalized Spa Recommendation",
      text: `Thank you for completing our quiz! Here is your recommendation: ${recommendation}`,
    });

    // Return response with recommendation
    res.status(200).json({
      message: "Quiz submitted successfully.",
      recommendation: recommendation,
    });
  } catch (error) {
    console.error("Error during quiz submission:", error);
    res.status(500).json({ error: "Failed to submit the quiz" });
  }
});

module.exports = router;
