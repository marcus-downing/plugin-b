//  Build the plugin's main PHP file, and copy the various classes, widgets and include files that go with it into
//  their respective folders

module.exports = function (grunt) {
  var fs = require('fs'),
      _ = require('lodash-node');

  var pluginName = grunt.pkg.name;
  grunt.log.writeln("Building '"+pluginName+"': "+grunt.pkg.title);

  var namespace = grunt.pkg.namespace.replace('^\\', '');
  var namespacePath = namespace.replace('\\', '/');
  var namespaceEscaped = namespace.replace('\\', '\\\\');
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
            var settingsCode = "";
            var stylesheetCode = "";

            if (fs.existsSync("lib/init.php")) {
              initCode = "include_once 'lib/"+namespacePath+"/init.php';\n";
            }

            var activateDir = grunt.dirs.pluginSource+'/activate/';
            _.forEach(fs.readdirSync(activateDir), function (file) {
              activationCode = "register_activation_hook(__FILE__, function () {\n  include_once 'lib/activate/"+file+"';\n});\n";
            });

            // var includesDir = "./lib/";
            var includesDir = grunt.dirs.pluginSource+"/lib/";
            _.forEach(fs.readdirSync(includesDir), function (file) {
              if (_.endsWith(file, ".php") && file != "init.php" && file != "settings.php") {
                includesCode += "include_once 'lib/"+file+"';\n";
              }
            });

            if (fs.existsSync("lib/settings.php")) {
              var settingsFunction = "add_options_page";
              settingsCode = "add_action('admin_menu', function () {\n  "+settingsFunction+"('"+grunt.pkg.title+"', '"+grunt.pkg.title+"', 'manage_options', '"+pluginName+"', function () {\n    include '"+pluginName+"-settings.php';\n  });\n});\n";
            }

            var widgetsDir = grunt.dirs.pluginSource+'/widgets/';
            _.forEach(fs.readdirSync(widgetsDir), function (file) {
              if (_.endsWith(file, ".php")) {
                widgetsRegisterCode += "  include_once 'widgets/"+file+"';\n";
                if (_.endsWith(file, "_Widget.class.php")) {
                  className = file.replace('.class.php', '');
                  widgetsRegisterCode += "  register_widget('\\"+namespace+"\\"+className+"');\n";
                }
              }
            });
            if (widgetsRegisterCode != "") {
              widgetsCode += "\nadd_action('widgets_init', function () {\n"+widgetsRegisterCode+"});\n\n";
            }

            var i18nCode = "load_plugin_textdomain('"+pluginName+"', false, dirname(plugin_basename(__FILE__)).'/languages');";

            if (_(grunt.knownStylesheets).includes('admin.css')) {
              
            }

            return grunt.template.process(src, {
              data: {
                banner: pluginBanner,
                init: initCode,
                activation: activationCode,
                settings: settingsCode,
                includes: includesCode,
                widgets: widgetsCode,
                i18n: i18nCode,
              }
            });
            
          }
        }
      },

      settings: {
        src: grunt.dirs.coreSource+'/parts/settings.php',
        dest: grunt.dirs.dest+'/'+pluginName+'-settings.php',
        options: {
          process: function (src) {
            return grunt.template.process(src, {
              data: {
                title: grunt.pkg.title,
                icon: "themes",
              }
            })
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
          dest: grunt.dirs.dest+'/classes/'+namespacePath+'/'
        }]
      },

      baseClasses: {
        files: [{
          expand: true, 
          cwd: grunt.dirs.coreSource+'/classes/',
          src: ['**'],
          dest: grunt.dirs.dest+'/classes/Plugin_b/'
        }]
      },

      widgets: {
        files: [{
          expand: true, 
          cwd: grunt.dirs.pluginSource+'/widgets/',
          src: ['**'],
          dest: grunt.dirs.dest+'/widgets/'
        }]
      },

      lib: {
        files: [{
          expand: true,
          cwd: grunt.dirs.pluginSource+'/lib/',
          src: ['**'],
          dest: grunt.dirs.dest+'/lib/'
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