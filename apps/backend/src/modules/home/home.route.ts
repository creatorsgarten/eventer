import { sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "#backend/infrastructure/db";

export const homeRouter = new Elysia()
	.get("/", () => "Hello Elysia")
	.get("/api", () => {
		return {
			message: "Welcome to the Eventer API",
			version: "1.0.0",
		};
	})
	.get("/health", async ({ set }) => {
		try {
			await db.execute(sql`SELECT 1`);
			return { status: "ok", timestamp: new Date().toISOString() };
		} catch {
			set.status = 503;
			return { status: "error", timestamp: new Date().toISOString() };
		}
	});
