const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  app.use(helmet()); // Helmet middleware for security headers
  app.use(compression()); // Compression middleware for gzip compression
};
