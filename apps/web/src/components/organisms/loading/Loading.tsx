export function Loading() {
	return (
		<div className="flex items-center justify-center">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					{/* Spinner */}
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Loading...</h2>
					<p className="mt-2 text-sm text-gray-600 animate-pulse">Please wait a bit...</p>
				</div>
			</div>
		</div>
	);
}
