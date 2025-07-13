import type { AgendaRepository } from "../agenda.repository";
import type { CreateAgendaDTO } from "../dtos/create-agenda.dto";
import type { AgendaType } from "../agenda.model";
import type { UpdateAgendaDTO } from "../dtos/update-agenda.dto";

export async function createAgenda(
  agendaRepository: AgendaRepository,
  data: CreateAgendaDTO
): Promise<AgendaType> {
  return await agendaRepository.create({
    ...data,
  });
}

export async function listAgenda(
  agendaRepository: AgendaRepository,
  query?: CreateAgendaDTO
): Promise<AgendaType[]> {
  // TODO implement query CRUD
  const all = await agendaRepository.list();

  let filtered = all;

  if (query?.eventId) {
    filtered = filtered.filter((a) => a.eventId === query.eventId);
  }

  if (query?.personincharge) {
    filtered = filtered.filter((a) =>
      a.personincharge
        ?.toLowerCase()
        .includes(query.personincharge.toLowerCase())
    );
  }

  if (query?.start) {
    filtered = filtered.filter(
      (a) => new Date(a.start) >= new Date(query.start)
    );
  }

  if (query?.end) {
    filtered = filtered.filter((a) => new Date(a.end) <= new Date(query.end));
  }

  if (query?.activity) {
    filtered = filtered.filter((a) =>
      a.activity.toLowerCase().includes(query.activity.toLowerCase())
    );
  }

  return filtered;
}

export async function getAgendaById(
  agendaRepository: AgendaRepository,
  id: string
): Promise<AgendaType | null> {
  return await agendaRepository.read(id);
}

export async function updateAgenda(
  agendaRepository: AgendaRepository,
  id: string,
  data: UpdateAgendaDTO
): Promise<AgendaType> {
  return await agendaRepository.update(id, data);
}

export async function deleteAgenda(
  agendaRepository: AgendaRepository,
  id: string
): Promise<void> {
  return await agendaRepository.delete(id);
}
