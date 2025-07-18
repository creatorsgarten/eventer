import { Button } from "@/components/atoms/button";

interface UnAuthenticatedUserLoginProps {
	handleGoogleSignIn: () => void;
}

export function UnAuthenticatedUserLogin({ handleGoogleSignIn }: UnAuthenticatedUserLoginProps) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Test Authentication</h2>
					<p className="mt-2 text-sm text-gray-600">
						Click the button below to test Google authentication
					</p>
				</div>
				<div className="flex justify-center">
					<Button type="button" onClick={handleGoogleSignIn}>
						Sign in with Google
					</Button>
				</div>
			</div>
		</div>
	);
}
