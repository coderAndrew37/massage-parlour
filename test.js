require("dotenv").config(); // Load environment variables
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer configuration error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // Replace with admin email
  subject: "Test Email",
  text: "This is a test email sent from the contact form API",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error("Error sending test email:", error);
  }
  console.log("Test email sent:", info.response);
});
