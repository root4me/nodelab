module.exports = function(grunt) {

    // Time how long tasks take.
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurations
    var config = {
        app: 'app',
        dist: 'dist',
        srcjs: ['../bower_components/foundation/js/vendor/modernizr.js', '../bower_components/jquery/dist/jquery.js', 
        '../bower_components/ScrollMagic/js/jquery.scrollmagic.js', '../bower_components/foundation/js/foundation/foundation.js',
        '../bower_components/gsap/src/uncompressed/TweenMax.js', ],
        srccss: ['../bower_components/foundation/css/foundation.css', 'css/scroll.css'],
        srcimg: ['img/demo_tophat.png'],
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['.tmp', '<%= config.dist %>/*', '!<%= config.dist %>/.git*']
                }]
            },
        },

        processhtml: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: ['*.html'],
                    dest: '<%= config.dist %>',
                    ext: '.html'
                }],
            },
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: '<%= config.srcimg %>',
                    dest: '<%= config.dist %>',

                }]
                //console.log('test');

            },

        },

        uglify: {
            options: {
                banner: '/*Packaged on : <%=grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    extDot: 'last',
                    /* Without this jquery.xyz.js and jquery.js at source will only produce one jquery.min.js at the destination folder
                    Drove me nuts wondering why uglify seem to miss files. Turns out, i didnt read the doc close enough.
                    But, why some one thought that setting extDot default to 'first' is the best thing to do is still a mystery. Extensions usually start after the last dot !  */
                    cwd: '<%= config.app %>',
                    src: '<%= config.srcjs %>',
                    dest: '<%= config.dist %>/js',
                    ext: '.min.js'
                }]
            },
        },
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: '<%= config.app %>',
                    src: '<%= config.srccss %>',
                    dest: '<%= config.dist %>/css',
                    ext: '.min.css'
                }]
            }
        },
    });

    grunt.registerTask('default', ['clean', 'copy:dist', 'processhtml', 'cssmin', 'uglify']);

};