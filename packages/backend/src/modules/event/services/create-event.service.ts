import type { EventRepository } from "../event.repository";
import type { CreateEventDTO } from "../dtos/create-event.dto";
import type { EventType } from "../event.model";

type ListEventQuery = {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  desciption?: string;
  createdBy?: string;
};

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
  eventRepository: EventRepository,
  query?:ListEventQuery
): Promise<EventType[]> {
  // TODO implement query CRUD 
  // TODO Refactor pls
  // get all events
  const allEvents = await eventRepository.list(); 
  // in memory filtering
  let filtered = allEvents;
  if (query?.name) {
    filtered = filtered.filter((event) =>
      event.name.toLowerCase().includes(query.name!.toLowerCase())
    );
  }
  if (query?.startDate) {
    filtered = filtered.filter((event) =>
      new Date(event.startDate) >=query.startDate!);
  }
  if (query?.endDate) {
    filtered = filtered.filter(event =>
      new Date(event.endDate) <= query.endDate!);
  }
  if (query?.location) {
    filtered = filtered.filter((event) =>
      event.location.toLowerCase().includes(query.location!.toLowerCase())
    );
  if (query?.createdBy) {
    filtered = filtered.filter((event) =>
      event.createdBy.toLowerCase().includes(query.createdBy!.toLowerCase())
    );
  }
}
  return filtered;
}


// export async function listEventsById(
//   eventRepository: EventRepository,
//   ids: string[]
// ): Promise<EventType[]> {
//   return await eventRepository.list(ids);
// }


export async function getEventById(
  eventRepository: EventRepository,
  id: string
): Promise<EventType | null> {
  return await eventRepository.read(id);
}



