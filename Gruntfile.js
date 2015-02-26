module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            main: {
                options: {
                    compress: true,
                    yuicompress: true
                },
                files: {
                    "build/main.min.css": "styles/main.less" // destination file and source file
                }
            }
        },
        concat: {
            // 2. Configuration for concatinating files goes here.
            templates: {
                src: [
                    'templates/*.html'
                ],
                dest: 'build/templates.html'
            },
            underscore_bundled: {
                src: [
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.string.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.template.js'
                ],
                dest: 'build/underscore-bundled.js'
            },
            backbone_bundled: {
                src: [
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.mutators.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.basicauth.js'
                ],
                dest: 'build/backbone-bundled.js'
            },
            marionette_bundled: {
                src: [
                    'packages/stadline/js-extension-bundle/Resources/public/js/marionette.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/marionette.filtering.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/jquery.serialize-object.js'
                ],
                dest: 'build/marionette-bundled.js'
            },
            main: {
                src: [
                    'build/underscore-bundled.js',
                    'build/backbone-bundled.js',
                    'build/marionette-bundled.js',
                    
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
            styles: {
                files: ['styles/*.less', 'styles/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['scripts/*.js', 'scripts/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            },
            templates: {
                files: ['templates/*.html', 'templates/**/*.html'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['less', 'concat', 'uglify']);

};