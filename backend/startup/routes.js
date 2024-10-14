const express = require("express");
const services = require("../routes/services");
const testimonials = require("../routes/testimonials");
const gallery = require("../routes/gallery");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/services", services);
  app.use("/api/testimonials", testimonials);
  app.use("/api/gallery", gallery);
};
