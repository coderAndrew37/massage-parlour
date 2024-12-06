// contact.js
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { Contact, validateContact } = require("../models/contact");
const connectToDatabase = require("../startup/db");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Contact Form Submission Route
router.post("/", async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, message, phone } = req.body;
  const formattedPhone = phone.startsWith("07")
    ? `+254${phone.slice(1)}`
    : phone;

  try {
    const contact = new Contact({
      name,
      email,
      message,
      phone: formattedPhone,
    });
    await contact.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We’ve Received Your Message",
      html: `<p>Thank you, ${name}! We have received your message and will get back to you shortly.</p>`,
    });

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Failed to submit the contact form" });
  }
});

module.exports = router;
