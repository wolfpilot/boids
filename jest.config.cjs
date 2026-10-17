module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": [
      "ts-jest",
      { diagnostics: false, tsconfig: { allowJs: true } },
    ],
  },
  transformIgnorePatterns: [
    "[\\\\/]node_modules[\\\\/](?!.*@datorama(?:\\+|[\\\\/])akita)",
  ],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/database",
    "src/test",
    "src/types",
  ],
  setupFiles: ["jest-canvas-mock"],
}
