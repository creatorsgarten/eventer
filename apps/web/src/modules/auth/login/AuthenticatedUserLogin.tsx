import Image from "next/image";
import { Button } from "@/components/atoms/button";

interface AuthenticatedUserLoginProps {
	avatarUrl?: string;
	name: string;
	email: string;
	id: string;
	handleSignOut: () => void;
}

export function AuthenticatedUserLogin({
	avatarUrl,
	name,
	email,
	id,
	handleSignOut,
}: AuthenticatedUserLoginProps) {
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
						<Button type="button" onClick={handleSignOut} variant="destructive">
							Sign Out
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
