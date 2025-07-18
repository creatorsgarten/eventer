import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import type { CreateAgendaDTO } from "../../../backend/src/modules/agenda/dtos/create-agenda.dto";

export function useCreateAgenda() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (body: CreateAgendaDTO) => client.api.agenda.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["index"] });
    },
  });

  return {
    createAgenda: mutate,
    isCreating: isPending,
    error,
  };
}
