import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // Serial execution required: all tests share one SQLite database, parallel workers contaminate each other's state
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: [
    { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true, cwd: '.' },
  ],
});
