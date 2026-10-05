import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './helper-scripts',
    fullyParallel: true,
    workers: 4,
    timeout: 60_000,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://localhost:9000',
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
            args: ['--autoplay-policy=no-user-gesture-required'],
        },
    },
    webServer: {
        command: process.env.CI ? 'npm run serve:dist' : 'npm run serve',
        url: 'http://localhost:9000/index.html',
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
    },
});
