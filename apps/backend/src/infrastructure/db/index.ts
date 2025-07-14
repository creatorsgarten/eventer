import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "#backend/env";
import * as schema from "./schema";

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });

export type DrizzleClient = typeof db;
