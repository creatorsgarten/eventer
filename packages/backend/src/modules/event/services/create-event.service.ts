import type { EventRepository } from "../event.repository";
import type { CreateEventDTO } from "../dtos/create-event.dto";
import type { EventType } from "../event.model";

export async function createEvent(
  eventRepository: EventRepository,
  data: CreateEventDTO
) {
  return await eventRepository.create({
    name: data.name,
    startDate: data.startDate, // Convert Date to number
    endDate: data.endDate,
    location: data.location,
    description: data.description,
    createdBy: data.createdBy,
  });
}

export async function listEvents(
  eventRepository: EventRepository
): Promise<EventType[]> {
  // TODO implement query
  return await eventRepository.list();
}
