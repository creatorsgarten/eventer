import { type UserType, users } from "#backend/modules/user/user.model";
import { eq } from "drizzle-orm";
import type { DrizzleClient } from "#backend/infrastructure/db";
import type { CreateUserDTO } from "./dtos/create-user.dto";
import { v4 as uuidv4 } from "uuid";
import type { UpdateUserDTO } from "./dtos/update-user.dto";

class UserRepository {
  constructor(private db: DrizzleClient) {}

  async create(user: CreateUserDTO): Promise<UserType> {
    try {
      const id = uuidv4();
      await this.db.insert(users).values({
        ...user,
        id,
      });

      return {
        ...user,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating user:", error.message);
        throw error;
      }
      throw new Error("Failed to create user");
    }
  }

  async find(id: string): Promise<UserType | null> {
    try {
      const user = await this.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });

      return user || null;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error finding user:", error.message);
        throw error;
      }
      throw new Error("Failed to find user");
    }
  }

  async findByEmail(email: string): Promise<UserType | null> {
    try {
      const user = await this.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      return user || null;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error finding user by email:", error.message);
        throw error;
      }
      throw new Error("Failed to find user by email");
    }
  }

  async findByUsername(username: string): Promise<UserType | null> {
    try {
      const user = await this.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });

      return user || null;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error finding user by username:", error.message);
        throw error;
      }
      throw new Error("Failed to find user by username");
    }
  }

  async update(id: string, user: UpdateUserDTO): Promise<UserType> {
    try {
      const updated = await this.db
        .update(users)
        .set({
          ...user,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      if (updated.length === 0 || !updated[0]) {
        throw new Error("User not found");
      }

      return updated[0];
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating user:", error.message);
        throw error;
      }
      throw new Error("Failed to update user");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.db.delete(users).where(eq(users.id, id));

      if (result.changes === 0) {
        throw new Error("User not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting user:", error.message);
        throw error;
      }
      throw new Error("Failed to delete user");
    }
  }

  async list(): Promise<UserType[]> {
    try {
      const userList = await this.db.query.users.findMany();

      return userList;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error listing users:", error.message);
        throw error;
      }
      throw new Error("Failed to list users");
    }
  }
}

export { UserRepository };
