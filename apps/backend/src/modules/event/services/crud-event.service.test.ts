import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { db } from "#backend/infrastructure/db";
import { type EventType, events } from "../event.model";
import { EventRepository } from "../event.repository";
import { createEvent, listEvents } from "./crud-event.service";

// async function createEvent(data: AppEvent) {
//   return await db.insert(EventEntity).values(data);
// }

const fakeEvent: EventType = {
	id: "test-event-crud-event",
	name: "Test Event",
	description: "This is a test event",
	startDate: new Date("2025-07-01"),
	endDate: new Date("2025-07-02"),
	location: "Chulalongkorn University",
	createdBy: "admin-1",
};

describe("Event Usecase", () => {
	beforeEach(async () => {
		// Clear table before each test
		await db.delete(events);
	});

	afterEach(async () => {
		await db.delete(events); // Clean up after each test
	});

	it("should create a new event", async () => {
		const eventRepository = new EventRepository(db);

		await createEvent(eventRepository, fakeEvent);

		const results = await listEvents(eventRepository);
		expect(results.length).toBe(1);
		//expect(results[0].name).toBe('Test Conference');
	});
});
