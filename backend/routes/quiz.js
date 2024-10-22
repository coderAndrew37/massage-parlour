const express = require("express");
const { Lead, validateLead } = require("../models/lead");
const nodemailer = require("nodemailer");
const router = express.Router();

// Helper function to determine the recommended treatment based on answers
function getRecommendedTreatment(answers) {
  const { q1, q2, q3 } = answers;
  let recommendation = "";

  if (q1 === "relaxation") {
    recommendation +=
      "We recommend our full-body relaxation massage to help you unwind.\n";
  } else if (q1 === "detox") {
    recommendation +=
      "Our detoxifying treatments will help cleanse your body and mind.\n";
  } else if (q1 === "rejuvenation") {
    recommendation += "Rejuvenate with our anti-aging facial treatments!\n";
  } else if (q1 === "pain-relief") {
    recommendation += "For pain relief, we suggest our deep tissue massage.\n";
  }

  if (q2 === "weekly") {
    recommendation +=
      "Since you visit spas weekly, we'd recommend setting up a personalized wellness routine.\n";
  } else if (q2 === "monthly") {
    recommendation +=
      "A monthly visit to our spa will ensure you maintain a consistent level of relaxation.\n";
  } else if (q2 === "occasionally") {
    recommendation +=
      "We'd love to welcome you more often! Why not take advantage of our loyalty program?\n";
  }

  if (q3 === "calm") {
    recommendation +=
      "Our spa offers a calm and quiet environment, perfect for complete relaxation.\n";
  } else if (q3 === "social") {
    recommendation +=
      "If you prefer a more social environment, we recommend booking during our group sessions.\n";
  } else if (q3 === "luxurious") {
    recommendation +=
      "We offer luxurious high-end treatments that you'll love!\n";
  }

  return recommendation;
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
  // Validate the incoming data
  const { error } = validateLead(req.body);
  if (error) {
    console.error("Validation error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, quizAnswers } = req.body;

  try {
    // Create a new lead entry
    const lead = new Lead({
      email: email,
      quizAnswers: quizAnswers,
    });

    // Save the lead to the database
    await lead.save();
    console.log("Quiz submission saved to database for email:", email);

    // Get the personalized recommendation based on the quiz answers
    const recommendation = getRecommendedTreatment(quizAnswers);

    // Send the recommendation to the user's email
    const mailOptions = {
      from: process.env.EMAI_USER, // Your email address as the sender
      to: email, // Send email to the user
      subject: "Your Personalized Recommendation - Equator Spa",
      html: `
        <h2>Your Personalized Spa Treatment Recommendation</h2>
        <p>Thank you for taking our wellness quiz. Based on your answers, here is our recommendation:</p>
        <h3>Recommended Treatment:</h3>
        <p>${recommendation}</p>
        <br/>
        <p>We hope to see you soon at Equator Spa!</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email via Nodemailer:", error);
        return res
          .status(500)
          .json({ error: "Failed to send quiz results via email" });
      } else {
        console.log("Email sent successfully: " + info.response);
      }
    });

    // Respond with the recommendation
    res.status(201).json({ recommendation });
  } catch (error) {
    // Handle MongoDB duplicate email error gracefully
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      console.error("Duplicate email submission error:", error.keyValue.email);
      return res.status(400).json({
        error: `Email '${error.keyValue.email}' has already been used to submit the quiz.`,
      });
    }

    console.error("Error saving quiz submission:", error);
    res.status(500).json({ error: "Failed to submit the quiz" });
  }
});

module.exports = router;
