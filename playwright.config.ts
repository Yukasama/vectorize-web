import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path, { dirname } from 'node:path';

dotenv.config({ path: path.resolve(dirname('/'), '.env') });

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  reporter: process.env.CI ? 'github' : 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  workers: 1,

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'pnpm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !env.CI,
  //   ignoreHTTPSErrors: true,
  //   stdout: 'ignore',
  //   stderr: 'pipe',
  // },
});
