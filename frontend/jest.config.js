/** @type {import('jest').Config} */

const config = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,tsx}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
};

module.exports = config;
