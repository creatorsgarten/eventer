import { Elysia, t } from "elysia";
import { db } from "#backend/infrastructure/db";
import {
	authMiddleware,
	optionalAuthMiddleware,
} from "#backend/shared/middleware/auth.middleware";
import {
	CreateEventSchema,
	EventListResponseSchema,
	EventSchema,
	PaginationQuerySchema,
} from "#backend/shared/schemas";
import { EventRepository } from "./event.repository";
import { createEvent, listEvents } from "./services/crud-event.service";

const eventRepository = new EventRepository(db);

export const eventRouter = new Elysia({ prefix: "/event" })
	.use(optionalAuthMiddleware)
	.get(
		"/",
		async ({ query }) => {
			const events = await listEvents(eventRepository);
			return {
				data: events,
				pagination: {
					page: query.page ? parseInt(query.page) : 1,
					limit: query.limit ? parseInt(query.limit) : 10,
					total: events.length,
				},
			};
		},
		{
			query: PaginationQuerySchema,
			response: EventListResponseSchema,
		},
	)
	.use(authMiddleware)
	.post(
		"/",
		async ({ body }) => {
			const transformedData = {
				...body,
				startDate: new Date(body.startDate),
				endDate: new Date(body.endDate),
				description: body.description ?? null,
				createdBy: "user_placeholder", // TODO: Fix auth context injection
			};
			return await createEvent(eventRepository, transformedData);
		},
		{
			body: CreateEventSchema,
			response: EventSchema,
		},
	);
