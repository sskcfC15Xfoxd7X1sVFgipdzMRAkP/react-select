'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./react-select-generate-magical-types-generate.cjs.prod.js");
} else {
  module.exports = require("./react-select-generate-magical-types-generate.cjs.dev.js");
}
