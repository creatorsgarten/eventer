import { Hono } from "hono";
import { createAgenda, listAgenda } from "./services/crud-agenda.service";
import { AgendaRepository } from "./agenda.repository";
import { db } from "#backend/infrastructure/db";
import { zValidator } from "@hono/zod-validator";
import {
  CreateAgendaSchema,
  PaginationQuerySchema,
} from "#backend/shared/schemas";

const agendaRepository = new AgendaRepository(db);

const app = new Hono()
  .get("/", zValidator("query", PaginationQuerySchema), async (c) => {
    try {
      const query = c.req.valid("query");
      const agenda = await listAgenda(agendaRepository);
      return c.json({
        data: agenda,
        pagination: {
          page: parseInt(query.page || "1"),
          limit: parseInt(query.limit || "10"),
          total: agenda.length,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }
      return c.json({ error: "Failed to list agenda" }, 500);
    }
  })
  .post("/", zValidator("json", CreateAgendaSchema), async (c) => {
    try {
      const data = c.req.valid("json");

      // Transform data and generate ID
      const transformedData = {
        id: crypto.randomUUID(), // Generate a new UUID
        eventId: data.eventId,
        start: data.start,
        end: data.end,
        personincharge: data.personincharge,
        duration: data.duration,
        activity: data.activity,
        remarks: data.remarks ?? null,
      };

      const createdAgenda = await createAgenda(
        agendaRepository,
        transformedData
      );
      return c.json(createdAgenda, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Failed to create agenda" }, 500);
    }
  });

export { app as agendaRouter };
