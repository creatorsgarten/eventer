"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authHeaders } from "@/config/header";
import { client } from "@/lib/client";

export function useLogOutMutation() {
	const router = useRouter();

	return useMutation({
		mutationKey: ["logout"],
		mutationFn: async () => {
			const response = await client.api.auth.logout.post(
				{},
				{
					headers: {
						...authHeaders,
					},
				}
			);

			if (response.status !== 200) {
				throw new Error("Logout failed");
			}

			router.refresh();
			return response.data;
		},
	});
}
