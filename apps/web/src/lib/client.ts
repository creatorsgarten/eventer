import { treaty } from "@elysiajs/eden";
import type { AppType } from "@eventer/backend";
import { env } from "@/env";

// Create a safe backend URL that gracefully handles missing environment variables
const getBackendUrl = () => {
	// If we have the environment variable and it's not localhost, use it
	if (env.NEXT_PUBLIC_BACKEND_URL && !env.NEXT_PUBLIC_BACKEND_URL.includes("localhost")) {
		return env.NEXT_PUBLIC_BACKEND_URL;
	}

	// During build time or when env var is missing/localhost, use a placeholder
	// This prevents build failures but API calls will fail gracefully
	if (typeof window === "undefined") {
		// Server-side (build time) - use a placeholder that won't cause connection errors
		return "http://localhost:4000"; // This will fail gracefully during build
	}

	// Client-side fallback - try to construct from current host
	return `${window.location.protocol}//${window.location.hostname}:4000`;
};

export const client = treaty<AppType>(getBackendUrl());
