"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { env } from "@/env";

interface UserInfo {
	id: string;
	email: string;
	username: string;
	avatar_url?: string;
}

export default function TestPage() {
	const [user, setUser] = useState<UserInfo | null>(null);

	useEffect(() => {
		// Check if user is logged in
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const handleGoogleSignIn = () => {
		// Redirect to your backend's Google auth endpoint
		window.location.href = `${env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
	};

	const handleSignOut = () => {
		localStorage.removeItem("user");
		setUser(null);
		// Optionally, also clear the backend session
		fetch(`${env.NEXT_PUBLIC_BACKEND_URL}api/auth/logout`, {
			method: "POST",
			credentials: "include",
		}).catch(console.error);
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
									<h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
									<p className="text-sm text-gray-500">{user.email}</p>
									<p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
								</div>
							</div>
							<button
								type="button"
								onClick={handleSignOut}
								className="w-full mt-4 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Sign Out
							</button>
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
					<button
						type="button"
						onClick={handleGoogleSignIn}
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Sign in with Google
					</button>
				</div>
			</div>
		</div>
	);
}
