"use client";

import { useSearchParams } from "next/navigation";
import { useGetAgenda } from "@/hooks/use-get-agenda";

interface PageProps {
	params: {
		id: string;
	};
}

export default function EventPage({ params }: PageProps) {
	const searchParams = useSearchParams();
	const day = Number(searchParams.get("day")) || 1;

	const { data, isLoading, error } = useGetAgenda();

	if (isLoading) return <div>Loading agenda...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<h1>
				Agenda for Event {params.id} on Day {day}
			</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
