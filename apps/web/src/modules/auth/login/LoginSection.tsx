"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Loading } from "@/components/organisms/loading/Loading";
import { authHeaders } from "@/config/header";
import { SIGN_IN_LINK } from "@/config/link";
import { useSession } from "@/hooks/use-session";
import { client } from "@/lib/client";
import { AuthenticatedUserLogin } from "./AuthenticatedUserLogin";
import { UnAuthenticatedUserLogin } from "./UnauthenticatedUserLogin";

export function LoginSection() {
	const { user, isLoading, refetch } = useSession();
	const router = useRouter();

	const handleGoogleSignIn = useCallback(() => {
		// Redirect to your backend's Google auth endpoint
		router.push(SIGN_IN_LINK);
	}, [router]);

	const handleSignOut = useCallback(() => {
		client.api.auth.logout
			.post(
				{},
				{
					...authHeaders,
				}
			)
			.then(() => {
				refetch();
				router.refresh();
			})
			.catch((error) => {
				console.error("Logout failed:", error);
			});
	}, [refetch, router]);

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
			/>
		);
	}

	return <UnAuthenticatedUserLogin handleGoogleSignIn={handleGoogleSignIn} />;
}
