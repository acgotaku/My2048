'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var modRewrite = require('connect-modrewrite');
  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n' ,
    yeoman: yeomanConfig,
    watch: {
      script: {
        files: ['<%= yeoman.app %>/dist/{support2048.js,showAnimation2048.js,main2048.js}'],
        tasks: ['concat', 'uglify', 'copy:main']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/css/{,*/}*.css',
          '<%= yeoman.app %>/js/{,*/}*.js'
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['<%= yeoman.app %>/dist/{support2048.js,showAnimation2048.js,main2048.js}'],
        dest: '<%= yeoman.app %>/dist/<%= pkg.name %>.js'
      },
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      dist: {
        options: {
          jshintrc: '<%= yeoman.app %>/dist/.jshintrc'
        },
        src: ['<%= yeoman.app %>/dist/{support2048.js,showAnimation2048.js,main2048.js}']
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= yeoman.app %>/dist/<%= pkg.name %>.min.js'
      },
    },
    copy: {
        main: {
            files: [
            {
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>/dist',
              src: ['<%= pkg.name %>.min.js','<%= pkg.name %>.js'],
              dest: '<%= yeoman.app %>/js/'
            }]
        },
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
      },
      proxies: [
        {
          context: '/api',
          host: 'localhost',
          port: 3000,
          https: false,
          changeOrigin: false,
          xforward: false
        }
      ],
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              proxySnippet,
              modRewrite([
               '!\\.html|\\.js|\\.css|\\.swf|\\.jp(e?)g|\\.png|\\.gif|\\.eot|\\.woff|\\.ttf|\\.svg$ /index.html'
              ]),
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'configureProxies',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });
};

