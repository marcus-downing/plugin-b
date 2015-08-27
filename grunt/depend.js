module.exports = function (grunt) {
  var _ = require('lodash-node');

  // Custom Meta Boxes 2
  if (_.has(grunt.pkg.dependencies, 'cmb2')) {
    grunt.inc.includesCode += "include_once('lib/include/cmb/init.php');\n";

    grunt.config.merge({
      copy: {

        cmb2: {
          files: [{
            expand: true, 
            cwd: grunt.dirs.pluginSource+'/node_modules/',
            src: ['cmb/**'],
            dest: grunt.dirs.dest+'/lib/include/'
          }]
        }

      }
    });
  }

}