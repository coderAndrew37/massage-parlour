const express = require("express");
const { Contact, validateContact } = require("../models/contact"); // Import the model and validation function
const nodemailer = require("nodemailer");
const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password if using Gmail
  },
});

// POST route to handle contact form submissions
router.post("/", async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, message } = req.body;

  try {
    // Create a new contact entry
    const contact = new Contact({
      name,
      email,
      message,
    });

    // Save the contact to the database
    await contact.save();
    console.log("Contact submission saved to database for email:", email);

    // Send the contact message via email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Your email address
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Message From Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send the message" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(201).json({ message: "Message sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error saving contact submission:", error);
    res.status(500).json({ error: "Failed to submit the contact form" });
  }
});

module.exports = router;
