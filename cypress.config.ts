import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 30000,
  fixturesFolder: false,
  pageLoadTimeout: 200000,
  responseTimeout: 200000,
  video: false,
  viewportHeight: 1200,
  viewportWidth: 1920,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:4200',
    supportFile: false,
    experimentalStudio: true,
  },
})
