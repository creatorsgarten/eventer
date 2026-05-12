import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const origin = requestUrl.origin;

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error("Error exchanging code for session:", error);
			return NextResponse.redirect(`${origin}/auth/login?error=${error.message}`);
		}
	}

	// URL to redirect to after sign in process completes
	return NextResponse.redirect(`${origin}/event`);
}
