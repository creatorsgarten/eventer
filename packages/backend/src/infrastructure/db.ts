import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../modules/event/event.model";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

export type DrizzleClient = typeof db;
