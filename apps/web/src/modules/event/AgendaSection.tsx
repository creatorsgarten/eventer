"use client";

import { Edit, GripVertical, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/atoms/button";
// shadcn dialog imports
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { useCreateAgenda } from "@/hooks/use-create-agenda";
import { useDeleteAgenda } from "@/hooks/use-delete-agenda";
import { useGetAgenda } from "@/hooks/use-get-agenda";
import { useUpdateAgenda } from "@/hooks/use-update-agenda";

type AgendaSlot = {
	id: string;
	eventId: string;
	start: string;
	end: string;
	activity: string;
	personincharge: string;
	duration: number;
	remarks: string | null;
	actualEndTime?: string | null;
};

// Utility function to safely parse time
const parseTime = (timeString: string): { hours: number; minutes: number } | null => {
	const parts = timeString.split(":").map(Number);
	if (
		parts.length !== 2 ||
		Number.isNaN(parts[0]!) ||
		Number.isNaN(parts[1]!) ||
		parts[0] === undefined ||
		parts[1] === undefined
	) {
		return null;
	}
	return { hours: parts[0]!, minutes: parts[1]! };
};

const agendaHeaders = [
	"Slot",
	"Start",
	"End",
	"Activity",
	"Person in Charge",
	"Remarks",
	"Actions",
];

export default function AgendaSection() {
	const eventId = "static-event-1";
	const [currentDay, setCurrentDay] = useState(1);
	const [hasMounted, setHasMounted] = useState(false);

	// Calculate event dates based on a static event (you can modify this to use props)
	const eventStartDate = "2025-07-26"; // Day 1
	const eventDays = useMemo(() => {
		const startDate = new Date(eventStartDate);
		// Assuming 3 days event, you can modify this logic
		return Array.from({ length: 3 }, (_, i) => {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			return {
				day: i + 1,
				date: date.toISOString().split("T")[0], // YYYY-MM-DD format
				displayDate: date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
			};
		});
	}, []);

	const currentDayData = eventDays[currentDay - 1];

	const { data: agendaSlots, isLoading, error, refetch } = useGetAgenda(); //eventId, currentDay - previous input

	// Dialog state
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editingSlot, setEditingSlot] = useState<AgendaSlot | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Form state
	const [form, setForm] = useState({
		start: "",
		end: "",
		activity: "",
		personincharge: "",
		remarks: "",
	});

	const { createAgenda, isPending: isCreating } = useCreateAgenda();
	const { updateAgenda, isPending: isUpdating } = useUpdateAgenda();
	const { deleteAgenda, isPending: isDeleting } = useDeleteAgenda();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError(null);

		// Validate time format
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
		if (!timeRegex.test(form.start)) {
			setSubmitError("Start time must be in HH:MM format (e.g., 09:00)");
			return;
		}
		if (!timeRegex.test(form.end)) {
			setSubmitError("End time must be in HH:MM format (e.g., 17:00)");
			return;
		}

		// Compare times to ensure end is after start
		const startTime = parseTime(form.start);
		const endTime = parseTime(form.end);

		if (!startTime || !endTime) {
			setSubmitError("Invalid time format");
			return;
		}

		const startMinutes = startTime.hours * 60 + startTime.minutes;
		const endMinutes = endTime.hours * 60 + endTime.minutes;

		if (endMinutes <= startMinutes) {
			setSubmitError("End time must be after start time");
			return;
		}

		// Create full datetime by combining current day with time input
		const createDateTime = (timeString: string) => {
			const time = parseTime(timeString);
			if (!time) return "";

			// Get the current day's date
			const currentDate = new Date(`${currentDayData?.date}T00:00:00`);

			// Set the time (in Thailand timezone)
			currentDate.setHours(time.hours, time.minutes, 0, 0);

			return currentDate.toISOString();
		};

		const startDateTime = createDateTime(form.start);
		const endDateTime = createDateTime(form.end);

		console.log("Submitting form data (Thailand time):", {
			eventId,
			day: currentDay,
			start: startDateTime,
			end: endDateTime,
			activity: form.activity,
			personincharge: form.personincharge,
			remarks: form.remarks,
		});

		createAgenda(
			{
				eventId,
				day: currentDay,
				start: startDateTime,
				end: endDateTime,
				activity: form.activity,
				personincharge: form.personincharge,
				remarks: form.remarks,
			},
			{
				onSuccess: () => {
					console.log("Agenda created successfully");
					setOpen(false);
					setForm({
						start: "",
						end: "",
						activity: "",
						personincharge: "",
						remarks: "",
					});
					refetch();
				},
				onError: (error) => {
					console.error("Error creating agenda:", error);
					setSubmitError(error instanceof Error ? error.message : "Failed to create agenda");
				},
			}
		);
	};

	const handleEdit = (slot: AgendaSlot) => {
		setEditingSlot(slot);
		// Convert the slot data to form format
		const startTime = new Date(slot.start).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "Asia/Bangkok",
		});
		const endTime = new Date(slot.end).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "Asia/Bangkok",
		});

		setForm({
			start: startTime,
			end: endTime,
			activity: slot.activity,
			personincharge: slot.personincharge,
			remarks: slot.remarks || "",
		});
		setEditOpen(true);
	};

	const handleEditSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError(null);

		if (!editingSlot) return;

		// Validate time format
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
		if (!timeRegex.test(form.start)) {
			setSubmitError("Start time must be in HH:MM format (e.g., 09:00)");
			return;
		}
		if (!timeRegex.test(form.end)) {
			setSubmitError("End time must be in HH:MM format (e.g., 17:00)");
			return;
		}

		// Compare times to ensure end is after start
		const startTime = parseTime(form.start);
		const endTime = parseTime(form.end);

		if (!startTime || !endTime) {
			setSubmitError("Invalid time format");
			return;
		}

		const startMinutes = startTime.hours * 60 + startTime.minutes;
		const endMinutes = endTime.hours * 60 + endTime.minutes;

		if (endMinutes <= startMinutes) {
			setSubmitError("End time must be after start time");
			return;
		}

		// Create full datetime for the current day
		const createDateTime = (timeString: string) => {
			const time = parseTime(timeString);
			if (!time) return "";

			const currentDate = new Date(`${currentDayData?.date}T00:00:00`);
			currentDate.setHours(time.hours, time.minutes, 0, 0);
			return currentDate.toISOString();
		};

		const startDateTime = createDateTime(form.start);
		const endDateTime = createDateTime(form.end);

		updateAgenda(
			{
				id: editingSlot.id,
				eventId,
				day: currentDay,
				start: startDateTime,
				end: endDateTime,
				activity: form.activity,
				personincharge: form.personincharge,
				remarks: form.remarks,
			},
			{
				onSuccess: () => {
					console.log("Agenda updated successfully");
					setEditOpen(false);
					setEditingSlot(null);
					setForm({
						start: "",
						end: "",
						activity: "",
						personincharge: "",
						remarks: "",
					});
					refetch();
				},
				onError: (error) => {
					console.error("Error updating agenda:", error);
					setSubmitError(error instanceof Error ? error.message : "Failed to update agenda");
				},
			}
		);
	};

	const handleDelete = (slot: AgendaSlot) => {
		if (window.confirm("Are you sure you want to delete this agenda slot?")) {
			deleteAgenda(
				{
					id: slot.id,
					eventId,
					day: currentDay,
				},
				{
					onSuccess: () => {
						console.log("Agenda deleted successfully");
						refetch();
					},
					onError: (error) => {
						console.error("Error deleting agenda:", error);
						alert(error instanceof Error ? error.message : "Failed to delete agenda");
					},
				}
			);
		}
	};

	const sortedSlots = useMemo(() => {
		if (!agendaSlots || !Array.isArray(agendaSlots)) return [];

		// Convert UTC times to Thailand timezone (UTC+7) for filtering and sorting
		const filteredSlots = agendaSlots.filter((slot) => {
			const slotDateThailand = new Date(slot.start).toLocaleDateString("en-CA", {
				timeZone: "Asia/Bangkok",
			});
			return slotDateThailand === currentDayData?.date;
		});

		// Sort by Thailand time chronologically
		return [...filteredSlots].sort((a, b) => {
			// Convert to Thailand timezone for comparison
			const dateA = new Date(a.start).toLocaleDateString("en-CA", {
				timeZone: "Asia/Bangkok",
			});
			const dateB = new Date(b.start).toLocaleDateString("en-CA", {
				timeZone: "Asia/Bangkok",
			});

			// First, sort by date
			if (dateA !== dateB) {
				return dateA.localeCompare(dateB);
			}

			// Then sort by start time in Thailand timezone
			const timeA = new Date(a.start).toLocaleString("en-US", {
				timeZone: "Asia/Bangkok",
				hour12: false,
				hour: "2-digit",
				minute: "2-digit",
			});
			const timeB = new Date(b.start).toLocaleString("en-US", {
				timeZone: "Asia/Bangkok",
				hour12: false,
				hour: "2-digit",
				minute: "2-digit",
			});

			// Compare times as numbers (convert HH:MM to minutes)
			const startTimeA = parseTime(timeA);
			const startTimeB = parseTime(timeB);

			if (!startTimeA || !startTimeB) {
				return 0; // If parsing fails, consider equal
			}

			const totalMinutesA = startTimeA.hours * 60 + startTimeA.minutes;
			const totalMinutesB = startTimeB.hours * 60 + startTimeB.minutes;

			if (totalMinutesA === totalMinutesB) {
				// If start times are the same, sort by end time
				const endTimeStrA = new Date(a.end).toLocaleString("en-US", {
					timeZone: "Asia/Bangkok",
					hour12: false,
					hour: "2-digit",
					minute: "2-digit",
				});
				const endTimeStrB = new Date(b.end).toLocaleString("en-US", {
					timeZone: "Asia/Bangkok",
					hour12: false,
					hour: "2-digit",
					minute: "2-digit",
				});

				const endTimeA = parseTime(endTimeStrA);
				const endTimeB = parseTime(endTimeStrB);

				if (!endTimeA || !endTimeB) {
					return 0; // If parsing fails, consider equal
				}

				const totalEndMinutesA = endTimeA.hours * 60 + endTimeA.minutes;
				const totalEndMinutesB = endTimeB.hours * 60 + endTimeB.minutes;

				return totalEndMinutesA - totalEndMinutesB;
			}

			return totalMinutesA - totalMinutesB;
		});
	}, [agendaSlots, currentDayData]);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen text-purple-500">
				Loading agenda...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
				Error loading agenda: {error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header - Mobile responsive */}
			<div className="p-4 lg:p-8">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold">Event Agenda</h1>
						<p className="text-gray-600 text-sm lg:text-base mt-1">
							Day {currentDay} - {currentDayData?.displayDate} ({currentDayData?.date})
						</p>
					</div>

					{/* Day selector - Mobile responsive */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
						<div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
							{eventDays.map((dayInfo) => (
								<Button
									key={dayInfo.day}
									variant={currentDay === dayInfo.day ? "default" : "outline"}
									size="sm"
									onClick={() => setCurrentDay(dayInfo.day)}
									className={`flex-shrink-0 ${currentDay === dayInfo.day ? "bg-purple-600" : ""}`}
								>
									<div className="text-center">
										<div className="text-xs">Day {dayInfo.day}</div>
										<div className="text-xs opacity-75">{dayInfo.displayDate}</div>
									</div>
								</Button>
							))}
						</div>

						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button variant="default" size="sm" className="w-full sm:w-auto">
									<span className="text-sm">+ Add Task</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="w-[95vw] max-w-md mx-auto">
								<DialogHeader>
									<DialogTitle>Create Agenda Slot</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmit} className="space-y-4">
									{submitError && (
										<div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
											{submitError}
										</div>
									)}

									<div>
										<label htmlFor="start" className="text-sm block mb-2 font-medium">
											Start Time
										</label>
										<Input
											id="start"
											name="start"
											type="text"
											value={form.start}
											onChange={handleInputChange}
											required
											placeholder="09:00"
											pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9]"
											className="w-full text-base font-mono"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Format: HH:MM (e.g., 09:00) for {currentDayData?.displayDate}
										</p>
									</div>
									<div>
										<label htmlFor="end" className="text-sm block mb-2 font-medium">
											End Time
										</label>
										<Input
											id="end"
											name="end"
											type="text"
											value={form.end}
											onChange={handleInputChange}
											required
											placeholder="17:00"
											pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9]"
											className="w-full text-base font-mono"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Format: HH:MM (e.g., 17:00) for {currentDayData?.displayDate}
										</p>
									</div>
									<div>
										<label htmlFor="activity" className="text-sm block mb-2 font-medium">
											Activity
										</label>
										<Input
											id="activity"
											name="activity"
											value={form.activity}
											onChange={handleInputChange}
											required
											className="w-full"
										/>
									</div>
									<div>
										<label htmlFor="personincharge" className="text-sm block mb-2 font-medium">
											Person in Charge
										</label>
										<Input
											id="personincharge"
											name="personincharge"
											value={form.personincharge}
											onChange={handleInputChange}
											required
											className="w-full"
										/>
									</div>
									<div>
										<label htmlFor="remarks" className="text-sm block mb-2 font-medium">
											Remarks
										</label>
										<Input
											id="remarks"
											name="remarks"
											value={form.remarks}
											onChange={handleInputChange}
											className="w-full"
										/>
									</div>
									<DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
										<DialogClose asChild>
											<Button type="button" variant="outline" className="w-full sm:w-auto">
												Cancel
											</Button>
										</DialogClose>
										<Button type="submit" disabled={isCreating} className="w-full sm:w-auto">
											{isCreating ? "Creating..." : "Create"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						{/* Edit Dialog */}
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogContent className="w-[95vw] max-w-md mx-auto">
								<DialogHeader>
									<DialogTitle>Edit Agenda Slot</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleEditSubmit} className="space-y-4">
									{submitError && (
										<div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
											{submitError}
										</div>
									)}

									<div>
										<label htmlFor="edit-start" className="text-sm block mb-2 font-medium">
											Start Time
										</label>
										<Input
											id="edit-start"
											name="start"
											type="text"
											value={form.start}
											onChange={handleInputChange}
											required
											placeholder="09:00"
											pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9]"
											className="w-full text-base font-mono"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Format: HH:MM (e.g., 09:00) for {currentDayData?.displayDate}
										</p>
									</div>
									<div>
										<label htmlFor="edit-end" className="text-sm block mb-2 font-medium">
											End Time
										</label>
										<Input
											id="edit-end"
											name="end"
											type="text"
											value={form.end}
											onChange={handleInputChange}
											required
											placeholder="17:00"
											pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9]"
											className="w-full text-base font-mono"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Format: HH:MM (e.g., 17:00) for {currentDayData?.displayDate}
										</p>
									</div>
									<div>
										<label htmlFor="edit-activity" className="text-sm block mb-2 font-medium">
											Activity
										</label>
										<Input
											id="edit-activity"
											name="activity"
											value={form.activity}
											onChange={handleInputChange}
											required
											className="w-full"
										/>
									</div>
									<div>
										<label htmlFor="edit-personincharge" className="text-sm block mb-2 font-medium">
											Person in Charge
										</label>
										<Input
											id="edit-personincharge"
											name="personincharge"
											value={form.personincharge}
											onChange={handleInputChange}
											required
											className="w-full"
										/>
									</div>
									<div>
										<label htmlFor="edit-remarks" className="text-sm block mb-2 font-medium">
											Remarks
										</label>
										<Input
											id="edit-remarks"
											name="remarks"
											value={form.remarks}
											onChange={handleInputChange}
											className="w-full"
										/>
									</div>
									<DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
										<DialogClose asChild>
											<Button
												type="button"
												variant="outline"
												className="w-full sm:w-auto"
												onClick={() => {
													setEditOpen(false);
													setEditingSlot(null);
													setForm({
														start: "",
														end: "",
														activity: "",
														personincharge: "",
														remarks: "",
													});
												}}
											>
												Cancel
											</Button>
										</DialogClose>
										<Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
											{isUpdating ? "Updating..." : "Update"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{/* Desktop Table */}
				<div className="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									{agendaHeaders.map((header) => (
										<th key={header} className="px-6 py-3 text-left text-gray-600 font-semibold">
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{sortedSlots.length > 0 ? (
									sortedSlots.map((slot, idx) => (
										<tr key={slot.id} className="border-t hover:bg-gray-50">
											<td className="px-6 py-4 flex items-center gap-2">
												<GripVertical className="w-4 h-4 text-gray-400" />
												{idx + 1}
											</td>
											<td className="px-6 py-4 font-medium">
												{hasMounted
													? new Date(slot.start).toLocaleTimeString("en-US", {
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
															timeZone: "Asia/Bangkok",
														})
													: "--:--"}
											</td>
											<td className="px-6 py-4 font-medium">
												{hasMounted
													? new Date(slot.end).toLocaleTimeString("en-US", {
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
															timeZone: "Asia/Bangkok",
														})
													: "--:--"}
											</td>
											<td className="px-6 py-4">{slot.activity}</td>
											<td className="px-6 py-4">{slot.personincharge}</td>
											<td className="px-6 py-4">{slot.remarks || "-"}</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEdit(slot)}
														className="h-8 w-8 p-0"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleDelete(slot)}
														className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
														disabled={isDeleting}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={agendaHeaders.length} className="text-center text-gray-500 py-12">
											<div className="flex flex-col items-center gap-2">
												<div className="text-4xl">📅</div>
												<p className="font-medium">No agenda slots yet</p>
												<p className="text-sm">Click &ldquo;Add Task to get started</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Mobile Card Layout */}
				<div className="lg:hidden space-y-3">
					{sortedSlots.length > 0 ? (
						sortedSlots.map((slot, idx) => (
							<div key={slot.id} className="bg-white rounded-lg shadow-sm border p-4">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center gap-2">
										<GripVertical className="w-4 h-4 text-gray-400" />
										<span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded">
											#{idx + 1}
										</span>
									</div>
									<div className="text-xs text-gray-500">{currentDayData?.displayDate}</div>
								</div>

								<div className="space-y-3">
									<div>
										<h3 className="font-semibold text-purple-800 bg-purple-50 px-3 py-2 rounded-lg text-sm">
											{slot.activity}
										</h3>
									</div>

									<div className="grid grid-cols-2 gap-3 text-sm">
										<div>
											<p className="text-gray-500 text-xs font-medium">Start</p>
											<p className="font-semibold">
												{hasMounted
													? new Date(slot.start).toLocaleTimeString("en-US", {
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
															timeZone: "Asia/Bangkok",
														})
													: "--:--"}
											</p>
										</div>
										<div>
											<p className="text-gray-500 text-xs font-medium">End</p>
											<p className="font-semibold">
												{hasMounted
													? new Date(slot.end).toLocaleTimeString("en-US", {
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
															timeZone: "Asia/Bangkok",
														})
													: "--:--"}
											</p>
										</div>
									</div>

									<div>
										<p className="text-gray-500 text-xs font-medium">Person in Charge</p>
										<p className="font-medium text-sm">{slot.personincharge}</p>
									</div>

									{slot.remarks && (
										<div>
											<p className="text-gray-500 text-xs font-medium">Remarks</p>
											<p className="text-sm text-gray-600">{slot.remarks}</p>
										</div>
									)}

									<div className="flex items-center justify-end gap-2 pt-2 border-t">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleEdit(slot)}
											className="h-8 px-3"
										>
											<Edit className="h-4 w-4 mr-1" />
											Edit
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDelete(slot)}
											className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
											disabled={isDeleting}
										>
											<Trash2 className="h-4 w-4 mr-1" />
											Delete
										</Button>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
							<div className="text-6xl mb-4">📅</div>
							<p className="font-medium text-lg mb-2">No agenda slots yet</p>
							<p className="text-sm">
								Click &ldquo;Add Task&rdquo; to create your first agenda item for{" "}
								{currentDayData?.displayDate}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
