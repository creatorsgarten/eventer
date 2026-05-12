import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export type EventItem = {
	id: string;
	name: string;
	description?: string | null;
	startDate: string | Date;
	endDate: string | Date;
	location: string;
	createdBy?: string;
	createdAt?: string | Date;
	updatedAt?: string | Date;
};

export function useGetEvents() {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["events"],
		// biome-ignore lint/suspicious/noExplicitAny: elysia treaty client lacks inference here
		queryFn: () => (client.api.event as any).get() as Promise<{ data: unknown }>,
	});

	// biome-ignore lint/suspicious/noExplicitAny: elysia treaty client lacks inference here
	const responseData = (data as any)?.data as { data: EventItem[]; pagination: unknown } | null;

	return {
		events: responseData?.data ?? [],
		pagination: responseData?.pagination,
		isLoading,
		error,
		refetch,
	};
}
