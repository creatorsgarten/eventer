import { defineConfig } from "drizzle-kit";
import { env } from "#backend/env";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/infrastructure/db/schema/*",
	out: "./drizzle",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
