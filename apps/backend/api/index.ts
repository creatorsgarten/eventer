import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

// Create a simple health check first to debug
const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "https://eventer-web-red.vercel.app",
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
	try {
		console.log("Elysia handler called:", {
			method: req.method,
			url: req.url,
			path: req.url?.split("?")[0],
		});

		// Let Elysia handle CORS and preflight entirely
		if (req.method === "OPTIONS") {
			const response = await app.handle(new Request("https://dummy", { method: "OPTIONS" }));
			res.status(response.status);
			for (const [key, value] of response.headers.entries()) {
				res.setHeader(key, value);
			}
			res.end();
			return;
		}

		// For non-API routes, return basic info
		if (!req.url?.includes("/api/")) {
			return res.status(200).json({
				message: "Eventer Backend API",
				version: "1.0.0",
				endpoints: {
					health: "/api/health",
					auth: "/api/auth/*",
					events: "/api/events/*",
				},
			});
		}

		console.log("Calling Elysia app...");

		// Convert Node.js request to Web API Request format
		const protocol = req.headers["x-forwarded-proto"] || "https";
		const host = req.headers.host;
		const url = new URL(req.url, `${protocol}://${host}`);

		const request = new Request(url.href, {
			method: req.method,
			headers: req.headers,
			body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
		});

		console.log("Calling Elysia app with request:", {
			url: request.url,
			method: request.method,
		});

		// Handle the request with Elysia
		const response = await app.handle(request);

		console.log("Elysia response received:", {
			status: response.status,
			statusText: response.statusText,
		});

		// Convert Response object to Node.js response
		res.status(response.status);

		// Set response headers
		for (const [key, value] of response.headers.entries()) {
			res.setHeader(key, value);
		}

		const responseText = await response.text();

		// Try to parse as JSON, fallback to plain text
		try {
			const jsonData = JSON.parse(responseText);
			res.json(jsonData);
		} catch {
			res.send(responseText);
		}
	} catch (error) {
		console.error("Elysia handler error:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: error instanceof Error ? error.message : "Unknown error",
			stack:
				process.env.NODE_ENV === "development"
					? error instanceof Error
						? error.stack
						: undefined
					: undefined,
		});
	}
}
