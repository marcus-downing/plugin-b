module.exports = function (grunt) {
  var base = "./node_modules/plugin-b";
  var path = require("path");
  grunt.sources = [
    path.resolve("."),
    path.resolve(base)
  ];
  grunt.dest = path.resolve("../dest");
  require(base+"/grunt/grunt.js")(grunt);
};
