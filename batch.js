var Etch = require(__dirname + "/node-etch.js");
var fs = require("fs");
var async = require("async");

var path = "/home/oli/Videos/300/";
var frames = fs.readdirSync(path + "frames/");
var count = 0;
async.eachLimit(frames, 1, function(frame, next) {
  count ++;
  Etch(path + "frames/" + frame, path + "output/" + frame, next);
  console.log(frames.length - count);
}, function() {
  console.log("DONE");
});
