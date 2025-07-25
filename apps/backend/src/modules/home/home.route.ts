import { Elysia } from "elysia";

export const homeRouter = new Elysia()
	.get("/", () => "Hello Elysia")
	.get("/health", () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || "development",
	}));
