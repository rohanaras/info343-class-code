module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-sass');

	grunt.initConfig({
		connect: {
			server: {
				options: {
					keepalive: true,
					port: 8080,
					base: 'dawg-coffee'
				}
			}
		},
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'dawg-coffee/css/main.css': 'dawg-coffee/scss/main.scss'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/js/medium-effect.js': 'dawg-coffee/js/mdeium-effects.js'
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
				},
				files: {
					'dist/index.html': 'dawg-coffee/index.html',
					'dist/order.html': 'dawg-coffee/order.html'
				}
			}
		}
		copy: {
			dist: {
				expand: true,
				cwd: 'dawg-coffee/img/',
				src: '*',
				dest: 'dist/img/'
			}
		}
	});

	grunt.registerTask('minify', ['uglify', 'htmlmin']);
	grunt.registerTask('default', ['sass', 'minify', 'copy', 'connect']);
};