import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

// Create a simple health check first to debug
const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "*",
			credentials: true,
		})
	)
	.get("/api/health", () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
		env: {
			cors_origin: process.env.CORS_ORIGIN || "not set",
			database_url: process.env.DATABASE_URL ? "set" : "not set",
		},
	}))
	.get("/api", () => ({
		message: "Eventer API is running",
		version: "1.0.0",
	}));

// Export the handler for Vercel
export default function handler(req: any, res: any) {
	console.log("Handler called:", {
		method: req.method,
		url: req.url,
		headers: req.headers,
	});

	res.status(200).json({
		message: "Backend API is working on Vercel!",
		method: req.method,
		url: req.url,
		timestamp: new Date().toISOString(),
	});
}
