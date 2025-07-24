"use server";
import { authHeaders } from "@/config/header";
import { env } from "@/env";
import { client } from "./client";

export async function getSession() {
	// During build time, if no backend URL is configured, return null immediately
	if (!env.NEXT_PUBLIC_BACKEND_URL && typeof window === "undefined") {
		// Silent return during build - no logging to avoid Vercel build issues
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
