import { Hono } from "hono";
import {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
} from "./services/crud-user.service";
import { UserRepository } from "./user.repository";
import { db } from "#backend/infrastructure/db";
import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema, UpdateUserSchema } from "#backend/shared/schemas";

const userRepository = new UserRepository(db);

const app = new Hono()
  // POST /users - Create a new user
  .post("/", zValidator("json", CreateUserSchema), async (c) => {
    try {
      const data = c.req.valid("json");
      const createdUser = await createUser(userRepository, data);
      return c.json(createdUser, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Failed to create user" }, 500);
    }
  })

  // GET /users/:id - Get user by ID
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const user = await getUserById(userRepository, id);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(user);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }
      return c.json({ error: "Failed to get user" }, 500);
    }
  })

  // PUT /users/:id - Update user
  .put("/:id", zValidator("json", UpdateUserSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const updatedUser = await updateUser(userRepository, id, data);
      return c.json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          return c.json({ error: error.message }, 404);
        }
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Failed to update user" }, 500);
    }
  })

  // DELETE /users/:id - Delete user
  .delete("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      await deleteUser(userRepository, id);
      return c.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          return c.json({ error: error.message }, 404);
        }
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Failed to delete user" }, 500);
    }
  })

  // GET /users/email/:email - Get user by email
  .get("/email/:email", async (c) => {
    try {
      const email = c.req.param("email");
      const user = await getUserByEmail(userRepository, email);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(user);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }
      return c.json({ error: "Failed to get user" }, 500);
    }
  })

  // GET /users/username/:username - Get user by username
  .get("/username/:username", async (c) => {
    try {
      const username = c.req.param("username");
      const user = await getUserByUsername(userRepository, username);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(user);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }
      return c.json({ error: "Failed to get user" }, 500);
    }
  });

export { app as userRouter };
