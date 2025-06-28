import type { AgendaType} from "#backend/modules/agenda/agenda.model";
import { eq } from "drizzle-orm";
import type { DrizzleClient } from "#backend/infrastructure/db";
import type { CreateAgendaDTO } from "./dtos/create-agenda.dto";
import type { UpdateAgendaDTO } from "./dtos/update-agenda.dto";
import { v4 as uuidv4 } from "uuid";
import { agenda } from "#backend/modules/agenda/agenda.model"; // agenda model

class AgendaRepository {
  constructor(private db: DrizzleClient) {}

  async create(agendaData: CreateAgendaDTO): Promise<AgendaType> {
    try {
      const newAgenda: AgendaType = {
        ...agendaData,
        id: uuidv4(),
        start: agendaData.start instanceof Date ? agendaData.start.toISOString() : agendaData.start,
        end: agendaData.end instanceof Date ? agendaData.end.toISOString() : agendaData.end,
      };
      await this.db.insert(agenda).values(newAgenda);
      return newAgenda;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating agenda:", error.message);
        throw error;
      }
      throw new Error("Failed to create agenda");
    }
  }
  // read one agenda item by ID
  async read(id: string): Promise<AgendaType | null> {
    try {
      const result = await this.db.query.agenda.findFirst({
        where: (agendaTable, { eq }) => eq(agendaTable.id, id),
      });

      return result ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error reading agenda:", error.message);
        throw error;
      }
      throw new Error("Failed to read agenda");
    }
  }

  async update(id: string, updateData: UpdateAgendaDTO): Promise<AgendaType> {
    try {
      const updated = await this.db
        .update(agenda)
        .set(updateData)
        .where(eq(agenda.id, id))
        .returning();

      if (!updated[0]) throw new Error("Agenda not found");

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
      const result = await this.db.delete(agenda).where(eq(agenda.id, id));

      if (result.changes === 0) {
        throw new Error("Agenda not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting agenda:", error.message);
        throw error;
      }
      throw new Error("Failed to delete agenda");
    }
  }
  // List all agenda items
  async list(): Promise<AgendaType[]> {
    try {
      const agendaList = await this.db.query.agenda.findMany();

      return agendaList;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error listing agenda:", error.message);
        throw error;
      }
      throw new Error("Failed to list agenda");
    }
  }
}

export { AgendaRepository };
