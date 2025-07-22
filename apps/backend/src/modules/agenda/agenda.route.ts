import { Elysia } from "elysia";
import { db } from "#backend/infrastructure/db";
import {
  AgendaListResponseSchema,
  AgendaSchema,
  CreateAgendaSchema,
  PaginationQuerySchema,
  ErrorResponseSchema,
} from "../../shared/schemas";
import { AgendaRepository } from "./agenda.repository";
import {
  createAgenda,
  listAgenda,
  getAgendaById,
  updateAgenda,
  deleteAgenda,
} from "./services/crud-agenda.service";
import { z } from "zod";

const agendaRepository = new AgendaRepository(db);

//TODO : Implement useGetAgenda(eventId, currentDay)

export const agendaRouter = new Elysia({ prefix: "/agenda" })

  .get(
    "/timer",
    async ({ query }) => {
      const agendas = await listAgenda(agendaRepository);
      return {
        data: agendas,
        pagination: {
          page: query.page ? parseInt(query.page) : 1,
          limit: query.limit ? parseInt(query.limit) : 10,
          total: agendas.length,
        },
      };
    },
    {
      query: PaginationQuerySchema,
      response: {
        200: AgendaListResponseSchema,
        400: ErrorResponseSchema,
      },
    }
  )
  .get(
    "/event",
    async ({ query }) => {
      const agendas = await listAgenda(agendaRepository);
      return {
        data: agendas,
        pagination: {
          page: query.page ? parseInt(query.page) : 1,
          limit: query.limit ? parseInt(query.limit) : 10,
          total: agendas.length,
        },
      };
    },
    {
      query: PaginationQuerySchema,
      response: {
        200: AgendaListResponseSchema,
        400: ErrorResponseSchema,
      },
    }
  )

  .post(
    "/event",
    async ({ query }) => {
      const { v4: uuidv4 } = await import("uuid");
      const agendaWithId = {
        ...query,
        id: uuidv4(),
        remarks: query.remarks ?? null,
      };
      const agendas = await createAgenda(agendaRepository, agendaWithId);
      return {
        ...agendas,
      };
    },
    {
      query: CreateAgendaSchema,
      response: {
        200: AgendaSchema,
        400: ErrorResponseSchema,
      },
    }
  );
