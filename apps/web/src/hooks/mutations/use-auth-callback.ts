import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/client";

export function useAuthCallbackMutation() {
	return useMutation({
		mutationKey: ["auth-callback"],
		mutationFn: async (params: { access_token: string; refresh_token: string }) => {
			console.log("Sending auth callback with params:", {
				access_token: `${params.access_token.substring(0, 20)}...`,
				refresh_token: `${params.refresh_token.substring(0, 20)}...`,
			});

			const response = await client.api.auth.callback.post(params);

			console.log("Auth callback response:", {
				status: response.status,
				data: response.data,
				error: response.error,
			});

			if (response.status !== 200) {
				const errorMessage = response.error?.value
					? JSON.stringify(response.error.value)
					: "Authentication failed";
				throw new Error(errorMessage);
			}

			return response.data;
		},
	});
}
