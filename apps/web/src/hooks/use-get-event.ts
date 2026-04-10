import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export function useGetEvent(eventId: string | undefined) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["event", eventId],
		// Eden Treaty dynamic route: GET /api/event/:id
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryFn: () => (client.api.event as any)[eventId!].get() as Promise<{ data: unknown }>,
		enabled: !!eventId,
	});

	return {
		// biome-ignore lint/suspicious/noExplicitAny: treaty dynamic route typing
		event: (data as any)?.data as Record<string, unknown> | null | undefined,
		isLoading,
		error,
	};
}
