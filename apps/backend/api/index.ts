import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// Convert Vercel request to Web Request
	const url = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}${req.url}`;
	const headers = new Headers();
	Object.entries(req.headers).forEach(([key, value]) => {
		if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
	});

	const request = new Request(url, {
		method: req.method,
		headers,
		body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
	});

	// Handle with Elysia
	const response = await app.handle(request);

	// Convert Web Response to Vercel Response
	res.status(response.status);
	response.headers.forEach((value, key) => {
		res.setHeader(key, value);
	});

	const body = await response.text();
	res.send(body);
}
