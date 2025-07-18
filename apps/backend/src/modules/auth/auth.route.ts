import { Elysia, t } from "elysia";
import { db } from "#backend/infrastructure/db";
import { supabase } from "#backend/infrastructure/db/supabase";
import { UserRepository } from "#backend/modules/user/user.repository";
import {
	AuthCallbackSchema,
	AuthSuccessResponseSchema,
	ErrorResponseSchema,
	SuccessResponseSchema,
} from "../../shared/schemas";

const userRepository = new UserRepository(db);

export const authRouter = new Elysia({ prefix: "/auth" })
	.post(
		"/callback",
		async ({ body, cookie: { session } }) => {
			if (!session) {
				throw new Error("Session cookie not available");
			}

			const { access_token, refresh_token } = body;

			const { data, error } = await supabase.auth.setSession({
				access_token,
				refresh_token,
			});

			if (error || !data.session || !data.user) {
				throw new Error("Failed to set session");
			}

			const { user } = data;
			if (!user.email) {
				throw new Error("User email is required");
			}

			const appUser = await userRepository.findByEmail(user.email);

			if (!appUser) {
				await userRepository.create({
					id: user.id,
					email: user.email,
					name: user.user_metadata.full_name || user.email,
				});
			}

			session.set({
				value: data.session.access_token,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
			});

			return {
				success: true,
				message: "Authentication successful",
				user: {
					id: user.id,
					email: user.email,
					name: user.user_metadata.full_name,
					avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
				},
			};
		},
		{
			body: AuthCallbackSchema,
			response: AuthSuccessResponseSchema,
		}
	)
	.post(
		"/logout",
		({ cookie: { session }, set }) => {
			if (!session) {
				set.status = 400;
				return { error: "No session to logout" };
			}

			session.remove();
			set.status = 200;
			return { success: true, message: "Logged out successfully" };
		},
		{
			response: {
				200: SuccessResponseSchema,
				400: ErrorResponseSchema,
			},
		}
	);
