module.exports = (config) => {
    config.set({
        frameworks: [
            'jasmine'
        ],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-spec-reporter'),
            require('karma-webpack')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        files: [{
            pattern: 'src/**/*.spec.ts'
        }],
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        preprocessors: {
            'src/**/*.spec.ts': ['webpack']
        },
        webpack: require('./webpack.config'),
        reporters: ['spec', 'kjhtml'],
        specReporter: {
            maxLogLines: 5,         // limit number of lines logged per test
            suppressErrorSummary: true,  // do not print error summary
            suppressFailed: false,  // do not print information about failed tests
            suppressPassed: false,  // do not print information about passed tests
            suppressSkipped: true,  // do not print information about skipped tests
            showSpecTiming: false // print the time elapsed for each spec
        },
        browsers: ['Chrome'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        logLevel: config.LOG_INFO,
        singleRun: false
    });
};
