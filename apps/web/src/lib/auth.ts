"use server";
import { authHeaders } from "@/config/header";
import { client } from "./client";

export async function getSession() {
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
	} catch (error) {
		// Handle build-time errors gracefully
		console.warn("Session fetch failed (likely during build):", error);
		return null;
	}
}
