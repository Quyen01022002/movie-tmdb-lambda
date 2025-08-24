module.exports = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js", "!src/config/**"],
  coverageReporters: ["text", "lcov", "json", "html"],
};
