var Etch = require(__dirname + "/node-etch.js")
  , argv = require("optimist").argv;

Etch(argv._[0], argv._[1]);
