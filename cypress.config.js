const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    responseTimeout: 30000,
  },
  fixturesFolder: false,
  video: false,
  screenshotOnRunFailure: true,
  viewportHeight: 1200,
  viewportWidth: 1920,
  allowCypressEnv: false,
});
