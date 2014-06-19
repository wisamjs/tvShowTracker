var path = require('path');

var stylesheetsDir = 'public/stylesheets/';

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					port: 9001
				}
			}
		},
		sass: {                              // Task
			dist: {                            // Target
				options: {                       // Target options
					style: 'expanded'
				},
				files: {                         // Dictionary of files
					'public/stylesheets/style.css': stylesheetsDir + 'style.scss'      // 'destination': 'source'
				}
			}
		},
		watch: {
			js: {
				files: ['public/vendor/*.js'],
				options: {
					livereload: true
				}
			},
			css: {
				files: ['styles/*.scss'],
				tasks: ['sass'],
				options: {
					livereload: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Run the server and watch for file changes
	grunt.registerTask('default', ['connect','sass', 'watch']);
};