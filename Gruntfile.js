/*!
 * SmartAdmin's Gruntfile for HTML / AJAX / PHP Versions (please use a seperate Gruntfile for the AngularJS verison)
 * Copyright 2013-2014 MYORANGE INC.
 */

module.exports = function(grunt) {
  'use strict';
  
  // DEFINE DIRECTORY FOR SMARTADMIN VERSION HERE
  var globalConfig = {
    src: 'sources',
    dest: 'build' // PHP_version/PHP_AJAX_Version | PHP_version/PHP_HTML_Version | HTML_version | AJAX_version |
  };
    
  // DEFINE YOUR VERSION NAME 	  
  grunt.initConfig({
  	globalConfig: globalConfig,
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Standard v<%= pkg.version %>\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery\') }\n\n',
    
    // MINIFY JS FILE
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
	  build: {
	  	
        // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
        // runs and build the appropriate src-dest file mappings then, so you
        // don't need to update the Gruntfile when files are added or removed.
        files: [{
            expand: true,
            src: ['**/*.js', '!**/*.min.js', '!**/*.backup.js'],
            dest: '<%= globalConfig.dest %>/js/',
            cwd: '<%= globalConfig.src %>/js/',
            extDot: 'last',
            ext: '.min.js'
            
        }]
      }
    },
    
    // LESS FILE COMPILATION
	less: {
	  development: {
	    options: {
	      banner: '<%= banner %>'
	    },
	    files: {
          "<%= globalConfig.src %>/css/bootstrap.css": "<%= globalConfig.src %>/less/bootstrap.less",
	      "<%= globalConfig.src %>/css/smartadmin-production.css": "<%= globalConfig.src %>/less/smartadmin-production.less",
	      "<%= globalConfig.src %>/css/font-awesome.css": "<%= globalConfig.src %>/less/library/fontawesome/font-awesome.less",
	      "<%= globalConfig.src %>/css/smartadmin-skins.css": "<%= globalConfig.src %>/less/smartadmin-skin/smartadmin-skins.less"
	    }
	  }
	},
	
	// MINIFY CSS
	cssmin: {
	  minify: {
	    expand: true,
	    src: ['*.css', '!*.min.css'],
	    dest: '<%= globalConfig.dest %>/css/',
	    cwd: '<%= globalConfig.src %>/css/',
	    extDot: 'last',
	    ext: '.min.css'
	  }
	},

    // COPY RESOURCES
    copy: {
        images: {
            files: [
                {
                    expand: true,
                    cwd: '<%= globalConfig.src %>/img',
                    src: ['**/*.{png,jpg,svg,gif}'],
                    dest:'<%= globalConfig.dest %>/img'
                }
            ]
        },
        fonts: {
            files: [
                {
                    expand: true,
                    cwd: '<%= globalConfig.src %>/fonts',
                    src: ['**/*.{otf,eot,svg,ttf,woff}'],
                    dest:'<%= globalConfig.dest %>/fonts'
                }
            ]
        }
    }
  });



    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['uglify', 'less', 'cssmin', 'copy']);
    grunt.registerTask('dist-less', ['less','cssmin']);
    grunt.registerTask('dist-js', ['uglify']);
    grunt.registerTask('dist-resources', ['copy']);

};