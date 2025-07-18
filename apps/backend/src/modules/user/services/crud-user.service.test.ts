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
	listUsers,
	updateUser,
} from "./crud-user.service";

const fakeUser1: CreateUserDTO = {
	name: "Test User 1",
	email: "testuser1@example.com",
};

const fakeUser2: CreateUserDTO = {
	name: "Test User 2",
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

			expect(createdUser.name).toBe(fakeUser1.name);
			expect(createdUser.email).toBe(fakeUser1.email);
			expect(createdUser.id).toBeDefined();
			expect(createdUser.createdAt).toBeDefined();
			expect(createdUser.updatedAt).toBeDefined();
		});

		it("should throw error when creating user with existing email", async () => {
			await createUser(userRepository, fakeUser1);

			const duplicateEmailUser: CreateUserDTO = {
				name: "Different User",
				email: fakeUser1.email,
			};

			await expect(createUser(userRepository, duplicateEmailUser)).rejects.toThrow(
				"User with this email already exists"
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
			expect(foundUser?.name).toBe(fakeUser1.name);
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
			expect(foundUser?.name).toBe(fakeUser1.name);
		});

		it("should return null for non-existent email", async () => {
			const foundUser = await getUserByEmail(userRepository, "nonexistent@example.com");
			expect(foundUser).toBeNull();
		});
	});

	describe("updateUser", () => {
		it("should update user successfully", async () => {
			const createdUser = await createUser(userRepository, fakeUser1);

			const updateData: UpdateUserDTO = {
				name: "Updated User",
				email: "updated@example.com",
			};

			const updatedUser = await updateUser(userRepository, createdUser.id, updateData);

			expect(updatedUser.name).toBe("Updated User");
			expect(updatedUser.email).toBe("updated@example.com");
			expect(updatedUser.id).toBe(createdUser.id);
		});

		it("should update user with partial data", async () => {
			const createdUser = await createUser(userRepository, fakeUser1);

			const updateData: UpdateUserDTO = {
				name: "Updated Name Only",
			};

			const updatedUser = await updateUser(userRepository, createdUser.id, updateData);

			expect(updatedUser.name).toBe("Updated Name Only");
			expect(updatedUser.email).toBe(fakeUser1.email); // Should remain unchanged
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

		it("should throw error when updating non-existent user", async () => {
			const updateData: UpdateUserDTO = {
				name: "New Name",
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
