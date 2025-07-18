"use client";

// Auth Guard for Dashboard Page

import { Button } from "@eventer/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Check if user is logged in
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setIsAuthenticated(true);
		} else {
			// Redirect to login page if not authenticated
			router.push("/auth/login");
		}
	}, [router]);

	if (!isAuthenticated) {
		return <div>Loading...</div>; // or a loading spinner
	}

	const handleLogout = () => {
		client.api.auth.logout
			.post(
				{},
				{
					headers: {
						credentials: "include",
					},
				}
			)
			.then(() => {
				localStorage.removeItem("user");
				setIsAuthenticated(false);
				router.push("/auth/login");
			})
			.catch((error) => {
				console.error("Logout failed:", error);
			});
	};

	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-gray-800 text-white flex justify-between p-4">
				<h1 className="text-xl">Dashboard</h1>
				<Button type="button" onClick={() => handleLogout()} variant="destructive">
					Logout
				</Button>
			</header>
			<main className="flex-1 p-6 bg-gray-100">{children}</main>
		</div>
	);
}
