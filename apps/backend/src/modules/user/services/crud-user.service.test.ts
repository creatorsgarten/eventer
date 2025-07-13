import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "#backend/infrastructure/db";
import type { CreateUserDTO } from "../dtos/create-user.dto";
import type { UpdateUserDTO } from "../dtos/update-user.dto";
import { users } from "../user.model";
import { UserRepository } from "../user.repository";
import {
	createUser,
	deleteUser,
	getUserByEmail,
	getUserById,
	getUserByUsername,
	listUsers,
	updateUser,
} from "./crud-user.service";

const fakeUser1: CreateUserDTO = {
	username: "testuser1",
	email: "testuser1@example.com",
};

const fakeUser2: CreateUserDTO = {
	username: "testuser2",
	email: "testuser2@example.com",
};

describe("User Service", () => {
	let userRepository: UserRepository;

	beforeAll(async () => {
		userRepository = new UserRepository(db);
	});

	beforeEach(async () => {
		// Clean up before each test
		await db.delete(users);
	});

	afterAll(async () => {
		// Clean up after all tests
		await db.delete(users);
	});

	describe("createUser", () => {
		it("should create a new user", async () => {
			const createdUser = await createUser(userRepository, fakeUser1);

			expect(createdUser.username).toBe(fakeUser1.username);
			expect(createdUser.email).toBe(fakeUser1.email);
			expect(createdUser.id).toBeDefined();
			expect(createdUser.createdAt).toBeDefined();
			expect(createdUser.updatedAt).toBeDefined();
		});

		it("should throw error when creating user with existing email", async () => {
			await createUser(userRepository, fakeUser1);

			const duplicateEmailUser: CreateUserDTO = {
				username: "differentuser",
				email: fakeUser1.email,
			};

			await expect(createUser(userRepository, duplicateEmailUser)).rejects.toThrow(
				"User with this email already exists"
			);
		});

		it("should throw error when creating user with existing username", async () => {
			await createUser(userRepository, fakeUser1);

			const duplicateUsernameUser: CreateUserDTO = {
				username: fakeUser1.username,
				email: "different@example.com",
			};

			await expect(createUser(userRepository, duplicateUsernameUser)).rejects.toThrow(
				"User with this username already exists"
			);
		});
	});

	describe("listUsers", () => {
		it("should list all users", async () => {
			await createUser(userRepository, fakeUser1);
			await createUser(userRepository, fakeUser2);

			const users = await listUsers(userRepository);
			expect(users.length).toBe(2);
		});

		it("should filter users by username", async () => {
			await createUser(userRepository, fakeUser1);
			await createUser(userRepository, fakeUser2);

			const filteredUsers = await listUsers(userRepository, {
				username: "testuser1",
			});
			expect(filteredUsers.length).toBe(1);
			expect(filteredUsers[0]?.username).toBe("testuser1");
		});

		it("should filter users by email", async () => {
			await createUser(userRepository, fakeUser1);
			await createUser(userRepository, fakeUser2);

			const filteredUsers = await listUsers(userRepository, {
				email: "testuser2@example.com",
			});
			expect(filteredUsers.length).toBe(1);
			expect(filteredUsers[0]?.email).toBe("testuser2@example.com");
		});
	});

	describe("getUserById", () => {
		it("should get user by id", async () => {
			const createdUser = await createUser(userRepository, fakeUser1);
			const foundUser = await getUserById(userRepository, createdUser.id);

			expect(foundUser).toBeDefined();
			expect(foundUser?.id).toBe(createdUser.id);
			expect(foundUser?.username).toBe(fakeUser1.username);
		});

		it("should return null for non-existent user", async () => {
			const foundUser = await getUserById(userRepository, "non-existent-id");
			expect(foundUser).toBeNull();
		});
	});

	describe("getUserByEmail", () => {
		it("should get user by email", async () => {
			await createUser(userRepository, fakeUser1);
			const foundUser = await getUserByEmail(userRepository, fakeUser1.email);

			expect(foundUser).toBeDefined();
			expect(foundUser?.email).toBe(fakeUser1.email);
			expect(foundUser?.username).toBe(fakeUser1.username);
		});

		it("should return null for non-existent email", async () => {
			const foundUser = await getUserByEmail(userRepository, "nonexistent@example.com");
			expect(foundUser).toBeNull();
		});
	});

	describe("getUserByUsername", () => {
		it("should get user by username", async () => {
			await createUser(userRepository, fakeUser1);
			const foundUser = await getUserByUsername(userRepository, fakeUser1.username);

			expect(foundUser).toBeDefined();
			expect(foundUser?.username).toBe(fakeUser1.username);
			expect(foundUser?.email).toBe(fakeUser1.email);
		});

		it("should return null for non-existent username", async () => {
			const foundUser = await getUserByUsername(userRepository, "nonexistentuser");
			expect(foundUser).toBeNull();
		});
	});

	describe("updateUser", () => {
		it("should update user successfully", async () => {
			const createdUser = await createUser(userRepository, fakeUser1);

			const updateData: UpdateUserDTO = {
				username: "updateduser",
				email: "updated@example.com",
			};

			const updatedUser = await updateUser(userRepository, createdUser.id, updateData);

			expect(updatedUser.username).toBe("updateduser");
			expect(updatedUser.email).toBe("updated@example.com");
			expect(updatedUser.id).toBe(createdUser.id);
		});

		it("should throw error when updating to existing email", async () => {
			const user1 = await createUser(userRepository, fakeUser1);
			await createUser(userRepository, fakeUser2);

			const updateData: UpdateUserDTO = {
				email: fakeUser2.email,
			};

			await expect(updateUser(userRepository, user1.id, updateData)).rejects.toThrow(
				"Another user with this email already exists"
			);
		});

		it("should throw error when updating to existing username", async () => {
			const user1 = await createUser(userRepository, fakeUser1);
			await createUser(userRepository, fakeUser2);

			const updateData: UpdateUserDTO = {
				username: fakeUser2.username,
			};

			await expect(updateUser(userRepository, user1.id, updateData)).rejects.toThrow(
				"Another user with this username already exists"
			);
		});

		it("should throw error when updating non-existent user", async () => {
			const updateData: UpdateUserDTO = {
				username: "newusername",
			};

			await expect(updateUser(userRepository, "non-existent-id", updateData)).rejects.toThrow(
				"User not found"
			);
		});
	});

	describe("deleteUser", () => {
		it("should delete user successfully", async () => {
			const createdUser = await createUser(userRepository, fakeUser1);

			await deleteUser(userRepository, createdUser.id);

			const foundUser = await getUserById(userRepository, createdUser.id);
			expect(foundUser).toBeNull();
		});

		it("should throw error when deleting non-existent user", async () => {
			await expect(deleteUser(userRepository, "non-existent-id")).rejects.toThrow("User not found");
		});
	});
});
