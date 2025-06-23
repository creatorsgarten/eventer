import { type EventType, events } from "~/modules/event/event.model";
import { eq } from "drizzle-orm";
import type { DrizzleClient } from "~/infrastructure/db";
import type { CreateEventDTO } from "./dtos/create-event.dto";
import { v4 as uuidv4 } from "uuid";
import type { UpdateEventDTO } from "./dtos/update-event.dto";

class EventRepository {
  constructor(private db: DrizzleClient) {}

  async create(event: CreateEventDTO): Promise<EventType> {
    try {
      const created = await this.db.insert(events).values({
        ...event,
        id: uuidv4(),
      });
      const id = created.lastInsertRowid;

      return {
        ...event,
        id: id.toString(),
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
      const updated = await this.db
        .update(events)
        .set(event)
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
      const result = await this.db.delete(events).where(eq(events.id, id));

      if (result.changes === 0) {
        throw new Error("Event not found");
      }
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
