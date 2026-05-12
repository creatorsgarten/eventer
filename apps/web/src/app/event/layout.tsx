import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function EventLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
		return null;
	}

	return <>{children}</>;
}
