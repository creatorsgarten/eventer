import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "#backend/env";
import * as schema from "./schema";

// Configure for serverless with connection pooling
const client = postgres(env.DATABASE_URL, {
	max: 1, // Limit connections for serverless
	idle_timeout: 20,
	max_lifetime: 60 * 30, // 30 minutes
});

export const db = drizzle(client, { schema });

export type DrizzleClient = typeof db;
