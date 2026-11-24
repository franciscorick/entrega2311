module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/checks/**/*.test.js'],
  cacheDirectory: '<rootDir>/.jest-cache',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageDirectory: 'rdm/coverage',
  clearMocks: true
};
