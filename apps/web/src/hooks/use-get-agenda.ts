import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export function useGetAgenda() {
	const {
		data: agenda,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["index"],
		queryFn: () =>
			client.api.agenda.timer.get({
				query: {},
			}),
	});

	return {
		isLoading,
		data: agenda?.data?.data,
		error,
		refetch,
	};
}
