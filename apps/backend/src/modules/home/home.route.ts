import { Elysia } from "elysia";

export const homeRouter = new Elysia()
	.get("/", () => "Hello Elysia")
	.get("/api", () => {
		return {
			message: "Welcome to the Eventer API",
			version: "1.0.0",
		};
	});
