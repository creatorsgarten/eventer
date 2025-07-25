import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import type { DrizzleClient } from "#backend/infrastructure/db";
import { type EventType, events } from "#backend/modules/event/event.model";
import type { CreateEventDTO } from "./dtos/create-event.dto";
import type { UpdateEventDTO } from "./dtos/update-event.dto";

class EventRepository {
	constructor(private db: DrizzleClient) {}

	async create(event: CreateEventDTO): Promise<EventType> {
		try {
			const id = uuidv4();
			await this.db.insert(events).values({
				...event,
				id,
				startDate: new Date(event.startDate),
				endDate: new Date(event.endDate),
			});

			return {
				...event,
				id,
				startDate: new Date(event.startDate),
				endDate: new Date(event.endDate),
			};
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error creating event:", error.message);
				throw error;
			}
			throw new Error("Failed to create event");
		}
	}

	async read(id: string): Promise<EventType | null> {
		try {
			const event = await this.db.query.events.findFirst({
				where: (events, { eq }) => eq(events.id, id),
			});

			return event || null;
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error reading event:", error.message);
				throw error;
			}
			throw new Error("Failed to read event");
		}
	}

	async update(id: string, event: UpdateEventDTO): Promise<EventType> {
		try {
			const updateData: any = { ...event };
			if (event.startDate) {
				updateData.startDate = new Date(event.startDate);
			}
			if (event.endDate) {
				updateData.endDate = new Date(event.endDate);
			}
			const updated = await this.db
				.update(events)
				.set(updateData)
				.where(eq(events.id, id))
				.returning();

			if (updated.length === 0 || !updated[0]) {
				throw new Error("Event not found");
			}

			return updated[0];
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error updating event:", error.message);
				throw error;
			}
			throw new Error("Failed to update event");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			// First check if the event exists
			const existingEvent = await this.db.select().from(events).where(eq(events.id, id)).limit(1);

			if (existingEvent.length === 0) {
				throw new Error("Event not found");
			}

			await this.db.delete(events).where(eq(events.id, id));
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error deleting event:", error.message);
				throw error;
			}
			throw new Error("Failed to delete event");
		}
	}

	async list(): Promise<EventType[]> {
		try {
			const eventList = await this.db.query.events.findMany();

			return eventList;
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error listing events:", error.message);
				throw error;
			}
			throw new Error("Failed to list events");
		}
	}
}

export { EventRepository };
