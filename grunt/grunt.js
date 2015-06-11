module.exports = function (grunt) {
  var fs = require('fs'),
      util = require('util'),
      path = require('path'),
      _ = require('lodash-node');

  //  load utils and polyfill early
  require('./util.js')(grunt, _);

  // set up some data
  grunt.dirs = {
    'pluginSource': path.resolve("."),
    'coreSource': path.resolve(__dirname+"/.."),
    'dest': path.resolve("../dist")
  };

  var pkgFile = path.normalize(grunt.dirs.pluginSource+'/package.json');
  grunt.pkg = grunt.file.readJSON(pkgFile);

  // build the config from each source's package.json
  // grunt.pluginConfig = {}
  // _(grunt.sources).each(function (src) {
  //   var pkgFile = src+'/package.json';
  //   if (grunt.file.exists(pkgFile)) {
  //     var pkg = grunt.file.readJSON(pkgFile);
  //     _.defaults(grunt.pluginConfig, pkg.config);
  //   }
  // });

  // load tasks
  var cwd = process.cwd();
  process.chdir(grunt.dirs.coreSource);
  require('load-grunt-tasks')(grunt);
  process.chdir(cwd);
  require('load-grunt-tasks')(grunt);

  //  our various build modules
  require('./main.js')(grunt, _);
  require('./javascript.js')(grunt, _);
  require('./stylesheets.js')(grunt, _);

  // push the tasks
  grunt.registerTask('default', [ 'concat' ]);
};
