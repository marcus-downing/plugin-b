module.exports = function (grunt) {
  var fs = require('fs'),
      util = require('util'),
      path = require('path'),
      _ = require('lodash-node');

  //  load utils and polyfill early
  require('./util.js')(grunt, _);

  // set up some data
  grunt.dirs = {
    'pluginSource': _.first(grunt.sources),
    'coreSource': _.last(grunt.sources),
    'dest': grunt.dest
  };

  var pkgFile = path.normalize(grunt.dirs.pluginSource+'/package.json');
  grunt.pkg = grunt.file.readJSON(pkgFile);

  // build the config from each source's package.json
  grunt.pluginConfig = {}
  _(grunt.sources).each(function (src) {
    var pkgFile = src+'/package.json';
    if (grunt.file.exists(pkgFile)) {
      var pkg = grunt.file.readJSON(pkgFile);
      _.defaults(grunt.pluginConfig, pkg.config);
    }
  });

  // load tasks
  // require('load-grunt-tasks')(grunt);
  var cwd = process.cwd();
  process.chdir(__dirname+"/..");
  require('load-grunt-tasks')(grunt);
  process.chdir(cwd);

  //  our various build modules
  require('./main.js')(grunt, _);
  require('./javascript.js')(grunt, _);
  require('./stylesheets.js')(grunt, _);

  // push the tasks
  grunt.registerTask('default', [ 'concat' ]);
};
