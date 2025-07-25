"use client";

import { Clock, Flame, QrCode, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/atoms/button";
import { useSessionManager } from "@/hooks/use-session-manager";
import { useTimer } from "@/hooks/use-timer";
import { calculateProgress, formatTime, parseTime, toDisplayTime } from "@/lib/time";

export default function TimerPage() {
	const { data, isLoading, error } = useTimer();
	const [currentTime, setCurrentTime] = useState(new Date());
	const [currentDay, setCurrentDay] = useState(1);

	// Use session manager for AP notation
	const { getLatestAPNotation } = useSessionManager();

	// Calculate event days (same logic as AgendaSection)
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

	// Filter data by selected day
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
		const interval = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<Timer className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
					<div className="text-lg font-medium">Loading...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-lg font-medium">Error</div>
				</div>
			</div>
		);
	}

	// Convert current time to seconds for comparison with parsed database times
	const nowSec = (() => {
		// Get current time in Thailand timezone to match stored data
		const thailandTime = new Date(
			currentTime.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
		);
		return (
			thailandTime.getHours() * 3600 + thailandTime.getMinutes() * 60 + thailandTime.getSeconds()
		);
	})();

	const currentIndex =
		filteredData?.findIndex((t) => {
			const start = parseTime(t.start);
			const end = parseTime(t.end);
			return nowSec >= start && nowSec < end;
		}) ?? -1;

	const current = filteredData?.[currentIndex];
	const next = filteredData?.[currentIndex + 1];

	const progress = current
		? {
				percent: calculateProgress(parseTime(current.start), parseTime(current.end), nowSec),
				start: toDisplayTime(parseTime(current.start)),
				end: toDisplayTime(parseTime(current.end)),
			}
		: {
				percent: 0,
				start: "--:--",
				end: "--:--",
			};

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-md mx-auto p-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
					<div>
						<h1 className="text-xl font-bold text-gray-900">Timer Page</h1>
						<div className="text-sm flex items-center gap-2 mt-2 text-purple-600">
							<Clock className="w-4 h-4" />
							<span className="font-semibold">{formatTime(currentTime)}</span>
						</div>
					</div>
					<div className="w-14 h-14 flex items-center justify-center rounded-xl border-2 bg-purple-600 border-purple-600">
						<QrCode className="w-7 h-7 text-white" />
					</div>
				</div>

				{/* Day Selection */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-lg font-semibold text-gray-900">
							Day {currentDay} - {currentDayData?.displayDate}
						</h2>
					</div>
					<div className="flex gap-2 overflow-x-auto pb-2">
						{eventDays.map((dayInfo) => (
							<Button
								key={dayInfo.day}
								variant={currentDay === dayInfo.day ? "default" : "outline"}
								size="sm"
								onClick={() => setCurrentDay(dayInfo.day)}
								className={`flex-shrink-0 ${
									currentDay === dayInfo.day ? "bg-purple-600 text-white" : ""
								}`}
							>
								<div className="text-center">
									<div className="text-xs">Day {dayInfo.day}</div>
									<div className="text-xs opacity-75">{dayInfo.displayDate}</div>
								</div>
							</Button>
						))}
					</div>
				</div>

				{/* Current Slot */}
				{current && (
					<div className="border-2 rounded-xl p-6 mb-6 shadow-lg border-purple-600 text-center">
						<div className="text-xs font-bold tracking-wider mb-4 px-4 py-2 rounded-full inline-block bg-purple-600 text-white">
							HAPPENING NOW
						</div>
						<div className="text-2xl font-bold text-gray-900 mb-2">{current.activity}</div>
						<div className="text-base text-gray-600 mb-5 leading-7 tracking-normal">
							{current.remarks || "-"}
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

						<div className="mb-4">
							<div className="flex justify-between text-sm font-semibold text-gray-700 mb-3">
								<span>{progress.start}</span>
								<span>{progress.end}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-3">
								<div
									className="h-3 rounded-full transition-all duration-1000 ease-out"
									style={{
										width: `${progress.percent}%`,
										backgroundColor: "#7F56D9",
									}}
								></div>
							</div>
							<div className="text-xs text-gray-500 mt-2 text-center font-medium">
								{Math.round(progress.percent)}% complete
							</div>
						</div>
					</div>
				)}

				{/* Next Up */}
				{next && (
					<div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
						<div className="text-xs font-bold tracking-wider mb-3 text-purple-600">NEXT UP</div>
						<div className="text-lg font-bold text-gray-900 mb-1">{next.activity}</div>
						<div className="text-sm text-gray-600 mb-3">{next.remarks || next.activity}</div>
						<div className="text-sm font-semibold px-3 py-2 rounded-lg inline-block text-white bg-purple-600">
							{toDisplayTime(parseTime(next.start))} - {toDisplayTime(parseTime(next.end))}
						</div>
					</div>
				)}

				{/* No events message */}
				{(!filteredData || filteredData.length === 0) && (
					<div className="bg-gray-50 rounded-xl p-8 mb-6 border border-gray-100 text-center">
						<div className="text-4xl mb-3">📅</div>
						<div className="text-lg font-semibold text-gray-900 mb-2">No events scheduled</div>
						<div className="text-sm text-gray-600">
							No agenda items found for {currentDayData?.displayDate}
						</div>
					</div>
				)}

				{/* Agenda List */}
				{filteredData && filteredData.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						<div className="px-5 py-4 border-b border-gray-200 bg-purple-600">
							<h3 className="font-bold text-white text-lg">Agenda - Day {currentDay}</h3>
						</div>
						<div className="divide-y divide-gray-100">
							{filteredData.map((t, i) => (
								<div
									key={t.id}
									className={`p-5 ${i === currentIndex ? "border-l-4 bg-purple-100" : ""}`}
									style={{
										borderLeftColor: i === currentIndex ? "#7F56D9" : "transparent",
									}}
								>
									<div className="flex justify-between items-center">
										<div className="flex-1">
											<div className="font-semibold text-gray-900 text-base mb-1 flex items-center gap-2">
												{t.activity}
												{i === currentIndex && <Flame className="w-4 h-4 text-orange-500" />}
											</div>
											<div className="text-sm text-gray-600">{t.remarks || "-"}</div>
										</div>
										<div className="ml-4">
											<div
												className="text-sm font-semibold px-3 py-2 rounded-lg"
												style={{
													backgroundColor: i === currentIndex ? "#7F56D9" : "transparent",
													color: i === currentIndex ? "white" : "#7F56D9",
												}}
											>
												{toDisplayTime(parseTime(t.start))} - {toDisplayTime(parseTime(t.end))}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="mt-8 text-center">
					<Link href="/event" className="text-sm font-medium underline text-purple-600 mr-4">
						Back to Event
					</Link>
				</div>
			</div>
		</div>
	);
}
//     <div className="flex flex-col items-center justify-center min-h-screen font-main">
//       <h1 className="text-2xl font-bold mb-4">Timer</h1>
//       <div className="text-lg">
//         {data?.map((timer) => (
//           <div key={timer.id} className="mb-2">
//             <p>
//               {timer.activity}: {timer.duration} seconds
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
