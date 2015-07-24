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
  var debugFlag = namespace+'\\DEBUG';
  grunt.log.writeln("Namespace: "+namespace);

  if (_.has(grunt.pkg, "pluginDependencies") && !_.isEmpty(grunt.pkg.pluginDependencies)) {
    grunt.log.writeln("Plugin dependencies: "+grunt.pkg.pluginDependencies.join(", "));
  }

  var processFunction = function (src, srcpath) {
    return grunt.template.process(src, {
      data: {
        namespace: namespace,
        DEBUG: debugFlag
      }
    });
  };

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
              "Tags: plugin-b <%= false %>\n"+
              "License: <%= pkg.license %>\n"+
              "License URI: <%= false %>\n"+
              "*/\n", {
                data: {
                  pkg: grunt.pkg
                }
              });

            var initCode;
            var activationCode = "";
            var deactivationCode = "";
            var includesCode = "";
            var widgetsCode = "";
            var widgetsRegisterCode = "";
            var settingsCode = "";
            var stylesheetCode = "";
            var javascriptCode = "";
            var settingsPage = "";

            if (fs.existsSync("lib/init.php")) {
              initCode = "include_once plugin_lib_dir().'/init.php';\n";
            }

            var activateDir = grunt.dirs.pluginSource+'/activate/';
            _.forEach(fs.readdirSync(activateDir), function (file) {
              if (_.endsWith(file, ".php")) {
                activationCode += "  include_once plugin_lib_dir().'/activate/"+file+"';\n";
              }
            });
            if (activationCode != "") {
              activationCode = "register_activation_hook(__FILE__, function () {\n"+activationCode+"});\n";
            }

            var deactivateDir = grunt.dirs.pluginSource+'/deactivate/';
            _.forEach(fs.readdirSync(deactivateDir), function (file) {
              if (_.endsWith(file, ".php")) {
                activationCode += "  include_once plugin_lib_dir().'/deactivate/"+file+"';\n";
              }
            });
            if (deactivationCode != "") {
              deactivationCode = "register_deactivation_hook(__FILE__, function () {\n"+deactivationCode+"});\n";
            }

            var dependenciesCode = "";
            if (_.has(grunt.pkg, "pluginDependencies") && !_.isEmpty(grunt.pkg.pluginDependencies)) {
              var depsList = _.map(grunt.pkg.pluginDependencies, function (dep) { return "'"+dep+"'"; }).join(", ");
              dependenciesCode = grunt.file.read(grunt.dirs.coreSource+"/parts/main-deps.php");
              dependenciesCode = grunt.template.process(dependenciesCode, {
                data: {
                  deps: depsList,
                }
              });

              // dependenciesCode = "$pluginDependencies = array("+_.map(grunt.pkg.pluginDependencies, function (dep) { return "'"+dep+"'"; }).join(", ")+");\n"+
              //   "$inactivePlugins = array();\n"+
              //   "include_once( ABSPATH . 'wp-admin/includes/plugin.php' );\n"+
              //   "foreach ($pluginDependencies as $dep) {\n"+
              //   "  if (!is_plugin_active($dep)) {\n"+
              //   "    $inactivePlugins[] = $dep;\n"+
              //   "  }\n"+
              //   "}\n"+
              //   "if (!empty($inactivePlugins)) {\n"+
              //   "  if (is_admin()) "
              //   "  return;\n"+
              //   "}\n";
            }

            // var includesDir = "./lib/";
            var includesDir = grunt.dirs.pluginSource+"/lib/";
            _.forEach(fs.readdirSync(includesDir), function (file) {
              if (_.endsWith(file, ".php") && file != "init.php" && file != "settings.php") {
                includesCode += "include_once plugin_lib_dir().'/"+file+"';\n";
              }
            });

            if (fs.existsSync("lib/settings.php")) {
              var settingsFunction = "add_options_page";
              settingsCode = "add_action('admin_menu', function () {\n    "+settingsFunction+"('"+grunt.pkg.title+"', '"+grunt.pkg.title+"', 'manage_options', '"+pluginName+"', function () {\n      include '"+pluginName+"-settings.php';\n    });\n  });\n";
            }

            var widgetsDir = grunt.dirs.pluginSource+'/widgets/';
            _.forEach(fs.readdirSync(widgetsDir), function (file) {
              if (_.endsWith(file, ".php")) {
                widgetsRegisterCode += "    include_once plugin_widgets_dir().'/"+file+"';\n";
                if (_.endsWith(file, "_Widget.class.php")) {
                  className = file.replace('.class.php', '');
                  widgetsRegisterCode += "    register_widget('\\"+namespace+"\\"+className+"');\n";
                }
              }
            });
            if (widgetsRegisterCode != "") {
              widgetsCode += "\n  add_action('widgets_init', function () {\n"+widgetsRegisterCode+"  });\n\n";
            }

            var i18nCode = "load_plugin_textdomain('"+pluginName+"', false, plugin_languages_dir());";

            if (_(grunt.knownStylesheets).includes('admin.css')) {
              
            }

            return grunt.template.process(src, {
              data: {
                banner: pluginBanner,
                namespace: namespace,
                init: initCode,
                activation: activationCode,
                deactivation: deactivationCode,
                dependencies: dependenciesCode,
                settings: settingsCode,
                includes: includesCode,
                widgets: widgetsCode,
                i18n: i18nCode,
                stylesheets: stylesheetCode,
                js: javascriptCode,
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
            var settingsClass = '\\'+namespace+'\\Settings';

            return grunt.template.process(src, {
              data: {
                title: grunt.pkg.title,
                icon: "themes",
                settingsClass: settingsClass,
              }
            })
          }
        }
      }

    },
    copy: {

      classes: {
        options: {
          process: processFunction
        },
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
        options: {
          process: processFunction
        },
        files: [{
          expand: true, 
          cwd: grunt.dirs.pluginSource+'/widgets/',
          src: ['**'],
          dest: grunt.dirs.dest+'/widgets/'
        }]
      },

      lib: {
        options: {
          process: processFunction
        },
        files: [{
          expand: true,
          cwd: grunt.dirs.pluginSource+'/lib/',
          src: ['**'],
          dest: grunt.dirs.dest+'/lib/'
        }]
      },

      activation: {
        options: {
          process: processFunction
        },
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