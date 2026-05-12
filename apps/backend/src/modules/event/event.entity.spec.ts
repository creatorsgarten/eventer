import { describe, expect, it } from "vitest";
import { EventEntity } from "./event.entity";
import type { EventType } from "./event.model";

const makeEvent = (overrides?: Partial<EventType>): EventType => ({
	id: "evt-1",
	name: "Test Conference",
	startDate: new Date("2099-01-10"),
	endDate: new Date("2099-01-12"),
	location: "Bangkok",
	description: null,
	createdBy: "user-1",
	createdAt: new Date("2025-01-01"),
	updatedAt: new Date("2025-01-01"),
	...overrides,
});

describe("EventEntity", () => {
	describe("isUpcoming()", () => {
		it("returns true when event starts in the future", () => {
			const entity = new EventEntity(makeEvent({ startDate: new Date("2099-01-10") }));
			expect(entity.isUpcoming()).toBe(true);
		});

		it("returns false when event started in the past", () => {
			const entity = new EventEntity(makeEvent({ startDate: new Date("2000-01-01") }));
			expect(entity.isUpcoming()).toBe(false);
		});
	});

	describe("durationIndays()", () => {
		it("returns correct duration for a 2-day event", () => {
			const entity = new EventEntity(
				makeEvent({
					startDate: new Date("2099-01-10"),
					endDate: new Date("2099-01-12"),
				})
			);
			expect(entity.durationIndays()).toBe(2);
		});

		it("returns 0 for a same-day event", () => {
			const d = new Date("2099-01-10");
			const entity = new EventEntity(makeEvent({ startDate: d, endDate: d }));
			expect(entity.durationIndays()).toBe(0);
		});

		it("returns 1 for an overnight event", () => {
			const entity = new EventEntity(
				makeEvent({
					startDate: new Date("2099-01-10"),
					endDate: new Date("2099-01-11"),
				})
			);
			expect(entity.durationIndays()).toBe(1);
		});
	});

	describe("getSummary()", () => {
		it("returns 'name @ location' format", () => {
			const entity = new EventEntity(makeEvent({ name: "My Event", location: "Chiang Mai" }));
			expect(entity.getSummary()).toBe("My Event @ Chiang Mai");
		});
	});
});
