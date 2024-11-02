require("dotenv").config();
const express = require("express");
const connectToDatabase = require("../startup/db");
const { Contact, validateContact } = require("../models/contact");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const app = express.Router();

// Database connection for Vercel serverless functions
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Rate limiting for Vercel environment
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// POST route for contact submissions
app.post("/", async (req, res) => {
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
    res.status(500).json({ error: "Failed to submit the contact form" });
  }
});

module.exports = app;
