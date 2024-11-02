require("dotenv").config();
const express = require("express");
const connectToDatabase = require("../startup/db");
const { Lead, validateLead } = require("../models/lead");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const moment = require("moment");
const app = express.Router();

// Database connection for Vercel serverless functions
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Rate limiting middleware
const quizLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests, try again after 15 minutes" },
});

// Daily submission limit check
async function checkDailySubmissionLimit(email) {
  const startOfDay = moment().startOf("day").toDate();
  const submissionsToday = await Lead.countDocuments({
    email,
    createdAt: { $gte: startOfDay },
  });
  return submissionsToday >= 3;
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Quiz submission
app.post("/", quizLimiter, async (req, res) => {
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
});

module.exports = app;
