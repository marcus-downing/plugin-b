module.exports = function (grunt) {
  
  grunt.config.merge({
    copy: {

      //  Copy the main readme.txt file
      readme: {
        files: [{
          cwd: grunt.dirs.pluginSource,
          src: 'README.txt',
          dest: grunt.dirs.dest+'/README.txt'
        }]
      }
    }
  });
}