import { Hono } from "hono";
import { listEvents } from "./services/create-event.service";
import { EventRepository } from "./event.repository";
import { db } from "@/infrastructure/db";

const eventRepository = new EventRepository(db);

const app = new Hono().get("/", async (c) => {
  const q = c.req.query();
  const query ={
    name: q.name,
    location: q.location,
    description: q.description,
    createdBy: q.createdBy,
    startDate: q.startDate ? new Date(q.startDate) : undefined,
    endDate: q.endDate ? new Date(q.endDate) : undefined,
  };
  const events = await listEvents(eventRepository, query);
  return c.json(events);
});

export { app as eventRouter };
