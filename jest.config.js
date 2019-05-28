module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/lib/", "/node_modules/"],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  collectCoverage: true
}