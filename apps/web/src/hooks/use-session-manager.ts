import { useEffect, useState } from "react";
import { useEndSession } from "./use-end-session";

export interface SessionEnd {
	slotId: string;
	actualEndTime: Date;
	scheduledEndTime: Date;
	difference: number; // in minutes
}

export interface AgendaSlot {
	id: string;
	eventId: string;
	start: string;
	end: string;
	personincharge: string;
	duration: number;
	activity: string;
	remarks?: string | null;
	actualEndTime?: Date | string | null; // From backend - can be Date or string
}

export function useSessionManager() {
	const [sessionEnds, setSessionEnds] = useState<SessionEnd[]>([]);
	const { endSessionAsync, isLoading, error } = useEndSession();

	// Load session ends from localStorage on mount
	useEffect(() => {
		const savedSessionEnds = localStorage.getItem("sessionEnds");
		if (savedSessionEnds) {
			try {
				const parsed = JSON.parse(savedSessionEnds).map(
					(se: {
						slotId: string;
						actualEndTime: string;
						scheduledEndTime: string;
						difference: number;
					}) => ({
						...se,
						actualEndTime: new Date(se.actualEndTime),
						scheduledEndTime: new Date(se.scheduledEndTime),
					})
				);
				setSessionEnds(parsed);
			} catch (error) {
				console.error("Failed to parse saved session ends:", error);
				localStorage.removeItem("sessionEnds");
			}
		}
	}, []);

	//   const parseTime = (timeString: string): number => {
	//     const date = new Date(timeString);
	//     return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
	//   };

	const handleEndSession = async (slot: AgendaSlot) => {
		try {
			const now = new Date(); // Ensure we have a proper Date object

			// Validate that now is a valid Date
			if (Number.isNaN(now.getTime())) {
				throw new Error("Invalid date created");
			}

			// Create scheduled end time from the slot's end time
			const scheduledEndTime = new Date(slot.end);

			// Validate scheduled end time
			if (Number.isNaN(scheduledEndTime.getTime())) {
				throw new Error("Invalid scheduled end time");
			}

			const difference = Math.round((now.getTime() - scheduledEndTime.getTime()) / (1000 * 60));

			// Store the session end data
			const sessionEnd: SessionEnd = {
				slotId: slot.id,
				actualEndTime: now, // This is already a Date object
				scheduledEndTime,
				difference,
			};

			setSessionEnds((prev) => prev.filter((se) => se.slotId !== slot.id).concat(sessionEnd));

			// Call the API with properly formatted data
			try {
				await endSessionAsync({
					id: slot.id,
					actualEndTime: now.toISOString(), // Convert to ISO string here
				});
			} catch (apiError) {
				// Remove the session end if API call fails
				setSessionEnds((prev) => prev.filter((se) => se.slotId !== slot.id));

				// Ensure we throw a proper Error object
				if (apiError instanceof Error) {
					throw apiError;
				} else if (typeof apiError === "object" && apiError !== null) {
					const errorObj = apiError as Record<string, unknown>;
					const errorMessage =
						(typeof errorObj.message === "string" ? errorObj.message : undefined) ||
						"API call failed";
					throw new Error(errorMessage);
				} else {
					throw new Error("Failed to end session via API");
				}
			}

			// Save to localStorage after successful API call
			const updatedSessionEnds = sessionEnds
				.filter((se) => se.slotId !== slot.id)
				.concat(sessionEnd);
			localStorage.setItem(
				"sessionEnds",
				JSON.stringify(
					updatedSessionEnds.map((se) => ({
						...se,
						actualEndTime:
							se.actualEndTime instanceof Date
								? se.actualEndTime.toISOString()
								: new Date(se.actualEndTime).toISOString(),
						scheduledEndTime:
							se.scheduledEndTime instanceof Date
								? se.scheduledEndTime.toISOString()
								: new Date(se.scheduledEndTime).toISOString(),
					}))
				)
			);
		} catch (error) {
			console.error("Failed to end session:", error);

			// Ensure we always throw a proper Error object
			if (error instanceof Error) {
				throw error;
			} else if (typeof error === "object" && error !== null) {
				const errorObj = error as Record<string, unknown>;
				const errorMessage =
					(typeof errorObj.message === "string" ? errorObj.message : undefined) ||
					"Session end failed";
				throw new Error(errorMessage);
			} else {
				throw new Error("An unexpected error occurred while ending session");
			}
		}
	};

	const handleUndoSession = (slot: AgendaSlot): void => {
		const updatedSessionEnds = sessionEnds.filter((se) => se.slotId !== slot.id);

		setSessionEnds(updatedSessionEnds);
		localStorage.setItem("sessionEnds", JSON.stringify(updatedSessionEnds));
	};

	const getSessionEndInfo = (slotId: string): SessionEnd | undefined => {
		return sessionEnds.find((se) => se.slotId === slotId);
	};

	const formatAPNotation = (difference: number): string => {
		if (difference > 0) {
			return `AP+${difference}`;
		} else if (difference < 0) {
			return `AP${difference}`;
		}
		return "AP+0";
	};

	const getLatestAPNotation = (): {
		notation: string;
		isLate: boolean;
	} | null => {
		if (sessionEnds.length === 0) return null;

		const latestSession = sessionEnds.sort(
			(a, b) => b.actualEndTime.getTime() - a.actualEndTime.getTime()
		)[0];

		if (!latestSession) return null;

		const difference = latestSession.difference;

		if (difference > 0) {
			return { notation: `AP+${difference}`, isLate: true };
		} else if (difference < 0) {
			return { notation: `AP${difference}`, isLate: false };
		}
		return { notation: "AP+0", isLate: false };
	};

	// Merge localStorage data with backend data (prioritize backend if available)
	const getMergedSessionData = (agendaData: AgendaSlot[]): AgendaSlot[] => {
		return agendaData.map((slot) => {
			// If backend has actualEndTime, use it
			if (slot.actualEndTime) {
				return slot;
			}

			// Otherwise, check localStorage
			const localSessionEnd = getSessionEndInfo(slot.id);
			if (localSessionEnd) {
				return {
					...slot,
					actualEndTime:
						localSessionEnd.actualEndTime instanceof Date
							? localSessionEnd.actualEndTime.toISOString()
							: new Date(localSessionEnd.actualEndTime).toISOString(),
				};
			}

			return slot;
		});
	};

	return {
		sessionEnds,
		handleEndSession,
		handleUndoSession,
		getSessionEndInfo,
		formatAPNotation,
		getLatestAPNotation,
		getMergedSessionData,
		isLoading,
		error,
	};
}
