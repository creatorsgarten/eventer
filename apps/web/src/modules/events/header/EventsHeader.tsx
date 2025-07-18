"use client";
import { Button } from "@/components/atoms/button";
import { useLogOutMutation } from "@/hooks/mutations/use-log-out";
import { useSession } from "@/hooks/use-session";

export function EventsHeader() {
	const { mutate: logOut } = useLogOutMutation();
	const { user, isLoading, error } = useSession();

	return (
		<header className="bg-gray-800 text-white flex items-center justify-between px-2 py-4">
			<h1 className="text-base">
				{isLoading ? "Loading ..." : error ? "error" : `Hi, ${user?.name}!`}
			</h1>
			<Button type="button" variant="destructive" onClick={() => logOut()}>
				Logout
			</Button>
		</header>
	);
}
