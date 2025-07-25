import type { EventType } from "./event.model";

export class EventEntity {
	constructor(private event: EventType) {}

	isUpcoming(): boolean {
		return new Date() < this.event.startDate;
	}
	durationIndays(): number {
		const diff = +this.event.endDate - +this.event.startDate;
		return diff / (1000 * 60 * 60 * 24);
	}
	getSummary(): string {
		return `${this.event.name} @ ${this.event.location}`;
	}
}
