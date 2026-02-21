"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";

interface AuthenticatedUserLoginProps {
	avatarUrl?: string;
	name: string;
	email: string;
	id: string;
	handleSignOut: () => void;
	rateLimitMessage?: string;
}

export function AuthenticatedUserLogin({
	avatarUrl,
	name,
	email,
	id,
	handleSignOut,
	rateLimitMessage,
}: AuthenticatedUserLoginProps) {
	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome Back!</h2>
					<div className="mt-8 p-6 bg-white rounded-lg shadow border">
						<div className="flex items-center justify-center mb-4">
							{avatarUrl && (
								<Image
									src={avatarUrl}
									alt="Profile"
									width={80}
									height={80}
									className="w-20 h-20 rounded-full mr-4"
								/>
							)}
							<div className="text-left">
								<h3 className="text-lg font-medium text-gray-900">{name}</h3>
								<p className="text-sm text-gray-500">{email}</p>
								<p className="text-xs text-gray-400 mt-1">ID: {id}</p>
							</div>
						</div>
						{rateLimitMessage && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-600 text-sm">⚠️ {rateLimitMessage}</p>
							</div>
						)}
						<div className="flex flex-col gap-2">
							<Button type="button" onClick={() => router.push("/event")}>
								Go to Events
							</Button>
							<Button type="button" onClick={handleSignOut} variant="destructive">
								Sign Out
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
