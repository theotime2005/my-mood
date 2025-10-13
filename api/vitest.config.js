import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: "src",
    },
    setupFiles: ["tests/setup.js"],
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
  },
});
