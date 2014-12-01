/*
  Date: 10/04/2013 
  Author: Vinicius Linck <viniciusl@tlantic.com.br>
  
    Description:    File for build based on Grunt package over NodeJS platform.
 */

module.exports = function (grunt) {
    'use strict';
    
    // loading project properties
    var project = grunt.file.readJSON('config/build.conf.json');
    
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),               // loading dependencies
        
        // cleaning last build
        clean: {
            options: {
                force: true,
                "no-write": false
            },
            app: ["src/app.conf.json"],
            dist: ["www", "reports", "docs"],
            release: project.cleanReleasePaths
        },
        
        // organize/build dist pack by env
        copy: {
            dev: {
                src: "config/app.dev.conf.json",
                dest: "src/app.conf.json"
            },
            
            
            // dist
            dist: {
                expand: true,
                cwd: "src/",
                src: "**",
                dest: "www/"
            }
        },
        
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ["src/targets"],
                    outdir: "docs"
                }
            }
        },
        
        shell: {
            /* debugging tools -RAA */
            logcat_dump: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: "adb.exe logcat -s -d CordovaLog LocationManagerService GpsLocationProvider"
            },
            logcat_tail: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: "adb.exe logcat -s CordovaLog LocationManagerService GpsLocationProvider"
            },
            /*** project dependencies ***/
            dependencies: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'bower install'                
            },
            /*** project setup ***/
            setup: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'cordova create --name <%= pkg.name %> --id com.tlantic.<%= pkg.name %> ./'
                
            },
            
            /*** PG plugins ***/
            plugins: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false                    
                },
                command: project.plugins.join("&&")
            },
            
            /*** building platforms ***/
            build_wp7: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'cordova build wp7'
            },
	    build_android: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'cordova build android'
            },
            build_ios: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'cordova build ios'
            },
            
            /*** running over platforms ***/
            run_wp7: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'cordova run wp7'
            },
	    run_android: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'cordova run android'
            },
            run_ios: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    async:false
                },
                command: 'cordova run ios'
            }
        }
    });
    
    
    // loading node dependencies
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    
    // tests
    grunt.registerTask('test', function () {
        grunt.task.run('karma');
    });
    
    // build denvironments
    grunt.registerTask('dev-env', ['clean:app', 'copy:dev']);
    
    // copying release for projects platforms
    grunt.registerTask('release', function () {
        var distro, idx = 0;
        
        for (idx in project.platforms) {
            distro = project.platforms[idx];
            grunt.log.write("Building " + distro + " release...");
            grunt.task.run("shell:build_" + distro);
            grunt.log.write().ok();
        }
    });
    
    // setup environment
    grunt.registerTask('setup', function () {
        var idx = 0, plugin, options, done;
        
        done = function (error, result, code) {
            if (error === null) {
            } else {
                grunt.log.error("Exit code: " + code);
            }
        };
        
        grunt.log.write("Launching Apache Cordova project setup...");
        grunt.task.run(["shell:dependencies", "shell:setup", "release", "shell:plugins"]);
        grunt.log.write().ok();
    });
    
    
    // running over platforms
    grunt.registerTask('android', ['clean',  'copy:dev', 'copy:dist', 'shell:build_android', 'shell:run_android', 'shell:logcat_tail']);
    grunt.registerTask('plugins',['shell:plugins']);

    // debugging
    grunt.registerTask('logcat',['shell:logcat_tail']);
    grunt.registerTask('logcatdump',['shell:logcat_dump']);
    
    // run ALL targets
    grunt.registerTask('all', ['clean','jshint','test','yuidoc','copy:dev','copy:dist','release']); //distribute
    
    // Default task(s).
    grunt.registerTask('default', ['all']);
};

