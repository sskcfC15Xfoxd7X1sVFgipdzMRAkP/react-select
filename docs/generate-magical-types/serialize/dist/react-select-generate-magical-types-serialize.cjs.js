'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./react-select-generate-magical-types-serialize.cjs.prod.js");
} else {
  module.exports = require("./react-select-generate-magical-types-serialize.cjs.dev.js");
}
