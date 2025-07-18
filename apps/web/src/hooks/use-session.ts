"use client";

import { useQuery } from "@tanstack/react-query";
import { authHeaders } from "@/config/header";
import { client } from "@/lib/client";

export function useSession() {
	const {
		data: user,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const response = await client.api.auth.session.get({
				headers: {
					...authHeaders,
				},
			});

			if (!(response.status === 200)) {
				throw new Error("Failed to fetch session");
			}

			return response?.data?.user;
		},
	});

	return { user, isLoading, error, refetch };
}
