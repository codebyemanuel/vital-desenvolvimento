import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests-static",
  fullyParallel: true,
  workers: 2,
  reporter: [["list"], ["html", { outputFolder: "playwright-report/static", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:5500",
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "python3 -m http.server 5500 --bind 127.0.0.1 --directory site-html",
    url: "http://127.0.0.1:5500",
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "ignore",
  },
});
