module.exports = function (grunt) {
  var path = require('path');

  //  load utils and polyfill early
  require('./util.js')(grunt);

  // set up some data
  grunt.dirs = {
    'pluginSource': path.resolve("."),
    'coreSource': path.resolve(__dirname+"/.."),
    'dest': path.resolve("../trunk")
  };

  var pkgFile = path.normalize(grunt.dirs.pluginSource+'/package.json');
  grunt.pkg = grunt.file.readJSON(pkgFile);

  // load tasks
  var cwd = process.cwd();
  process.chdir(grunt.dirs.coreSource);
  require('load-grunt-tasks')(grunt);
  process.chdir(cwd);
  require('load-grunt-tasks')(grunt);

  //  our various build modules
  grunt.defaultTasks = [ 'concat', 'copy' ];
  require('./javascript.js')(grunt);
  require('./stylesheets.js')(grunt);
  require('./main.js')(grunt);
  require('./i18n.js')(grunt);
  require('./docs.js')(grunt);

  // push the tasks
  grunt.registerTask('default', grunt.defaultTasks);
};
