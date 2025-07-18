"use client";
import { Button } from "@/components/atoms/button";
import { useLogOutMutation } from "@/hooks/mutations/use-log-out";

export function EventsHeader() {
	const { mutate: logOut } = useLogOutMutation();

	return (
		<header className="bg-gray-800 text-white flex justify-between p-4">
			<h1 className="text-xl">Dashboard</h1>
			<Button type="button" variant="destructive" onClick={() => logOut()}>
				Logout
			</Button>
		</header>
	);
}
