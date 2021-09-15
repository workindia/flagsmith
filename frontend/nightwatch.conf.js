// Autogenerated by Nightwatch
// Refer to the online docs for more details: https://nightwatchjs.org/gettingstarted/configuration/
require('dotenv').config();

const Services = {};
loadServices();
global.testHelpers = require('./e2e/helpers');
require('dotenv').config({ path: './env' });
const fork = require('child_process').fork;
const { exec } = require('child_process');

const browserSize = 'window-size=1900x1080';

process.env.PORT = 8081;
let server;

// Tests unexpected terminated i.e. Ctrl+c
process.on('SIGINT', () => {
    if (!server.killed) server.kill('SIGINT');
    process.exit(2);
});
let firstTime = true;
module.exports = {
    // An array of folders (excluding subfolders) where your tests are located;
    // if this is not specified, the test source must be passed as the second argument to the test runner.
    src_folders: ['./e2e/tests'],

    // See https://nightwatchjs.org/guide/working-with-page-objects/
    page_objects_path: '',

    // See https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
    custom_commands_path: ['./e2e/custom-commands'],

    // See https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-assertions
    custom_assertions_path: '',

    // See https://nightwatchjs.org/guide/#external-globals
    globals_path: '',

    webdriver: {},
    'test_workers': { 'enabled': true, 'workers': 'auto' },
    parallel_process_delay: process.env.E2E_PARALLEL_PROCESS_DELAY
        ? parseInt(process.env.E2E_PARALLEL_PROCESS_DELAY)
        : 500,
    test_settings: {
        default: {
            globals: {
                'waitForConditionPollInterval': 500, // sometimes internet is slow so wait.
                'waitForConditionTimeout': 20000, // sometimes internet is slow so wait.
                'asyncHookTimeout': 60000,
                'retryAssertionTimeout': 30000,
                before: (browser, done) => {
                    firstTime = false;
                    setTimeout(() => {
                        console.log('Starting server');
                        process.env.NODE_ENV = 'production';
                        server = fork('./server');
                        server.on('message', () => {
                            done();
                        });
                    }, 1000);
                },
                after: (browser, done) => {
                    exec('killall chromedriver');
                    server.kill('SIGINT');
                    process.exit();
                    done();
                },
                afterEach(browser, done) {
                    if (
                        browser.currentTest.results.errors
                        || browser.currentTest.results.failed
                    ) {
                        browser.getLog('browser', (logEntries) => {
                            logEntries.forEach((log) => {
                                if (log.level === 'SEVERE') {
                                    console.log(`[${log.level}] ${log.message}`);
                                }
                            });
                            browser.source((result) => {
                                // Source will be stored in result.value
                                // console.log(result && result.value)
                                done();
                            });
                        });
                    } else {
                        done();
                    }
                },
            },
            desiredCapabilities: {
                javascriptEnabled: true,
                acceptSslCerts: true,

                browserName: 'chrome',
                // handleAlerts: true,
                loggingPrefs: {
                    browser: 'ALL',
                    driver: 'ALL',
                    performance: 'ALL',
                    server: 'ALL',
                },
                'goog:chromeOptions': {
                    args: [
                        'no-sandbox',
                        'ignore-certificate-errors',
                        'allow-insecure-localhost',
                        'headless',
                        browserSize,
                        'allow-file-access-from-files',
                        'use-fake-device-for-media-stream',
                        'use-fake-ui-for-media-stream',
                        'disable-translate',
                        'no-process-singleton-dialog',
                        'disable-gesture-requirement-for-media-playback',
                        'auto-select-desktop-capture-source="Entire screen"',
                        'autoplay-policy=no-user-gesture-required',
                        'no-user-gesture-required',
                        'ignore-certificate-errors',
                        'disable-dev-shm-usage',
                        'disable-gpu',
                    ],
                },
            },

            webdriver: {
                start_process: true,
                port: 9515,
                server_path: Services.chromedriver ? Services.chromedriver.path : '',
                cli_args: [
                    // --verbose
                ],
                log_path: 'logs',
            },
            live_output: true,

        },
    },
};

function loadServices() {
    try {
        Services.seleniumServer = require('selenium-server');
    } catch (err) {}

    try {
        Services.chromedriver = require('chromedriver');
    } catch (err) {}

    try {
        Services.geckodriver = require('geckodriver');
    } catch (err) {}

    try {
        Services.operadriver = require('operadriver');
    } catch (err) {}
}
