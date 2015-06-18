//  Build stylesheets from either LESS or SASS (or just plain CSS), depending on which folder exists.
//  Builds a separate .css for each file in the 'sass' or 'less' folder, excluding any starting with a _

module.exports = function (grunt) {
  var fs = require('fs'),
      _ = require('lodash-node');

  //  SASS / SCSS
  if (fs.existsSync("sass")) {
    grunt.log.writeln("Using SASS stylesheets");

    var sassOptions = {};
    var sassAdminOptions = sassOptions;

    var sassConfigs = {};
    _.forEach(fs.readdirSync("sass"), function (file) {
      if ( _(file).startsWith("_") || _(file).startsWith(".") || !(_(file).endsWith(".sass") || _(file).endsWith(".scss")) ) {
        return;
      }

      var name = file.substring(0, file.length - 5);
      sassConfigs[name] = {
        options: sassOptions,
        src: 'sass/'+file,
        dest: grunt.dirs.dest+'/css/'+name+'.css'
      }
    });

    if (!_(sassConfigs).isEmpty()) {
      grunt.config.merge({
        sass: sassConfigs
      });
      grunt.defaultTasks.push('sass');
    }


  //  LESS
  } else if (fs.existsSync("less")) {
    grunt.log.writeln("Using LESS stylesheets");

    var lessOptions = {};
    var lessAdminOptions = lessOptions;

    var lessConfigs = {};
    _.forEach(fs.readdirSync("less"), function (file) {
      if ( _(file).startsWith("_") || _(file).startsWith(".") || !_(file).endsWith(".less") ) {
        return;
      }

      var name = file.substring(0, file.length - 5);
      lessConfigs[name] = {
        options: lessOptions,
        src: 'less/'+file,
        dest: grunt.dirs.dest+'/css/'+name+'.css'
      }
    });

    if (!_(lessConfigs).isEmpty()) {
      grunt.config.merge({
        less: lessConfigs
      });
      grunt.defaultTasks.push('less');
    }

  } else if (fs.existsSync("css")) {
    grunt.log.writeln("Using CSS stylesheets");

    grunt.config.merge({
      copy: {
        css: {

          files: [{
            expand: true, 
            cwd: grunt.dirs.pluginSource+'/css/',
            src: ['**.css'],
            dest: grunt.dirs.dest+'/css/'
          }]

        }
      }
    })
  }
}