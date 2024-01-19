module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper({
    "^src/(.*)$": "<rootDir>/src/$1",
  }),
};
