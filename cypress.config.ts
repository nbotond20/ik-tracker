import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 10000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.ts',
    baseUrl: 'http://localhost:3000',
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'cypress/reports/testReport-[hash].junit.xml',
    },
  },
})
