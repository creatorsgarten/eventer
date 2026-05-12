"use client";

import { useMemo } from "react";
import type { EventData } from "@/app/event/page";
import { useGetAgenda } from "@/hooks/use-get-agenda";

interface StaffMember {
	name: string;
	activities: { activity: string; start: string; end: string }[];
}

// Deterministic hue from a string
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

export default function StaffSection({ eventData }: { eventData: EventData }) {
	const { data: agendaSlots, isLoading, error } = useGetAgenda();

	const staffRoster = useMemo((): StaffMember[] => {
		if (!agendaSlots || !Array.isArray(agendaSlots)) return [];

		const filtered = agendaSlots.filter((s) => s.eventId === eventData.id);
		const map = new Map<string, StaffMember>();

		for (const slot of filtered) {
			const name = slot.personincharge?.trim();
			if (!name) continue;
			if (!map.has(name)) {
				map.set(name, { name, activities: [] });
			}
			map.get(name)!.activities.push({
				activity: slot.activity,
				start: slot.start,
				end: slot.end,
			});
		}

		return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
	}, [agendaSlots, eventData.id]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen text-purple-500">
				Loading staff…
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
				Error loading staff: {error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4 lg:p-8">
			<div className="mb-6">
				<h1 className="text-2xl lg:text-3xl font-bold">Staff</h1>
				<p className="text-gray-600 text-sm mt-1">
					{staffRoster.length} person{staffRoster.length !== 1 ? "s" : ""} derived from agenda —{" "}
					{eventData.name}
				</p>
			</div>

			{staffRoster.length === 0 ? (
				<div className="bg-white rounded-lg shadow-sm border p-12 text-center text-gray-500">
					<div className="text-6xl mb-4">👥</div>
					<p className="font-medium text-lg mb-2">No staff found</p>
					<p className="text-sm">Add agenda slots with a Person in Charge to populate this list.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{staffRoster.map((member) => {
						const hue = stringToHue(member.name);
						return (
							<div
								key={member.name}
								className="bg-white rounded-lg shadow-sm border overflow-hidden"
							>
								{/* Color strip */}
								<div className="h-2" style={{ backgroundColor: `hsl(${hue}, 60%, 55%)` }} />
								<div className="p-4">
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3">
											<div
												className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
												style={{ backgroundColor: `hsl(${hue}, 55%, 50%)` }}
											>
												{member.name.charAt(0).toUpperCase()}
											</div>
											<div>
												<p className="font-semibold text-sm">{member.name}</p>
												<p className="text-xs text-gray-500">
													{member.activities.length} activit
													{member.activities.length !== 1 ? "ies" : "y"}
												</p>
											</div>
										</div>
									</div>

									<ul className="space-y-2">
										{member.activities
											.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
											.map((act, i) => (
												<li key={i} className="flex items-start gap-2 text-xs">
													<span className="font-mono text-gray-400 flex-shrink-0 pt-0.5">
														{formatTime(act.start)}–{formatTime(act.end)}
													</span>
													<span className="text-gray-700">{act.activity}</span>
												</li>
											))}
									</ul>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
