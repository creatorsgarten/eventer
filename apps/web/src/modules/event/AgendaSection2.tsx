"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAgenda } from "@/hooks/use-get-agenda";

const agendaHeaders = ["Slot", "Start", "End", "Activity", "Person in Charge", "Remarks"];

export default function AgendaSection() {
	const [currentDay] = useState(1);

	const { data: agendaSlots, isLoading, error } = useGetAgenda();
	const sortedSlots = useMemo(() => {
		if (!agendaSlots) return [];
		return [...agendaSlots].sort(
			(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
		);
	}, [agendaSlots]);

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
		<div className="min-h-screen bg-gray-50 p-8">
			<h1 className="text-3xl font-bold mb-6">Static Event Agenda (Day {currentDay})</h1>

			{/* TODO: Add Day Buttons if multiple days */}

			<div className="overflow-x-auto bg-white shadow rounded-lg">
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
								<tr key={slot.id} className="border-t hover:bg-gray-50 cursor-move">
									<td className="px-6 py-4 flex items-center gap-2">
										<GripVertical className="w-4 h-4 text-gray-400" />
										{idx + 1}
									</td>
									<td className="px-6 py-4">{slot.start}</td>
									<td className="px-6 py-4">{slot.end}</td>
									<td className="px-6 py-4">{slot.activity}</td>
									<td className="px-6 py-4">{slot.personincharge}</td>
									<td className="px-6 py-4">{slot.remarks || "-"}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={agendaHeaders.length} className="text-center text-gray-500 py-10">
									No agenda slots found for this event and day.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
