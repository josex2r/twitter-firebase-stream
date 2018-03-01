const path = require('path');

module.exports = function(req, res, next) {
  res.locals = {
    env: process.env
  };
  next();
};
