module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "BuildX API Test Report",
      "outputPath": "./test-report.html"
    }]
  ]
};
