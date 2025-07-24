import type { CreateEventDTO } from "../dtos/create-event.dto";
import type { UpdateEventDTO } from "../dtos/update-event.dto";
import type { EventType } from "../event.model";
import type { EventRepository } from "../event.repository";

export async function createEvent(eventRepository: EventRepository, data: CreateEventDTO) {
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
	query?: {
		name?: string;
		startDate?: string;
		endDate?: string;
		location?: string;
	}
): Promise<EventType[]> {
	// TODO implement query CRUD
	// TODO Refactor pls

	const allEvents = await eventRepository.list();
	// in memory filtering
	let filtered = allEvents;
	if (query?.name) {
		filtered = filtered.filter((event) =>
			event.name.toLowerCase().includes(query.name.toLowerCase())
		);
	}
	if (query?.startDate) {
		filtered = filtered.filter((event) => new Date(event.startDate) >= new Date(query.startDate));
	}
	if (query?.endDate) {
		filtered = filtered.filter((event) => new Date(event.endDate) <= new Date(query.endDate));
	}
	if (query?.location) {
		filtered = filtered.filter((event) =>
			event.location.toLowerCase().includes(query.location.toLowerCase())
		);
		if (query?.createdBy) {
			filtered = filtered.filter((event) =>
				event.createdBy.toLowerCase().includes(query.createdBy.toLowerCase())
			);
		}
	}
	return filtered;
}

export async function getEventById(
	eventRepository: EventRepository,
	id: string
): Promise<EventType | null> {
	return await eventRepository.read(id);
}

export async function updateEvent(
	eventRepository: EventRepository,
	id: string,
	data: UpdateEventDTO
) {
	return await eventRepository.update(id, data);
}

export async function deleteEvent(eventRepository: EventRepository, id: string) {
	return await eventRepository.delete(id);
}

// export async function listEventsByIds(
//   eventRepository: EventRepository,
//   ids: string[]
// ) {
//   return await eventRepository.list(ids);
// }
// s
