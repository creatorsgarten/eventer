// vitest.config.ts
import { defineConfig } from "vitest/config";
import { config } from "dotenv";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"], // Fixed pattern (was .test.ts)
    env: {
      ...config({ path: ".env.test" }).parsed,
    },
  },
});
