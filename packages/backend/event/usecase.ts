// event/usecase.ts
import { db } from '../infrastructure/db';
import { events } from '../infrastructure/schema';
import { Event } from './types';



export async function createEvent(data: Event) {
  // Convert Dates to numbers (Unix timestamp in milliseconds)
  return await db.insert(events).values({
    id: data.id,
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
    location: data.location,
    description: data.description,
    createdBy: data.createdBy,
  });
}
export async function listEvents(): Promise<Event[]> {
  const rows = await db.select().from(events);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    startDate: new Date(row.startDate), // Convert from number to Date
    endDate: new Date(row.endDate),
    location: row.location,
    description: row.description ?? undefined,
    createdBy: row.createdBy,
  }));
}



// export const createEvent = async (data: NewEvent) => {
//   const id = crypto.randomUUID();
//   await db.insert('events', {
//     id,
//     name: data.name,
//     date: data.date,
//     location: data.location,
//   });
//   return new EventEntity(id, data.name, data.date, data.location);
// };

// export const getAllEvents = async () => {
//   const rows = await db.select("events").all();
//   return rows.map(row => new EventEntity(row.id, row.name, new Date(row.date), row.location));
// };
