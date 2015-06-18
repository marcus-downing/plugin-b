module.exports = function (grunt) {
  var fs = require('fs'),
      path = require('path'),
      _ = require('lodash-node');
  

  //  functions to find files across multiple source folders
  grunt.plugin_b = {
    isValidFile: function (file) {
      var paths = file.split('/');
      var fn = _.last(paths);
      return fn[0] != '_' && fn[0] != '.';
    },

    filenameMatchesWildcard: function (pattern) {
      if (_.isNull(pattern) || _.isEmpty(pattern)) {
        return function (file) {
          return true;
        };
      }

      return function (file) {
        var paths = file.split('/');
        var fn = _.last(paths);

        var rex = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
        rex = rex.replace(/\{(.*?)\}/g, '\($1\)').replace(/,/g, '|');
        rex = '^'+rex+'$';
        // if (grunt.debug) console.log("Wildcare regex: "+rex);
        var re = new RegExp(rex);
        return fn.match(re);
      };
    },


    locateFile: function (filename) {
      var fileVersions = _(grunt.sources).map(function (src) {
        return src+'/'+filename;
      }).filter(function (path) {
        return grunt.file.exists(path);
      });

      if (fileVersions.isEmpty()) {
        return null;
      } else {
        return fileVersions.first();
      }
    },

    locateFolders: function (path) {
      return _(grunt.sources).map(function (src) {
        return src+'/'+path;
      }).filter(function (src) {
        return grunt.file.exists(src) && fs.statSync(src).isDirectory();
      }).value();
    },

    locateFiles: function (path, pattern) {
      var sources = _(grunt.sources).map(function (src) {
        return src+'/'+path;
      }).filter(function (src) {
        return grunt.file.exists(src) && fs.statSync(src).isDirectory();
      }).value();

      var matchesPattern = grunt.wb.filenameMatchesWildcard(pattern);
      var names = _(sources).map(function (src) {
        var files = fs.readdirSync(src);
        files = _(files).filter(function (name) {
          var filename = src+'/'+name;
          return fs.statSync(filename).isFile();
        }).value();
        // if (grunt.debug) console.log("Found files named: "+files);
        return files;
      }).flatten().filter(function (str) {
        // if (grunt.debug) console.log("Checking name: "+str);
        return str != "" && matchesPattern(str);
      }).uniq();
      if (names.isEmpty())
        return [];
      // if (grunt.debug) console.log("Found files named: "+names);

      var files = names.map(function (name) {
        // if (grunt.debug) console.log("Looking for files named: "+name);
        return _(sources).map(function (src) {
          return src+'/'+name;
        }).filter(function (filename) {
          // if (grunt.debug) console.log("Checking file: "+filename);
          return grunt.file.exists(filename);
        }).first();
      }).value();
      // if (grunt.debug) console.log("Found files: "+files);
      return files;
    },

    locateFilesDeep: function (path, pattern) {
      var matchesPattern = grunt.wb.filenameMatchesWildcard(pattern);

      function recurseFiles (dir) {
        var files = fs.readdirSync(dir);
        return _(files).map(function (file) {
          var filename = dir+'/'+file;
          // if (grunt.debug) console.log("? "+filename);
          if (fs.statSync(filename).isDirectory()) {
            return recurseFiles(filename);
          } else {
            if (matchesPattern(file))
              return [ filename ];
            else
              return [];
          }
        }).flatten().value();
      }

      var files = _(grunt.sources).map(function (src) {
        return src+'/'+path;
      }).filter(function (src) {
        return grunt.file.exists(src) && fs.statSync(src).isDirectory();
      }).map(function (src) {
        return recurseFiles(src);
      }).flatten().value();

      // if (grunt.debug) console.log("Found files: "+JSON.stringify(files, null, 4));
      return files;
    },

    locateSets: function (path) {
      var sources = _(grunt.sources).map(function (src) {
        return src+'/'+path;
      }).filter(function (src) {
        return grunt.file.exists(src) && fs.statSync(src).isDirectory();
      }).value();

      return _(sources).map(function (src) {
        return _(fs.readdirSync(src)).filter(function (dirset) {
          var path = src+'/'+dirset;
          return fs.statSync(path).isDirectory();
        }).value();
      }).flatten().uniq().value();
    },

    locateSetFiles: function (path, set, pattern, key) {
      // if (grunt.debug) console.log("\nLocate set files: "+path+", "+set+", "+pattern+", "+key);
      var sources = _(grunt.sources).map(function (src) {
        return src+'/'+path+'/'+set;
      }).filter(function (src) {
        return grunt.file.exists(src) && fs.statSync(src).isDirectory();
      });
      // if (grunt.debug) console.log(" in sources: "+sources);

      if (!!key) {
        var keyedSources = sources.map(function (src) {
          return src+'/'+key;
        }).filter(function (keyfile) {
          // if (grunt.debug) console.log("Checking keyed source: "+keyfile);
          return grunt.file.exists(keyfile);
        });

        if (!keyedSources.isEmpty()) {
          // if (grunt.debug) console.log("Found keyed sources: "+keyedSources);
          return [ keyedSources.first() ];
        }
      }

      var matchesPattern = grunt.wb.filenameMatchesWildcard(pattern);
      var names = _(sources).map(function (src) {
        var files = fs.readdirSync(src);
        files = _(files).filter(function (name) {
          var filename = src+'/'+name;
          return fs.statSync(filename).isFile();
        }).value();
        // if (grunt.debug) console.log("Found files named: "+files);
        return files;
      }).flatten().filter(function (str) {
        // if (grunt.debug) console.log("Checking name: "+str);
        return str != "" && matchesPattern(str);
      }).uniq();
      if (names.isEmpty())
        return [];
      // if (grunt.debug) console.log("Found files named: "+names);

      var files = names.map(function (name) {
        // if (grunt.debug) console.log("Looking for files named: "+name);
        return _(sources).map(function (src) {
          return src+'/'+name;
        }).filter(function (filename) {
          // if (grunt.debug) console.log("Checking file: "+filename);
          return grunt.file.exists(filename);
        }).first();
      }).value();
      // if (grunt.debug) console.log("Found files: "+files);
      return files;
    },

    localFilename: function (filename, sets) {
      if (!_.isArray(sets)) {
        sets = grunt.wb.locateFolders(sets);
      }
      return _(sets).map(function (set) {
        if (_(filename).startsWith(set))
          return filename.substr(set.length);
        return false;
      }).compact().map(function (local) {
        if (_(local).startsWith('/'))
          local = local.substr(1);
        return local;
      }).first();
    }
  };
}