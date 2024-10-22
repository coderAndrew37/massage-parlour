// file: routes/contact.js
const express = require("express");
const { Contact, validateContact } = require("../models/contact");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit"); // Add rate limiting
const xss = require("xss"); // Add sanitization
const router = express.Router();

// Rate limiting (e.g., 5 requests per minute)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiting to contact route
router.use(limiter);

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route to handle contact form submissions
router.post("/", async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, message } = req.body;

  // Sanitize input to avoid XSS attacks
  const sanitizedMessage = xss(message);

  try {
    // Create a new contact entry
    const contact = new Contact({
      name: xss(name),
      email: xss(email),
      message: sanitizedMessage,
    });

    await contact.save();

    // Email setup
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${xss(name)}`,
      html: `
        <h2>New Message From Contact Form</h2>
        <p><strong>Name:</strong> ${xss(name)}</p>
        <p><strong>Email:</strong> ${xss(email)}</p>
        <p><strong>Message:</strong> ${sanitizedMessage}</p>
      `,
    };

    // Send the contact message via email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact or sending email:", error);
    res.status(500).json({ error: "Failed to submit the contact form" });
  }
});

module.exports = router;
