require("dotenv").config(); // Load environment variables

const express = require("express");
const { Contact, validateContact } = require("../models/contact");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiting to contact route
router.use(limiter);

// Nodemailer transporter setup with verification
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer configuration error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

// POST route to handle contact form submissions
router.post("/", async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, message, phone } = req.body;
  const formattedPhone = phone.startsWith("07")
    ? phone.replace(/^07/, "+2547")
    : phone.startsWith("01")
    ? phone.replace(/^01/, "+2541")
    : phone;

  try {
    // Save the contact details in the database
    const contact = new Contact({
      name,
      email,
      message,
      phone: formattedPhone,
    });
    await contact.save();

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Message from Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${formattedPhone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send the admin email
    await transporter.sendMail(adminMailOptions);

    // Send acknowledgment email to the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send to the user's email
      subject: "We’ve Received Your Message",
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>We have received your message and will get back to you shortly.</p>
        <p>Here’s a copy of your message for your reference:</p>
        <blockquote>
          <p><strong>Message:</strong> ${message}</p>
        </blockquote>
        <p>Best regards,<br/>Customer Support Team</p>
      `,
    };

    // Send the user acknowledgment email
    await transporter.sendMail(userMailOptions);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error in submission process:", error);
    res.status(500).json({ error: "Failed to submit the contact form" });
  }
});

module.exports = router;
