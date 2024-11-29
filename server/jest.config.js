/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  roots: ['<rootDir>'],
  automock: false,
  rootDir: "./",
  moduleNameMapper: {
      "^@core/(.*)$": "<rootDir>/core/$1",
      "^@utils/(.*)$": "<rootDir>/utils/$1",
      "^@event/(.*)$": "<rootDir>/event/$1",
      "^@config/(.*)$": "<rootDir>/config/$1",
  },
  testEnvironment: "node",
};
