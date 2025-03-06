import '@testing-library/jest-dom';

const jestJunit = require('jest-junit').default;
module.exports = {
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "reports", outputName: "test-results.xml" }]
  ],
};