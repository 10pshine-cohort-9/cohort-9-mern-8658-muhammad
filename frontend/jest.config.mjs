import nextJest from "next/jest.js";

/** @type {import("jest").Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

const createJestConfig = nextJest({
  dir: "./",
});

export default createJestConfig(config);
