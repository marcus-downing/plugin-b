module.exports = function (grunt) {
  
  grunt.config.merge({

    image_resize: {
      options: {},
      screenshots: {
        options: {
          width: 300,
          height: 225,
          upscale: true,
          crop: true,
          overwrite: true
        },
        src: 'assets/*.{png,jpg}',
        dest: grunt.dirs.assets+'/'
      },

      banner: {
        options: {
          width: 772,
          height: 250,
          upscale: true,
          crop: true,
          overwrite: true
        },
        src: 'assets/banner.{png,jpg}',
        dest: grunt.dirs.assets+'/banner-772x250.jpg'
      },

      banner2x: {
        options: {
          width: 1544,
          height: 500,
          upscale: true,
          crop: true,
          overwrite: true
        },
        src: 'assets/banner.{png,jpg}',
        dest: grunt.dirs.assets+'/banner-1544x500.jpg'
      },

      icon: {
        options: {
          width: 128,
          height: 128,
          crop: true,
          overwrite: true,
        },
        src: 'assets/icon.{png,jpg}',
        dest: grunt.dirs.assets+'/icon-128x128.png'
      },

      icon2x: {
        options: {
          width: 256,
          height: 256,
          crop: true,
          overwrite: true,
        },
        src: 'assets/icon.{png,jpg}',
        dest: grunt.dirs.assets+'/icon-256x256.png'
      }

    }
  });

  grunt.defaultTasks.push('image_resize');
}