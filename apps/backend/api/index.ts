import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const url = new URL(req.url!, `http://${req.headers.host}`);

		// Create a Request object that Elysia can handle
		const request = new Request(url.href, {
			method: req.method,
			headers: new Headers(req.headers as Record<string, string>),
			body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
		});

		const response = await app.handle(request);

		// Set status code
		res.status(response.status);

		// Set headers
		response.headers.forEach((value, key) => {
			res.setHeader(key, value);
		});

		// Send response body
		const text = await response.text();
		res.send(text);
	} catch (error) {
		console.error("Error handling request:", error);
		console.error(
			"Error stack:",
			error instanceof Error ? error.stack : "No stack trace available"
		);
		res.status(500).json({
			error: "Internal server error",
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
}
