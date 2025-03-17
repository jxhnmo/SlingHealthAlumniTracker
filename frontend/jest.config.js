/** @type {import('jest').Config} */

const config = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,tsx}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
};

module.exports = config;
