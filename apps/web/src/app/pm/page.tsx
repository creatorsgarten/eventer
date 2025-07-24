"use client";

import { Clock, Flame, QrCode, Undo2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/atoms/alert-dialog";
import { Button } from "@/components/atoms/button";
import { type AgendaSlot, useSessionManager } from "@/hooks/use-session-manager";
import { useTimer } from "@/hooks/use-timer";
import { formatTime, parseTime, toDisplayTime } from "@/lib/time";
interface SessionEnd {
	slotId: string;
	actualEndTime: Date;
	scheduledEndTime: Date;
	difference: number; // in minutes
}

interface DayGroup {
	date: string;
	dayName: string;
	slots: AgendaSlot[];
}

export default function PMAdminPage() {
	const { data, isLoading, error } = useTimer();
	const [currentTime, setCurrentTime] = useState(new Date());
	const [currentDay, setCurrentDay] = useState(1);

	// Use the new session manager
	const {
		sessionEnds,
		handleEndSession,
		handleUndoSession,
		getSessionEndInfo,
		formatAPNotation,
		getLatestAPNotation,
	} = useSessionManager();

	// Calculate event days (same logic as timer page)
	const eventStartDate = "2025-07-26"; // Day 1
	const eventDays = useMemo(() => {
		const startDate = new Date(eventStartDate);
		return Array.from({ length: 3 }, (_, i) => {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			return {
				day: i + 1,
				date: date.toISOString().split("T")[0],
				displayDate: date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
			};
		});
	}, []);

	const currentDayData = eventDays[currentDay - 1];

	// Filter data by selected day (similar to timer page)
	const filteredData = useMemo(() => {
		if (!data || !Array.isArray(data)) return [];

		return data
			.filter((slot) => {
				// Extract date from slot.start (assuming it's stored in Thailand time)
				const slotDate = new Date(slot.start).toISOString().split("T")[0];
				return slotDate === currentDayData?.date;
			})
			.sort((a, b) => {
				// Sort by start time using parseTime function for consistency
				const timeA = parseTime(a.start);
				const timeB = parseTime(b.start);

				// If start times are equal, sort by end time as secondary criteria
				if (timeA === timeB) {
					return parseTime(a.end) - parseTime(b.end);
				}

				return timeA - timeB;
			});
	}, [data, currentDayData]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Group slots by day and sort
	const groupSlotsByDay = (slots: AgendaSlot[]): DayGroup[] => {
		if (!slots || !Array.isArray(slots)) {
			return [];
		}

		const groups: { [key: string]: AgendaSlot[] } = {};

		slots.forEach((slot) => {
			const date = new Date(slot.start);
			const dateKey = date.toDateString();

			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(slot);
		});

		return Object.keys(groups)
			.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
			.map((dateKey, index) => {
				const sortedSlots = (groups[dateKey] || []).sort(
					(a, b) => parseTime(a.start) - parseTime(b.start)
				);

				return {
					date: dateKey,
					dayName: `Day ${index + 1}`,
					slots: sortedSlots,
				};
			});
	};

	const dayGroups = groupSlotsByDay(data || []);

	const getCurrentSlotIndex = (
		currentTime: Date,
		sessionEnds: SessionEnd[],
		slots: AgendaSlot[]
	): number => {
		if (!slots || slots.length === 0) return 0;

		// Find the latest ended session for current slots
		const currentSlotIds = slots.map((slot) => slot.id);
		const currentEndedSessions = sessionEnds
			.filter((se) => currentSlotIds.includes(se.slotId))
			.sort((a, b) => b.actualEndTime.getTime() - a.actualEndTime.getTime());

		if (currentEndedSessions.length > 0) {
			const latestEndedSession = currentEndedSessions[0];
			if (latestEndedSession) {
				const endedSlotIndex = slots.findIndex((slot) => slot.id === latestEndedSession.slotId);

				if (endedSlotIndex !== -1 && endedSlotIndex < slots.length - 1) {
					return endedSlotIndex + 1;
				}
			}
		}

		// Use time-based logic
		const currentHour = currentTime.getHours();
		const currentMinute = currentTime.getMinutes();
		const currentTimeInMinutes = currentHour * 60 + currentMinute;

		for (let i = 0; i < slots.length; i++) {
			const slot = slots[i];
			if (!slot) continue;

			const startTime = parseTime(slot.start);
			const endTime = parseTime(slot.end);

			const startTimeInMinutes = Math.floor(startTime / 60);
			const endTimeInMinutes = Math.floor(endTime / 60);

			if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
				return i;
			}
		}

		if (slots.length > 0) {
			const firstSlot = slots[0];
			if (firstSlot) {
				const firstSlotStart = Math.floor(parseTime(firstSlot.start) / 60);
				if (currentTimeInMinutes < firstSlotStart) {
					return 0;
				}
			}
		}

		return Math.max(0, slots.length - 1);
	};

	// Updated to use async session handling
	const handleEndSessionWithConfirmation = async (slot: AgendaSlot) => {
		try {
			await handleEndSession(slot);
		} catch (error) {
			console.error("Failed to end session:", error);
			// Handle the error properly - check if it's an object with a message
			const errorMessage =
				error instanceof Error
					? error.message
					: typeof error === "object" && error !== null && "message" in error
						? String((error as { message: unknown }).message)
						: "An unknown error occurred";

			console.error("Error details:", errorMessage);
			// You could show a toast notification here or set an error state
			alert(`Failed to end session: ${errorMessage}`);
		}
	};

	const handleUndoSessionWithConfirmation = (slot: AgendaSlot) => {
		try {
			handleUndoSession(slot);
		} catch (error) {
			console.error("Failed to undo session:", error);
			// Handle the error properly
			const errorMessage =
				error instanceof Error
					? error.message
					: typeof error === "object" && error !== null && "message" in error
						? String((error as { message: unknown }).message)
						: "An unknown error occurred";

			console.error("Error details:", errorMessage);
			alert(`Failed to undo session: ${errorMessage}`);
		}
	};

	const calculateSlotProgress = (
		slot: AgendaSlot
	): { progress: number; startTime: string; endTime: string } => {
		const startTime = toDisplayTime(parseTime(slot.start));
		const endTime = toDisplayTime(parseTime(slot.end));

		const startSec = parseTime(slot.start);
		const endSec = parseTime(slot.end);
		const currentSec =
			currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();

		const totalDuration = endSec - startSec;
		const elapsed = Math.max(0, currentSec - startSec);
		const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

		return { progress, startTime, endTime };
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<Clock className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
					<div className="text-lg font-medium">Loading...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-lg font-medium">Error loading agenda</div>
				</div>
			</div>
		);
	}

	if (!data || !Array.isArray(data) || data.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="text-gray-500 text-lg font-medium">No agenda data available</div>
				</div>
			</div>
		);
	}

	if (dayGroups.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="text-gray-500 text-lg font-medium">No agenda slots available</div>
				</div>
			</div>
		);
	}

	// Ensure selectedDayIndex is within bounds - not needed anymore with new logic
	// const validSelectedDayIndex = Math.min(
	//   selectedDayIndex,
	//   dayGroups.length - 1
	// );
	// const selectedDay = dayGroups[validSelectedDayIndex];

	// Get current slot index for the selected day data
	const currentSlotIndex = getCurrentSlotIndex(currentTime, sessionEnds, filteredData);

	// For the left panel (showing "live" current slot from actual current day)
	const currentDate = currentTime.toDateString();
	const liveDayIndex = dayGroups.findIndex((day) => day.date === currentDate);
	const liveDay = liveDayIndex !== -1 ? dayGroups[liveDayIndex] : dayGroups[0];
	const liveCurrentSlotIndex = liveDay
		? getCurrentSlotIndex(currentTime, sessionEnds, liveDay.slots || [])
		: 0;

	const liveDayData = liveDay;
	const currentSlot = liveDayData?.slots[liveCurrentSlotIndex];
	const previousSlot =
		liveCurrentSlotIndex > 0 ? liveDayData?.slots[liveCurrentSlotIndex - 1] : null;
	const nextSlot =
		liveCurrentSlotIndex < (liveDayData?.slots.length ?? 0) - 1
			? liveDayData?.slots[liveCurrentSlotIndex + 1]
			: null;
	const slotProgress = currentSlot
		? calculateSlotProgress(currentSlot)
		: { progress: 0, startTime: "--:--", endTime: "--:--" };

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-4xl mx-auto p-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
					<div>
						<h1 className="text-xl font-bold text-gray-900">PM Admin Panel</h1>
						<div className="text-sm flex items-center gap-2 mt-2" style={{ color: "#7F56D9" }}>
							<Clock className="w-4 h-4" />
							<span className="font-semibold">{formatTime(currentTime)}</span>
						</div>
						<div
							className="text-xs font-bold tracking-wider mt-2 px-3 py-1 rounded-full inline-block text-white "
							style={{ backgroundColor: "#F28B14" }}
						>
							SESSION CONTROL
						</div>
						{liveDayData && (
							<div
								className="text-xs ml-3 font-bold tracking-wider mt-2 px-3 py-1 rounded-full inline-block text-white"
								style={{ backgroundColor: "#7F56D9" }}
							>
								{liveDayData.dayName.toUpperCase()}
							</div>
						)}
					</div>
					<div
						className="w-14 h-14 flex items-center justify-center rounded-xl border-2"
						style={{ backgroundColor: "#7F56D9", borderColor: "#7F56D9" }}
					>
						<QrCode className="w-7 h-7 text-white" />
					</div>
				</div>

				{/* Day Navigation Buttons */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-lg font-semibold text-gray-900">
							Day {currentDay} - {currentDayData?.displayDate}
						</h2>
					</div>
					<div className="flex gap-2 overflow-x-auto pb-2 justify-center">
						{eventDays.map((dayInfo) => (
							<Button
								key={dayInfo.day}
								onClick={() => setCurrentDay(dayInfo.day)}
								variant="outline"
								className={`flex-shrink-0 px-6 py-3 font-semibold transition-all duration-200 border-2 ${
									currentDay === dayInfo.day
										? "text-white shadow-lg"
										: "text-gray-600 bg-white hover:bg-gray-50"
								}`}
								style={{
									backgroundColor: currentDay === dayInfo.day ? "#7F56D9" : "white",
									borderColor: "#7F56D9",
								}}
							>
								<div className="text-center">
									<div className="font-bold">Day {dayInfo.day}</div>
									<div className="text-xs opacity-90">{dayInfo.displayDate}</div>
								</div>
							</Button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left Column - Current Status */}
					<div>
						{/* Current Slot - Main Focus */}
						{currentSlot && (
							<div
								className="border-2 rounded-xl p-6 mb-6 shadow-lg"
								style={{ borderColor: "#7F56D9" }}
							>
								<div className="text-center">
									{/* <div
                    className="text-xs font-bold tracking-wider mb-2 px-4 py-2 rounded-full inline-block text-white"
                    style={{ backgroundColor: "#7F56D9" }}
                  >
                    {currentDay.dayName.toUpperCase()}
                  </div> */}
									<div
										className="text-xs left font-bold tracking-wider mb-4 px-4 py-2 rounded-full inline-block text-white"
										style={{ backgroundColor: "#7F56D9" }}
									>
										HAPPENING NOW
									</div>
									<div className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
										{currentSlot.activity}
										<Flame className="w-6 h-6 text-orange-500" />
									</div>
									<div className="text-base text-gray-600 mb-5 leading-7 tracking-normal">
										{currentSlot.personincharge}
									</div>
									<div className="text-sm text-gray-500 mb-4">
										{toDisplayTime(parseTime(currentSlot.start))} -{" "}
										{toDisplayTime(parseTime(currentSlot.end))}
									</div>

									{/* AP Notation */}
									{(() => {
										const latestAP = getLatestAPNotation();
										return (
											latestAP && (
												<div
													className={`text-sm font-bold mb-4 px-4 py-2 rounded-full inline-block text-white`}
													style={{
														backgroundColor: latestAP.isLate ? "#F28B14" : "#10B981",
													}}
												>
													{latestAP.notation}
												</div>
											)
										);
									})()}

									{/* Progress Bar */}
									<div className="mb-4">
										<div className="flex justify-between text-sm font-semibold text-gray-700 mb-3">
											<span>{slotProgress.startTime}</span>
											<span>{slotProgress.endTime}</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div
												className="h-3 rounded-full transition-all duration-1000 ease-out"
												style={{
													width: `${slotProgress.progress}%`,
													backgroundColor: "#7F56D9",
												}}
											></div>
										</div>
										<div className="text-xs text-gray-500 mt-2 text-center font-medium">
											{Math.round(slotProgress.progress)}% complete
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Previous and Next Slots */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							{/* Previous Slot */}
							<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
								<div className="text-xs font-bold tracking-wider mb-2" style={{ color: "#7F56D9" }}>
									PREVIOUS SLOT
								</div>
								{previousSlot ? (
									<>
										<div className="text-lg font-bold text-gray-900 mb-1">
											{previousSlot.activity}
										</div>
										<div className="text-sm text-gray-600 mb-2">{previousSlot.personincharge}</div>
										<div className="text-xs text-gray-500">
											{toDisplayTime(parseTime(previousSlot.start))} -{" "}
											{toDisplayTime(parseTime(previousSlot.end))}
										</div>
									</>
								) : (
									<div className="text-sm text-gray-500">No previous slot</div>
								)}
							</div>

							{/* Next Slot */}
							<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
								<div className="text-xs font-bold tracking-wider mb-2" style={{ color: "#7F56D9" }}>
									NEXT UP
								</div>
								{nextSlot ? (
									<>
										<div className="text-lg font-bold text-gray-900 mb-1">{nextSlot.activity}</div>
										<div className="text-sm text-gray-600 mb-2">{nextSlot.personincharge}</div>
										<div className="text-xs text-gray-500">
											{toDisplayTime(parseTime(nextSlot.start))} -{" "}
											{toDisplayTime(parseTime(nextSlot.end))}
										</div>
									</>
								) : (
									<div className="text-sm text-gray-500">No next slot</div>
								)}
							</div>
						</div>
					</div>

					{/* Right Column - Admin Controls */}
					<div>
						{/* Admin Controls */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
							<div
								className="px-5 py-4 border-b border-gray-200 flex items-center justify-between"
								style={{ backgroundColor: "#7F56D9" }}
							>
								<h3 className="font-bold text-white text-lg">Session Controls</h3>
								{currentDayData && (
									<div className="text-white text-sm font-medium">
										Day {currentDay} - {currentDayData.displayDate}
									</div>
								)}
							</div>
							<div className="divide-y divide-gray-100">
								{filteredData && filteredData.length > 0 ? (
									filteredData.map((slot, slotIdx) => {
										const sessionEndInfo = getSessionEndInfo(slot.id);
										// Check if this slot is current in the selected day context
										const isCurrentSlot = slotIdx === currentSlotIndex;
										// Check if this is the actual live current slot (for today only)
										const isLiveCurrentSlot =
											currentDayData?.date === currentDate && slotIdx === liveCurrentSlotIndex;

										return (
											<div
												key={slot.id}
												className={`p-4 ${
													isCurrentSlot ? "border-l-4 bg-purple-50" : ""
												} ${isLiveCurrentSlot ? "bg-purple-100" : ""}`}
												style={{
													borderLeftColor: isCurrentSlot ? "#7F56D9" : "transparent",
												}}
											>
												<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
													<div className="flex-1">
														<div className="font-semibold text-gray-900 mb-1 flex items-center gap-2 text-base">
															{slot.activity}
															{isLiveCurrentSlot && <Flame className="w-4 h-4 text-orange-500" />}
															{isCurrentSlot && !isLiveCurrentSlot && (
																<div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
																	Next Up
																</div>
															)}
														</div>
														<div className="text-xs text-gray-600 mb-1">{slot.personincharge}</div>
														<div className="text-gray-500 text-base">
															{toDisplayTime(parseTime(slot.start))} -{" "}
															{toDisplayTime(parseTime(slot.end))}
														</div>
														{sessionEndInfo && (
															<div
																className="text-xs font-semibold mt-2 px-2 py-1 rounded inline-block text-white"
																style={{
																	backgroundColor:
																		sessionEndInfo.difference > 0 ? "#F28B14" : "#10B981",
																}}
															>
																{formatAPNotation(sessionEndInfo.difference)} (Ended at{" "}
																{formatTime(sessionEndInfo.actualEndTime)})
															</div>
														)}
													</div>
													<div className="flex gap-2 flex-wrap">
														{sessionEndInfo ? (
															<>
																<AlertDialog>
																	<AlertDialogTrigger asChild>
																		<Button size="sm" variant="secondary" className="text-xs">
																			Update End
																		</Button>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle>Update Session End</AlertDialogTitle>
																			<AlertDialogDescription>
																				Are you sure you want to update the end time for [
																				{slot.activity}]?
																				<br />
																				<br />
																				Scheduled end time: {toDisplayTime(parseTime(slot.end))}
																				<br />
																				Current time: {formatTime(currentTime)}
																			</AlertDialogDescription>
																		</AlertDialogHeader>
																		<AlertDialogFooter>
																			<AlertDialogCancel>Cancel</AlertDialogCancel>
																			<AlertDialogAction
																				onClick={() => handleEndSessionWithConfirmation(slot)}
																			>
																				Update
																			</AlertDialogAction>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>

																<AlertDialog>
																	<AlertDialogTrigger asChild>
																		<Button size="sm" variant="outline" className="text-xs">
																			<Undo2 className="w-3 h-3 mr-1" />
																			Undo
																		</Button>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle>Undo Session End</AlertDialogTitle>
																			<AlertDialogDescription>
																				Are you sure you want to undo the end of [{slot.activity}]
																				session?
																				<br />
																				<br />
																				This will reset the slot data and recalculate the current
																				slot based on time or previous ended sessions.
																			</AlertDialogDescription>
																		</AlertDialogHeader>
																		<AlertDialogFooter>
																			<AlertDialogCancel>Cancel</AlertDialogCancel>
																			<AlertDialogAction
																				onClick={() => handleUndoSessionWithConfirmation(slot)}
																			>
																				Undo
																			</AlertDialogAction>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>
															</>
														) : (
															<AlertDialog>
																<AlertDialogTrigger asChild>
																	<Button
																		size="sm"
																		className="text-xs"
																		style={{ backgroundColor: "#7F56D9" }}
																	>
																		End Session
																	</Button>
																</AlertDialogTrigger>
																<AlertDialogContent>
																	<AlertDialogHeader>
																		<AlertDialogTitle>End Session Confirmation</AlertDialogTitle>
																		<AlertDialogDescription>
																			Are you sure that [{slot.activity}] session has ended?
																			<br />
																			<br />
																			Scheduled end time: {toDisplayTime(parseTime(slot.end))}
																			<br />
																			Current time: {formatTime(currentTime)}
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel>Cancel</AlertDialogCancel>
																		<AlertDialogAction
																			onClick={() => handleEndSessionWithConfirmation(slot)}
																		>
																			Confirm
																		</AlertDialogAction>
																	</AlertDialogFooter>
																</AlertDialogContent>
															</AlertDialog>
														)}
													</div>
												</div>
											</div>
										);
									})
								) : (
									<div className="p-4 text-center text-gray-500">
										No slots available for Day {currentDay}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Back to User View */}
				<div className="mt-8 text-center">
					<Button
						onClick={() => {
							window.location.href = "/timer";
						}}
						className="px-8 py-2 mr-4"
						variant="outline"
						style={{ borderColor: "#7F56D9", color: "#7F56D9" }}
					>
						Back to Timer View
					</Button>
					<Button
						onClick={() => {
							window.location.href = "/event";
						}}
						className="px-8 py-2"
						variant="outline"
						style={{ borderColor: "#7F56D9", color: "#7F56D9" }}
					>
						Back to Event Management
					</Button>
				</div>
			</div>
		</div>
	);
}
