import { Hono } from "hono";
import { createAgenda, listAgenda } from "./services/crud-agenda.service";
import { AgendaRepository } from "./agenda.repository";
import { db } from "#backend/infrastructure/db";
import { zValidator } from "@hono/zod-validator";
import { queryAgendaDTO } from "./dtos/query-agenda.dto";
import { createAgendaDTO } from "./dtos/create-agenda.dto";

const agendaRepository = new AgendaRepository(db);

const app = new Hono()
  .get("/", zValidator("query", queryAgendaDTO), async (c) => {
    const agenda = await listAgenda(agendaRepository);
    return c.json(agenda);
  })
  .post("/", zValidator("json", createAgendaDTO), async (c) => {
    const data = c.req.valid("json");
    const createdEvent = await createAgenda(agendaRepository, data);
    return c.json(createdEvent, 201);
  });

export { app as agendaRouter };
