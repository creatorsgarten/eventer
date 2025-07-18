import { Elysia, status } from "elysia";
import { db } from "#backend/infrastructure/db";
import {
	CreateUserSchema,
	SuccessResponseSchema,
	UpdateUserSchema,
	UserSchema,
	UserWithErrorResponseSchema,
} from "../../shared/schemas";
import {
	createUser,
	deleteUser,
	getUserByEmail,
	getUserById,
	updateUser,
} from "./services/crud-user.service";
import { UserRepository } from "./user.repository";

const userRepository = new UserRepository(db);

export const userRouter = new Elysia({ prefix: "/user" })
	.post(
		"/",
		async ({ body }) => {
			return await createUser(userRepository, body);
		},
		{
			body: CreateUserSchema,
			response: UserSchema,
		}
	)
	.get(
		"/:id",
		async ({ params }) => {
			const user = await getUserById(userRepository, params.id);
			if (!user) {
				return status(404, { error: "User not found" });
			}
			return user;
		},
		{
			response: UserWithErrorResponseSchema,
		}
	)
	.put(
		"/:id",
		async ({ params, body }) => {
			return await updateUser(userRepository, params.id, body);
		},
		{
			body: UpdateUserSchema,
			response: UserSchema,
		}
	)
	.delete(
		"/:id",
		async ({ params }) => {
			await deleteUser(userRepository, params.id);
			return { success: true, message: "User deleted successfully" };
		},
		{
			response: SuccessResponseSchema,
		}
	)
	.get(
		"/email/:email",
		async ({ params }) => {
			const user = await getUserByEmail(userRepository, params.email);
			if (!user) {
				return status(404, { error: "User not found" });
			}
			return user;
		},
		{
			response: UserWithErrorResponseSchema,
		}
	);
