import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

type EndSessionInput = {
	id: string;
	actualEndTime: string | Date; // ISO string or Date
};

export function useEndSession() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: EndSessionInput) => {
			console.log("Starting end session mutation with data:", data);

			// Ensure actualEndTime is properly formatted
			let formattedActualEndTime: string;

			if (typeof data.actualEndTime === "string") {
				// If it's already a string, validate it's a proper ISO string
				try {
					new Date(data.actualEndTime).toISOString();
					formattedActualEndTime = data.actualEndTime;
				} catch {
					// If invalid string, create new date
					formattedActualEndTime = new Date().toISOString();
				}
			} else if (data.actualEndTime instanceof Date) {
				formattedActualEndTime = data.actualEndTime.toISOString();
			} else {
				// Fallback to current time
				formattedActualEndTime = new Date().toISOString();
			}

			const formattedData = {
				...data,
				actualEndTime: formattedActualEndTime,
			};

			console.log("Formatted data for API call:", formattedData);

			try {
				const response = await client.api.agenda["end-session"].patch(formattedData);

				console.log("API response:", response);

				// Check if response indicates an error
				if (response.error) {
					console.error("API returned error:", response.error);

					let errorMessage = "Failed to end session";

					// Try to extract error message from response
					if (response.error && typeof response.error === "object") {
						const errorObj = response.error as Record<string, unknown>;

						// Check various possible error message locations
						if (errorObj.message) {
							errorMessage = String(errorObj.message);
						} else if (
							errorObj.data &&
							typeof errorObj.data === "object" &&
							errorObj.data !== null
						) {
							const dataObj = errorObj.data as Record<string, unknown>;
							if (dataObj.message) {
								errorMessage = String(dataObj.message);
							} else if (dataObj.error) {
								errorMessage = String(dataObj.error);
							}
						} else if (errorObj.status) {
							errorMessage = `API error with status: ${errorObj.status}`;
						} else if (typeof errorObj === "string") {
							errorMessage = errorObj;
						} else {
							// If it's still an object, try to stringify it for debugging
							try {
								errorMessage = JSON.stringify(errorObj);
							} catch {
								errorMessage = `API error (status: ${response.status || "unknown"})`;
							}
						}
					} else if (typeof response.error === "string") {
						errorMessage = response.error;
					}

					console.error("Extracted error message:", errorMessage);
					throw new Error(errorMessage);
				}

				// Check if response.data exists
				if (!response.data) {
					console.error("API response missing data field");
					throw new Error("Invalid API response: missing data");
				}

				console.log("Session ended successfully:", response.data);
				return response.data;
			} catch (error) {
				console.error("Error in API call:", error);

				// If it's already an Error, re-throw it with additional context
				if (error instanceof Error) {
					console.error("Error details:", {
						name: error.name,
						message: error.message,
						stack: error.stack,
					});
					// Don't wrap the error message again if it's already meaningful
					throw error;
				}

				// Handle network or other non-Error objects
				if (typeof error === "object" && error !== null) {
					console.error("Non-Error object thrown:", error);

					// Try to extract meaningful information
					const errorObj = error as Record<string, unknown>;
					let errorMessage = "Unknown error occurred";

					if (errorObj.message) {
						errorMessage = String(errorObj.message);
					} else if (errorObj.status) {
						errorMessage = `Network error with status: ${errorObj.status}`;
					} else if (errorObj.code) {
						errorMessage = `Error code: ${errorObj.code}`;
					}

					throw new Error(`Session end failed: ${errorMessage}`);
				}

				// Handle string errors
				if (typeof error === "string") {
					throw new Error(`Session end failed: ${error}`);
				}

				// Fallback for truly unknown error types
				console.error("Unknown error type:", typeof error, error);
				throw new Error("Session end failed: An unexpected error occurred during API call");
			}
		},
		onSuccess: () => {
			console.log("Mutation succeeded, invalidating queries...");
			// Invalidate and refetch timer data to get updated agenda
			queryClient.invalidateQueries({ queryKey: ["index"] });
		},
		onError: (error) => {
			console.error("Mutation failed with error:", error);

			// Additional error logging for debugging
			if (error instanceof Error) {
				console.error("Error name:", error.name);
				console.error("Error message:", error.message);
				console.error("Error stack:", error.stack);
			} else {
				console.error("Non-Error object in onError:", typeof error, error);
			}
		},
	});

	return {
		endSession: mutation.mutate,
		endSessionAsync: mutation.mutateAsync,
		isLoading: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
