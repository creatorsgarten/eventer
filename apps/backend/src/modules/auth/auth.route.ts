import { Elysia } from "elysia";
import { db } from "#backend/infrastructure/db";
import { supabase } from "#backend/infrastructure/db/supabase";
import { UserRepository } from "#backend/modules/user/user.repository";
import {
	AuthCallbackSchema,
	AuthResponseSchema,
	AuthSuccessResponseSchema,
	ErrorResponseSchema,
	SuccessResponseSchema,
} from "../../shared/schemas";

const userRepository = new UserRepository(db);

export const authRouter = new Elysia({ prefix: "/api/auth" })
	.get(
		"/session",
		async ({ cookie: { session } }) => {
			if (!session) {
				return { user: null };
			}

			const { data, error } = await supabase.auth.getUser(session.value);
			if (error || !data.user) {
				return { user: null };
			}

			const user = await userRepository.find(data.user.id);
			if (!user) {
				return { user: null };
			}

			return {
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					...(user.avatarUrl && { avatar_url: user.avatarUrl }),
				},
			};
		},
		{
			response: {
				200: AuthResponseSchema,
				401: ErrorResponseSchema,
			},
		}
	)
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
					avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
				});
			}

			session.set({
				value: data.session.access_token,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
			});

			const avatarUrl = user.user_metadata.avatar_url || user.user_metadata.picture;

			return {
				success: true,
				message: "Authentication successful",
				user: {
					id: user.id,
					email: user.email,
					name: user.user_metadata.full_name,
					...(avatarUrl && avatarUrl !== "" && { avatar_url: avatarUrl }),
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
