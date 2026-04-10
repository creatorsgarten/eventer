import { Elysia, t } from "elysia";
import { db } from "#backend/infrastructure/db";
import { authMiddleware, optionalAuthMiddleware } from "#backend/shared/middleware/auth.middleware";
import { rateLimit, rateLimitPresets } from "#backend/shared/middleware/rate-limit.middleware";
import {
	CreateEventSchema,
	EventListResponseSchema,
	EventQuerySchema,
	EventSchema,
} from "#backend/shared/schemas";
import { EventRepository } from "./event.repository";
import { createEvent, getEventById, listEvents } from "./services/crud-event.service";

const eventRepository = new EventRepository(db);

export const eventRouter = new Elysia({ prefix: "/api/event" })
	// Apply moderate rate limiting to event endpoints (30 requests per minute)
	.use(
		rateLimit({
			...rateLimitPresets.moderate,
			message: "Too many requests to event API. Please slow down.",
		})
	)
	.use(optionalAuthMiddleware)
	.get(
		"/:id",
		async ({ params, error }) => {
			const event = await getEventById(eventRepository, params.id);
			if (!event) {
				return error(404, { error: "Event not found" });
			}
			return event;
		},
		{
			params: t.Object({ id: t.String() }),
			response: {
				200: EventSchema,
				404: t.Object({ error: t.String() }),
			},
		}
	)
	.get(
		"/",
		async ({ query }) => {
			const events = await listEvents(eventRepository, {
				name: query.name,
				startDate: query.startDate,
				endDate: query.endDate,
				location: query.location,
			});
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
			query: EventQuerySchema,
			response: EventListResponseSchema,
		}
	)
	.use(authMiddleware)
	.post(
		"/",
		async ({ body }) => {
			const transformedData = {
				...body,
				startDate: body.startDate, // Keep as string for database storage
				endDate: body.endDate, // Keep as string for database storage
				description: body.description ?? null,
				createdBy: "user_placeholder", // TODO: Fix auth context injection
			};
			return await createEvent(eventRepository, transformedData);
		},
		{
			body: CreateEventSchema,
			response: EventSchema,
		}
	);
