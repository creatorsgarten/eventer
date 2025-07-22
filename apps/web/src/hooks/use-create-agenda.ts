import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

type CreateAgendaInput = {
  eventId: string;
  day: number;
  start: string;
  end: string;
  activity: string;
  personincharge: string;
  remarks?: string;
};

export function useCreateAgenda() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newAgenda: CreateAgendaInput) => {
      // Calculate duration in minutes
      const startTime = new Date(newAgenda.start);
      const endTime = new Date(newAgenda.end);
      const duration = Math.round(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60)
      );

      const agendaWithDuration = {
        ...newAgenda,
        duration,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
      };

      console.log("Sending to backend:", agendaWithDuration);

      return client.api.agenda.event.post({}, { query: agendaWithDuration });
    },
    onSuccess: (_, variables) => {
      // Invalidate to refetch updated list
      queryClient.invalidateQueries({
        queryKey: ["agenda", variables.eventId, variables.day],
      });
    },
  });

  return {
    createAgenda: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
