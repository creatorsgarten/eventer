import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { EventsHeader } from "@/modules/events/header/EventsHeader";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
		return null; // Ensure the function returns null after redirecting
	}

	return (
		<div className="min-h-screen flex flex-col">
			<EventsHeader />
			<main className="flex-1 p-6 bg-gray-100">{children}</main>
		</div>
	);
}
