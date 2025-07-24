import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

type DeleteAgendaInput = {
	id: string;
	eventId: string;
	day: number;
};

export function useDeleteAgenda() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (deleteData: DeleteAgendaInput) => {
			console.log("Deleting agenda with id:", deleteData.id);

			return await client.api.agenda.event.delete(
				{},
				{
					query: { id: deleteData.id },
				}
			);
		},
		onSuccess: (_, variables) => {
			// Invalidate to refetch updated list
			queryClient.invalidateQueries({
				queryKey: ["agenda", variables.eventId, variables.day],
			});
			// Also invalidate the general index query
			queryClient.invalidateQueries({
				queryKey: ["index"],
			});
		},
	});

	return {
		deleteAgenda: mutation.mutate,
		deleteAgendaAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
		isSuccess: mutation.isSuccess,
		error: mutation.error,
	};
}
