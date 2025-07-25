// import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src";

export const config = {
	runtime: "edge", //  Required for edge deployment
};

export default async function handler(request: Request): Promise<Response> {
	return app.handle(request);
}
