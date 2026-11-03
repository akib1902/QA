playwright-qa-portfolio/
├── .github/
│   └── workflows/
│       └── playwright.yml     # Automated CI/CD pipeline script
├── src/
│   ├── pages/                 # Page Object Model (POM) classes
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   └── utils/
│       └── api-client.ts      # Custom API helper (if extending Playwright request)
├── tests/
│   ├── api/
│   │   └── auth-api.spec.ts   # Backend / API automation endpoints
│   ├── e2e/
│   │   └── login-flow.spec.ts # Frontend UI user journeys
│   ├── integration/
│   │   └── hybrid-flow.spec.ts# Hybrid API setup + UI verification tests
│   └── visual/
│       └── visual.spec.ts     # Visual regression/snapshot tests
├── .env.example               # Template for BASE_URL, API_KEY, etc.
├── .gitignore                 # Excludes node_modules, test-results, and .env
├── playwright.config.ts       # Central Playwright configurations
├── package.json               # Dependencies and execution scripts
└── README.md                  # Detailed portfolio documentation


**package.json**
{
  "name": "playwright-qa-portfolio",
  "version": "1.0.0",
  "description": "Production-ready Playwright QA Automation Portfolio",
  "scripts": {
    "test": "npx playwright test",
    "test:ui": "npx playwright test --project=chromium --headed",
    "test:e2e": "npx playwright test tests/e2e/",
    "test:api": "npx playwright test tests/api/",
    "test:report": "npx playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "dotenv": "^16.4.5",
    "typescript": "^5.0.0"
  }
}





**playwright.config.ts**
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});





**.github/workflows/playwright.yml**
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
      env:
        BASE_URL: 'https://expandtesting.com' # Replace with your target app
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
