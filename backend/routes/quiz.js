const express = require("express");
const { Lead, validateLead } = require("../models/lead");
const nodemailer = require("nodemailer");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const moment = require("moment");
const router = express.Router();

// ZeroBounce API key (Replace with your actual API key)
const ZEROBOUNCE_API_KEY = process.env.ZEROBOUNCE_API_KEY;

// Helper function to check daily submission limit (2 per day)
async function checkDailySubmissionLimit(email) {
  const startOfDay = moment().startOf("day").toDate();
  const submissionsToday = await Lead.countDocuments({
    email: email,
    createdAt: { $gte: startOfDay },
  });

  return submissionsToday >= 2;
}

// Helper function to verify email using ZeroBounce
async function verifyEmailWithZeroBounce(email) {
  const url = `https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`;
  try {
    const response = await axios.get(url);
    const { status } = response.data;

    // Only allow "valid" emails through
    return status === "valid";
  } catch (error) {
    console.error("Error calling ZeroBounce API:", error);
    throw new Error("Email verification failed.");
  }
}

// Helper function to generate a verification token
function generateVerificationToken(email) {
  return Buffer.from(email).toString("base64");
}

// Helper function to verify token
function verifyToken(token) {
  try {
    return Buffer.from(token, "base64").toString("ascii");
  } catch (error) {
    return null;
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

    // Verify the email with ZeroBounce
    const isValidEmail = await verifyEmailWithZeroBounce(email);
    if (!isValidEmail) {
      return res.status(400).json({ error: "Invalid or undeliverable email." });
    }

    // Create the lead but mark it as unverified initially
    const lead = new Lead({
      email: xss(email),
      quizAnswers: {
        q1: xss(quizAnswers.q1),
        q2: xss(quizAnswers.q2),
        q3: xss(quizAnswers.q3),
      },
      verified: false, // Initially set to false
    });

    // Generate verification token
    const token = generateVerificationToken(email);

    // Send verification email
    const verificationLink = `http://localhost:5500/api/quiz/verify?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - Equator Spa",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email and complete the quiz submission:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Temporarily save the lead (without saving the answers until verification)
    await lead.save();

    res
      .status(200)
      .json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.error("Error during quiz submission:", error);
    res.status(500).json({ error: "Failed to submit the quiz" });
  }
});

// Verification route
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  // Decode token to extract email
  const email = verifyToken(token);

  if (!email) {
    return res
      .status(400)
      .json({ error: "Invalid or expired verification token." });
  }

  try {
    // Mark the lead as verified
    const lead = await Lead.findOneAndUpdate(
      { email: email, verified: false }, // Find unverified lead
      { verified: true }, // Set verified to true
      { new: true }
    );

    if (!lead) {
      return res
        .status(400)
        .json({ error: "Lead not found or already verified." });
    }

    res.status(200).json({
      message: "Email verified successfully. Quiz submission completed.",
    });
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ error: "Failed to verify email." });
  }
});

module.exports = router;
