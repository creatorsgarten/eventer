import { useMutation } from "@tanstack/react-query";
import { authHeaders } from "@/config/header";
import { client } from "@/lib/client";

export function useAuthCallbackMutation() {
	return useMutation({
		mutationKey: ["auth-callback"],
		mutationFn: async (params: { access_token: string; refresh_token: string }) => {
			const response = await client.api.auth.callback.post(params, {
				headers: {
					...authHeaders,
				},
			});

			if (response.status !== 200) {
				throw new Error("Authentication failed");
			}

			return response.data;
		},
	});
}
