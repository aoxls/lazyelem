module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            ignore_warning: {
                options: {
                    '-W030': true,
                },
                src: ['lazyelem.js'],
            }
        },

        uglify: {
            main: {
                files: {
                    'lazyelem.min.js': 'lazyelem.js'
                }
            }
        }

    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['jshint', 'uglify']);
}
