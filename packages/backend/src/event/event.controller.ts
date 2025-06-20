import { Hono } from "hono";
import { listEvents } from "./event.service";

const app = new Hono().get("/events", async (c) => {
  const events = await listEvents();
  return c.json(events);
});

export { app as eventRouter };
