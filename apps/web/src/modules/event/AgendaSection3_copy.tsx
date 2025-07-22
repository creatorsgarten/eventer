"use client";

import { Calendar, Edit, Filter, GripVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/atoms/button";
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
import { useGetAgenda } from "@/hooks/use-get-agenda";

// Use the same static data as OverviewSection
const staticEventData = {
	id: "1",
	name: "Stupido Hackettino ๙: Create weird things",
	startDate: "2025-07-26T08:00:00",
	endDate: "2025-07-27T18:00:00",
	location: "Bangkok, Thailand",
	description: "Demo event",
	type: "hackathon",
	isPublic: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const agendaHeaders = ["Slot", "Start", "End", "Activity", "Person in Charge", "Remarks"];

//TODO : Problem right now is the day use is not event date it the current date which is wrong

type AgendaSectionProps = {
	eventData?: {
		id: string;
		name: string;
		startDate: string;
		endDate: string;
		location: string;
		description: string;
		type: string;
		isPublic: boolean;
		createdAt: string;
		updatedAt: string;
	};
};

export default function AgendaSection({ eventData = staticEventData }: AgendaSectionProps) {
	const [currentDay, setCurrentDay] = useState(1);
	const [currentTime, setCurrentTime] = useState(() => new Date());
	const [hasMounted, setHasMounted] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showMobileFilters, setShowMobileFilters] = useState(false);

	// Calculate event days based on start and end dates
	const eventDays = useMemo(() => {
		const start = new Date(eventData.startDate);
		const end = new Date(eventData.endDate);
		const diffTime = end.getTime() - start.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

		return Array.from({ length: diffDays }, (_, i) => {
			const date = new Date(start);
			date.setDate(start.getDate() + i);
			return {
				day: i + 1,
				date: date,
				dateString: date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				fullDate: date.toISOString().split("T")[0],
			};
		});
	}, [eventData.startDate, eventData.endDate]);

	const currentDayInfo = eventDays[currentDay - 1];

	const { data: agendaSlots, isLoading, error } = useGetAgenda("1", currentDay); // Always use "1" as eventId

	// Dialog state
	const [open, setOpen] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Form state
	const [form, setForm] = useState({
		start: "",
		end: "",
		activity: "",
		personincharge: "",
		remarks: "",
	});

	const { createAgenda, isPending: isCreating, error: createError } = useCreateAgenda();

	// Live time ticker
	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError(null);

		// Validate time format (HH:MM)
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
		if (!timeRegex.test(form.start)) {
			setSubmitError("Start time must be in HH:MM format (e.g., 08:00)");
			return;
		}
		if (!timeRegex.test(form.end)) {
			setSubmitError("End time must be in HH:MM format (e.g., 17:00)");
			return;
		}

		// Compare times - fix time comparison for HH:MM format
		const [startHour, startMin] = form.start.split(":").map(Number);
		const [endHour, endMin] = form.end.split(":").map(Number);
		const startMinutes = startHour * 60 + startMin;
		const endMinutes = endHour * 60 + endMin;

		if (endMinutes <= startMinutes) {
			setSubmitError("End time must be after start time");
			return;
		}

		// Create agenda with static eventId "1"
		const agendaData = {
			eventId: "1", // Always use "1" as the eventId
			day: currentDay,
			start: form.start,
			end: form.end,
			activity: form.activity,
			personincharge: form.personincharge,
			remarks: form.remarks || "",
		};

		console.log("Submitting agenda data:", agendaData); // Debug log

		createAgenda(agendaData, {
			onSuccess: () => {
				console.log("Agenda created successfully!");
				setOpen(false);
				setForm({
					start: "",
					end: "",
					activity: "",
					personincharge: "",
					remarks: "",
				});
			},
			onError: (error) => {
				console.error("Error creating agenda:", error);
				const errorMessage = error instanceof Error ? error.message : "Failed to create agenda";
				setSubmitError(errorMessage);
			},
		});
	};

	const formatCurrentDate = () => {
		if (currentDayInfo) {
			return currentDayInfo.date.toLocaleDateString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		}
		return new Date().toLocaleDateString();
	};

	const formatDateTime = (dateString: string) => {
		try {
			// If it's already in HH:MM format, return as is
			if (dateString && dateString.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
				return dateString;
			}
			// If it's a full datetime, extract time only
			return new Date(dateString).toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
		} catch {
			return dateString;
		}
	};

	const formatTime = (date: Date) =>
		date.toLocaleTimeString("th-TH", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

	const sortedSlots = useMemo(() => {
		if (!agendaSlots) return [];
		const filtered = agendaSlots.filter(
			(slot) =>
				searchQuery === "" ||
				slot.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
				slot.personincharge.toLowerCase().includes(searchQuery.toLowerCase())
		);
		return [...filtered].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
	}, [agendaSlots, searchQuery]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen text-purple-500 px-4">
				<div className="text-center">
					<Calendar className="w-8 h-8 animate-spin mx-auto mb-2" />
					<span className="font-medium">Loading agenda...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen text-red-500 font-medium px-4">
				<div className="text-center">
					<h2 className="text-lg md:text-xl mb-2">Error loading agenda</h2>
					<p className="text-sm">{(error as any).message || "Unknown error"}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Top Header - Mobile Responsive */}
			<div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white">
				<div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
					<div className="flex-1">
						<h1 className="text-xl md:text-2xl font-bold">{eventData.name}</h1>
						<p className="text-purple-200 text-sm md:text-base">
							Agenda Management - {currentDayInfo?.dateString} (Day {currentDay})
						</p>
						<p className="text-purple-100 text-xs md:text-sm mt-1">{eventData.location}</p>
						<Button
							variant="secondary"
							size="sm"
							className="mt-3 md:mt-4 bg-white text-purple-600 hover:bg-gray-100"
							onClick={() => window.location.assign(`/timer`)}
						>
							View Timer
						</Button>
					</div>

					{/* Time Widget - Responsive */}
					<div className="bg-white text-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 shadow w-full lg:min-w-80 lg:w-auto">
						<div className="text-center mb-3 md:mb-4">
							<p className="text-2xl md:text-4xl font-bold">
								{hasMounted ? formatTime(currentTime) : "--:--:--"}
							</p>
							<p className="text-xs text-gray-500 mt-1">{formatCurrentDate()}</p>
						</div>
						<div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-center">
							<div>
								<p className="text-gray-500">Current Activity</p>
								<p className="font-medium text-xs md:text-sm">
									{sortedSlots.find((slot) => {
										const now = new Date();
										const start = new Date(slot.start);
										const end = new Date(slot.end);
										return now >= start && now <= end;
									})?.activity || "No Activity"}
								</p>
							</div>
							<div>
								<p className="text-gray-500">Next Activity</p>
								<p className="font-medium text-xs md:text-sm">
									{sortedSlots.find((slot) => new Date(slot.start) > new Date())?.activity ||
										"No Activity"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Toolbar */}
			<div className="md:hidden px-4 py-3 bg-white border-b">
				<div className="flex gap-2 mb-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Search..."
							className="pl-10 bg-gray-50 text-sm"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowMobileFilters(!showMobileFilters)}
						className="px-3"
					>
						<Filter className="w-4 h-4" />
					</Button>
				</div>

				{showMobileFilters && (
					<div className="flex gap-2 pb-2 border-t pt-3">
						<Button variant="outline" size="sm" className="text-xs">
							<Calendar className="w-3 h-3 mr-1" />
							{currentDayInfo?.dateString}
						</Button>
					</div>
				)}
			</div>

			{/* Desktop Toolbar */}
			<div className="hidden md:flex px-8 py-4 bg-white border-b justify-between items-center">
				<div className="relative w-full max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
					<Input
						placeholder="Search activities or person..."
						className="pl-10 bg-gray-50"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2 ml-4">
					<Button variant="outline" size="sm">
						<Calendar className="w-4 h-4 mr-2" />
						{currentDayInfo?.dateString}
					</Button>
					<Button variant="outline" size="sm">
						<Filter className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Agenda Content */}
			<div className="px-4 md:px-8 py-4 md:py-8">
				<div className="bg-white shadow rounded-lg">
					{/* Header with Day Selector */}
					<div className="px-4 md:px-6 py-4 border-b">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
							<div className="flex flex-col sm:flex-row sm:items-center gap-4">
								<h2 className="text-lg md:text-xl font-bold">
									Day {currentDay} - {currentDayInfo?.dateString}
								</h2>
								<div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
									{eventDays.map((dayInfo) => (
										<Button
											key={dayInfo.day}
											variant={currentDay === dayInfo.day ? "default" : "outline"}
											size="sm"
											className={`flex-shrink-0 ${
												currentDay === dayInfo.day ? "bg-purple-600 text-white" : ""
											}`}
											onClick={() => setCurrentDay(dayInfo.day)}
										>
											<div className="text-center">
												<div className="text-xs">Day {dayInfo.day}</div>
												<div className="text-xs opacity-75">{dayInfo.dateString}</div>
											</div>
										</Button>
									))}
								</div>
							</div>

							{/* Dialog remains the same */}
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger asChild>
									<Button className="bg-purple-600 text-white hover:bg-purple-700 w-full sm:w-auto">
										<Plus className="w-4 h-4 mr-2" />
										Add Task
									</Button>
								</DialogTrigger>
								<DialogContent className="w-[95vw] max-w-md mx-auto">
									<DialogHeader>
										<DialogTitle>Add Task Schedule</DialogTitle>
									</DialogHeader>
									<form onSubmit={handleSubmit} className="space-y-4 mt-4">
										{submitError && (
											<div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
												{submitError}
											</div>
										)}

										{/* Form fields with time-only inputs */}
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
												placeholder="08:00"
												pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
												className="w-full text-base font-mono"
											/>
											<p className="text-xs text-gray-500 mt-1">Format: HH:MM (e.g., 08:00)</p>
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
												pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
												className="w-full text-base font-mono"
											/>
											<p className="text-xs text-gray-500 mt-1">Format: HH:MM (e.g., 17:00)</p>
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
												placeholder="Enter activity name"
												className="w-full text-base"
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
												placeholder="Enter person name"
												className="w-full text-base"
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
												placeholder="Optional remarks"
												className="w-full text-base"
											/>
										</div>

										<DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
											<DialogClose asChild>
												<Button
													type="button"
													variant="outline"
													disabled={isCreating}
													className="w-full sm:w-auto"
												>
													Cancel
												</Button>
											</DialogClose>
											<Button
												type="submit"
												disabled={isCreating}
												className="bg-purple-600 text-white hover:bg-purple-700 w-full sm:w-auto"
											>
												{isCreating ? (
													<>
														<span className="animate-spin mr-2">⏳</span>
														Creating...
													</>
												) : (
													"Save Changes"
												)}
											</Button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						</div>
					</div>

					{/* Table Container - Desktop */}
					<div className="hidden md:block overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									{agendaHeaders.map((header) => (
										<th key={header} className="px-6 py-3 text-left text-gray-600 font-semibold">
											{header}
										</th>
									))}
									<th className="px-6 py-3 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{sortedSlots.length > 0 ? (
									sortedSlots.map((slot, idx) => (
										<tr key={slot.id} className="border-t hover:bg-gray-50 transition-colors">
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
													<span className="font-medium">{idx + 1}</span>
												</div>
											</td>
											<td className="px-6 py-4 font-medium">{formatDateTime(slot.start)}</td>
											<td className="px-6 py-4 font-medium">{formatDateTime(slot.end)}</td>
											<td className="px-6 py-4">
												<span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
													{slot.activity}
												</span>
											</td>
											<td className="px-6 py-4">{slot.personincharge}</td>
											<td className="px-6 py-4 text-gray-600">{slot.remarks || "-"}</td>
											<td className="px-6 py-4">
												<div className="flex gap-2 justify-center">
													<Button size="sm" variant="outline" className="h-8 w-8 p-0">
														<Edit className="w-3 h-3" />
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
													>
														<Trash2 className="w-3 h-3" />
													</Button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={agendaHeaders.length + 1}
											className="text-center text-gray-500 py-12"
										>
											<div className="flex flex-col items-center gap-2">
												<Calendar className="w-8 h-8 text-gray-300" />
												<p className="font-medium">No agenda slots yet</p>
												<p className="text-sm">Click "Add Task" to get started</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Mobile Card Layout */}
					<div className="md:hidden">
						{sortedSlots.length > 0 ? (
							<div className="divide-y">
								{sortedSlots.map((slot, idx) => (
									<div key={slot.id} className="p-4 hover:bg-gray-50">
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-2">
												<GripVertical className="w-4 h-4 text-gray-400" />
												<span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded">
													#{idx + 1}
												</span>
											</div>
											<div className="flex gap-2">
												<Button size="sm" variant="outline" className="h-8 w-8 p-0">
													<Edit className="w-3 h-3" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<div>
												<span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
													{slot.activity}
												</span>
											</div>

											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<p className="text-gray-500 text-xs">Start</p>
													<p className="font-medium">{formatDateTime(slot.start)}</p>
												</div>
												<div>
													<p className="text-gray-500 text-xs">End</p>
													<p className="font-medium">{formatDateTime(slot.end)}</p>
												</div>
											</div>

											<div>
												<p className="text-gray-500 text-xs">Person in Charge</p>
												<p className="font-medium text-sm">{slot.personincharge}</p>
											</div>

											{slot.remarks && (
												<div>
													<p className="text-gray-500 text-xs">Remarks</p>
													<p className="text-sm text-gray-600">{slot.remarks}</p>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center text-gray-500 py-12 px-4">
								<Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
								<p className="font-medium">No agenda slots yet</p>
								<p className="text-sm mt-1">Click "Add Task" to get started</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
