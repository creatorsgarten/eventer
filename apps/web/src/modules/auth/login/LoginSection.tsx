"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "@/components/organisms/loading/Loading";
import { authHeaders } from "@/config/header";
import { getSignInLink } from "@/config/link";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useSession } from "@/hooks/use-session";
import { client } from "@/lib/client";
import { AuthenticatedUserLogin } from "./AuthenticatedUserLogin";
import { UnAuthenticatedUserLogin } from "./UnauthenticatedUserLogin";

export function LoginSection() {
	const { user, isLoading, refetch } = useSession();
	const router = useRouter();
	const [rateLimitMessage, setRateLimitMessage] = useState<string>("");

	// Rate limit: 5 login attempts per minute
	const loginRateLimit = useRateLimit({
		maxAttempts: 5,
		windowMs: 60000, // 1 minute
		onLimitExceeded: (resetIn) => {
			setRateLimitMessage(
				`Too many login attempts. Please wait ${resetIn} seconds before trying again.`
			);
		},
	});

	// Rate limit: 3 logout attempts per minute
	const logoutRateLimit = useRateLimit({
		maxAttempts: 3,
		windowMs: 60000, // 1 minute
		onLimitExceeded: (resetIn) => {
			setRateLimitMessage(
				`Too many logout attempts. Please wait ${resetIn} seconds before trying again.`
			);
		},
	});

	// Clear rate limit message after it's been shown
	useEffect(() => {
		if (rateLimitMessage) {
			const timer = setTimeout(() => setRateLimitMessage(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [rateLimitMessage]);

	// Redirect authenticated users to event page
	useEffect(() => {
		if (!isLoading && user) {
			router.push("/event");
		}
	}, [user, isLoading, router]);

	const handleGoogleSignIn = useCallback(async () => {
		const { success } = await loginRateLimit.execute(() => {
			// Redirect to your backend's Google auth endpoint
			router.push(getSignInLink());
		});

		if (!success && rateLimitMessage) {
			console.warn(rateLimitMessage);
		}
	}, [router, loginRateLimit, rateLimitMessage]);

	const handleSignOut = useCallback(async () => {
		const { success } = await logoutRateLimit.execute(async () => {
			await client.api.auth.logout.post(
				{},
				{
					...authHeaders,
				}
			);
			refetch();
			router.refresh();
		});

		if (!success && rateLimitMessage) {
			console.warn(rateLimitMessage);
		}
	}, [refetch, router, logoutRateLimit, rateLimitMessage]);

	if (isLoading) {
		return (
			<section className="min-h-screen flex flex-col items-center justify-center">
				<Loading />
			</section>
		);
	}

	if (user) {
		return (
			<AuthenticatedUserLogin
				id={user.id}
				email={user.email}
				name={user.name}
				avatarUrl={user.avatar_url}
				handleSignOut={handleSignOut}
				rateLimitMessage={rateLimitMessage}
			/>
		);
	}

	return (
		<UnAuthenticatedUserLogin
			handleGoogleSignIn={handleGoogleSignIn}
			rateLimitMessage={rateLimitMessage}
		/>
	);
}
