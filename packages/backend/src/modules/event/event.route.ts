import { Hono } from "hono";
import { listEvents } from "./services/create-event.service";

const app = new Hono().get("/", async (c) => {
  const events = await listEvents();
  return c.json(events);
});

export { app as eventRouter };
