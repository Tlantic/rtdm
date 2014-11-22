module.exports = function(config) {
    config.set({
        basePath: '../',
        logLevel: config.LOG_WARN,
        frameworks: ['jasmine'],
        files: [
            'src/lib/angular/angular.min.js',
            'src/lib/angular/angular-*.min.js',
            'src/lib/angular/**.js',
            'src/lib/angular-bindonce/**.js',
            'src/lib/angular-i18n/angular-locale_pt-pt.js',
            'src/lib/google/**.js',
            'src/lib/mrs/*.min.js',
            'src/lib/vendor/**.js',
            'src/lib/tlantic/kernel.js',
            'src/lib/tlantic/kernel.*.js',
            'src/modules/**.js',
            'src/js/**.js',
            'src/js/**/**.js',
            'test/lib/sinon/sinon-server-1.7.3.js',
            'test/lib/sinon/sinon-1.7.3.js',
            'test/lib/angular/angular-mocks.js',
            'test/unit/**/**.js'
        ],
        exclude: [
        ],        
        singleRun: true,
        reportSlowerThan : 500,
        autoWatch: true,
        browsers: ['PhantomJS'],
        reporters: ['dots', 'coverage', 'junit'],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/lib/tlantic/*.js': ['coverage'],
            'src/js/**.js': ['coverage'],
            'src/js/**/**.js': ['coverage']
        },
        junitReporter: {
          outputFile: 'reports/coverage/test-results.xml',
          suite: 'unit' 
        },
        coverageReporter: {
          type : 'html',
          dir : 'reports/coverage/'
        }
    });
}