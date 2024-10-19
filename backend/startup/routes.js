const express = require("express");
const services = require("../routes/services");
const testimonials = require("../routes/testimonials");
const gallery = require("../routes/gallery");
const search = require("../routes/search");
const upload = require("../routes/upload");
const team = require("../routes/teamMembers");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/services", services);
  app.use("/api/testimonials", testimonials);
  app.use("/api/gallery", gallery);
  app.use("/api/search", search);
  app.use("/api/upload", upload); // Add upload route here
  app.use("/api/team", team); // Add team route here
};
