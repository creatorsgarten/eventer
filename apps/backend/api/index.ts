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
export default async function handler(req: any, res: any) {
	// Set CORS headers
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

	// Handle preflight requests
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	console.log("Backend handler called:", {
		method: req.method,
		url: req.url,
		timestamp: new Date().toISOString(),
	});

	res.status(200).json({
		message: "Eventer Backend API is working!",
		method: req.method,
		url: req.url,
		timestamp: new Date().toISOString(),
		version: "1.0.0",
	});
}
