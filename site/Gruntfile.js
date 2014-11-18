module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist',
        srcjs: ['../bower_components/foundation/js/vendor/modernizr.js', '../bower_components/foundation/js/vendor/jquery.js', '../bower_components/foundation/js/foundation/foundation.min.js'],
        srccss: ['../bower_components/foundation/css/foundation.css']
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
            server: '.tmp'
            //??
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
                    src: '<%= config.vendorjs %>',
                    dest: 'dist/jstmp/*.*',

                }]
                //console.log('test');
            },

        },

        uglify: {
            options: {
                banner: '/*!<%=pkg.name%> <%=grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
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

    grunt.registerTask('default', ['clean', 'processhtml', 'cssmin', 'uglify']);

};