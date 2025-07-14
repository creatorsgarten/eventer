import { Elysia } from "elysia";
import { db } from "#backend/infrastructure/db";
import {
	AgendaListResponseSchema,
	AgendaSchema,
	CreateAgendaSchema,
	PaginationQuerySchema,
} from "../../shared/schemas";
import { AgendaRepository } from "./agenda.repository";
import { createAgenda, listAgenda } from "./services/crud-agenda.service";

const agendaRepository = new AgendaRepository(db);

export const agendaRouter = new Elysia({ prefix: "/agenda" })
	.get(
		"/timer",
		async ({ query }) => {
			const agenda = await listAgenda(agendaRepository);
			return {
				data: agenda,
				pagination: {
					page: query.page ? parseInt(query.page) : 1,
					limit: query.limit ? parseInt(query.limit) : 10,
					total: agenda.length,
				},
			};
		},
		{
			query: PaginationQuerySchema,
			response: AgendaListResponseSchema,
		}
	)
	.post(
		"/",
		async ({ body }) => {
			const transformedData = {
				id: crypto.randomUUID(),
				...body,
				remarks: body.remarks ?? null,
			};
			return await createAgenda(agendaRepository, transformedData);
		},
		{
			body: CreateAgendaSchema,
			response: AgendaSchema,
		}
	);
