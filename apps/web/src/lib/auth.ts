"use server";
import { createClient } from "@/lib/supabase-server";

export async function getSession() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			return null;
		}

		return {
			id: user.id,
			email: user.email ?? "",
			name: user.user_metadata.full_name ?? user.user_metadata.name ?? user.email ?? "",
			avatar_url: user.user_metadata.avatar_url ?? user.user_metadata.picture ?? undefined,
		};
	} catch (error) {
		console.error("Session check failed:", error);
		return null;
	}
}
