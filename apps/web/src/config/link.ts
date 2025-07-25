import { env } from "@/env";

// Get the app URL, with fallback to current host in browser or localhost for builds
const getAppUrl = () => {
	if (env.NEXT_PUBLIC_APP_URL) {
		return env.NEXT_PUBLIC_APP_URL;
	}

	// In browser, use current origin
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	// During build, use localhost
	return "http://localhost:3000";
};

// Generate the sign-in link dynamically at runtime
export const getSignInLink = () => {
	const redirectUri = encodeURIComponent(`${getAppUrl()}/auth/callback`);
	return `https://qtrkroiyvtnwdpjscyvp.supabase.co/auth/v1/authorize?provider=google&redirect_to=${redirectUri}&scopes=email%20profile`;
};

// For backward compatibility, but this will use build-time URL
const REDIRDCT_URI = encodeURIComponent(`${getAppUrl()}/auth/callback`);
export const SIGN_IN_LINK = `https://qtrkroiyvtnwdpjscyvp.supabase.co/auth/v1/authorize?provider=google&redirect_to=${REDIRDCT_URI}&scopes=email%20profile`;
