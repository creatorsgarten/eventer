import type { CreateUserDTO } from "../dtos/create-user.dto";
import type { UpdateUserDTO } from "../dtos/update-user.dto";
import type { UserType } from "../user.model";
import type { UserRepository } from "../user.repository";

export async function createUser(
	userRepository: UserRepository,
	data: CreateUserDTO
): Promise<UserType> {
	// Check if user already exists by email
	const existingUserByEmail = await userRepository.findByEmail(data.email);
	if (existingUserByEmail) {
		throw new Error("User with this email already exists");
	}

	return await userRepository.create({
		name: data.name,
		email: data.email,
	});
}

export async function listUsers(
	userRepository: UserRepository,
	query?: { email?: string }
): Promise<UserType[]> {
	const allUsers = await userRepository.list();

	// In-memory filtering for now
	let filtered = allUsers;

	if (query?.email) {
		const email = query.email;
		filtered = filtered.filter((user) => user.email.toLowerCase().includes(email.toLowerCase()));
	}

	return filtered;
}

export async function getUserById(
	userRepository: UserRepository,
	id: string
): Promise<UserType | null> {
	return await userRepository.find(id);
}

export async function getUserByEmail(
	userRepository: UserRepository,
	email: string
): Promise<UserType | null> {
	return await userRepository.findByEmail(email);
}

export async function updateUser(
	userRepository: UserRepository,
	id: string,
	data: UpdateUserDTO
): Promise<UserType> {
	// Check if user exists
	const existingUser = await userRepository.find(id);
	if (!existingUser) {
		throw new Error("User not found");
	}

	// Check for email conflicts if email is being updated
	if (data.email && data.email !== existingUser.email) {
		const existingUserByEmail = await userRepository.findByEmail(data.email);
		if (existingUserByEmail && existingUserByEmail.id !== id) {
			throw new Error("Another user with this email already exists");
		}
	}

	return await userRepository.update(id, data);
}

export async function deleteUser(userRepository: UserRepository, id: string): Promise<void> {
	// Check if user exists before deletion
	const existingUser = await userRepository.find(id);
	if (!existingUser) {
		throw new Error("User not found");
	}

	return await userRepository.delete(id);
}
