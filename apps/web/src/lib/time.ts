export const formatTime = (date: Date): string =>
	`${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

export const parseTime = (timeStr: string): number => {
	// Handle both HH:MM format and ISO datetime format
	if (timeStr.includes("T") || timeStr.includes("-")) {
		// ISO datetime format: 2025-07-23T05:09:00.000Z
		const date = new Date(timeStr);
		return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
	} else {
		// Legacy HH:MM:SS format
		const [hours = "0", minutes = "0", seconds = "0"] = timeStr.split(":");
		return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
	}
};

export const toDisplayTime = (secs: number): string =>
	`${String(Math.floor(secs / 3600)).padStart(2, "0")}:${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}`;

export const calculateProgress = (start: number, end: number, now: number): number =>
	Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
