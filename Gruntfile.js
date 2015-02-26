module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            // 2. Configuration for concatinating files goes here.
            dist: {
                src: [
                    // underscore-bundled.js
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.string.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.template.js',

                    // backbone-bundled.js
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.mutators.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.basicauth.js',

                    // marionette-bundled.js
                    'packages/stadline/js-extension-bundle/Resources/public/js/marionette.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/marionette.filtering.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/jquery.serialize-object.js',

                    // main-bundled.js
                    'packages/stadline/js-extension-bundle/Resources/public/backbone/extensions/*.js',
                    'scripts/models/*.js',
                    'scripts/collections/*.js',
                    'scripts/views/*.js',
                    'scripts/main.js'
                ],
                dest: 'build/main.js'
            }
        },
        uglify: {
            build: {
                src: 'build/main.js',
                dest: 'build/main.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['scripts/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify']);
    grunt.registerTask('dev', ['watch']);

};