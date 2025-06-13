import { db } from "@/infrastructure/db"; 
import { EventEntity } from "./entity";
import { NewEvent } from "./types";

export const createEvent = async (data: NewEvent) => {
  const id = crypto.randomUUID();
  await db.insert('events', {
    id,
    name: data.name,
    date: data.date,
    location: data.location,
  });
  return new EventEntity(id, data.name, data.date, data.location);
};

export const getAllEvents = async () => {
  const rows = await db.select("events").all();
  return rows.map(row => new EventEntity(row.id, row.name, new Date(row.date), row.location));
};
