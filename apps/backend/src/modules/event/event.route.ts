import { Hono } from "hono";
import { createEvent, listEvents } from "./services/crud-event.service";
import { EventRepository } from "./event.repository";
import { db } from "#backend/infrastructure/db";
import { zValidator } from "@hono/zod-validator";
import {
  CreateEventSchema,
  PaginationQuerySchema,
} from "#backend/shared/schemas";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "#backend/shared/middleware/auth.middleware";

const eventRepository = new EventRepository(db);

const app = new Hono()
  .get(
    "/",
    optionalAuthMiddleware,
    zValidator("query", PaginationQuerySchema),
    async (c) => {
      try {
        const query = c.req.valid("query");
        const events = await listEvents(eventRepository);
        return c.json({
          data: events,
          pagination: {
            page: parseInt(query.page || "1"),
            limit: parseInt(query.limit || "10"),
            total: events.length,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          return c.json({ error: error.message }, 500);
        }
        return c.json({ error: "Failed to list events" }, 500);
      }
    }
  )
  .post(
    "/",
    authMiddleware,
    zValidator("json", CreateEventSchema),
    async (c) => {
      try {
        const data = c.req.valid("json");
        const user = c.get("user");

        // Transform string dates to Date objects and handle nullable description
        const transformedData = {
          name: data.name,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          location: data.location,
          description: data.description ?? null,
          createdBy: user.id, // Use authenticated user ID
        };

        const createdEvent = await createEvent(
          eventRepository,
          transformedData
        );
        return c.json(createdEvent, 201);
      } catch (error) {
        if (error instanceof Error) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Failed to create event" }, 500);
      }
    }
  );

export { app as eventRouter };
