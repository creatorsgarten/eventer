import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "#backend/infrastructure/db";
import { events, type EventType } from "../agenda.model";
import { createEvent, listEvents } from "./crud-schedule.service";
import { EventRepository } from "../agenda.repository";

// async function createEvent(data: AppEvent) {
//   return await db.insert(EventEntity).values(data);
// }

const fakeEvent: EventType = {
  id: "test-event-1",
  name: "Test Event",
  description: "This is a test event",
  startDate: new Date("2025-07-01"),
  endDate: new Date("2025-07-02"),
  location: "Chulalongkorn University",
  createdBy: "admin-1",
};

describe("Event Usecase", () => {
  beforeAll(async () => {
    // Optionally clear or seed table
    await db.delete(events);
  });

  afterAll(async () => {
    await db.delete(events); // Clean up after tests
  });

  it("should create a new event", async () => {
    const eventRepository = new EventRepository(db);

    await createEvent(eventRepository, fakeEvent);

    const results = await listEvents(eventRepository);
    expect(results.length).toBe(1);
    //expect(results[0].name).toBe('Test Conference');
  });
});
