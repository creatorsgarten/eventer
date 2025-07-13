import { env } from "#backend/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
