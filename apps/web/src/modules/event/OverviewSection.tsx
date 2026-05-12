import { useEffect, useMemo, useState } from "react";
import type { EventData } from "@/app/event/page";
import { useGetAgenda } from "@/hooks/use-get-agenda";

function formatDateTH(dateStr: string) {
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return dateStr;
	return date.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}

function formatTimeTH(date: Date) {
	return date.toLocaleTimeString("th-TH", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

function OverviewSection({ eventData }: { eventData: EventData }) {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [hasMounted, setHasMounted] = useState(false);

	const { data: agendaSlots } = useGetAgenda();

	useEffect(() => {
		setHasMounted(true);
		const interval = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	// Derive current and next activity from agenda
	const { currentActivity, nextActivity, progressPercent } = useMemo(() => {
		if (!agendaSlots || agendaSlots.length === 0) {
			return { currentActivity: null, nextActivity: null, progressPercent: 0 };
		}

		const now = currentTime.getTime();
		const sorted = [...agendaSlots].sort(
			(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
		);

		let current = null;
		let next = null;
		let progress = 0;

		for (let i = 0; i < sorted.length; i++) {
			const slot = sorted[i];
			if (!slot) continue;
			const start = new Date(slot.start).getTime();
			const end = new Date(slot.end).getTime();

			if (now >= start && now <= end) {
				current = slot;
				progress = Math.min(100, Math.round(((now - start) / (end - start)) * 100));
				next = sorted[i + 1] ?? null;
				break;
			}

			if (now < start) {
				next = slot;
				break;
			}
		}

		return { currentActivity: current, nextActivity: next, progressPercent: progress };
	}, [agendaSlots, currentTime]);

	// Event duration progress (whole event)
	const eventProgress = useMemo(() => {
		if (!hasMounted) return 0;
		const start = new Date(eventData.startDate).getTime();
		const end = new Date(eventData.endDate).getTime();
		const now = currentTime.getTime();
		if (now <= start) return 0;
		if (now >= end) return 100;
		return Math.round(((now - start) / (end - start)) * 100);
	}, [eventData.startDate, eventData.endDate, currentTime, hasMounted]);

	const formatSlotTime = (isoStr: string) =>
		new Date(isoStr).toLocaleTimeString("th-TH", {
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Asia/Bangkok",
		});

	return (
		<div className="p-4 lg:p-8 space-y-4 overflow-y-auto h-full">
			{/* Tabs */}
			<div className="flex border-b border-gray-200 overflow-x-auto">
				<button
					type="button"
					className="px-4 py-2 text-sm font-medium text-purple-600 border-b-2 border-purple-600 whitespace-nowrap"
				>
					ภาพรวม
				</button>
				<button
					type="button"
					className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
				>
					กิจกรรมย่อย
				</button>
			</div>

			{/* Hero banner */}
			<div
				className="rounded-xl lg:rounded-2xl p-4 lg:p-6 xl:p-8 text-white relative overflow-hidden"
				style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)" }}
			>
				<div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
					<div className="flex-1">
						<h2 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2">{eventData.name}</h2>
						<p className="text-purple-100 mb-1 text-sm lg:text-base">
							{formatDateTH(eventData.startDate)} &mdash; {formatDateTH(eventData.endDate)}
						</p>
						<p className="text-purple-100 mb-1 text-sm lg:text-base">{eventData.location}</p>
						{eventData.description && (
							<p className="text-purple-200 text-sm mt-2 mb-4 max-w-lg">{eventData.description}</p>
						)}

						{/* Event progress bar */}
						<div className="mb-4">
							<div className="flex justify-between text-xs text-purple-200 mb-1">
								<span>ความคืบหน้าของงาน</span>
								<span>{eventProgress}%</span>
							</div>
							<div className="w-full bg-white/20 rounded-full h-1.5">
								<div
									className="bg-white h-1.5 rounded-full transition-all duration-1000"
									style={{ width: `${eventProgress}%` }}
								/>
							</div>
						</div>

						<button
							type="button"
							className="w-full sm:w-auto hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm bg-orange-500 rounded-xl lg:rounded-2xl px-4 py-2 lg:py-3 text-sm lg:text-base font-medium transition-colors duration-200"
							onClick={() => {
								window.location.href = "/timer";
							}}
						>
							🕓 AP Timer
						</button>
					</div>

					{/* Time card */}
					<div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 text-gray-900 w-full lg:w-80">
						<div className="text-center mb-4">
							<div className="text-xs text-gray-500 mb-2">เวลาปัจจุบัน</div>
							<div className="text-2xl lg:text-3xl xl:text-4xl font-bold font-mono">
								{hasMounted ? formatTimeTH(currentTime) : "--:--:--"}
							</div>
						</div>

						{/* Current slot progress */}
						{currentActivity ? (
							<div className="mb-4">
								<div className="flex justify-between text-xs text-gray-500 mb-1">
									<span>{formatSlotTime(currentActivity.start)}</span>
									<span>{formatSlotTime(currentActivity.end)}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
										style={{ width: `${progressPercent}%` }}
									/>
								</div>
								<div className="text-center text-xs text-gray-500 mt-1">
									{progressPercent}% เสร็จแล้ว
								</div>
							</div>
						) : (
							<div className="mb-4">
								<div className="flex justify-between text-xs text-gray-500 mb-1">
									<span>--:--</span>
									<span>--:--</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-orange-500 h-2 rounded-full" style={{ width: "0%" }} />
								</div>
							</div>
						)}

						{/* Current / Next */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm">
							<div>
								<div className="text-gray-500 mb-1">กิจกรรมปัจจุบัน</div>
								<div className="font-medium text-purple-700 truncate">
									{currentActivity ? currentActivity.activity : "ไม่มีกิจกรรม"}
								</div>
							</div>
							<div>
								<div className="text-gray-500 mb-1">กิจกรรมต่อไป</div>
								<div className="font-medium truncate">
									{nextActivity ? nextActivity.activity : "ไม่มีกิจกรรม"}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Agenda quick-view */}
			{agendaSlots && agendaSlots.length > 0 && (
				<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm text-gray-700">
						กิจกรรมวันนี้
					</div>
					<div className="divide-y divide-gray-50">
						{agendaSlots
							.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
							.slice(0, 6)
							.map((slot) => {
								const isActive = currentActivity?.id === slot.id;
								return (
									<div
										key={slot.id}
										className={`flex items-center gap-3 px-4 py-3 text-sm ${isActive ? "bg-purple-50" : ""}`}
									>
										<div
											className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? "bg-purple-600 animate-pulse" : "bg-gray-300"}`}
										/>
										<span className="text-gray-500 font-mono text-xs w-12 flex-shrink-0">
											{formatSlotTime(slot.start)}
										</span>
										<span
											className={`flex-1 truncate ${isActive ? "text-purple-800 font-medium" : "text-gray-700"}`}
										>
											{slot.activity}
										</span>
										<span className="text-gray-400 text-xs flex-shrink-0">
											{slot.personincharge}
										</span>
									</div>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
}

export default OverviewSection;
