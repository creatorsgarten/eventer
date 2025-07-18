"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { useAuthCallback } from "./use-handle-auth-callback";

export function AuthCallback() {
	const router = useRouter();
	const { status, message, userInfo, isLoading } = useAuthCallback();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					{status === "idle" && (
						<>
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<h2 className="text-xl font-semibold text-gray-900">Processing Authentication</h2>
							<p className="text-gray-600 mt-2 animate-pulse">
								{isLoading ? "Loading..." : "Waiting for backend..."}
							</p>
						</>
					)}

					{status === "success" && (
						<>
							<div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="h-6 w-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Success"
								>
									<title>Success</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							</div>
							<h2 className="text-xl font-semibold text-green-900">Success!</h2>
							<p className="text-green-600 mt-2">{message}</p>

							{userInfo && (
								<div className="mt-6 p-4 bg-white rounded-lg shadow border">
									<h3 className="text-lg font-medium text-gray-900 mb-3">Welcome!</h3>
									<div className="space-y-2">
										<div className="flex items-center justify-center">
											{userInfo.avatar_url && (
												<Image
													src={userInfo.avatar_url}
													alt="Profile"
													width={64}
													height={64}
													className="w-16 h-16 rounded-full mr-3"
												/>
											)}
											<div className="text-left">
												<p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
												<p className="text-sm text-gray-500">{userInfo.email}</p>
											</div>
										</div>
									</div>
									<p className="text-xs text-gray-400 mt-3 animate-pulse">
										Redirecting to dashboard in a few seconds...
									</p>
								</div>
							)}
						</>
					)}

					{status === "error" && (
						<>
							<div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="h-6 w-6 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Error"
								>
									<title>Error</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</div>
							<h2 className="text-xl font-semibold text-red-900">Authentication Failed</h2>
							<p className="text-red-600 mt-2">{message}</p>
							<Button type="button" onClick={() => router.push("/")}>
								Go Home
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
