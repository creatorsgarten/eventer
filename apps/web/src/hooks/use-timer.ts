import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export function useTimer() {
	const { data: timer, isLoading } = useQuery({
		queryKey: ["index"],
		queryFn: () =>
			client.api.agenda.timer.get({
				query: {},
			}),
	});

	return {
		isLoading,
		data: timer?.data?.data,
		error: timer?.error,
	};
}
