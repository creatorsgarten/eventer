"use client";

import { Button } from "@eventer/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authHeaders } from "@/config/header";
import { SIGN_IN_LINK } from "@/config/link";
import { client } from "@/lib/client";

interface UserInfo {
	id: string;
	email: string;
	name: string;
	avatar_url?: string;
}

export default function TestPage() {
	const [user, setUser] = useState<UserInfo | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Check if user is logged in
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const handleGoogleSignIn = () => {
		// Redirect to your backend's Google auth endpoint
		router.push(SIGN_IN_LINK);
	};

	const handleSignOut = () => {
		localStorage.removeItem("user");
		setUser(null);

		client.api.auth.logout
			.post(
				{},
				{
					...authHeaders,
				}
			)
			.catch((error) => {
				console.error("Logout failed:", error);
			});
	};

	if (user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full space-y-8">
					<div className="text-center">
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome Back!</h2>
						<div className="mt-8 p-6 bg-white rounded-lg shadow border">
							<div className="flex items-center justify-center mb-4">
								{user.avatar_url && (
									<Image
										src={user.avatar_url}
										alt="Profile"
										width={80}
										height={80}
										className="w-20 h-20 rounded-full mr-4"
									/>
								)}
								<div className="text-left">
									<h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
									<p className="text-sm text-gray-500">{user.email}</p>
									<p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
								</div>
							</div>
							<Button type="button" onClick={handleSignOut} variant="destructive">
								Sign Out
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Test Authentication</h2>
					<p className="mt-2 text-sm text-gray-600">
						Click the button below to test Google authentication
					</p>
				</div>
				<div>
					<Button type="button" onClick={handleGoogleSignIn}>
						Sign in with Google
					</Button>
				</div>
			</div>
		</div>
	);
}
