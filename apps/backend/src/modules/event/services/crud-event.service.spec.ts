import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EventType } from "../event.model";
import type { EventRepository } from "../event.repository";
import { createEvent, getEventById, listEvents } from "./crud-event.service";

// ── Helpers ──────────────────────────────────────────────────────────────────

const makeEventType = (overrides?: Partial<EventType>): EventType => ({
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

const makeRepo = (): EventRepository =>
	({
		create: vi.fn(),
		read: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		list: vi.fn(),
	}) as unknown as EventRepository;

// ── createEvent ───────────────────────────────────────────────────────────────

describe("createEvent", () => {
	let repo: EventRepository;

	beforeEach(() => {
		repo = makeRepo();
	});

	it("calls repository.create with the supplied data", async () => {
		const input = {
			name: "My Event",
			startDate: "2099-01-10T00:00:00.000Z",
			endDate: "2099-01-12T00:00:00.000Z",
			location: "Bangkok",
			description: null,
			createdBy: "user-1",
		};
		const stored = makeEventType();
		vi.mocked(repo.create).mockResolvedValue(stored);

		await createEvent(repo, input);

		expect(repo.create).toHaveBeenCalledOnce();
		expect(repo.create).toHaveBeenCalledWith(input);
	});

	it("returns the event record from the repository (including createdAt/updatedAt)", async () => {
		const stored = makeEventType({
			id: "evt-new",
			createdAt: new Date("2025-05-01"),
			updatedAt: new Date("2025-05-01"),
		});
		vi.mocked(repo.create).mockResolvedValue(stored);

		const result = await createEvent(repo, {
			name: "My Event",
			startDate: "2099-01-10T00:00:00.000Z",
			endDate: "2099-01-12T00:00:00.000Z",
			location: "Bangkok",
			description: null,
			createdBy: "user-1",
		});

		expect(result.id).toBe("evt-new");
		expect(result.createdAt).toBeDefined();
		expect(result.updatedAt).toBeDefined();
	});

	it("propagates errors thrown by the repository", async () => {
		vi.mocked(repo.create).mockRejectedValue(new Error("DB down"));

		await expect(
			createEvent(repo, {
				name: "My Event",
				startDate: "2099-01-10T00:00:00.000Z",
				endDate: "2099-01-12T00:00:00.000Z",
				location: "Bangkok",
				description: null,
				createdBy: "user-1",
			})
		).rejects.toThrow("DB down");
	});
});

// ── getEventById ──────────────────────────────────────────────────────────────

describe("getEventById", () => {
	let repo: EventRepository;

	beforeEach(() => {
		repo = makeRepo();
	});

	it("returns the event when found", async () => {
		const event = makeEventType();
		vi.mocked(repo.read).mockResolvedValue(event);

		const result = await getEventById(repo, "evt-1");

		expect(result).toEqual(event);
		expect(repo.read).toHaveBeenCalledWith("evt-1");
	});

	it("returns null when the event does not exist", async () => {
		vi.mocked(repo.read).mockResolvedValue(null);

		const result = await getEventById(repo, "non-existent");

		expect(result).toBeNull();
	});
});

// ── listEvents ────────────────────────────────────────────────────────────────

describe("listEvents", () => {
	let repo: EventRepository;

	beforeEach(() => {
		repo = makeRepo();
	});

	it("returns all events when no filters applied", async () => {
		const events = [makeEventType(), makeEventType({ id: "evt-2", name: "Second Event" })];
		vi.mocked(repo.list).mockResolvedValue(events);

		const result = await listEvents(repo);

		expect(result).toHaveLength(2);
	});

	it("filters by name (case-insensitive substring)", async () => {
		vi.mocked(repo.list).mockResolvedValue([
			makeEventType({ name: "Bangkok Summit" }),
			makeEventType({ id: "evt-2", name: "Chiang Mai Festival" }),
		]);

		const result = await listEvents(repo, { name: "bangkok" });

		expect(result).toHaveLength(1);
		expect(result[0]?.name).toBe("Bangkok Summit");
	});

	it("filters by location (case-insensitive substring)", async () => {
		vi.mocked(repo.list).mockResolvedValue([
			makeEventType({ location: "Bangkok Arena" }),
			makeEventType({ id: "evt-2", location: "Chiang Mai Hall" }),
		]);

		const result = await listEvents(repo, { location: "chiang" });

		expect(result).toHaveLength(1);
		expect(result[0]?.location).toBe("Chiang Mai Hall");
	});

	it("filters by startDate — excludes events before the given date", async () => {
		vi.mocked(repo.list).mockResolvedValue([
			makeEventType({ startDate: new Date("2099-03-01") }),
			makeEventType({ id: "evt-2", startDate: new Date("2099-01-01") }),
		]);

		const result = await listEvents(repo, { startDate: "2099-02-01T00:00:00.000Z" });

		expect(result).toHaveLength(1);
		expect(result[0]?.startDate).toEqual(new Date("2099-03-01"));
	});

	it("returns empty array when no events match the filter", async () => {
		vi.mocked(repo.list).mockResolvedValue([makeEventType({ name: "Bangkok Summit" })]);

		const result = await listEvents(repo, { name: "nonexistent" });

		expect(result).toHaveLength(0);
	});
});
