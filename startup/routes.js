const express = require("express");
const services = require("../routes/services");
const gallery = require("../routes/gallery");
const search = require("../routes/search");
const upload = require("../routes/upload");
const quiz = require("../routes/quiz");
const contact = require("../routes/contact");
const testimonials = require("../routes/testimonials");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/services", services);
  app.use("/api/gallery", gallery);
  app.use("/api/search", search);
  app.use("/api/upload", upload); // Add upload route here
  app.use("/api/quiz", quiz); // Add quiz route here
  app.use("/api/contact", contact); // Add contact route here
  app.use("/api/testimonials", testimonials);
};
