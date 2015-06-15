// Build the plugin's metadata

module.exports = function (grunt) {
  var fs = require('fs'),
      _ = require('lodash-node');

  var pluginName = grunt.pkg.name;
  grunt.log.writeln("Building '"+pluginName+"': "+grunt.pkg.title);
  var namespace = grunt.pkg.namespace.replace('\\', '/');
  var namespaceEscaped = grunt.pkg.namespace.replace('\\', '\\\\');
  grunt.log.writeln("Namespace: "+namespace);

  grunt.config.merge({
    concat: {

      //  Copy the main plugin.php file, customising it to fit
      main: {
        src: grunt.dirs.coreSource+'/parts/main.php',
        dest: grunt.dirs.dest+'/'+pluginName+'.php',
        options: {
          process: function (src) {

            var pluginBanner = grunt.template.process("/*\n"+
              "Plugin Name: <%= pkg.title %>\n"+
              "Plugin URI: <%= pkg.homepage %>\n"+
              "Description: <%= pkg.description %>\n"+
              "Author: <%= pkg.author.name %>\n"+
              "Author URI: <%= pkg.author.url %>\n"+
              "Version: <%= pkg.version %>\n"+
              "Tags: wireframe-b <%= false %>\n"+
              "License: <%= pkg.license %>\n"+
              "License URI: <%= false %>\n"+
              "*/\n", {
                data: {
                  pkg: grunt.pkg
                }
              });

            var initCode;
            var activationCode = "";
            var includesCode = "";
            var widgetsCode = "";
            var widgetsRegisterCode = "";

            if (fs.existsSync("lib/init.php")) {
              initCode = "include_once 'lib/"+namespace+"/init.php';\n";
            }

            var activateDir = grunt.dirs.pluginSource+'/activate/';
            _.forEach(fs.readdirSync(activateDir), function (file) {
              activationCode = "register_activation_hook(__FILE__, function () {\n  include_once 'lib/activate/"+file+"';\n});\n";
            });

            // var includesDir = "./lib/";
            var includesDir = grunt.dirs.pluginSource+"/lib/";
            _.forEach(fs.readdirSync(includesDir), function (file) {
              if (_.endsWith(file, ".php")  && file != "init.php") {
                includesCode += "include_once 'lib/"+namespace+"/"+file+"';\n";
              }
            });

            var widgetsDir = grunt.dirs.pluginSource+'/widgets/';
            _.forEach(fs.readdirSync(widgetsDir), function (file) {
              if (_.endsWith(file, ".php")) {
                widgetsRegisterCode += "  include_once 'widgets/"+namespace+"/"+file+"';\n";
                if (_.endsWith(file, "_Widget.class.php")) {
                  className = file.replace('.class.php', '');
                  widgetsRegisterCode += "  register_widget('"+namespaceEscaped+"\\"+className+"');\n";
                }
              }
            });
            if (widgetsRegisterCode != "") {
              widgetsCode += "\nadd_action('widgets_init', function () {\n"+widgetsRegisterCode+"});\n\n";
            }

            return grunt.template.process(src, {
              data: {
                banner: pluginBanner,
                init: initCode,
                activation: activationCode,
                includes: includesCode,
                widgets: widgetsCode,
              }
            });
            
          }
        }
      }

    },
    copy: {

      classes: {
        files: [{
          expand: true, 
          cwd: grunt.dirs.pluginSource+'/classes/',
          src: ['**'],
          dest: grunt.dirs.dest+'/classes/'+namespace+'/'
        }]
      },

      widgets: {
        files: [{
          expand: true, 
          cwd: grunt.dirs.pluginSource+'/widgets/',
          src: ['**'],
          dest: grunt.dirs.dest+'/widgets/'+namespace+'/'
        }]
      },

      lib: {
        files: [{
          expand: true,
          cwd: grunt.dirs.pluginSource+'/lib/',
          src: ['**'],
          dest: grunt.dirs.dest+'/lib/'+namespace+'/'
        }]
      },

      activation: {
        files: [{
          expand: true,
          cwd: grunt.dirs.pluginSource+'/activate/',
          src: ['**'],
          dest: grunt.dirs.dest+'/lib/activate/'
        }]
      }

    },
  });
}