import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

type CreateEventInput = {
	name: string;
	startDate: string;
	endDate: string;
	location: string;
	description?: string | null;
};

export function useCreateEvent() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: CreateEventInput) =>
			// biome-ignore lint/suspicious/noExplicitAny: elysia treaty client lacks inference here
			(client.api.event as any).post(data) as Promise<{ data: { id: string } }>,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});

	return {
		createEvent: mutation.mutate,
		createEventAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
		isSuccess: mutation.isSuccess,
		error: mutation.error,
	};
}
