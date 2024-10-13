const express = require("express");
const products = require("../routes/products"); // Ensure these files export router instances
const users = require("../routes/users");
const auth = require("../routes/auth");
const cart = require("../routes/cart");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/products", products); // Expecting products to be a middleware function (router)
  app.use("/api/register", users); // Expecting users to be a middleware function (router)
  app.use("/api/login", auth); // Expecting auth to be a middleware function (router)

  app.use("/api/cart", cart);
};
