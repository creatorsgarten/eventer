import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

type UpdateAgendaInput = {
	id: string;
	eventId: string;
	day: number;
	start: string;
	end: string;
	activity: string;
	personincharge: string;
	remarks?: string;
};

export function useUpdateAgenda() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (updateData: UpdateAgendaInput) => {
			// Map frontend fields to backend DTO fields
			const backendData = {
				id: updateData.id,
				startTime: updateData.start,
				endTime: updateData.end,
				activity: updateData.activity,
				picUserId: updateData.personincharge, // Note: This might need user ID mapping
				remark: updateData.remarks,
			};

			console.log("Updating agenda with data:", backendData);

			return client.api.agenda.event.put(
				{},
				{
					query: backendData,
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
		updateAgenda: mutation.mutate,
		isPending: mutation.isPending,
		isSuccess: mutation.isSuccess,
		error: mutation.error,
	};
}
