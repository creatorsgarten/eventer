import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables
config();

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/infrastructure/db/schema/*",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
