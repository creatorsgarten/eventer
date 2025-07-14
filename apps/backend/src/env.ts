import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
	PORT: z.coerce.number().default(4000),
	DATABASE_URL: z.string(),
	SUPABASE_URL: z.string().default(""),
	SUPABASE_KEY: z.string().default(""),
	CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
