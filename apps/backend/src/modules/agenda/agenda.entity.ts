import type { AgendaType } from "./agenda.model";

export class AgendaEntityProps {
	constructor(private agenda: AgendaType) {}
	get duration(): number {
		return (new Date(this.agenda.end).getTime() - new Date(this.agenda.start).getTime()) / 60000; // in minutes
	}
	static validateSequential(agenda: AgendaType[]) {
		if (agenda.length <= 1) return;

		for (let i = 1; i < agenda.length; i++) {
			const prev = agenda[i - 1]!; // can remove non-null assertion
			const current = agenda[i]!; // can remove non-null assertion
			const prevEnd = new Date(prev.end).getTime();
			const currentStart = new Date(current.start).getTime();
			if (prevEnd !== currentStart) {
				throw new Error(
					`Agenda at index ${i} does not start immediately after the previous agenda. Expected start: ${new Date(prevEnd).toISOString()}, got: ${new Date(currentStart).toISOString()}`
				);
			}
		}
	}
}
