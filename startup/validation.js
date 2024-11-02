const Joi = require("joi");

module.exports = function setupValidation() {
  Joi.objectId = require("joi-objectid")(Joi);
};
