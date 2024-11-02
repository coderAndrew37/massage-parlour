// prod.js
const helmet = require("helmet");
const compression = require("compression");

module.exports = function applyProductionMiddleware(app) {
  app.use(helmet());
  app.use(compression());
};
