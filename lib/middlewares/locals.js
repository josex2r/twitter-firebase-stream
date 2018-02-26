const path = require('path');
const env = require('node-env-file');

env(path.resolve(__dirname, '../..', '.env'));

module.exports = function(req, res, next) {
  res.locals = {
    env: process.env
  };
  next();
};
