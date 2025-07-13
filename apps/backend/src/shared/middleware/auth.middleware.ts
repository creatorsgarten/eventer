import { bearer } from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { supabase } from "#backend/infrastructure/db/supabase";

export const authMiddleware = new Elysia()
	.use(bearer())
	.derive(async ({ bearer, set }) => {
		if (!bearer) {
			set.status = 401;
			throw new Error("Authentication required");
		}

		const { data, error } = await supabase.auth.getUser(bearer);

		if (error || !data.user) {
			set.status = 401;
			throw new Error("Invalid session");
		}

		return { user: data.user };
	});

export const optionalAuthMiddleware = new Elysia()
	.use(bearer())
	.derive(async ({ bearer }) => {
		if (!bearer) {
			return { user: null };
		}

		const { data, error } = await supabase.auth.getUser(bearer);

		if (error || !data.user) {
			return { user: null };
		}

		return { user: data.user };
	});
