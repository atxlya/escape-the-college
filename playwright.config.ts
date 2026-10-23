import { defineConfig, devices } from '@playwright/test';

// Smoke tests run against the production build, served by `vite preview`
// at the same base path GitHub Pages uses.
const PORT = 4173;

export default defineConfig({
  testDir: 'tests',
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}/escape-the-college/`,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/escape-the-college/`,
    reuseExistingServer: true,
  },
});
