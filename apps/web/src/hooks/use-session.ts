"use client";

import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface UserInfo {
	id: string;
	email: string;
	name: string;
	avatar_url?: string;
}

function mapUser(supabaseUser: User | null): UserInfo | null {
	if (!supabaseUser) return null;
	return {
		id: supabaseUser.id,
		email: supabaseUser.email ?? "",
		name:
			supabaseUser.user_metadata.full_name ??
			supabaseUser.user_metadata.name ??
			supabaseUser.email ??
			"",
		avatar_url:
			supabaseUser.user_metadata.avatar_url ?? supabaseUser.user_metadata.picture ?? undefined,
	};
}

export function useSession() {
	const [user, setUser] = useState<UserInfo | null | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	const supabase = createClient();

	const refetch = useCallback(async () => {
		const {
			data: { user: supabaseUser },
		} = await supabase.auth.getUser();
		setUser(mapUser(supabaseUser));
	}, [supabase]);

	useEffect(() => {
		// Get the initial session on mount
		supabase.auth.getUser().then(({ data: { user: supabaseUser } }) => {
			setUser(mapUser(supabaseUser));
			setIsLoading(false);
		});

		// Keep state in sync with Supabase auth events (sign-in, sign-out, token refresh)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(mapUser(session?.user ?? null));
			setIsLoading(false);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	return { user, isLoading, refetch };
}
