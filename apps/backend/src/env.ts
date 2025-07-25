import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
	PORT: z.coerce.number().default(4000),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	SUPABASE_URL: z.string().default(""),
	SUPABASE_KEY: z.string().default(""),
	CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

// Add better error handling for environment validation
let env: z.infer<typeof envSchema>;
try {
	env = envSchema.parse(process.env);
} catch (error) {
	console.error("Environment validation failed:", error);
	throw new Error("Invalid environment configuration");
}

export { env };
