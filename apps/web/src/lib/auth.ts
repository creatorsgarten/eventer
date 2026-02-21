"use server";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function getSession() {
	try {
		// Determine backend URL - support both development and production
		const backendUrl = env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

		// Get cookies from the request
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session");

		// If no session cookie, user is not authenticated
		if (!sessionCookie) {
			return null;
		}

		// Call backend API with session cookie
		const res = await fetch(`${backendUrl}/api/auth/session`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${sessionCookie.value}`,
			},
			credentials: "include",
			cache: "no-store", // Don't cache session checks
		});

		if (!res.ok) {
			return null;
		}

		const data = await res.json();
		return data?.user || null;
	} catch (error) {
		// Silent error handling to prevent build/runtime failures
		console.error("Session check failed:", error);
		return null;
	}
}
