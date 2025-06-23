import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "../../infrastructure/db";
import { events } from "../../infrastructure/schema";
import { createEvent, listEvents } from "./event.service";
import type { Event } from "./dto/types";

// async function createEvent(data: AppEvent) {
//   return await db.insert(EventEntity).values(data);
// }

const fakeEvent: Event = {
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
    await createEvent(fakeEvent);

    const results = await listEvents();
    expect(results.length).toBe(1);
    //expect(results[0].name).toBe('Test Conference');
  });
});
