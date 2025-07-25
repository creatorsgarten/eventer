"use server";
import { authHeaders } from "@/config/header";
import { env } from "@/env";
import { client } from "./client";

export async function getSession() {
	// If backend URL points to localhost, return null (not available in production)
	if (!env.NEXT_PUBLIC_BACKEND_URL || env.NEXT_PUBLIC_BACKEND_URL.includes("localhost")) {
		return null;
	}

	try {
		const res = await client.api.auth.session.get({
			headers: {
				...authHeaders,
			},
		});

		if (res.status !== 200) {
			return null;
		}

		return res?.data?.user;
	} catch {
		// Silent error handling during build to prevent Vercel build failures
		return null;
	}
}
