module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        notify: {
            watch: {
                options: {
                    title: 'Task Complete',
                    message: 'Automatic compilation finished running'
                }
            }
        },
        less: {
            main: {
                options: {
                    compress: true,
                    yuicompress: true,
                    sourceMap: true,
                    sourceMapURL: 'main.min.css.map',
                    sourceMapRootpath: '../../'
                },
                files: {
                    "dist/css/main.min.css": "assets/styles/main.less" // destination file and source file
                }
            }
        },
        concat: {
            // 2. Configuration for concatinating files goes here.
            options: {
                sourceMap: true
            },
            templates: {
                options: {
                    sourceMap: false
                },
                src: [
                    'assets/templates/*.html'
                ],
                dest: 'dist/templates.html'
            },
            underscore_bundled: {
                src: [
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.string.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/underscore.template.js'
                ],
                dest: 'dist/js/underscore-bundled.js'
            },
            backbone_bundled: {
                src: [
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.mutators.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/backbone.basicauth.js'
                ],
                dest: 'dist/js/backbone-bundled.js'
            },
            marionette_bundled: {
                src: [
                    'packages/stadline/js-extension-bundle/Resources/public/js/marionette.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/marionette.filtering.js',
                    'packages/stadline/js-extension-bundle/Resources/public/js/jquery.serialize-object.js'
                ],
                dest: 'dist/js/marionette-bundled.js'
            },
            main: {
                src: [
                    'packages/stadline/js-extension-bundle/Resources/public/backbone/extensions/*.js',
                    'assets/scripts/models/*.js',
                    'assets/scripts/collections/*.js',
                    'assets/scripts/views/*.js',
                    'assets/scripts/main.js'
                ],
                dest: 'dist/js/main.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                sourceMapIn: 'dist/js/main.js.map'
            },
            build: {
                src: 'dist/js/main.js',
                dest: 'dist/js/main.min.js'
            }
        },
        watch: {
            styles: {
                files: ['assets/**/*.css', 'assets/**/*.less'],
                tasks: ['less', 'notify:watch'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['assets/**/*.js'],
                tasks: ['concat', 'uglify', 'notify:watch'],
                options: {
                    spawn: false
                }
            },
            templates: {
                files: ['assets/**/*.html'],
                tasks: ['concat', 'uglify', 'notify:watch'],
                options: {
                    spawn: false
                }
            },
            browserify: {
                files: ['browserify-assets/**/*.js'],
                tasks: ['browserify', 'notify:watch'],
                options: {
                    spawn: false
                }
            }
        },
        browserify: {
            'browserify-dist/js/main.js': ['browserify-assets/scripts/main.js']
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('build', ['less', 'concat', 'uglify', 'browserify']);
    grunt.registerTask('dev', ['build', 'watch']);

    grunt.registerTask('default', ['build']);

};