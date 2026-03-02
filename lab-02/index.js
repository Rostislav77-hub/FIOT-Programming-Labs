const generators = require("./generators");
const consumer = require("./consumer");

module.exports = {
  ...generators,
  ...consumer,
};
