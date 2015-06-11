// Build the plugin's metadata

module.exports = function (grunt, _) {
  var pluginName = grunt.pkg.name;
  grunt.log.writeln("Building '"+pluginName+"': "+grunt.pkg.title);

  var mainFile = grunt.dirs.coreSource+'/lib/main.php';

  grunt.config.merge({
    concat: {

      main: {
        src: mainFile,
        dest: grunt.dest+'/'+pluginName+'.php',
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

            return grunt.template.process(src, {
              data: {
                banner: pluginBanner
              }
            });
            
          }
        }
      }

    }
  });
}