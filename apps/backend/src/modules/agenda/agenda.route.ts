import { Elysia, t } from "elysia";
import { db } from "#backend/infrastructure/db";
import {
	AgendaListResponseSchema,
	AgendaSchema,
	CreateAgendaSchema,
	DeleteAgendaSchema,
	ErrorResponseSchema,
	PaginationQuerySchema,
	UpdateAgendaSchema,
} from "../../shared/schemas";
import { AgendaRepository } from "./agenda.repository";
import { endSessionDTO } from "./dtos/update-agenda.dto";
import {
	createAgenda,
	deleteAgenda,
	endSession,
	listAgenda,
	updateAgenda,
} from "./services/crud-agenda.service";

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
	)

	.put(
		"/event",
		async ({ query }) => {
			const { id, ...updateData } = query;
			const updatedAgenda = await updateAgenda(agendaRepository, id, {
				...updateData,
				id,
			});
			return updatedAgenda;
		},
		{
			query: UpdateAgendaSchema,
			response: {
				200: AgendaSchema,
				400: ErrorResponseSchema,
			},
		}
	)

	.delete(
		"/event",
		async ({ query }: { query: { id: string } }) => {
			await deleteAgenda(agendaRepository, query.id);
			return { success: true, message: "Agenda deleted successfully" };
		},
		{
			query: DeleteAgendaSchema,
			response: {
				200: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
				400: ErrorResponseSchema,
			},
		}
	)

	.patch(
		"/end-session",
		async ({ body }) => {
			const updatedAgenda = await endSession(agendaRepository, body);
			return updatedAgenda;
		},
		{
			body: endSessionDTO,
			response: {
				200: AgendaSchema,
				400: ErrorResponseSchema,
			},
		}
	);
