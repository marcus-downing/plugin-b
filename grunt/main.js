// Build the plugin's metadata

module.exports = function (grunt, _) {
  var pluginName = grunt.pkg.name;
  grunt.log.writeln("Building '"+pluginName+"': "+grunt.pkg.title);
  var namespace = grunt.pkg.namespace.replace('\\', '/');
  grunt.log.writeln("Namespace: "+namespace);

  grunt.config.merge({
    concat: {

      //  Copy the main plugin.php file, customising it to fit
      main: {
        src: grunt.dirs.coreSource+'/parts/main.php',
        dest: grunt.dirs.dest+'/'+pluginName+'.php',
        options: {
          process: function (src) {

            var pluginBanner = grunt.template.process("/*!\n"+
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

            var activationCode = "";
            var includesCode = "";
            var widgetsCode = "";

            activationCode = "register_activation_hook(__FILE__, function () {\n  include_once 'inc/activate.php';\n});";

            return grunt.template.process(src, {
              data: {
                banner: pluginBanner,
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
      }

    }
  });
}