"use client";

import { useEffect, useMemo, useState } from "react";
import type { EventData } from "@/app/event/page";
import { Button } from "@/components/atoms/button";
import { useGetAgenda } from "@/hooks/use-get-agenda";

// Deterministic hue from string
function stringToHue(s: string): number {
	let hash = 0;
	for (let i = 0; i < s.length; i++) {
		hash = s.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash) % 360;
}

function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "Asia/Bangkok",
	});
}

export default function GanttSection({ eventData }: { eventData: EventData }) {
	const [currentDay, setCurrentDay] = useState(1);
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const eventDays = useMemo(() => {
		const start = new Date(eventData.startDate);
		const end = new Date(eventData.endDate);
		const dayCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
		return Array.from({ length: dayCount }, (_, i) => {
			const date = new Date(start);
			date.setDate(start.getDate() + i);
			return {
				day: i + 1,
				date: date.toISOString().split("T")[0] ?? "",
				displayDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
			};
		});
	}, [eventData.startDate, eventData.endDate]);

	const currentDayData = eventDays[currentDay - 1];

	const { data: agendaSlots, isLoading, error } = useGetAgenda();

	const daySlots = useMemo(() => {
		if (!agendaSlots || !Array.isArray(agendaSlots)) return [];
		return agendaSlots
			.filter((s) => {
				const date = new Date(s.start).toLocaleDateString("en-CA", {
					timeZone: "Asia/Bangkok",
				});
				return date === currentDayData?.date;
			})
			.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
	}, [agendaSlots, currentDayData]);

	// Axis spans: round to full hours
	const { axisStart, axisEnd, totalMinutes, hourMarks } = useMemo(() => {
		if (daySlots.length === 0) {
			const base = new Date();
			base.setHours(8, 0, 0, 0);
			const baseEnd = new Date(base);
			baseEnd.setHours(18, 0, 0, 0);
			return { axisStart: base, axisEnd: baseEnd, totalMinutes: 600, hourMarks: [] };
		}

		const earliest = new Date(daySlots[0]!.start);
		earliest.setMinutes(0, 0, 0);

		const latest = new Date(daySlots[daySlots.length - 1]!.end);
		if (latest.getMinutes() > 0 || latest.getSeconds() > 0) {
			latest.setHours(latest.getHours() + 1, 0, 0, 0);
		}

		const span = (latest.getTime() - earliest.getTime()) / 60000;
		const marks: Date[] = [];
		const cursor = new Date(earliest);
		while (cursor < latest) {
			marks.push(new Date(cursor));
			cursor.setHours(cursor.getHours() + 1);
		}

		return { axisStart: earliest, axisEnd: latest, totalMinutes: span, hourMarks: marks };
	}, [daySlots]);

	const toPercent = (iso: string) => {
		const ms = new Date(iso).getTime() - axisStart.getTime();
		return Math.max(0, Math.min(100, (ms / 60000 / totalMinutes) * 100));
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen text-purple-500">
				Loading Gantt…
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
				Error loading data: {error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4 lg:p-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold">Gantt Chart</h1>
					<p className="text-gray-600 text-sm mt-1">
						Day {currentDay} — {currentDayData?.displayDate}
					</p>
				</div>

				{/* Day tabs */}
				<div className="flex gap-2 flex-wrap">
					{eventDays.map((d) => (
						<Button
							key={d.day}
							variant={currentDay === d.day ? "default" : "outline"}
							size="sm"
							onClick={() => setCurrentDay(d.day)}
							className={`flex-shrink-0 ${currentDay === d.day ? "bg-purple-600" : ""}`}
						>
							<div className="text-center">
								<div className="text-xs">Day {d.day}</div>
								<div className="text-xs opacity-75">{d.displayDate}</div>
							</div>
						</Button>
					))}
				</div>
			</div>

			{daySlots.length === 0 ? (
				<div className="bg-white rounded-lg shadow-sm border p-12 text-center text-gray-500">
					<div className="text-6xl mb-4">📊</div>
					<p className="font-medium text-lg mb-2">No agenda for this day</p>
					<p className="text-sm">Add agenda slots in the Agenda section first.</p>
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
					<div className="min-w-[600px] p-4">
						{/* Hour labels */}
						<div className="relative h-6 mb-1 ml-36">
							{hourMarks.map((h) => {
								const left = toPercent(h.toISOString());
								return (
									<span
										key={h.toISOString()}
										className="absolute text-xs text-gray-400 font-mono -translate-x-1/2"
										style={{ left: `${left}%` }}
									>
										{hasMounted ? formatTime(h.toISOString()) : ""}
									</span>
								);
							})}
						</div>

						{/* Grid + bars */}
						<div className="relative">
							{/* Vertical grid lines */}
							{hourMarks.map((h) => {
								const left = toPercent(h.toISOString());
								return (
									<div
										key={h.toISOString()}
										className="absolute top-0 bottom-0 border-l border-gray-100"
										style={{ left: `calc(144px + ${left}% * (100% - 144px) / 100)` }}
									/>
								);
							})}

							{/* Rows */}
							{daySlots.map((slot) => {
								const hue = stringToHue(slot.personincharge ?? "");
								const left = toPercent(slot.start);
								const right = toPercent(slot.end);
								const width = right - left;
								const ap = slot.actualEndTime
									? Math.round(
											(new Date(slot.actualEndTime).getTime() - new Date(slot.end).getTime()) /
												60000
										)
									: null;

								return (
									<div key={slot.id} className="flex items-center mb-2 gap-2">
										{/* Label */}
										<div className="w-36 flex-shrink-0 pr-2">
											<p className="text-xs font-medium text-gray-700 truncate">{slot.activity}</p>
											<p className="text-xs text-gray-400 truncate">{slot.personincharge}</p>
										</div>

										{/* Bar track */}
										<div className="relative flex-1 h-8 bg-gray-100 rounded overflow-hidden">
											<div
												className="absolute top-0 h-full rounded flex items-center px-2 overflow-hidden"
												style={{
													left: `${left}%`,
													width: `${Math.max(width, 0.5)}%`,
													backgroundColor: `hsl(${hue}, 55%, 60%)`,
												}}
											>
												<span className="text-white text-xs font-medium truncate">
													{hasMounted ? `${formatTime(slot.start)}–${formatTime(slot.end)}` : ""}
												</span>
											</div>

											{/* Actual end time marker */}
											{hasMounted && slot.actualEndTime && (
												<div
													className="absolute top-0 h-full w-0.5 bg-red-500 z-10"
													style={{ left: `${toPercent(slot.actualEndTime)}%` }}
													title={`Actual end: ${formatTime(slot.actualEndTime)}${ap !== null ? ` (AP${ap >= 0 ? "+" : ""}${ap})` : ""}`}
												/>
											)}
										</div>

										{/* AP badge */}
										{ap !== null && (
											<span
												className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${ap > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
											>
												{ap >= 0 ? `AP+${ap}` : `AP${ap}`}
											</span>
										)}
									</div>
								);
							})}
						</div>

						{/* Legend */}
						<div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
							{Array.from(new Set(daySlots.map((s) => s.personincharge))).map((name) => {
								const hue = stringToHue(name ?? "");
								return (
									<div key={name} className="flex items-center gap-1 text-xs text-gray-600">
										<div
											className="w-3 h-3 rounded-sm flex-shrink-0"
											style={{ backgroundColor: `hsl(${hue}, 55%, 60%)` }}
										/>
										{name}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
