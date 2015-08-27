module.exports = function (grunt) {
  var fs = require('fs'),
      _ = require('lodash-node');

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

    }
  });

  if (fs.existsSync('assets/icon.png') || fs.existsSync('assets/icon.jpg')) {
    grunt.config.merge({
      image_resize: {

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
        },

      }
    });
  }

  if (fs.existsSync('assets/banner.png') || fs.existsSync('assets/banner.jpg')) {
    grunt.config.merge({
      image_resize: {

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

      }
    });
  }

  grunt.defaultTasks.push('image_resize');
}