"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuthCallbackMutation } from "@/hooks/mutations/use-auth-callback";

type AuthCallbackStatus = "idle" | "success" | "error";
interface UserInfo {
	avatar_url?: string | undefined;
	id: string;
	name: string;
	email: string;
}

export function useAuthCallback() {
	const router = useRouter();
	const { mutate: submitTokensToCallback, isPending } = useAuthCallbackMutation();

	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<AuthCallbackStatus>("idle");
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const extractTokensFromUrl = useCallback(() => {
		const hash = window.location.hash.substring(1);
		if (!hash) return null;

		const params = new URLSearchParams(hash);
		const accessToken = params.get("access_token");
		const refreshToken = params.get("refresh_token");

		return accessToken && refreshToken ? { accessToken, refreshToken } : null;
	}, []);

	useEffect(() => {
		const tokens = extractTokensFromUrl();

		if (!tokens) {
			router.push("/auth/login");
			return;
		}

		submitTokensToCallback(
			{
				access_token: tokens.accessToken,
				refresh_token: tokens.refreshToken,
			},
			{
				onSuccess: (res) => {
					setStatus("success");

					setUserInfo(res?.user ?? null);
					setMessage("Authentication successful! Redirecting...");

					setTimeout(() => {
						router.push("/event");
					}, 500);
				},
				onError: (error) => {
					setStatus("error");

					console.error("Authentication callback error:", error);
					setMessage("Authentication failed. Please try again.");

					setTimeout(() => {
						router.push("/auth/login");
					}, 500);
				},
			}
		);
	}, [extractTokensFromUrl, router, submitTokensToCallback]);

	return {
		status,
		message,
		userInfo,
		isLoading: isPending,
	};
}
