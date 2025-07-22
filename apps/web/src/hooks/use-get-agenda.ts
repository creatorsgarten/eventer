import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export function useGetAgenda(eventId: string, day: number) {
	const { data: agenda, isLoading } = useQuery({
		queryKey: ["index"],
		queryFn: () =>
			client.api.agenda.timer.get({
				query: {},
			}),
	});

	return {
		isLoading,
		data: agenda?.data?.data,
		error: agenda?.error,
	};
}