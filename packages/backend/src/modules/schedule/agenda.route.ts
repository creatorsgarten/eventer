import { Hono } from "hono";
import { createEvent, listEvents } from "./services/crud-schedule.service";
import { EventRepository } from "./agenda.repository";
import { db } from "#backend/infrastructure/db";
import { zValidator } from "@hono/zod-validator";
import { queryEventDTO } from "./dtos/query-agenda.dto";
import { createEventDTO } from "./dtos/create-agenda.dto";

const eventRepository = new EventRepository(db);

const app = new Hono()
  .get("/", zValidator("query", queryEventDTO), async (c) => {
    const q = c.req.query();
    const events = await listEvents(eventRepository);
    return c.json(events);
  })
  .post("/", zValidator("json", createEventDTO), async (c) => {
    const data = c.req.valid("json");
    const createdEvent = await createEvent(eventRepository, data);
    return c.json(createdEvent, 201);
  });

export { app as eventRouter };
